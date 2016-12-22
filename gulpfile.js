'use strict';
/**
 * Created by jin on 2016/12/13.
 */
var gulp = require('gulp'),
//关于gulp，一般除了全局安装一个以外，项目里面也得安装一个。只在全局安装，可能require不到，或者别的地方克隆了你的项目后，npm install之
// 后，可能依然启动不了gulp的服务，因为对方可能全局没有安装过gulp；只在项目中安装gulp，在命令行中只有cd到gulp目录下才能运行gulp命令，
// 否则运行不了（使用webstom把目录定位到gulp文件的话也可以直接运行）。
  scss = require('gulp-scss'),//编译scss
  sass = require('gulp-sass'),//编译sass
  sequence = require('gulp-sequence').use(gulp),//批量执行依赖任务，且按照参数中书写顺序
  browserSync = require('browser-sync'),//启动server或者proxy代理（解决本地跨域。
  inject = require('gulp-inject');

//gulp.task是书写命令，gulp.src是输入或针对某/某些文件，gulp.dest输出到指定文件，gulp.watch监听某/某些文件
//return是为了有返回值，从而书写pipe管道函数
gulp.task('scss', function () {//写一个scss命令
  return gulp.src('src/**/*.scss') //该任务针对的文件
    .pipe(sass()) //该任务调用的模块
    .pipe(gulp.dest('dist')); //将会在dist/css下生成style.css
});

gulp.task('watch',function(){//写一个监听命令
  return gulp.watch([//监听
    'src/**/*.css',//被监听的文件
    'src/**/*.html',//被监听的文件
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
      'src/**/*.scss',//被监听的文件
      //'src/**/*.css',//被监听的文件
      'src/**/*.html',//被监听的文件
      'src/**/*.js'//被监听的文件
    ],
    open: false//每次启动此任务是否打开新的浏览器页面
  });
});

gulp.task('reload', function(){//浏览器重载，刷新
  browserSync.reload();//重载刷新的方法
});

gulp.task('inject',function(){
  return gulp.src('src/index.html')
    .pipe(inject(gulp.src(['dist/**/*.js', 'dist/**/*.css'], {read: false},{starttag: '<!-- inject:{{ext}} -->'})))
    .pipe(gulp.dest('dist'));
});
//关于inject。1.gulp中：inject(gulp.src(['dist/**/*.js', 'dist/**/*.css'], {read: false},{starttag: '<!-- inject:dist:{{ext}} -->'}))中，
//{starttag: '<!-- inject:dist:{{ext}} -->'}是自定义标签，inject是固定的。dist是指指定的文件名，不加则为所有。{{ext}}是指文件类型，
//就写{{ext}}指所有类型，可写为css或js等，那就是指具体的类型了。2：html中：<!-- inject:dist:css --><!-- endinject -->写在head标签里，固定格式，只有
//中间的dist是指文件名，可以不写，若写，则与gulp中文件名一致。<!-- inject:dist:js --><!-- endinject -->规则同上，只是写在body里。
//html as target: <!-- {{name}}:{{ext}} -->
//haml as target: -# {{name}}:{{ext}}
//jade as target: //- {{name}}:{{ext}}
//pug as target: //- {{name}}:{{ext}}
//jsx as target: {/* {{name}}:{{ext}} */}
//slm as target: / {{name}}:{{ext}}
//less as target: /* {{name}}:{{ext}} */
//sass, scss as target: /* {{name}}:{{ext}} */

//gulp.task('default',['browserSync','scss','inject','watch']);//启动gulp时的默认任务
gulp.task('default', sequence('browserSync','scss','inject','watch'));//默认任务