
const { src, dest, parallel, series, watch } = require('gulp');
const bs = require('browser-sync').create();
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const del = require('del');

const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const cleancss = require('gulp-clean-css');
const gcmq = require('gulp-group-css-media-queries');

function browsersync() {
  bs.init({
    server: { baseDir: 'app/' },
    // notify: true,
    // online: true,
    files: ['app/*.html', 'app/js/main.js']
  })
}

function styles() {
  return src('app/sass/main.sass', { sourcemaps: true })
    .pipe(sass().on('error', sass.logError))
    // .pipe(sass().on('error'))
    .pipe(autoprefixer())
    .pipe(dest('app/css/', { sourcemaps: '.' }))
    .pipe(bs.stream())
}

exports.browsersync = browsersync;
exports.styles = styles;

exports.default = parallel(() => watch('app/sass/**/*', styles), browsersync);




// вручную подключаем скрипты ///////////////////


function js() {

  return src([
    'app/libs/jquery/dist/jquery.min.js',
    // 'app/libs/menu/drop_down_nav/doubletaptogo.js',
    'app/libs/jquery-migrate-1.2.1.min.js',
    'app/libs/slick/slick.js',

    // 'app/libs/ResponsiveSlides/responsiveslides.min.js',
    // 'app/libs/owl.carousel/docs/owl.carousel.min.js',
    // 'app/libs/jquery-ui-acc-tab/jquery-ui.min.js',
    // 'app/libs/jquery-ui-progressbar/jquery-ui.min.js',
    // 'app/libs/jquery-ui-effects/jquery-ui.min.js',
    // 'app/libs/jquery-ui-selectmenu/jquery-ui.min.js',
    // 'app/libs/smoothscroll/docs/smoothscroll.min.js',
    // 'app/libs/fontawesome/fontawesome-all.min.js'
    // 'app/libs/cache-polyfill.js',
    // 'app/libs/lazyload-8.17.0/lazyload.min.js',

    // 'app/js/main.js'

    //    'app/libs/anime-master/lib/anime.min.js'
    // 'app/blocks/video.js/docs/video.js'
  ])
    .pipe(concat('libs.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
}

exports.js = js;

// Сжатая  сборка  //////////////////////////////////////

function clean() {
  return del('docs/**');
};

function imageCompression() {
  return src('app/img/**/*')
    .pipe(imagemin())
    .pipe(dest('app/img'));
};

function imageToWebp() {
  return src('app/img/*.{jpg,png}')
    .pipe(webp())
    .pipe(dest('app/img'));
};

function jsMinify() {
  return src(['app/js/libs.min.js', 'app/js/main.js'], { base: 'app' })
    // return src('app/js/**/*')
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(dest('app/js'))
};

function groupCssQueries() {
  return src('app/css/main.css')
    .pipe(gcmq())
    .pipe(dest('app/css'));
};

function cssMinify() {
  return src('app/css/main.css')
    // .pipe(rename({suffix: '.min', prefix : ''}))
    .pipe(concat('main.min.css'))
    .pipe(cleancss())
    .pipe(dest('app/css'));
};

function jsBabel() {
  return src('app/js/main.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(dest('docs'))
};

function publish() {

  return src([
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
    .pipe(dest('docs'));

};

// const { series, parallel } = require('gulp');

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