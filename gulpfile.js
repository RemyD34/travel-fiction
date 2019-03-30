const { src, dest, task, watch, parallel, series } = require("gulp");

// CSS related plugins
var postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssvars = require("postcss-simple-vars"),
  nested = require("postcss-nested"),
  cssImport = require("postcss-import"),
  mixins = require("postcss-mixins");

// Browser related plugins
var browserSync = require("browser-sync").create();

// project related variables
var styleWatch = "./app/assets/styles/**/*.scss";
var htmlWatch = "./app/index.html";

var cssSRC = "./app/assets/styles/styles.css";
var cssURL = "./app/temp/styles";

// Tasks
function browser_sync() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: "./app/"
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
    .pipe(postcss([cssImport(), mixins(), cssvars(), nested(), autoprefixer()]))
    .on("error", function(errorInfo) {
      console.log(errorInfo.toString());
      this.emit("end");
    })
    .pipe(dest(cssURL));
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
