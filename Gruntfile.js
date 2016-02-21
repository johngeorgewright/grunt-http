/*
 * grunt-http
 * https://github.com/johngeorgewright/grunt-contrib-http
 *
 * Copyright (c) 2013 John Wright
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path'),
    FormData = require('form-data'),
    util = require('util');

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    http: {
      basic: {
        options: {
          url: 'http://blog.j-g-w.info'
        },
        dest: 'tmp/basic.html'
      },
      justLog: {
        options: {
          url: 'http://blog.j-g-w.info',
          logBody: true
        }
      },
      noSaveOrLog: {
        options: {
          url: 'http://blog.j-g-w.info'
        }
      },
      closure: {
        options: {
          form: {
            output_info: 'compiled_code',
            output_format: 'text',
            compilation_level: 'SIMPLE_OPTIMIZATIONS',
            warning_level: 'default',
          },
          url: 'http://closure-compiler.appspot.com/compile',
          method: 'POST',
          sourceField: 'form.js_code'
        },
        files: {
          'tmp/compiled.js': 'test/fixtures/not-compiled.js'
        }
      },
      jsonAtRuntime: {
        options: {
          url: 'http://posttestserver.com/post.php?dir=grunt-http',
          method: 'POST',
          json: function () { return '{"cheese": "its"}'; }
        },
        dest: 'tmp/jsonAtRuntime.txt'
      },
      bodyAtRuntime: {
        options: {
          url: 'http://posttestserver.com/post.php?dir=grunt-http',
          method: 'POST',
          body: function () { return 'mungface'; }
        },
        dest: 'tmp/bodyAtRuntime.txt'
      },
      ignoreErrors: {
        options: {
          url: 'http://someurlthatdoesntexist.xx',
          method: 'GET',
          ignoreErrors: true
        }
      },
      multipart: {
        options: {
          url: 'http://posttestserver.com/post.php?dir=grunt-http',
          method: 'POST',
          form: function (form) {
            form.append('buffer', new Buffer([1, 2, 3]));
            form.append('file', grunt.file.read(path.join(__dirname, 'test', 'fixtures', 'image.jpg')));
          }
        },
        dest: 'tmp/multipart.txt'
      },
      callback: {
        options: {
          url: 'http://blog.j-g-w.info',
          callback: function (error, response, body) {
            grunt.file.write('tmp/callback.error', util.inspect(error));
            grunt.file.write('tmp/callback.response', util.inspect(response));
            grunt.file.write('tmp/callback.body', util.inspect(body));
          }
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'http', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
  grunt.registerTask('wordpress', ['http:wordpress_login', 'http:wordpress_access']);

};
