/*
 * grunt-willitmerge
 * https://github.com/shama/grunt-github
 *
 * Copyright (c) 2012 Kyle Robinson Young
 * Licensed under the MIT license.
 */
/*globals require:true, process:true*/

module.exports = function(grunt) {
  'use strict';

  var util = require('util');
  var events = require('events');

  // libs
  var path = require('path');
  var fs = require('fs');
  var exec = require('child_process').exec;
  var request = require('request');
  var rimraf = require('rimraf');
  var readline = require('readline');

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  // globals
  var _ = grunt.util._;
  var async = grunt.util.async;
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // WillItMerge
  var WillItMerge = function(opts) {
    events.EventEmitter.call(this);

    this.opts = _.defaults(opts || {}, {
      auth: {},
      ignore: [],
      comment: 'Sorry, your pull request is unmergeable. ' +
        'Could you please rebase, squash and force push it? Thanks!'
    });

    // local vars
    this.tmpPatch = path.join(process.cwd(), '_tmp', process.pid + '.patch');
    this.isAuthed = !_.isEmpty(this.opts.auth);

    // find this user and repo
    this.userRepo = (function() {
      var res = {user:'',repo:''};
      var repo = grunt.file.readJSON(path.join(process.cwd(), 'package.json')).repository;
      if (repo.type === 'git' && _.isString(repo.url) && repo.url.indexOf('github.com') !== -1) {
        var arr = repo.url.split('/').slice(-2);
        res.user = arr[0];
        res.repo = arr[1].replace('.git', '');
      }
      return res;
    }());
  };
  util.inherits(WillItMerge, events.EventEmitter);

  // search github for open repo issues
  WillItMerge.prototype.getRepoIssues = function() {
    var that = this;
    grunt.helper('github', that.opts.auth, function githubHelper(err, github) {
      if (err) {throw err;}
      that.github = github;
      var msg = {
        user: that.userRepo.user,
        repo: that.userRepo.repo,
        state: 'open'
      };
      github.issues.repoIssues(msg, function githubRepoIssues(err, res) {
        if (err) { throw err; }
        that.emit('issues', null, that.extractPulls(res));
      });
    });
  };

  // process an issue
  WillItMerge.prototype.processIssue = function(iss, done) {
    var that = this;
    if (_.indexOf(that.opts.ignore, iss.number) !== -1) {
      grunt.log.writeln('Issue #' + iss.number + '... ' + 'SKIP'.cyan);
      return done();
    }
    grunt.log.write('Issue #' + iss.number + ', ' + iss.html_url + ', will it merge? ');

    grunt.file.mkdir(path.dirname(that.tmpPatch));
    request(iss.pull_request.patch_url)
      .on('end', function() {// why doesnt pipe work before end?

        var cmd = 'git apply --check --stat ' + that.tmpPatch;
        exec(cmd, function execCommand(err, stdout, stderr) {
          if (stderr) {
            that.mergeFailed(stderr, iss, done);
          } else {
            that.mergeSuccess(stdout, iss, done);
          }
        });

      })
      .pipe(fs.createWriteStream(that.tmpPatch));
  };

  // if merge failed
  WillItMerge.prototype.mergeFailed = function(msg, iss, done) {
    var that = this;
    grunt.log.fail('NO!');
    grunt.log.error(msg);
    if (that.isAuthed) {
      rl.question('Notify pull requester this is unmergeable? [y/N]', function questionNotifyUnmergeable(answer) {
       if (answer === 'y') {
         that.notifyUnmergeable(iss.number, done);
       } else {
         done();
       }
      });
    } else {
      grunt.log.error('Please supply your github auth.username and auth.password to notify pull requester.');
      done();
    }
  };

  // if merge succeeded
  WillItMerge.prototype.mergeSuccess = function(msg, iss, done) {
    var that = this;
    grunt.log.success('YES!');
    grunt.log.ok(msg);
    rl.question('Merge this pull request? [y/N]', function questionMergePR(answer) {
      if (answer === 'y') {
        that.mergePullRequest(function(err, res) {
          grunt.log.oklns(res);
          done();
        });
      } else {
        done();
      }
    });
  };

  // extract issues with pull requests
  WillItMerge.prototype.extractPulls = function(res) {
    var pulls = [];
    if (!_.isArray(res)) {
      return pulls;
    }
    res.forEach(function(iss) {
      if (iss.pull_request !== undefined && iss.pull_request.patch_url !== null) {
        pulls.push(iss);
      }
    });
    return pulls;
  };

  // merge the patch
  // TODO: check and mark with: Closes GH-###
  WillItMerge.prototype.mergePullRequest = function(done) {
    exec('git am --signoff ' + this.tmpPatch, function applyPatch(err, stdout, stderr) {
      if (stderr) {
        grunt.log.error(stderr);
      }
      done(err, stdout);
    });
  };

  // comment on the pull request that it is unmergeable
  WillItMerge.prototype.notifyUnmergeable = function(number, done) {
    var data = {
      user: this.userRepo.user,
      repo: this.userRepo.repo,
      number: number,
      body: this.opts.comment
    };
    if (_.isBlank(data.body) || data.number <= 0) {
      return done(); // add error
    }
    // TODO: Check if duplicate post
    this.github.issues.createComment(data, function githubCreateComment(err, res) {
      if (err) { throw err; }
      done();
    });
  };

  // clean up tmp dir
  WillItMerge.prototype.cleanUp = function() {
    rimraf.sync(path.dirname(this.tmpPatch));
  };

  // the show
  grunt.registerTask('willitmerge', 'Check if all open pull requests are mergeable.', function gruntRegisterTask() {
    var options = grunt.helper('options', this);
    var done = this.async();

    var wim = new WillItMerge(options);
    wim.on('issues', function(err, issues) {
      grunt.log.writeln('Found ' + issues.length + ' open pull requests.');
      if (issues.length <= 0) {
        done();
      }
      async.forEachSeries(issues, function(iss, next) {
        wim.processIssue(iss, function() {
          grunt.log.writeln();
          next();
        });
      }, function() {
        done();
      });
    });

    wim.getRepoIssues();
  });

  return WillItMerge;
};
