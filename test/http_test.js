'use strict';

var request = require('request'),
    grunt = require('grunt');

exports.http = {

  'it should have downloaded compiled code from the closure service': function (test) {
    test.expect(1);
    test.equal(
      grunt.file.read('tmp/compiled.js'),
      grunt.file.read('test/fixtures/compiled.js'),
      'different content to what\'s been downloaded'
    );
    test.done();
  }

};

