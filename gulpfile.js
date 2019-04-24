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
  del = require("del");

// Browser related plugins
var browserSync = require("browser-sync").create();

// project related variables
var styleWatch = "./app/assets/styles/**/*.scss";
var htmlWatch = "./app/index.html";

var cssSRC = "./app/assets/styles/styles.scss";
var cssURL = "./app/temp/styles";

//Sprite related variables
var iconSRC = "./app/assets/images/icons/**/*.svg";
var iconURL = "./app/temp/sprite/";
var graphicSRC = "./app/temp/sprite/css/**/*.svg";
var graphicURL = "./app/assets/images/sprites";
var copySRC = "./app/temp/sprite/css/*.css";
var copyURL = "./app/assets/styles/modules";
// var moduleURL = "./app/assets/styles/modules/_sprite.scss";

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

// Tasks
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

function html(done) {
  console.log("Imagine something useful being done to your HTML here.");
  done();
}

function css(done) {
  src(cssSRC)
    .pipe(rename("styles.css"))
    .pipe(postcss([cssImport(), mixins(), cssvars(), nested(), autoprefixer()]))
    .on("error", function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit("end");
    })
    .pipe(dest(cssURL));
  done();
}

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

function watch_files(done) {
  watch(htmlWatch, series(html, reload));
  watch(styleWatch, series(css, reload));
  done();
}

task("css", css);
task("html", html);

task("default", parallel(css, html));
task("watch", parallel(browser_sync, watch_files));
task("icons", series(beginClean, createSprite, copySpriteGraphic, copySpriteCSS, endClean));
