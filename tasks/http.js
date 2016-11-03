/*
 * grunt-http
 * https://github.com/johngeorgewright/grunt-contrib-http
 *
 * Copyright (c) 2014 John Wright
 * Licensed under the MIT license.
 */

'use strict';

var request = require('request'),
    async = require('async'),
    FormData = require('form-data');

module.exports = function (grunt) {

  function responseHandler(dest, ignoreErrors, logBody, suppressStatusCode, callback, done) {
    return function (error, response, body) {

      response = response || { statusCode: 0 };

      grunt.verbose.subhead('Response');

      if (error && !ignoreErrors) {
        return done(error);
      } else if (!ignoreErrors && (response.statusCode < 200 || response.statusCode > 399)) {
        return done(response.statusCode + " " + body);
      }

      if (!suppressStatusCode) {
        grunt.log.ok(response.statusCode);
      }

      if (logBody) {
        grunt.log.writeln(body);
      }

      if (dest) {
        grunt.file.write(dest, body);
      }

      if (callback) {
        callback(error, response, body);
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
          logBody: false,
          suppressStatusCode: false,
          sourceField: 'body'
        }),
        done = this.async(),
        logBody = grunt.option("logBody") || options.logBody,
        sourceField = options.sourceField,
        sourcePath = sourceField.split('.'),
        sourceKey = sourcePath.pop(),
        sourceObj = options,
        formCallback = typeof options.form === 'function' ? options.form : null,
        callback = options.callback,
        files = [];

    sourcePath.forEach(function (key) {
      sourceObj = sourceObj[key];
    });

    if (formCallback) {
      delete options.form;
    }

    if (callback && typeof callback !== 'function') {
      throw new Error('`callback` option must be a function');
    }

    function configureSource(file) {
      if (file.src) {
        sourceObj[sourceKey] = file.src;
      }
    }

    function call(file, next) {
      var r, callback, form;
      file = file || {};
      configureSource(file);
      if (typeof(options.body) === 'function') {
        options.body = options.body();
      }
      if (typeof(options.json) === 'function') {
        options.json = options.json();
      }
      callback = responseHandler(file.dest, options.ignoreErrors, logBody, options.suppressStatusCode, options.callback, next);
      r = request(options, callback);
      if (formCallback) {
        form = r.form();
        formCallback(form);
      }
    }

    function resolve(err) {
      if (err) {
        grunt.fail.fatal(err);
      }
      done(err);
    }

    function addToFilesArray(file) {
      var contents;

      if (file.src) {
        contents = file.src.map(readFile).join('\n');
      }

      grunt.verbose.subhead('Request');
      grunt.verbose.writeln(JSON.stringify(options, null, 2));

      files.push({
        src: contents,
        dest: file.dest
      });
    }

    if (this.files.length) {
      this.files.forEach(addToFilesArray);
      async.each(files, call, resolve);
    } else {
      call(null, resolve);
    }

  });

};
