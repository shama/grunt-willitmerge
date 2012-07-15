module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    willitmerge: {
      options: {
        auth: '<json:github_auth.json>'
      }
    },
    test: {
      files: ['test/**/*.js']
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    }
  });

  grunt.loadTasks('tasks');

  grunt.registerTask('default', 'lint test');

};
