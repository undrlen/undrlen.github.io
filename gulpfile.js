'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');
const gcmq = require('gulp-group-css-media-queries');
const imagemin = require('gulp-imagemin');
const cleancss = require('gulp-clean-css');
const webp = require('gulp-webp');
const babel = require('gulp-babel');

sass.compiler = require('node-sass');


gulp.task('sass', function () {
  return gulp.src('app/sass/*.sass', { sourcemaps: true })
    .pipe(sass({ outputStyle: 'expanded' }))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(gulp.dest('app/css', { sourcemaps: '.' }))
    .pipe(browserSync.stream());
});

gulp.task('watch:sass', function () {
  gulp.watch(['app/sass/**/*.sass', 'app/blocks/**/*.sass'], gulp.series('sass'));
});

gulp.task('serve', function () {
  browserSync.init({
    server: {
      baseDir: "app"
    }
  });
  browserSync.watch(['app/*.html', 'app/js/main.js']).on('change', browserSync.reload);
});

gulp.task('default', gulp.parallel('watch:sass', 'serve'));



// вручную подключаем скрипты ///////////////////

gulp.task('js', function () {

  return gulp.src([
    'app/libs/jquery/dist/jquery.min.js',
    // 'app/libs/menu/drop_down_nav/doubletaptogo.js',
    'app/libs/jquery-migrate-1.2.1.min.js',
    'app/libs/slick/slick.min.js',
    // 'app/libs/ResponsiveSlides/responsiveslides.min.js',
    // 'app/libs/owl.carousel/dist/owl.carousel.min.js',
    // 'app/libs/jquery-ui-acc-tab/jquery-ui.min.js',
    // 'app/libs/jquery-ui-progressbar/jquery-ui.min.js',
    // 'app/libs/jquery-ui-effects/jquery-ui.min.js',
    // 'app/libs/jquery-ui-selectmenu/jquery-ui.min.js',
    // 'app/libs/smoothscroll/dist/smoothscroll.min.js',
    // 'app/libs/fontawesome/fontawesome-all.min.js'
    // 'app/libs/cache-polyfill.js',
    // 'app/libs/lazyload-8.17.0/lazyload.min.js',
    //    'app/libs/anime-master/lib/anime.min.js'
    // 'app/blocks/video.js/dist/video.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
});


// Сжатая  сборка  //////////////////////////////////////

function clean() {
  return del('dist/**');
};

function imageCompression() {
  return gulp.src('app/img/**/*')
    .pipe(imagemin())
    .pipe(gulp.dest('app/img'));
};

function imageToWebp() {
  return gulp.src('app/img/*.{jpg,png}')
    .pipe(webp())
    .pipe(gulp.dest('app/img'));
};

function jsMinify() {
  return gulp.src(['app/js/libs.min.js', 'app/js/main.js'], { base: 'app' })
    // return gulp.src('app/js/**/*')
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('app/js'))
};

function groupCssQueries() {
  return gulp.src('app/css/main.css')
    .pipe(gcmq())
    .pipe(gulp.dest('app/css'));
};

function cssMinify() {
  return gulp.src('app/css/main.css')
    // .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(concat('main.min.css'))
    .pipe(cleancss())
    .pipe(gulp.dest('app/css'));
};

function jsBabel() {
  return gulp.src('app/js/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(gulp.dest('dist'))
};

function publish() {

  return gulp.src([
    'app/css/*.*',
    'app/js/*.*',
    // 'app/js/libs.min.js',
    'app/*.html',
    // 'app/sass/*.*',
    // 'app/ht.access',
    'app/img/*.*',
    // 'app/**/*.{html,css,js,sass}',
    //  Вручную перекидываем нужные шрифты  //////////////////////////////////////////
    // 'app/fonts/DroidSerif/droidserif-400-normal.{woff2,woff,ttf}',
    // 'app/fonts/DroidSerif/droidserif-700-normal.{woff2,woff,ttf}',
    // 'app/fonts/OpenSans/OpenSans/opensans-400-normal.{woff2,woff,ttf}',
    // 'app/fonts/Nunito/nunito-v11-latin-regular.{woff2,woff,ttf}',
    // 'app/fonts/Nunito/nunito-v11-latin-300.{woff2,woff,ttf}',
    // 'app/fonts/Dosis/dosis-v16-latin-200.{woff2,woff,ttf}',
    // 'app/fonts/Amethysta/amethysta-v8-latin-regular.{woff2,woff,ttf}',
    // 'app/fonts/fontello/font/fontello.{woff2,woff,ttf}',
    // 'app/fonts/Socialico/**/*.*',
    ////////////////////////////////////////////////////////////
    '!app/libs/**'
  ], { base: 'app' })
    .pipe(gulp.dest('dist'));

};

const { series, parallel } = require('gulp');

exports.babel = series(jsBabel);
exports.webp = series(imageCompression, imageToWebp);

exports.min = series(
  groupCssQueries,
  parallel(jsMinify, cssMinify)
);

exports.build = series(
  clean,
  imageCompression,
  imageToWebp,
  publish
);
