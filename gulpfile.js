const { src, dest, task, watch, parallel } = require("gulp");

//CSS related plugins
var postcss        = require('gulp-postcss');
var autoprefixer   = require('autoprefixer');
var cssvars        = require('postcss-simple-vars');
var nested         = require('postcss-nested');


// project related variables
var styleWatch   = ('./app/assets/styles/styles.css');
var htmlWatch    = ('./app/index.html');

var cssSRC       = ('./app/assets/styles/styles.css');
var cssURL       = ('./app/temp/styles');


function html(done) {

    console.log("Imagine something useful being done to your HTML here.");
    done();
};

function css(done) {

    src(cssSRC)
    .pipe(postcss([cssvars(), nested(), autoprefixer()]))
    .pipe(dest(cssURL));
    done();
};

function watch_files(done) {

    watch(htmlWatch, html);
    watch(styleWatch, css);
    done();
};

task("css", css);
task("html", html);

task("default", parallel(css, html));
task("watch", watch_files);