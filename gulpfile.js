'use strict';
/**
 * Created by jin on 2016/12/13.
 */

//如果有新引入的js或者css框架的话，需要在extractJs-dev引入、extractCss-dev引入、extractCss-pro引入、extractJs-pro引入且排序、inject-dev排序
//1.其中引入extractCss-pro和extractCss-dev的css框架，引入到dependCss数组里就可以
//2.其中引入extractJs-pro和extractJs-dev的js框架，引入到dependJs数组里并根据需要排序就可以
//3.其中引入inject-dev的js框架在injectDevDependJs数组里引入并排序就可以了
  //一般2和3一起改，1单独改，及个别框架需要123一起改
  //更多详细注释在doc/gulpfile.md里，如果这里有修改的地方，请在doc/gulpfile.md里也修改并写上详细说明

var gulp = require('gulp'),//全局和项目里各安装一个
  sass = require('gulp-sass'),
  sequence = require('gulp-sequence').use(gulp),
  browserSync = require('browser-sync'),
  inject = require('gulp-inject'),
  concat = require('gulp-concat'),
  del = require('del'),
  uglify = require('gulp-uglify'),
  minifycss = require('gulp-minify-css'),
  rev = require('gulp-rev'),
  babel = require('gulp-babel'),
  imagemin = require('gulp-imagemin'),
  pngquant = require('imagemin-pngquant'),
  cache = require('gulp-cache'),
  base64 = require('gulp-base64'),
  htmlmin = require('gulp-htmlmin'),
  zip = require('gulp-zip'),
  ftp = require('gulp-ftp'),
  autoprefixer = require('gulp-autoprefixer'),
  gulpif = require('gulp-if'),
  plumber = require('gulp-plumber'),
  sourcemaps = require('gulp-sourcemaps'),
  templateCache = require('gulp-angular-templatecache'),
  ngAnnotate = require('gulp-ng-annotate');

var dependCss = [
  './node_modules/**/bootstrap.css',//框架引入处
];//急需找到一个gulp插件来整合第三方插件的文件，现在这种笨办法太耗时间
var dependJs = [
  './node_modules/**/jQuery.js',
  './node_modules/**/angular.js',//框架引入且排序出
];
var injectDevDependJs = [
  './dist.dev/plugin/**/jQuery.js',//有些框架之间需要顺序，就在这里单独写
  './dist.dev/plugin/**/angular.js',
  './dist.dev/**/*.js',
  './dist.dev/**/*.css'
  ];

gulp.task('default', []);
gulp.task('clean-all', ['clean-dev', 'clean-pro']);

gulp.task('clean-dev', (cb) => {
  return del(['./dist.dev'], cb);
});

gulp.task('images-dev', () => {
  return gulp.src('./src/images/**/*.{jpg,png,svg,gif,ico}')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(gulp.dest('./dist.dev/images'));
});

gulp.task('scss-dev', () => {
  return gulp.src('./src/app.scss')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(gulpif(true, sass()))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true,
      remove: true
    }))
    .pipe(gulp.dest('./dist.dev/css'));
});

gulp.task('compileJs-dev', () => {
  return gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js'])
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(gulp.dest('./dist.dev/js'));
});

gulp.task('extractCss-dev', (cb) => {
  return gulp.src(dependCss)
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(gulp.dest('./dist.dev/plugin/css'));
});

gulp.task('extractJs-dev', (cb) => {
  return gulp.src(dependJs)
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(gulp.dest('./dist.dev/plugin/js'));
});

gulp.task('templates-dev', function () {
  //生成templates
  return gulp.src(['./src/**/*.html','!./src/index.html'])
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(templateCache({
      module: 'testAngular.templates'
    }))
    .pipe(gulp.dest('./dist.dev/js'));
});

gulp.task('inject-dev', () => {
  return gulp.src('./src/index.html')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(inject(gulp.src(injectDevDependJs, { read: false }, { starttag: '<!-- inject:{{ext}} -->' }),
      { relative: false, ignorePath: 'dist.dev/', addRootSlash: false }))
    .pipe(gulp.dest('./dist.dev'));
});

gulp.task('browserSync', () => {
  browserSync.init({
    server: {
      baseDir: './dist.dev',
      index: './index.html',
    },
    port: 9000,
    ui: {
      port: 9001
    },
    open: false
  });
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('watch', () => {
  return gulp.watch([
      'src/**/*.scss',
      'src/**/*.html',
      'src/**/*.js',
      'src/images/**/*.{jpg,png,svg,gif,ico}'
    ],
    (e) => {
      sequence('images-dev','scss-dev','compileJs-dev', 'inject-dev', 'reload')
      ((err) => {
        if (err) {
          console.log(err);
        }
      });
    });
});

gulp.task('clean-pro', (cb) => {
  return del(['./dist.pro'], cb);
});

gulp.task('images-pro', () => {
  return gulp.src('./src/images/**/*.{jpg,png,svg,gif,ico}')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(cache(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      multipass: true,
      svgoPlugins: [{ removeViewBox: false }],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('./dist.pro/images'));
});

gulp.task('scss-pro', () => {
  return gulp.src('./src/app.scss')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(gulpif(true, sass()))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: true,
      remove: true
    }))
    .pipe(base64({
      baseDir: './src',
      extensions: ['png', 'jpg', 'png', 'svg', 'gif', 'ico'],
      maxImageSize: 20 * 1024,
      debug: false
    }))
    .pipe(sourcemaps.init())
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(gulp.dest('./dist.pro/css'));
});

gulp.task('extractCss-pro', (cb) => {
  return gulp.src(dependCss)
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(concat('common.min.css'))
    .pipe(sourcemaps.init())
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(gulp.dest('./dist.pro/plugin/css'));
});

gulp.task('compileJs-pro', () => {
  return gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js'])
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(babel({
      presets: ['es2015']
    }))//转换为es6
    .pipe(concat('app.min.js'))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.init())
    .pipe(uglify({
      mangle: { except: ['require', 'exports', 'module', '$'] },
      compress: true,
    }))
    .pipe(sourcemaps.write())
    .pipe(rev())
    .pipe(gulp.dest('./dist.pro/js'));
});

gulp.task('extractJs-pro', (cb) => {
  return gulp.src(dependJs)
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(concat('common.min.js'))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      mangle: { except: ['require', 'exports', 'module', '$'] },
      compress: true,
    }))
    .pipe(rev())
    .pipe(gulp.dest('./dist.pro/plugin/js'));
});

gulp.task('templates-pro', function () {
  //生成templates
  return gulp.src(['./src/**/*.html','!./src/index.html'])
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(templateCache({
      module: 'testAngular.templates'
    }))
    .pipe(sourcemaps.init())
    .pipe(uglify({
      mangle: { except: ['require', 'exports', 'module', '$'] },
      compress: true,
    }))
    .pipe(rev())
    .pipe(gulp.dest('./dist.pro/js'));//生成的文件注入index后必须在app后面
});

gulp.task('inject-pro', () => {
  return gulp.src('./src/index.html')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(inject(gulp.src(['./dist.pro/**/*.css', './dist.pro/**/*.js'], { read: false }, { starttag: '<!-- inject:{{ext}} -->' }),
      { relative: false, ignorePath: 'dist.pro/', addRootSlash: false }))
    .pipe(htmlmin({//压缩html
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    }))
    .pipe(gulp.dest('./dist.pro'));
});

gulp.task('build-dev', sequence('clean-dev', 'images-dev', 'scss-dev','compileJs-dev','extractCss-dev','extractJs-dev','templates-dev','inject-dev', 'browserSync', 'watch'));

gulp.task('build-pro', sequence('clean-pro', 'images-pro', 'scss-pro', 'extractCss-pro','compileJs-pro', 'extractJs-pro','templates-pro','inject-pro'));

gulp.task('clean-zip', (cb) => {
  return del(['./test.zip'], cb);
});

gulp.task('zip', ['clean-zip'], () => {
  gulp.src('./dist.pro/**/*')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))
    .pipe(zip('test.zip'))
    .pipe(gulp.dest('./'));
});



