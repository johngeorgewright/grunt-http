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

  function responseHandler (done, dest) {
    return function (error, response, body) {

      grunt.log.subhead('Response');

      if (error) {
        grunt.fail.fatal(error);
        return done(error);
      } else if (response.statusCode < 200 || response.statusCode > 299) {
        grunt.fail.fatal(response.statusCode);
        return done(response.statusCode);
      }

      grunt.log.ok(response.statusCode);

      if (dest) {
        grunt.file.write(dest, body);
      }

      done();

    };
  }

  grunt.registerMultiTask('http', 'Sends a HTTP request and deals with the response.', function () {

    var data = this.data,
        done = this.async(),
        dest = false;

    if (data.dest) {
      dest = data.dest;
      delete data.dest;
    }

    if (!data.url) {
      grunt.fail.fatal('The http task requires a URL');
    }

    grunt.log.subhead('Request');
    grunt.log.writeln(JSON.stringify(data, null, 2));

    request(data, responseHandler(done, dest));

  });

};

