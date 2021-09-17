// Gulp
var gulp = require('gulp');

// Plugins
var sass = require('gulp-sass')(require('sass'));
var plumber = require('gulp-plumber');
var prefix = require('gulp-autoprefixer');
var minifycss = require('gulp-clean-css'); //ex gulp-clean-css
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var sourcemaps = require('gulp-sourcemaps');
var twig = require('gulp-twig');
var svgstore = require('gulp-svgstore');
var svgmin = require('gulp-svgmin');
var path = require('path');
var cssGlobbing = require('gulp-css-globbing');
var babel = require('gulp-babel');
var twigMarkdown = require('twig-markdown');

// Paths
var paths = {
scripts: [
    'node_modules/magnific-popup/dist/jquery.magnific-popup.min.js',
    'node_modules/masonry-layout/dist/masonry.pkgd.min.js',
    'node_modules/imagesloaded/imagesloaded.pkgd.min.js',
    'assets/js/components/*.js',
    'assets/js/main.js'
  ],
  copyScripts: [
    'node_modules/jquery/dist/jquery.min.js'
  ],
  images: ['assets/svg/*.svg'],
  copyImages: ['assets/images/**/*.{png,jpg,jpeg,svg,gif}'],
  copyFiles: ['files/**/*.*'],
  fonts: ['assets/fonts/*.{ttf,woff,woff2,eot,svg}'],
  scss: ['assets/scss/main.scss'],
  scssWatch: ['assets/scss/**/*.scss'],
  scssPaths: [
    'assets/scss/**/*.scss', 
    'node_modules/foundation-sites/scss', 
  ],
  twigTemplates: ['assets/twig/[^_]*.twig'],
  twigWatch: ['assets/twig/*.twig'],
  dest : 'dist/'
};

// Compile Sass
gulp.task('sass', gulp.series(function(done) {
  gulp.src(paths.scss)
  .pipe(plumber())
    .pipe(cssGlobbing({
      extensions: ['.scss'],
      autoReplaceBlock: {
        onOff: true,
        globBlockBegin: 'cssGlobbingBegin',
        globBlockEnd: 'cssGlobbingEnd',
        globBlockContents: 'components/*.scss'
    },
    scssImportPath: {
      leading_underscore: false,
      filename_extension: false
    }
  }))
  .pipe(sass({
    includePaths: paths.scssPaths,
    outputStyle: 'expanded',
    quietDeps: true,
  }))
  .pipe(prefix("last 2 versions", "> 1%", "ie 8"))
  .pipe(gulp.dest(paths.dest + 'css'))
  .pipe(browserSync.stream());
    done();
}));

// Compile Twig templates
gulp.task('twig', function () {
  'use strict';
  return gulp.src(paths.twigTemplates)
  .pipe(twig({data: {}, extend: twigMarkdown}))
  .pipe(gulp.dest('dist/'))
  .pipe(browserSync.stream());
});

// Uglify JS
gulp.task('uglify', function() {
  gulp.src( ['assets/js/main.js'] )
  .pipe(plumber())
  .pipe(uglify({
    outSourceMap: true
  }))
  .pipe(gulp.dest(paths.dest + 'js'));
});

// Concat
// TODO concat normalize.css from bower components with our stylesheet
gulp.task('concat', gulp.series(function(done) {
  gulp.src( paths.scripts )
  .pipe(plumber())
    .pipe(babel({
        presets: ['es2015']
    }))
  .pipe(concat('main.js'))
    .pipe(gulp.dest(paths.dest + 'js'))
    .pipe(browserSync.stream());
    done();
}));

// //SVGs
gulp.task('svgstore', function () {
  return gulp
  .src(paths.images)
  .pipe(svgmin(function (file) {
    var prefix = path.basename(file.relative, path.extname(file.relative));
    return {
      plugins: [{
        cleanupIDs: {
          prefix: prefix + '-',
          minify: true
        }
      }]
    };
  }))
  .pipe(svgstore())
  .pipe(gulp.dest(paths.dest + '/svg/'));
});

gulp.task('copyfonts', gulp.series(function(done) {
  gulp.src(paths.fonts)
   .pipe(gulp.dest(paths.dest + '/fonts'));
    done();
}));

gulp.task('copyImages', gulp.series(function(done) {
  gulp.src(paths.copyImages)
    .pipe(gulp.dest(paths.dest + '/images'));
    done();
}));

gulp.task('copyFiles', gulp.series(function(done) {
  gulp.src(paths.copyFiles)
    .pipe(gulp.dest(paths.dest + '/files'));
    done();
}));   

gulp.task('copyScripts', gulp.series(function(done) {
  gulp.src(paths.copyScripts, { allowEmpty: true })
    .pipe(gulp.dest(paths.dest + '/js'));
    done();
}));

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: "dist",
      index: "index.html"
    }
  });

  gulp.watch(paths.twigWatch, gulp.series('twig'));
  gulp.watch(paths.scssWatch, gulp.series('sass'));
  gulp.watch(paths.scripts, gulp.series('concat'));
});

gulp.task('build', gulp.series(
  'copyfonts', 
  'copyScripts', 
  'copyImages', 
  'copyFiles', 
  'svgstore', 
  'sass', 
  'twig', 
  'concat', 
));

gulp.task( 'default', gulp.series( 
  'build', 
  'serve' 
));
