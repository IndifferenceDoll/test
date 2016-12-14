'use strict';
/**
 * Created by jin on 2016/12/13.
 */
var gulp = require('gulp'),
//关于gulp，一般除了全局安装一个以外，项目里面也得安装一个。只在全局安装，可能require不到，或者别的地方克隆了你的项目后，npm install之
// 后，可能依然启动不了gulp的服务，因为对方可能全局没有安装过gulp；只在项目中安装gulp，在命令行中只有cd到gulp目录下才能运行gulp命令，
// 否则运行不了（使用webstom把目录定位到gulp文件的话也可以直接运行）。
  sass = require('gulp-sass'),//编译sass
  browserSync = require('browser-sync'),//启动server或者proxy代理（解决本地跨域。
  inject = require('gulp-inject');

//gulp.task是书写命令，gulp.src是输入或针对某/某些文件，gulp.dest输出到指定文件，gulp.watch监听某/某些文件
//return是为了有返回值，从而是些pipe管道函数
gulp.task('sass', function () {//写一个sass命令
  return gulp.src('src/**/*.sass') //该任务针对的文件
    .pipe(sass()) //该任务调用的模块
    .pipe(gulp.dest('src/css')); //将会在src/css下生成index.css
});

gulp.task('watch',function(){//写一个监听命令
  return gulp.watch([//监听
    'src/**/*.css',//被监听的文件
    'src/**/*.html',//被监听的文件//被监听的文件
    'src/**/*.js'//被监听的文件
  ],['reload']);//监听后要执行的任务
});

gulp.task('browserSync',function(){//服务器和代理的命令
  browserSync.init({//browserSync的初始化的配置
    server: {//server对象
      baseDir: "src",//要启动文件的目录
      index: 'index.html',//要启动的文件
      //routes: {//插件根目录
      //  '/XXX': 'xxxx'//该插件的文件位置
      //},
      //middleware: [//中间件，代理作用proxy
      //  proxyMiddleware(serverConfig.route,serverConfig.proxyOptions)//代理中间件方法（代理为，被代理）
      //]
    },
    port: 9000,//端口
    ui: {//配套的官网写的设置界面（设置有限）
      port: 9001//设置界面端口
    },
    files: [//监听，并刷新
      'src/**/*.css',//被监听的文件
      'src/**/*.html',//被监听的文件
      'src/**/*.js'//被监听的文件
    ],
    open: false//每次启动此任务是否打开新的浏览器页面
  });
});

gulp.task('reload', function(){//浏览器重载，刷新
  browserSync.reload();//重载刷新的方法
});

gulp.task('default',['sass','browserSync','watch']);//启动gulp时的默认任务