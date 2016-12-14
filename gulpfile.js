'use strict';
/**
 * Created by jin on 2016/12/13.
 */
var gulp = require('gulp'),
  sass = require('gulp-sass'),
  browserSync = require('browser-sync');

gulp.task('testSass', function () {
  gulp.src('src/**/*.sass') //该任务针对的文件
    .pipe(sass()) //该任务调用的模块
    .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
});

gulp.task('watch',function(){
  gulp.watch('src/*.html');
});

gulp.task('browserSync',function(){
  browserSync.init({
    server: {
      baseDir: "src",
      index: 'index.html',
      //routes: {
      //  '/vendor': 'vendor'
      //},
      //middleware: [
      //  proxyMiddleware(serverConfig.route,serverConfig.proxyOptions)
      //]
    },
    port: 9000,
    ui: {
      port: 9001
    },
    files: [
      'src/**/*.css',
      'src/**/*.html',
      'src/**/*.js'
    ],
    open: false
  });
});

//gulp.task('html', function(){
//  gulp.src('src/*.html')
//    .pipe(browserSync.reload({stream: true}));
//});

gulp.task('default',['browserSync','testSass','watch']);