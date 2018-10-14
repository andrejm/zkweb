// Gulp
var gulp = require('gulp');

// Plugins
var sass = require('gulp-sass');
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

// Paths
var paths = {
    scripts: [
        // 'node_modules/modernizr/modernizr.js',
        // 'node_modules/fastclick/lib/fastclick.js',
        // 'assets/js/navigation.js',
        
        // TODO temporarily loading from dist folder, find out how to load original files
        // https://foundation.zurb.com/forum/posts/53440-foundation-custom-gulp---uncaught-referenceerror-exports-is-not-defined

        'node_modules/foundation-sites/dist/js/foundation.core.js', //must be loaded
        'node_modules/foundation-sites/dist/js/foundation.util.mediaQuery.js', //must be loaded
        'node_modules/foundation-sites/dist/js/foundation.smoothScroll.js',
        // 'node_modules/foundation-sites/js/foundation.util.keyboard.js',
        // 'node_modules/foundation-sites/js/foundation.util.motion.js',
        // 'node_modules/foundation-sites/js/foundation.util.timerAndImageLoader.js',
        // 'node_modules/foundation-sites/js/foundation.util.touch.js',
        // 'node_modules/foundation-sites/js/foundation.toggler.js',
        // 'node_modules/foundation-sites/js/foundation.responsiveMenu.js',
        // 'node_modules/foundation-sites/js/foundation.responsiveToggle.js',
        // 'node_modules/foundation-sites/js/foundation.orbit.js',
        'assets/js/components/*.js',
        'assets/js/main.js'
        ],
        copyScripts: [
        // 'node_modules/jquery/dist/jquery.min.js',
        // 'node_modules/svg4everybody/dist/svg4everybody.min.js'
        ],
        images: ['assets/svg/*.svg'],
        copyImages: [
            'assets/images/*.{png,jpg,jpeg,svg}'
        ],
        fonts: [
        'assets/fonts/*.{ttf,woff,woff2,eot,svg}'
        ],
        scss: [
        'assets/scss/main.scss',
        ],
        scssWatch: [
        'assets/scss/**/*.scss'
        ],
        scssPaths: [
        'assets/scss/**/*.scss', 
        'node_modules/foundation-sites/scss', 
        // 'node_modules/motion-ui'
        ],
        twigTemplates: [
        'assets/twig/[^_]*.twig',
        ],
        twigWatch: [
        'assets/twig/*.twig',
        ],
        dest : 'dist/'
    };

// Compile Sass
gulp.task('sass', function() {
    gulp.src(paths.scss)
    .pipe(plumber())
        // .pipe(sourcemaps.init()) // Initialize sourcemap plugin
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
            outputStyle: 'expanded'
        }))
        .pipe(prefix(
            "last 2 versions", "> 1%", "ie 8"
            ))
        // .pipe(minifycss()) //TODO turn on
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.dest + 'css'))
        .pipe(browserSync.stream());
    });

// Compile Twig templates
gulp.task('twig', function () {
    'use strict';
    return gulp.src(paths.twigTemplates)
    .pipe(twig())
    .pipe(gulp.dest('.'))
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
gulp.task('concat', function() {
  gulp.src( paths.scripts )
  .pipe(plumber())
    .pipe(babel({
        presets: ['es2015']
    }))
  .pipe(concat('main.js'))
    // .pipe(uglify({
    //     outSourceMap: true
    // }))
    .pipe(gulp.dest(paths.dest + 'js'))
    .pipe(browserSync.stream());
});

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

gulp.task('copyfonts', function() {
 gulp.src(paths.fonts)
 .pipe(gulp.dest(paths.dest + '/fonts'));
});

gulp.task('copyImages', function() {
 gulp.src(paths.copyImages)
 .pipe(gulp.dest(paths.dest + '/images'));
});

gulp.task('copyScripts', function() {
 gulp.src(paths.copyScripts)
 .pipe(gulp.dest(paths.dest + '/js'));
});

gulp.task('serve', function() {

    browserSync.init({
        server: {
            baseDir: ".",
            index: "/index.html"
        }
    });

    gulp.watch(paths.twigWatch, ['twig']);
    gulp.watch(paths.scssWatch, ['sass']);
    gulp.watch(paths.scripts, ['concat']);
    // gulp.watch("./*.html").on('change', browserSync.reload);
});

gulp.task('default', [ 'copyfonts', 'copyScripts', 'copyImages', 'svgstore', 'sass', 'twig', 'concat', 'serve' ]);
