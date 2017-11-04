'use strict';

var grunt = require('grunt');

exports.http = {

  'it can fetch something just using a destination': function (test) {
    test.expect(1);
    test.equal(
      grunt.file.read('tmp/basic.html').replace(/\s+/g, '').replace(/\\+/g, ''),
      grunt.file.read('test/fixtures/basic.html').replace(/\s+/g, '').replace(/\\+/g, ''),
      'different content to what\'s been downloaded'
    );
    test.done();
  },

  'it should have downloaded compiled code from the closure service': function (test) {
    test.expect(1);
    test.equal(
      grunt.file.read('tmp/compiled.js').trim(),
      grunt.file.read('test/fixtures/compiled.js').trim(),
      'different content to what\'s been downloaded'
    );
    test.done();
  },

  'it can post multipart': function (test) {
    test.expect(1);
    test.equal(
      JSON.parse(grunt.file.read('tmp/multipart.txt')).headers['Content-Length'],
      793731
    );
    test.done();
  },

  // 'callbacks will be given data and response objects': function (test) {
  //   test.expect(2);
  //   ['error', 'body'].forEach(function (part) {
  //     test.equal(
  //       grunt.file.read('tmp/callback.' + part).replace(/\s+/g, '').replace(/\\+/g, ''),
  //       grunt.file.read('test/fixtures/callback.' + part).replace(/\s+/g, '').replace(/\\+/g, ''),
  //       'different content to what\'s been downloaded'
  //     );
  //   });
  //   test.done();
  // },

  'JSON at runtime': function (test) {
    test.expect(1);
    test.equal(
      JSON.parse(grunt.file.read('tmp/jsonAtRuntime.txt')).headers['Content-Length'],
      19
    );
    test.done();
  },

  'body at runtime': function (test) {
    test.expect(1);
    test.equal(
      JSON.parse(grunt.file.read('tmp/bodyAtRuntime.txt')).headers['Content-Length'],
      8
    );
    test.done();
  }

};
