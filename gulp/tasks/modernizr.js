const { src, dest, task } = require('gulp');

// Modernizr plugin
var Modernizr = require('gulp-modernizr');

// Modernizr variables
var modernizrCssSRC = './app/assets/styles/**/*.scss';
var modernizrJsSRC = './app/assets/scripts/**/*.js';
var modernizrURL = './app/temp/scripts/';
// var modernizrConfig = '../../modernizr-config.json';

// // Using Modernizr to look in .scss and .js files then build a modernizr.js file.
function modernizr() {
  return src([modernizrCssSRC, modernizrJsSRC])
    .pipe(
      Modernizr({
        'options': ['setClasses']
      })
    )
    .pipe(dest(modernizrURL));
}

task('modernizr', modernizr);
