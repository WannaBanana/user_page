var gulp = require('gulp'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    uglify = require('gulp-uglify-es').default,
    clean = require('gulp-clean'),
    rename = require("gulp-rename"),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    notify = require("gulp-notify"),
    minifyHTML = require('gulp-minify-html'),
    ghPages = require('gulp-gh-pages'),
    config = require('./gulpconfig');

gulp.task('server', function () {
    connect.server({
        root: config.dir.dest,
        livereload: true,
        port: 8080
    });
});

gulp.task('clean', function () {
    return gulp.src((config.dir.dest + '/*'), {
            read: false
        })
        .pipe(clean())
});

//Deploy to ghPages Task
gulp.task('ghpages', ['build'],function () {
    return gulp.src(config.dir.dest + "/**/*")
        .pipe(ghPages())
});

gulp.task('minify-style', function () {
    return gulp.src(config.paths.style.src)
        // .pipe(concat('all.css'))
        .pipe(minifyCSS({
            keepBreaks: true,
        }))
        .pipe(gulp.dest(config.dir.dest))
        .pipe(connect.reload());
});

gulp.task('minify-script', function () {
    return gulp.src(config.paths.script.src)
        // .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(config.dir.dest))
        .pipe(connect.reload());
});

gulp.task('minify-html', function () {
    var opts = {
        comments: false,
        spare: false,
        quotes: true
    };
    return gulp.src(config.paths.html.src)
        .pipe(minifyHTML(opts))
        .pipe(gulp.dest(config.dir.dest));
});

gulp.task('minify-img', function () {
    return gulp.src(config.paths.img.src)
        .pipe(imagemin())
        .pipe(gulp.dest(config.dir.dest));
});

gulp.task('default', ['clean'], function () {
    gulp.start(['build', 'server']);
});

gulp.task('build', ['minify-style', 'minify-script', 'minify-html', 'minify-img'], function () {
    return gulp.src('')
        .pipe(notify({
            message: 'Finished!'
        }));
});

gulp.task('deploy', ['ghpages']);