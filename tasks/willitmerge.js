/*
 * grunt-willitmerge
 * https://github.com/shama/grunt-github
 *
 * Copyright (c) 2013 Kyle Robinson Young
 * Licensed under the MIT license.
 */
/*globals require:true, process:true*/

module.exports = function(grunt) {
  'use strict';

  var wim = require('willitmerge');

  grunt.registerTask('willitmerge', 'Check if all open pull requests are mergeable.', function gruntRegisterTask() {
    this.requiresConfig(this.name);
    var options = grunt.config(this.name);
    var done = this.async();

    wim.once('issues', wim.testIssues);
    wim.on('error', wim.onError);
    wim.once('end', function(issues) {
      wim.onEnd(issues);
      done();
    });

    wim.run(options);
  });
};
