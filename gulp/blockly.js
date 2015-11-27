'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var $ = require('gulp-load-plugins')();

var files = [
"blockly-src/blockly_uncompressed.js",
"blockly-src/msg/js/en.js",
"blockly/easyj/easyj.js",
"blockly/easyj/easyj.checker.js",
"blockly/generators/java.js",
"blockly/easyj/javagenerator.js",
"blockly/field_variable_typed.js",
"blockly/easyj/tabifier.js",

"blockly/blocks/**/*.js",

"blockly/generators/java/*.js",
];


for (var i = 0; i < files.length; i++) {
	files[i] = path.resolve(path.join(conf.paths.src, files[i]));
}

gulp.task('blockly-dev', function() {
	var injectFile = gulp.src(files, { read: false });
  var injectOptions = {
    starttag: '<!-- inject:blockly -->',
    ignorePath: path.join(conf.paths.src),
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.tmp, '/serve/index.html'))
    .pipe($.inject(injectFile, injectOptions))
    .pipe(require('gulp-debug')())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

gulp.task('blockly-prod', function() {
  // Do stuff
});
