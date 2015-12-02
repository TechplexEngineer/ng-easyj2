'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var $ = require('gulp-load-plugins')();
var closureCompiler = require('gulp-closure-compiler');

var files_dev = [
"blockly-src/blockly_uncompressed.js",
"blockly-src/msg/js/en.js",

"blockly-ext/generators/java.js",
"blockly-ext/easyj/javagenerator.js", //must come after java
"blockly-ext/core/field_variable_typed.js",

"blockly-ext/blocks/**/*.js",

"blockly-ext/generators/java/*.js",
];
for (var i = 0; i < files_dev.length; i++) {
	files_dev[i] = path.resolve(path.join(conf.paths.src, files_dev[i]));
}

var files_prod = [
"dist/scripts/blockly-compressed.js",
"dist/scripts/blocks-compressed.js",
"dist/scripts/java-compressed.js",
];

gulp.task('blockly-dev', function() {
	console.log("blockly-dev");
	var injectFile = gulp.src(files_dev, { read: false });
  var injectOptions = {
    starttag: '<!-- inject:blockly -->',
    ignorePath: conf.paths.src,
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.tmp, '/serve/index.html'))
    .pipe($.inject(injectFile, injectOptions))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});


gulp.task('blockly-prod', ['inject', 'blockly-compressed', 'blocks-compressed', 'java-compressed'], function(){
	var injectFile = gulp.src(files_prod, { read: false });
	var injectOptions = {
    starttag: '<!-- inject:blockly -->',
    ignorePath: path.join(conf.paths.dist),
    addRootSlash: false
  };
  return gulp.src(path.join(conf.paths.tmp, '/serve/index.html'))
    .pipe($.inject(injectFile, injectOptions))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));

});
//blockly
gulp.task('blockly-compressed', function() {
	return gulp.src([
			'src/blockly-src/core/*.js',
			'src/blockly-ext/core/*.js',
			'src/closure-library/closure/goog/**/*.js',
			'src/closure-library/third_party/*.js'
		])
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'blockly-compressed.js',
      compilerFlags: {
        closure_entry_point: 'EasyJ',
        compilation_level: 'SIMPLE',
        // manage_closure_dependencies: true,
        only_closure_dependencies: true,
        //warning_level: 'VERBOSE'
      }
    }))
    //@cat $@ | $(TRIM_LIC) > $@ @todo
    .pipe(gulp.dest('dist/scripts'));
});


//blocks
gulp.task('blocks-compressed', function() {
	return gulp.src([
			'src/blockly-ext/shim/blocks.js',
			'src/blockly-ext/blocks/*.js'
		])
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'blocks-compressed.js',
      compilerFlags: {
        compilation_level: 'SIMPLE'
      }
    }))
    //@cat $@ | $(TRIM_LIC) > $@ @todo
    .pipe($.replace(/var Blockly=\{Blocks:\{\}\};/gi, ''))//@sed -i 's/var Blockly={Blocks:{}};//g' $@
    .pipe(gulp.dest('dist/scripts'));
});

//generators
gulp.task('java-compressed', function() {
	return gulp.src([
			'src/blockly-ext/shim/generator.js',
			'src/blockly-ext/generators/java.js',
			'src/blockly-ext/generators/java/*.js'
		])
    .pipe(closureCompiler({
      compilerPath: 'bower_components/closure-compiler/compiler.jar',
      fileName: 'java-compressed.js',
      compilerFlags: {
        compilation_level: 'SIMPLE'
        // manage_closure_dependencies: false
      }
    }))
    //@cat $@ | $(TRIM_LIC) > $@ @todo
    .pipe($.replace(/var Blockly=\{Blocks:\{\}\};/gi, ''))//@sed -i 's/var Blockly={Blocks:{}};//g' $@
    .pipe($.replace(/var Blockly=\{Generator:\{\}\};/gi, ''))
    .pipe(gulp.dest('dist/scripts'));
});


