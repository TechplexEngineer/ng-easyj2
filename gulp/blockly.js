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
"blockly/blocks/blockly/lists.js",
"blockly/blocks/blockly/logic.js",
"blockly/blocks/blockly/loops.js",
"blockly/blocks/blockly/math.js",
"blockly/blocks/blockly/procedures.js",
"blockly/blocks/blockly/text.js",
"blockly/blocks/blockly/variables.js",
"blockly/blocks/local/analog.js",
"blockly/blocks/local/blocks.js",
"blockly/blocks/local/digital_input.js",
"blockly/blocks/local/digital_output.js",
"blockly/blocks/local/gyro.js",
"blockly/blocks/local/iterativerobot.js",
"blockly/blocks/local/joystick.js",
"blockly/blocks/local/motors.js",
"blockly/blocks/local/relay.js",
"blockly/blocks/local/simplerobot.js",
"blockly/blocks/local/solenoid_double.js",
"blockly/blocks/local/solenoid_single.js",
"blockly/blocks/local/timing.js",
"blockly/blocks/local/variables_boolean.js",
"blockly/blocks/local/variables_double.js",
"blockly/blocks/local/variables_int.js",
"blockly/blocks/local/statevars.js",
"blockly/generators/java/logic.js",
"blockly/generators/java/loops.js",
"blockly/generators/java/math.js",
"blockly/generators/java/procedures.js",
"blockly/generators/java/text.js",
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
