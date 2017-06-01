var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var autoprefixer = require('gulp-autoprefixer');

gulp.task('serve', ['sass'], function() {

  browserSync.init({
    server: './app'
  });

  gulp.watch('./app/assets/sass/**/*.scss', ['sass']);
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('sass', function () {
  return gulp.src('./app/assets/sass/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 4 versions'],
      cascade: false
    }))
    .pipe(sourcemaps.write('./app/assets/maps'))
    .pipe(gulp.dest('./app/assets/css'))
    .pipe(browserSync.stream());
});

gulp.task('sass:watch', function () {
  gulp.watch('./app/assets/sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass', 'serve']);