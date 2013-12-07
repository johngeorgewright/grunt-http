/*
 * grunt-http
 * https://github.com/johngeorgewright/grunt-contrib-http
 *
 * Copyright (c) 2013 John Wright
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request');

module.exports = function (grunt) {

  function responseHandler (done, dest, ignoreErrors) {
    return function (error, response, body) {

      response = response || { statusCode: 0 };

      grunt.verbose.subhead('Response');

      if (error && !ignoreErrors) {
        grunt.fail.fatal(error);
        return done(error);
      } else if (!ignoreErrors && (response.statusCode < 200 || response.statusCode > 299)) {
        grunt.fail.fatal(response.statusCode);
        return done(response.statusCode);
      }

      grunt.log.ok(response.statusCode);
      grunt.verbose.writeln(body);

      if (dest) {
        grunt.file.write(dest, body);
      }

      done();
    };
  }

  function readFile(filepath) {
    return grunt.file.read(filepath);
  }

  grunt.registerMultiTask('http', 'Sends a HTTP request and deals with the response.', function () {

    var options = this.options({
          ignoreErrors: false,
          sourceField: 'body'
        }),
        done = this.async(),
        sourceField = options.sourceField,
        sourcePath = sourceField.split('.'),
        sourceKey = sourcePath.pop(),
        sourceObj = options;

    sourcePath.forEach(function (key) {
      sourceObj = sourceObj[key];
    });

    if (this.files.length) {
      this.files.forEach(function (file) {
        var dest = file.dest,
            contents;

        if (file.src) {
          contents = file.src.map(readFile).join('\n');
          sourceObj[sourceKey] = contents;
        }

        grunt.verbose.subhead('Request');
        grunt.verbose.writeln(JSON.stringify(options, null, 2));

        request(options, responseHandler(done, dest, options.ignoreErrors));
      });
    } else {
      request(options, responseHandler(done, null, options.ignoreErrors));
    }

  });

};

