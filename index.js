'use strict';

var fs = require('fs'),
    concat = require('concat-stream'),
    es = require('event-stream'),
    through2 = require('through2'),
    PluginError = require('gulp-util').PluginError;

module.exports = function(options) {
  options = injectDefaultOptions(options);

  var includeRegExp = new RegExp(escapeRegExp(options.prefix) +
      'include\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)' +
      escapeRegExp(options.suffix), 'g');

  function includer(file) {
    var self = this;
    if (file.isNull()) {
      self.emit('data', file);
    } else if (file.isStream()) {
      file.contents.pipe(concat(function(data) {
        var text = String(data);
        self.emit('data', include(file, text, includeRegExp, options.prefix, options.suffix, options.basePath));
      }));
    } else if (file.isBuffer()) {
      try {
        self.emit('data', include(file, String(file.contents), includeRegExp, options.prefix, options.suffix, options.basePath));
      } catch (e) {
        self.emit('error', new PluginError('gulp-file-includer', e));
      }
    }
  }

  return es.through(includer);
};

function injectDefaultOptions(options) {
  options = options || {};
  options.prefix = options.prefix || '@@';
  options.suffix = options.suffix || '';
  options.basePath = options.basePath || '';
  return options;
}

function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

function include(file, text, includeRegExp, prefix, suffix, basePath) {
  var matches = includeRegExp.exec(text);
  while (matches) {
    var match = matches[0],
        includePath = basePath + matches[1];
    try {
      var includeContent = fs.readFileSync(includePath);
    } catch (e) {
      console.log('file not found! (' + basePath + matches[1] + ')');
    }

    text = text.replace(match, includeContent);

    if (matches[3]) {
      // replace variables
      var data = JSON.parse(matches[3]);
      for (var k in data) {
        text = text.replace(
            new RegExp(escapeRegExp(prefix) + k + escapeRegExp(suffix), 'g'), data[k]);
      }
    }
    matches = includeRegExp.exec(text);
  }
  file.contents = new Buffer(text);
  return file;
}