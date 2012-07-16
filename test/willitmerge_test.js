/*globals exports:true, require:true*/
/*jshint globalstrict:true, sub:true*/

'use strict';

var grunt = require('grunt');
var fs = require('fs');
var path = require('path');

exports['willitmerge'] = {
  setUp: function(done) {
    var WillItMerge = require(grunt.task.getFile('willitmerge.js'))(grunt);
    this.wim = new WillItMerge();
    done();
  },
  'init': function(test) {
    test.expect(1);

    test.deepEqual(this.wim.userRepo, {user: 'shama', repo: 'grunt-willitmerge'});

    test.done();
  },
  'getRepoIssues': function(test) {
    test.expect(1);

    this.wim.on('issues', function(err, issues) {
      test.ok(issues.length > 0);
      test.done();
    });

    // must be a repo with open pull requests
    this.wim.userRepo = {user: 'cowboy', repo: 'grunt'};
    this.wim.getRepoIssues();
  },
  'processIssue': function(test) {
    var iss = grunt.file.readJSON('test/fixtures/issue.json');
    this.wim.processIssue(iss, function() {
      test.done();
    });
  },
  'cleanUp': function(test) {
    test.expect(1);

    var file = path.dirname(this.wim.tmpPatch);
    grunt.file.mkdir(file);
    this.wim.cleanUp();
    test.ok(!fs.existsSync(file));

    test.done();
  }
};
