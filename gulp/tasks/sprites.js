const { src, dest, task, series } = require('gulp');

// Sprite plugins
var del = require('del'),
  rename = require('gulp-rename'),
  svgSprite = require('gulp-svg-sprite'),
  svg2png = require('gulp-svg2png');

// Sprite variables
var iconSRC = './app/assets/images/icons/**/*.svg';
var iconURL = './app/temp/sprite/';
var pngSRC = './app/temp/sprite/css/*.svg';
var pngURL = './app/temp/sprite/css';
var graphicSRC = './app/temp/sprite/css/**/*.{svg,png}';
var graphicURL = './app/assets/images/sprites';
var copySRC = './app/temp/sprite/css/*.css';
var copyURL = './app/assets/styles/modules';

// Sprite config
var config = {
  shape: {
    spacing: {
      padding: 1
    }
  },
  mode: {
    css: {
      variables: {
        replaceSvgWithPng: function() {
          return function(sprite, render) {
            return render(sprite)
              .split('.svg')
              .join('.png');
          };
        }
      },
      sprite: 'sprite.svg',
      render: {
        css: {
          template: './gulp/templates/sprite.scss'
        }
      }
    }
  }
};

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

// Copy the sprite .svg file to a .png file.
function createPngCopy() {
  return src(pngSRC)
    .pipe(svg2png())
    .pipe(dest(pngURL));
}

// Copy the sprites files to the images/sprites map to organize.
function copySpriteGraphic() {
  return src(graphicSRC).pipe(dest(graphicURL));
}

// Rename and copy the css sprite file to the modules map.
function copySpriteCSS() {
  return src(copySRC)
    .pipe(rename('_sprite.scss'))
    .pipe(dest(copyURL));
}

// Delete unused sprite files.
function endClean(done) {
  del([iconURL]);
  done();
}

task('icons', series(beginClean, createSprite, createPngCopy, copySpriteGraphic, copySpriteCSS, endClean));
