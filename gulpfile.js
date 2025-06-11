const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const dartSass = require('sass');
const gulpSass = require('gulp-sass');

const sass = gulpSass(dartSass); // Set the Sass compiler

// Sass to CSS
function style() {
  return gulp.src('src/sass/main.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(cleanCSS())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
}

// Copy HTML
function html() {
  return gulp.src('src/html/**/*.html')
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

// Copy JavaScript
function js() {
  return gulp.src('src/js/**/*.js')
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
}

// Copy Images
function images() {
  return gulp.src('src/assets/images/**/*', { encoding: false }) // Set encoding to null
    .pipe(gulp.dest('dist/assets/images'))
    .pipe(browserSync.stream())
    .on('end', () => console.log('Images copied successfully'))
    .on('error', (err) => console.error('Error copying images:', err));
}


// Live server + watch
function serve() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
  gulp.watch('src/sass/**/*.scss', style);
  gulp.watch('src/html/**/*.html', html);

  gulp.watch('src/assets/images/**/*', images);
}

exports.default = gulp.series(gulp.parallel(style, html, js, images), serve);
