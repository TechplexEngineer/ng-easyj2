'use strict';

var gulp = require('gulp');

gulp.task('watch', ['wiredep', 'injector:css', 'injector:js', 'blockly:js'] ,function () {
  gulp.watch('src/{app,components}/**/*.css', ['injector:css']);
  gulp.watch('src/{app,components}/**/*.js', ['injector:js']);
//  gulp.watch('src/blockly/**/*.js', ['blockly:js']);
  gulp.watch('src/assets/images/**/*', ['images']);
  gulp.watch('bower.json', ['wiredep']);
});
