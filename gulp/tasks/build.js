const { src, dest, task, series } = require('gulp');

// Browser refresh plugin
var browserSync = require('browser-sync').create(),
  // Build packages
  imagemin = require('gulp-imagemin'),
  del = require('del'),
  usemin = require('gulp-usemin'),
  rev = require('gulp-rev'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify');

// Optimize images variables
var imageSRC = './app/assets/images/**/*';
var excludeIconsSRC = '!./app/assets/images/icons/**';
var imagesURL = './docs/assets/images';
// Usemin variables
var useminSRC = './app/index.html';

// Preview dist folder with browser sync.
function previewDist() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'docs'
    }
  });
}

// Build tasks
function deleteDistFolder() {
  return del('./docs');
}

function copyGeneralFiles() {
  var pathsToCopy = [
    './app/**/*',
    '!./app/index.html',
    '!./app/assets/images/**',
    '!./app/assets/scripts/**',
    '!./app/assets/styles/**',
    '!./app/temp/**'
  ];
  return src(pathsToCopy).pipe(dest('./docs'));
}

function optimizeImages() {
  return src([imageSRC, excludeIconsSRC])
    .pipe(
      imagemin({
        progressive: true,
        interlaced: true,
        multipass: true
      })
    )
    .pipe(dest(imagesURL));
}

function useMin() {
  return src(useminSRC)
    .pipe(
      usemin({
        css: [
          function() {
            return rev();
          },
          function() {
            return cssnano();
          }
        ],
        js: [
          function() {
            return rev();
          },
          function() {
            return uglify();
          }
        ]
      })
    )
    .pipe(dest('./docs'));
}

task('build', series(deleteDistFolder, copyGeneralFiles, optimizeImages, useMin));
task('preview', previewDist);
