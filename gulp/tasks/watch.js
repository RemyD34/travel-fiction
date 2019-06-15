const { src, dest, task, watch, parallel, series } = require('gulp');

// Browser refresh plugin
var browserSync = require('browser-sync').create(),
  // JS plugins
  webpack = require('webpack'),
  // CSS plugins
  postcss = require('gulp-postcss'),
  cssImport = require('postcss-import'),
  mixins = require('postcss-mixins'),
  cssvars = require('postcss-simple-vars'),
  nested = require('postcss-nested'),
  hexrgba = require('postcss-hexrgba'),
  autoprefixer = require('autoprefixer'),
  rename = require('gulp-rename');

// Webpack variable
var configURL = '../../webpack.config.js';

// Watch variables
var styleWatch = './app/assets/styles/**/*.scss';
var scriptWatch = './app/assets/scripts/**/*.js';

// CSS variables
var cssSRC = './app/assets/styles/styles.scss';
var cssURL = './app/temp/styles';

// CSS task.
function css(done) {
  src(cssSRC)
    .pipe(rename('styles.css'))
    .pipe(postcss([cssImport(), mixins(), cssvars(), nested(), hexrgba(), autoprefixer()]))
    .on('error', function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit('end');
    })
    .pipe(dest(cssURL));
  done();
}

// JS task.
// Automate bundling JS files into one file with Webpack 4
function scripts(done) {
  webpack(require(configURL), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }
    console.log(stats.toString());
  });
  done();
}

// Browser sync Tasks
function browser_sync() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'app'
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

// Watch files and reload browsersync after saving a change.
function watch_files(done) {
  watch(styleWatch, series(css, reload));
  watch(scriptWatch, series(scripts, reload));
  done();
}

task('watch', parallel(browser_sync, watch_files));
task('prep', series(css, scripts));
