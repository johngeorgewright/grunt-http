'use strict';

var grunt = require('grunt');

exports.http = {

  'it can fetch something just using a destination': function (test) {
    test.expect(1);
    test.equal(
      grunt.file.read('tmp/basic.html').replace(/\s+/g, ''),
      grunt.file.read('test/fixtures/basic.html').replace(/\s+/g, ''),
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
    test.ok(
      grunt.file.read('tmp/multipart.txt').match('Successfully dumped 2 post variables')
    );
    test.done();
  },

  'callbacks will be given data and response objects': function (test) {
    test.expect(2);
    ['error', 'body'].forEach(function (part) {
      test.equal(
        grunt.file.read('tmp/callback.' + part).trim(),
        grunt.file.read('test/fixtures/callback.' + part).trim()
      );
    });
    test.done();
  },

  'JSON at runtime': function (test) {
    test.expect(1);
    test.ok(
      grunt.file.read('tmp/jsonAtRuntime.txt').match('Post body was 23 chars long.')
    );
    test.done();
  },

  'body at runtime': function (test) {
    test.expect(1);
    test.ok(
      grunt.file.read('tmp/bodyAtRuntime.txt').match('Post body was 8 chars long.')
    );
    test.done();
  }

};
