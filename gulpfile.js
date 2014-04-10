var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');

var paths = {
  scripts: ['css/src/main.less']
};

gulp.task('default', function() {
	return gulp.src(paths.scripts)
			.pipe(plumber())
			.pipe(less().on('error', function(e) {console.log(e)}))
			.pipe(gulp.dest('css/dist'));
});
gulp.task('watch', function() {
	var watcher = gulp.watch('css/src/*.less', ['default']);
});