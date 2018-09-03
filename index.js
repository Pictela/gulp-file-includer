'use strict';

const fs = require('fs');
const concat = require('concat-stream');
const es = require('event-stream');
const through2 = require('through2');
const PluginError = require('gulp-util').PluginError;

module.exports = function(options) {
  options = injectDefaultOptions(options);

  const includeRegExp = new RegExp(escapeRegExp(options.prefix) +
      'include\\(\\s*["\'](.*?)["\'](,\\s*({[\\s\\S]*?})){0,1}\\s*\\)' +
      escapeRegExp(options.suffix), 'g');

  const includer => (file) => {
    if (file.isNull()) {
      this.emit('data', file);
    } else if (file.isStream()) {
      file.contents.pipe(concat((data) => {
        const text = String(data);
        this.emit('data', include(file, text, includeRegExp, options.prefix, options.suffix, options.basePath));
      }));
    } else if (file.isBuffer()) {
      try {
        this.emit('data', include(file, String(file.contents), includeRegExp, options.prefix, options.suffix, options.basePath));
      } catch (e) {
        this.emit('error', new PluginError('gulp-file-includer', e));
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
  let matches = includeRegExp.exec(text);
  while (matches) {
    const match = matches[0];
    const includePath = basePath + matches[1];
	let includeContent = '';
    try {
      includeContent = fs.readFileSync(includePath);
    } catch (e) {
      console.log('file not found! (' + basePath + matches[1] + ')');
    }

    if (matches[3]) {
      // replace variables
      const data = JSON.parse(matches[3]);
      for (const k in data) {
        includeContent = includeContent.replace(
            new RegExp(escapeRegExp(prefix) + k + escapeRegExp(suffix), 'g'), data[k]);
      }
    }

    text = text.replace(match, includeContent);
    includeRegExp.lastIndex -= match.length;

    matches = includeRegExp.exec(text);
  }
  file.contents = new Buffer(text);
  return file;
}
