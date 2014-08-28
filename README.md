# gulp-file-includer [![NPM version][npm-image]][npm-url] [![Build status][travis-image]][travis-url]

> A file include plugin for gulp 3

## Installation

First, install `gulp-file-includer` as a development dependency:

`npm install --save-dev gulp-file-includer`

## Usage

Add it to your `gulpfile.js`:

```javascript
var gulp = require('gulp')
var fileincluder = require('../index')

gulp.task('fileincluder', function() {
  gulp.src(['index.html'])
    .pipe(fileincluder())
    .pipe(gulp.dest('./result/'))
});

gulp.task('default', function() {
  gulp.run('fileincluder')
})
```

index.html
```html
<!DOCTYPE html>
<html>
  <body>
  @@include('./view.html')
  @@include('./var.html', {"name": "haoxin", "age": 12345})
  </body>
</html>
```

view.html
```html
<h1>view</h1>
```

var.html
```html
<label>@@name</label>
<label>@@age</label>
```

and the result is:
```html
<!DOCTYPE html>
<html>
  <body>
  <h1>view</h1>
  <label>haoxin</label>
<label>12345</label>
  </body>
</html>
```

## API

gulp-file-includer can be called with a config object with these attributes:
* **prefix** (defaults to '@@')
* **suffix** (defaults to '')
* **basePath** (defaults to '') If specified, the default root for the file path.

### License
MIT

[travis-url]: http://travis-ci.org/Pictela/gulp-file-includer
[travis-image]: https://secure.travis-ci.org/Pictela/gulp-file-includer.png?branch=master
[npm-url]: https://npmjs.org/package/gulp-file-includer
[npm-image]: https://badge.fury.io/js/gulp-file-includer.png
