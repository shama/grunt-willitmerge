/**
 * Helpers for grunt-mergeable
 *
 * Copyright (c) 2012 Kyle Robinson Young
 * Licensed under the MIT license.
 */
/*globals require:true*/

module.exports = function(grunt) {
  "use strict";

  // TODO: ditch this when grunt v0.4 is released
  grunt.util = grunt.util || grunt.utils;

  var _ = grunt.util._;

  var GitHubApi = require('github');
  var github = new GitHubApi({version: '3.0.0', debug: false});

  // Get an instance of github
  grunt.registerHelper('github', function githubHelper() {
    var cb = arguments[0];
    if (grunt.util.kindOf(arguments[0]) === 'object') {
      // TODO: Command Line OAuth Please?
      var auth = _.defaults(arguments[0], {
        type: 'basic',
        username: '',
        password: ''
      });
      if (!_.isBlank(auth.username) && !_.isBlank(auth.password)) {
        github.authenticate(arguments[0]);
      }
      cb = arguments[1];
    }
    cb(null, github);
  });

  // Helper for consistent options key access across contrib tasks.
  // Borrowed from grunt-contrib :)
  grunt.registerHelper("options", function(data, defaults) {
    var _ = grunt.util._;
    var namespace = data.nameArgs.split(":");
    var task = grunt.config(_.flatten([namespace, "options"]));
    var global_subtask = namespace.length > 1 ? grunt.config(_.flatten(["options", namespace])) : {};
    var global = grunt.config(["options", namespace[0]]);

    return _.defaults({}, task, global_subtask, global, defaults || {});
  });

};