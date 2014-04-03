/*
 * grunt-http
 * https://github.com/johngeorgewright/grunt-contrib-http
 *
 * Copyright (c) 2014 John Wright
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request'),
    async = require('async');

module.exports = function (grunt) {

  function responseHandler(dest, ignoreErrors, done) {
    return function (error, response, body) {

      response = response || { statusCode: 0 };

      grunt.verbose.subhead('Response');

      if (error && !ignoreErrors) {
        return done(error);
      } else if (!ignoreErrors && (response.statusCode < 200 || response.statusCode > 399)) {
        return done(response.statusCode + " " + body);
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

    var _this = this,
        options = this.options({
          ignoreErrors: false,
          sourceField: 'body'
        }),
        done = this.async(),
        sourceField = options.sourceField,
        sourcePath = sourceField.split('.'),
        sourceKey = sourcePath.pop(),
        sourceObj = options,
        formCallback = typeof options.form === 'function' ? options.form : null,
        dests = [];

    sourcePath.forEach(function (key) {
      sourceObj = sourceObj[key];
    });

    if (formCallback) {
      delete options.form;
    }

    function call(dest, next) {
      var r = request(options, responseHandler(dest, options.ignoreErrors, next));
      if (formCallback) {
        formCallback(r.form());
      }
    }

    function resolve(err) {
      if (err) {
        grunt.fail.fatal(err);
      }
      done();
    }

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

        dests.push(dest);
      });

      async.each(dests, call, resolve);

    } else {

      call(null, resolve);

    }
  });

};

