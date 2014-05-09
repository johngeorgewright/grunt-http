'use strict';

var grunt = require('grunt');

exports.http = {

  'it can fetch something just using a destination': function (test) {
    test.expect(1);
    test.equal(
      grunt.file.read('tmp/basic.html'),
      grunt.file.read('test/fixtures/basic.html'),
      'different content to what\'s been downloaded'
    );
    test.done();
  },

  'it should have downloaded compiled code from the closure service': function (test) {
    test.expect(1);
    test.equal(
      grunt.file.read('tmp/compiled.js'),
      grunt.file.read('test/fixtures/compiled.js'),
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
        grunt.file.read('tmp/callback.' + part),
        grunt.file.read('test/fixtures/callback.' + part)
      );
    });
    test.done();
  },

  'JSON at runtime': function (test) {
    test.expect(1);
    test.ok(
      grunt.file.read('tmp/bodyAtRuntime.txt').match('Post body was 23 chars long.')
    );
    test.done();
  }

};

