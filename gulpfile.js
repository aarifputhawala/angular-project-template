var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    wiredep = require('wiredep').stream,
    inject = require('gulp-inject'),
    webserver = require('gulp-webserver'),
    runSequence = require('run-sequence'),
    bowerSrc = require('gulp-bower-src');

var paths = {
    html: 'app/**/*.html',
    js: 'app/**/*.js',
    sass: 'app/scss/**/*.scss',
    dist: 'dist',
    distIndex: 'dist/index.html',
    distCSS: ['dist/**/*.css', '!dist/bower_components/**/*.js'],
    distJS: ['dist/**/*.js', '!dist/bower_components/**/*.js'],
    build: 'build'
};

gulp.task('html', function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass())
        .pipe(gulp.dest(paths.dist));
});

gulp.task('js', function () {
    return gulp.src(paths.js)
        .pipe(gulp.dest(paths.dist));
});

gulp.task('bower', function () {
    // gulp.src(paths.dist + '/bower_components').pipe(clean());
    return bowerSrc()
        .pipe(gulp.dest(paths.dist + '/bower_components'));
});

gulp.task('copy', ['html', 'sass', 'js', 'bower']);

gulp.task('inject-vendor', function () {
    return gulp.src(paths.distIndex)
        .pipe(wiredep({}))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('inject-own', function () {
    var css = gulp.src(paths.distCSS);
    var js = gulp.src(paths.distJS);
    return gulp.src(paths.distIndex)
        .pipe(inject(css, { relative: true }))
        .pipe(inject(js, { relative: true }))
        .pipe(gulp.dest(paths.dist));
});

gulp.task('inject', function () {
    runSequence('inject-vendor', 'inject-own');
});

gulp.task('serve', function () {
    runSequence('clean', 'copy', 'inject', function () {
        return gulp.src(paths.dist)
            .pipe(webserver({
                livereload: true,
                open: true
            }));
    });
});

gulp.task('clean', function () {
    return gulp.src([paths.dist, paths.build])
        .pipe(clean());
});

// gulp.task('watch', function() {
//     gulp.watch('app/js/**/*.js', ['jshint', 'build-js']);
//     gulp.watch('app/scss/**/*.scss', ['build-css']);
// });

gulp.task('default', ['watch']);

gulp.task('jshint', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('build-css', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' }))
        .pipe(concat('app.css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('public/assets/stylesheets'));
});

gulp.task('build-js', function () {
    return gulp.src('app/js/**/*.js')
        .pipe(concat('bundle.js'))
        .pipe(rename({ suffix: '.min' }))
        // .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/javascript'));
});