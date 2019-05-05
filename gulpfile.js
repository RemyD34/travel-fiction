const { src, dest, task, watch, parallel, series } = require("gulp");

// CSS related plugins
var postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssvars = require("postcss-simple-vars"),
  nested = require("postcss-nested"),
  cssImport = require("postcss-import"),
  mixins = require("postcss-mixins"),
  svgSprite = require("gulp-svg-sprite"),
  rename = require("gulp-rename"),
  del = require("del"),
  hexrgba = require("postcss-hexrgba");

// JS related plugins
var webpack = require("webpack");
var configURL = "./webpack.config.js";

// Browser related plugins
var browserSync = require("browser-sync").create();

// project related variables
var styleWatch = "./app/assets/styles/**/*.scss";
var htmlWatch = "./app/index.html";
var scriptWatch = "./app/assets/scripts/**/*.js";

var cssSRC = "./app/assets/styles/styles.scss";
var cssURL = "./app/temp/styles";

//Sprite related variables
var iconSRC = "./app/assets/images/icons/**/*.svg";
var iconURL = "./app/temp/sprite/";
var graphicSRC = "./app/temp/sprite/css/**/*.svg";
var graphicURL = "./app/assets/images/sprites";
var copySRC = "./app/temp/sprite/css/*.css";
var copyURL = "./app/assets/styles/modules";

var config = {
  mode: {
    css: {
      sprite: "sprite.svg",
      render: {
        css: {
          template: "./gulp/templates/sprite.scss"
        }
      }
    }
  }
};

// Function Tasks
function browser_sync() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "app"
    }
  });
}

function reload(done) {
  browserSync.reload();
  done();
}

// HTML task.
function html(done) {
  console.log("Imagine something useful being done to your HTML here.");
  done();
}

// CSS task.
function css(done) {
  src(cssSRC)
    .pipe(rename("styles.css"))
    .pipe(postcss([cssImport(), mixins(), cssvars(), nested(), hexrgba(), autoprefixer()]))
    .on("error", function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit("end");
    })
    .pipe(dest(cssURL));
  done();
}

// JS task.
// Automate bundling JS files into one file with Webpack 4.30.0
function scripts(done) {
  webpack(require(configURL), function(err, stats) {
    if (err) {
      console.log(err.toString());
    }
    console.log(stats.toString());
    done();
  });
}

// Begin compilling multiple icon files into one sprite file.
// Delete outdated sprite files before creating new ones.
function beginClean(done) {
  del([iconURL, graphicURL]);
  done();
}

// Create a sprite file.
function createSprite() {
  return src(iconSRC)
    .pipe(svgSprite(config))
    .pipe(dest(iconURL));
}

// Copy the sprite file to the images/sprites map to organize.
function copySpriteGraphic() {
  return src(graphicSRC).pipe(dest(graphicURL));
}

// Rename and copy the css sprite file to the modules map.
function copySpriteCSS() {
  return src(copySRC)
    .pipe(rename("_sprite.scss"))
    .pipe(dest(copyURL));
}

// Delete unused sprite files.
function endClean(done) {
  del([iconURL]);
  done();
}

// Watch files and reload browsersync after saving a change.
function watch_files(done) {
  watch(htmlWatch, series(html, reload));
  watch(styleWatch, series(css, reload));
  watch(scriptWatch, series(scripts, reload));
  done();
}

// Call tasks
// Parallel starts all tasks at the same time.
// Series starts all tasks sequential. One after another.
task("html", html);
task("css", css);
task("scripts", scripts);

task("default", parallel(css, html));
task("watch", parallel(browser_sync, watch_files));
task("icons", series(beginClean, createSprite, copySpriteGraphic, copySpriteCSS, endClean));
