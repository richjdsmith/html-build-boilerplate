// Plugins required Install
// npm install gulp --save -dev
// $ npm install gulp-newer gulp-imagemin gulp-htmlmin gulp-htmlclean gulp-deporder gulp-concat gulp-strip-debug gulp-sourcemaps  gulp-uglify gulp-add-src gulp-sass gulp-postcss postcss-assets autoprefixer css-mqpacker cssnano --save-dev


// Gulp.js configuration
var
  // modules
  gulp = require('gulp'),
  // img
  newer = require('gulp-newer'),
  imagemin = require('gulp-imagemin'),
  // HTML
  htmlclean = require('gulp-htmlclean'),
  htmlmin = require('gulp-htmlmin');
  // JS
  concat = require('gulp-concat'),
  deporder = require('gulp-deporder'),
  stripdebug = require('gulp-strip-debug'),
  uglify = require('gulp-uglify'),
  addsrc = require('gulp-add-src'),
  sourcemaps = require('gulp-sourcemaps'),
  // CSS
  sass = require('gulp-sass'),
  postcss = require('gulp-postcss'),
  assets = require('postcss-assets'),
  autoprefixer = require('autoprefixer'),
  mqpacker = require('css-mqpacker'),
  cssnano = require('cssnano'),
  // Browser Sync
  browserSync = require('browser-sync').create(),


  // development mode?
  devBuild = (process.env.NODE_ENV === 'production'),

  // folders
  folder = {
    src: 'dev/',
    build: 'build/'
  }
;




// FUNCTIONS //

// image processing
gulp.task('images', function() {
  var out = folder.build + 'assets/img/';
  return gulp.src(folder.src + 'assets/img/*')
    .pipe(newer(out))
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({plugins: [{removeViewBox: true}]})
    ]))
    .pipe(gulp.dest(out));
});

//FA Webfonts Copy

gulp.task('fontawesome', function () {
    gulp.src(folder.src + 'assets/fonts/*')
        .pipe(gulp.dest(folder.build + 'assets/fonts'));

    gulp.src(folder.src + 'assets/css/font-awesome.min.css')
        .pipe(gulp.dest(folder.build + 'assets/css'));
});


// //.htaccess Copy

// gulp.task('copyhta', function () {
//     gulp.src(folder.src + '.htaccess')
//         .pipe(gulp.dest(folder.build));
// });

// //favicon Copy

// gulp.task('copyphp', function () {
//     gulp.src(folder.src + 'assets/php/*')
//         .pipe(gulp.dest(folder.build + 'assets/php'));
// });

// //PHP Copy

// gulp.task('copyico', function () {
//     gulp.src(folder.src + 'favicon.ico')
//         .pipe(gulp.dest(folder.build));
// });

// HTML processing
gulp.task('html', ['images'], function() {
  var
    out = folder.build,
    page = gulp.src(folder.src + '*.html');
      // .pipe(newer(out))

  // minify production code
  if (!devBuild) {
    page = page.pipe(htmlclean())
    .pipe(htmlmin({collapseWhitespace: true}));
  }

  return page.pipe(gulp.dest(out));
});



// JavaScript processing
gulp.task('js', function() {

  var jsbuild = gulp.src(folder.src + 'assets/js/jquery.min.js')
    // .pipe(addsrc.append(folder.src + 'assets/js/jquery.scrollex.min.js'))
    // .pipe(addsrc.append(folder.src + 'assets/js/util.js'))
    .pipe(addsrc.append(folder.src + 'assets/js/main.js'))
    .pipe(deporder())
    .pipe(concat('main.js'));

  if (!devBuild) {
    jsbuild = jsbuild
      .pipe(stripdebug())
      .pipe(uglify());
  }


  return jsbuild.pipe(gulp.dest(folder.build + 'assets/js/'));

});




// // CSS processing
// gulp.task('css', ['images'], function() {

//   var postCssOpts = [
//   assets({ loadPaths: ['assets/img/'] }),
//   autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
//   mqpacker
//   ];

//   if (!devBuild) {
//     postCssOpts.push(cssnano);
//   }

//   return gulp.src(folder.src + 'assets/sass/**/*')
//     .pipe(sass({
//       outputStyle: 'nested',
//       imagePath: 'assets/img/',
//       precision: 3,
//       errLogToConsole: true
//     }))
//     .pipe(postcss(postCssOpts))
//     .pipe(gulp.dest(folder.build + 'assets/css/'));

// });

gulp.task('sass', function () {
  var postCssOpts = [
    assets({ loadPaths: ['assets/img/'] }),
    autoprefixer({ browsers: ['last 2 versions', '> 2%'] }),
    mqpacker
    ];

    if (!devBuild) {
    postCssOpts.push(cssnano);
  }

  return gulp.src(folder.src + 'assets/sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(postCssOpts))
    .pipe(gulp.dest(folder.build + 'assets/css'));
});





// run all tasks
gulp.task('run', ['html', 'sass', 'js', 'fontawesome']);



// watch for changes
gulp.task('watch', function() {

  // image changes
  gulp.watch(folder.src + 'assets/img/**/*', ['images']);

  // html changes
  gulp.watch(folder.src + '*.html', ['html']);

  // javascript changes
  gulp.watch(folder.src + 'assets/js/**/*', ['js']);

  // Sass changes
  gulp.watch(folder.src + 'assets/sass/**/*', ['sass']);



});

// default task
gulp.task('default', ['run', 'watch']);
