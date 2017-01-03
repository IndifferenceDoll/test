'use strict';
/**
 * Created by jin on 2016/12/13.
 */
var gulp = require('gulp'),
//关于gulp，一般除了全局安装一个以外，项目里面也得安装一个。只在全局安装，可能require不到，或者别的地方克隆了你的项目后，npm install之
// 后，可能依然启动不了gulp的服务，因为对方可能全局没有安装过gulp；只在项目中安装gulp，在命令行中只有cd到gulp目录下才能运行gulp命令，
// 否则运行不了（使用webstom把目录定位到gulp文件的话也可以直接运行）。
//  scss = require('gulp-scss'),//编译scss
  sass = require('gulp-sass'),//编译sass，sass({ outputStyle: 'compressed' })在编译之后就压缩css
  sequence = require('gulp-sequence').use(gulp),//批量执行依赖任务，且按照参数中书写顺序
  browserSync = require('browser-sync'),//启动server或者proxy代理（解决本地跨域)。
  inject = require('gulp-inject'),//注入文件的插件
  json = require('./package.json'),//获取package.json的文件对象
  concat = require('gulp-concat'),//连接文件
  del = require('del'),//删除文件
  order = require('gulp-order'),//文件排序
  uglify = require('gulp-uglify'),//js压缩混淆
  minifycss = require('gulp-minify-css'),//css压缩
  rev = require('gulp-rev');//版本号


//生成开发环境的一系列命令及其步骤，生成生产环境时，也会征用其中一些命令

gulp.task('default',[]);
gulp.task('clean-all',['clean-dev','clean-pro']);//删除所有生成文件夹或文件

gulp.task('clean-dev',function(cb){//删除文件夹或文件
  return del(['./dist.dev'],cb);//所删除文件路径，及回调函数
});

//gulp.task是书写命令，gulp.src是输入或针对某/某些文件，gulp.dest输出到指定文件，gulp.watch监听某/某些文件
//return是为了有返回值，从而书写pipe管道函数
gulp.task('scss', function () {//写一个scss命令,编译所有手写的样式,后期可以修改为所有手写的都@import引入最终的scss里，在编译最终的scss
  return gulp.src('./src/**/*.scss') //该任务针对的文件
    .pipe(sass()) //该任务调用的模块
    .pipe(concat('app.css'))//合并其中所有的文件并生成一个新文件app.css,如果用@import去引到一个scss里，基本可以省掉合并的这一步
    .pipe(gulp.dest('./dist.dev/css')); //将会在dist.dev/css下生成app.css
});

gulp.task('extractcss',function(){//用来抽取node——modules中外部依赖的项目并连接在一起，更名为common.css
  var depend = [];//抽取项目的路径数组
  Object.keys(json.dependencies).forEach(function(value){//遍历son中生产模式下依赖的项目所在的对象dependencies中各个属性的键名
    depend.push('./node_modules/' + value + '/' + value + '.css');//并根据该键名生成路径，并添加到数组depend中
    depend.push('./node_modules/' + value + '/dist/css/' + value + '.css');//并根据该键名生成路径，并添加到数组depend中
  });
  //上面的地址有可能因为包作者的地址存放习惯而不准，因此需要检查实际包地址进行修改或添加上面的地址
  //上面的这一步会生成很多空地址，这里需要有更好的方法能准确的找到依赖的包（所幸下面的concat方法合并所有地址下的文件，可以排掉空地址）
  return gulp.src(depend)//针对该数组中的文件路径操作,按照顺序处理，即按照json.dependencies里的顺序
    .pipe(order(Object.keys(json.dependencies)))//排序，根据关键字，Object.keys(json.dependencies)是一个数组，关键字数组
    .pipe(concat('common.css'))//合并其中所有的文件并生成一个新文件common.js
    .pipe(gulp.dest('./dist.dev/css'));//将新文件common.js输出在./dist.dev/css文件下
});

gulp.task('extractjs',function(){//用来抽取node——modules中外部依赖的项目并连接在一起，更名为common.js
  var depend = [];//抽取项目的路径数组
  Object.keys(json.dependencies).forEach(function(value){//遍历son中生产模式下依赖的项目所在的对象dependencies中各个属性的键名
    depend.push('./node_modules/' + value + '/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
    depend.push('./node_modules/' + value + '/dist/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
  });
  //上面的地址有可能因为包作者的地址存放习惯而不准，因此需要检查实际包地址进行修改或添加上面的地址
  //上面的这一步会生成很多空地址，这里需要有更好的方法能准确的找到依赖的包（所幸下面的concat方法合并所有地址下的文件，可以排掉空地址）
  return gulp.src(depend)//针对该数组中的文件路径操作,按照顺序处理，即按照json.dependencies里的顺序
    .pipe(order(Object.keys(json.dependencies)))//排序，根据关键字，Object.keys(json.dependencies)是一个数组，关键字数组
    .pipe(concat('common.js'))//合并其中所有的文件并生成一个新文件common.js
    .pipe(gulp.dest('./dist.dev/js'));//将新文件common.js输出在./dist.dev/js文件下
});

gulp.task('compilejs', function () {//写一个compilejs命令,编译合并所有手写js
  return gulp.src('./src/**/*.js')
  //return gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js'])
  //该任务针对的文件，使用angular时，合并文件需要遵循一定顺序规则，比如最大的module在最前面，接下来，所有小的module次之（小module之间
  // 无需顺序），剩下的随意。所以gulp.src('./src/**/*.js')可改为gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js']),
  //其中'./src/app.js'指的是最大的文件位置名字一开始就定死的module。
    .pipe(concat('app.js'))//合并其中所有的文件并生成一个新文件app.js
    .pipe(gulp.dest('./dist.dev/js')); //将会在dist.dev/js下生成app.js
});

gulp.task('inject-dev',function(){
  return gulp.src('./src/index.html')
    .pipe(inject(gulp.src(['./dist.dev/**/common.js', './dist.dev/**/common.css','./dist.dev/**/*.js', './dist.dev/**/*.css'], {read: false},{starttag: '<!-- inject:{{ext}} -->'}),
      { relative: false,ignorePath: 'dist.dev/', addRootSlash: false }))
    .pipe(gulp.dest('./dist.dev'));
});
//关于inject。1.gulp中：inject(gulp.src(['dist/**/*.js', 'dist/**/*.css'], {read: false},{starttag: '<!-- inject:dist:{{ext}} -->'}))中，
//{starttag: '<!-- inject:dist.dev:{{ext}} -->'}是自定义标签，inject是固定的。dist.dev是指指定的文件名，不加则为所有。{{ext}}是指文件类型，
//就写{{ext}}指所有类型，可写为css或js等，那就是指具体的类型了。2：html中：<!-- inject:dist:css --><!-- endinject -->写在head标签里，固定格式，只有
//中间的dist.dev是指文件名，可以不写，若写，则与gulp中文件名一致。<!-- inject:dist.dev:js --><!-- endinject -->规则同上，只是写在body里。
//{ relative: false,ignorePath: 'dist.dev/', addRootSlash: false }.relative为true时，相对路径且ignorePath的设置无效。relative为false时，
//为绝对路径，且ignorePath的设置有效，意为忽略某段路径。addRootSlash,是否在路径前面添加'/'。
//html as target: <!-- {{name}}:{{ext}} -->
//haml as target: -# {{name}}:{{ext}}
//jade as target: //- {{name}}:{{ext}}
//pug as target: //- {{name}}:{{ext}}
//jsx as target: {/* {{name}}:{{ext}} */}
//slm as target: / {{name}}:{{ext}}
//less as target: /* {{name}}:{{ext}} */
//sass, scss as target: /* {{name}}:{{ext}} */

gulp.task('browserSync',function(){//服务器和代理的命令
  browserSync.init({//browserSync的初始化的配置
    server: {//server对象
      baseDir: "./dist.dev",//要启动文件的目录
      index: './index.html',//要启动的文件
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
    //files: [//监听，并刷新
    //  //'./dist/**/*.scss',//被监听的文件
    //  './dist/**/*.css',//被监听的文件
    //  './dist/**/*.html',//被监听的文件
    //  './dist/**/*.js'//被监听的文件
    //],
    open: false//每次启动此任务是否打开新的浏览器页面
  });
});

gulp.task('reload', function(){//浏览器重载，刷新
  browserSync.reload();//重载刷新的方法
});

gulp.task('watch',function(){//写一个监听命令
  return gulp.watch([//监听
    //'./src/**/*.css',//被监听的文件
    './src/**/*.scss',//被监听的文件
    './src/**/*.html',//被监听的文件
    './src/**/*.js'//被监听的文件
  ],
    function(e){
      sequence('scss','extractcss','extractjs','compilejs','inject-dev','reload')//监听后要执行的任务,通过sequence按顺序执行,然后返回一个必须执行的函数，该函数的参数是一个函数，如下
      (function (err) {//这个参数函数是用来在出错时抛出错误的
        if (err) console.log(err);//如果出错，抛出错误的
      });
    });
    //['scss','inject','reload'])//监听后要执行的任务
    //.on('change',function(e){//执行回调函数
    //    console.log(1111);
    //  });
});

//生成生产环境的一系列命令及其步骤，会征用开发环境中的命令

gulp.task('clean-pro',function(cb){//删除文件夹或文件
  return del(['./dist.pro'],cb);//所删除文件路径，及回调函数
});

gulp.task('minify-uglify-rev',function(){//混淆压缩的命令
  gulp.src('./dist.dev/js/common.js','./dist.dev/js/*.js')//针对文件
    .pipe(concat('app.min.js'))//连接并更名
    .pipe(uglify({//混淆
      mangle: {except: ['require' ,'exports' ,'module' ,'$']},//排除混淆关键字,默认：true 是否修改变量名
      compress: true,//类型：Boolean 默认：true 是否完全压缩，若想完全压缩，则无法保留注释
      //preserveComments: 'all' //保留所有注释,若保留注释，则无法完全压缩
    }))
    .pipe(rev())//打上版本号
    .pipe(gulp.dest('./dist.pro/js'));//输出到文件夹
});

gulp.task('minifycss-rev',function(){//压缩css的命令
  gulp.src('./dist.dev/css/common.css','./dist.dev/css/*.css')//针对文件
    .pipe(concat('app.min.css'))//连接并更名
    .pipe(minifycss())//压缩css
    .pipe(rev())//打上版本号
    .pipe(gulp.dest('./dist.pro/css'));//输出到文件夹
});

gulp.task('inject-pro',function(){
  return gulp.src('./src/index.html')
    .pipe(inject(gulp.src(['./dist.pro/js/*.min.js', './dist.pro/css/*.min.css'], {read: false},{starttag: '<!-- inject:{{ext}} -->'}),
      { relative: false,ignorePath: 'dist.pro/', addRootSlash: false }))
    .pipe(gulp.dest('./dist.pro'));
});

//gulp.task('default',[...任务名...]);//启动gulp时的默认任务
//gulp.task('default',sequence(...任务名...));//启动gulp时的默认任务,按照顺序呢
//noinspection Eslint
gulp.task('build-dev', sequence('clean-dev','scss','extractcss','extractjs','compilejs','inject-dev','browserSync','watch'));//构建开发环境下的包
//'clean-dev'清除包  'scss'编译手写样式并连接起来  'extractcss'抽取外部依赖样式并连接起来 'extractjs'抽取外部依赖js并连接起来
//'compilejs'编译手写js并连接起来 'inject'将生成的js和css注入index.html 'browserSync'启动服务 'watch'监听src下文件，然后按顺序sequence('scss','extract','compilejs','inject','reload')并刷新
gulp.task('build-pro', sequence('clean-dev','clean-pro','scss','extractcss','extractjs','compilejs','minify-uglify-rev','minifycss-rev','inject-dev','inject-pro'));//构建生产环境下的包
//sequence('clean-dev','clean-pro','scss','extractcss','extractjs','compilejs','minify-uglify-rev','minifycss-rev','inject-dev','inject-pro')中最后的inject-pro与
//minify-uglify-rev和minifycss-rev中间必须隔一个任务，否则会导致inject-pro任务执行失败