var should = require('should');

var fs = require("fs");
var es = require('event-stream');
var gulp = require("gulp");
var includer = require('../');
var concat = require('concat-stream');

describe('source1.html', function() {
  describe('with includer()', function() {
    it('should match source1_output1.html', function(cb) {
      TestReplace('source1.html', null, 'source1_output1.html', true, cb);
    });
  });
});

describe('source2.html', function() {
  describe('with includer({basePath:"test/fixtures"})', function() {
    it('should match source2_output1.html', function(cb) {
      var options = {basePath:"test/fixtures/"};
      TestReplace('source2.html', options, 'source2_output1.html', true, cb);
    });
  });
});

describe('source3.html', function() {
  describe('with includer({prefix:"<!--+", suffix:"-->"})', function() {
    it('should match source3_output1.html', function(cb) {
      var options = {prefix:"<!--+", suffix:"-->"};
      TestReplace('source3.html', options, 'source3_output1.html', true, cb);
    });
  });
});

function TestReplace(sourceFile, options, testFile, shouldEqual, cb) {
  fs.readFile("./test/fixtures/" + testFile, function(err, expectedOutput) {
    if (err) { return cb(err); }

    function _assertOutput(output, expectedOutput) {
      if (shouldEqual) {
        console.log(output, 'should equal', expectedOutput);
        output.should.equal(expectedOutput);
      } else {
        console.log(output, 'should not equal', expectedOutput);
        output.should.not.equal(expectedOutput);
      }
      cb();
    }

    gulp.src("test/fixtures/" + sourceFile)
      .pipe(includer(options))
      .pipe(es.through(function(file) {
        if (file.isStream()) {
          file.contents.pipe(concat(function(output) {
            _assertOutput(String(output), String(expectedOutput));
          }));
        } else if (file.isBuffer()) {
          _assertOutput(String(file.contents), String(expectedOutput));
        } else {
          cb(new Error('unknown file type'));
        }
      }));
  });
}
