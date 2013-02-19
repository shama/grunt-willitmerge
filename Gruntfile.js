module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    willitmerge: {
      remote: 'test'
    },
    jshint: {
      files: ['Gruntfile.js', 'tasks/**/*.js']
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['default']
    }
  });
  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', ['jshint', 'willitmerge']);
};
