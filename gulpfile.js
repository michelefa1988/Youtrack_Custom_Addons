/* jshint node: true */

var
    gulp = require('gulp'),
    coffee = require('gulp-coffee'),
    sourcemaps = require('gulp-sourcemaps');

var paths = {
    coffee: ["src/**/*.coffee"],
    other: ["!src/**/*.coffee", "src/**/*"],
    dest: "dist"
};


gulp.task("coffee-script", function(){
    return gulp.src(paths.coffee)
        .pipe(coffee({bare: true}))
        .pipe(gulp.dest(paths.dest));
});

gulp.task("others", function(){
    return gulp.src(paths.other)
    .pipe(gulp.dest(paths.dest));
});


gulp.task('watch', function(){
    gulp.watch(paths.coffee, ['coffee-script']);
    gulp.watch(paths.other, ['others']);
});

gulp.task('build', ['coffee-script', 'others']);

gulp.task('default', ['build', 'watch']);
