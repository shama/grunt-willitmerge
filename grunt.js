module.exports = function(grunt) {
  'use strict';
  grunt.initConfig({
    willitmerge: {
      
      remote: 'test'
    },
    lint: {
      files: ['grunt.js', 'tasks/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    }
  });
  grunt.loadTasks('tasks');
  grunt.registerTask('default', 'lint willitmerge');
};
