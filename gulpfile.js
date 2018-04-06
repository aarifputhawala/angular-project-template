var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    webserver = require('gulp-webserver');

var paths = {
    html: 'app/**/*.html',
    js: 'app/js/**/*.js',
    sass: 'app/scss/**/*.scss',
    dist: 'dist'
};

gulp.task('html', function() {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function() {
    return gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('serve', function() {
    return gulp.src(paths.dist)
        .pipe(webserver({
            livereload: true,
            open: true
        }));
});

gulp.task('default', ['watch']);

gulp.task('jshint', function() {
    return gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function() {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('app.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('build-js', function() {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/javascript'));
});

gulp.task('watch', function() {
    gulp.watch('app/js/**/*.js', ['jshint', 'build-js']);
    gulp.watch('app/scss/**/*.scss', ['build-css']);
});