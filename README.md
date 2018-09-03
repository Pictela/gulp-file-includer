# gulp-file-includer

> A file include plugin for gulp 3

[npm-url]

## Installation

`yarn add --dev gulp-file-includer`

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

[npm-url]: https://npmjs.org/package/@yodasws/gulp-file-includer
