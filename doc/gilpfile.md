'use strict';
/**
 * Created by jin on 2016/12/13.
 */

//如果有新引入的js或者css框架的话，需要在extractJs-dev引入、extractCss-dev引入、extractJs-pro引入且排序、extractCss-pro引入、inject-dev排序

var gulp = require('gulp'),//全局和项目里各安装一个
//关于gulp，一般除了全局安装一个以外，项目里面也得安装一个。只在全局安装，可能require不到，或者别的地方克隆了你的项目后，npm install之
// 后，可能依然启动不了gulp的服务，因为对方可能全局没有安装过gulp；只在项目中安装gulp，在命令行中只有cd到gulp目录下才能运行gulp命令，
// 否则运行不了（使用webstom把目录定位到gulp文件的话也可以直接运行）。
//  scss = require('gulp-scss'),//编译scss
  sass = require('gulp-sass'),//编译sass，sass({ outputStyle: 'compressed' })在编译之后就压缩css
  sequence = require('gulp-sequence').use(gulp),//批量执行依赖任务，且按照参数中书写顺序
  browserSync = require('browser-sync'),//启动server或者proxy代理（解决本地跨域)。
  inject = require('gulp-inject'),//注入文件的插件
  //json = require('./package.json'),//获取package.json的文件对象
  concat = require('gulp-concat'),//连接文件
  del = require('del'),//删除文件
  //order = require('gulp-order'),//文件排序
  uglify = require('gulp-uglify'),//js压缩混淆
  minifycss = require('gulp-minify-css'),//css压缩
  rev = require('gulp-rev'),//版本号
  babel = require('gulp-babel'),//巴贝尔，配合babel-preset-es2015,babel-core可以转换js语法类型
  imagemin = require('gulp-imagemin'),//图片压缩
  pngquant = require('imagemin-pngquant'),//深度压缩
  cache = require('gulp-cache'),//获取缓存,图片快取
  base64 = require('gulp-base64'),//图片路径转base64
  htmlmin = require('gulp-htmlmin'),//html压缩
  zip = require('gulp-zip'),//压缩打包zip
  ftp = require('gulp-ftp'),//ftp发送zip
  autoprefixer = require('gulp-autoprefixer'),//浏览器前缀
  gulpif = require('gulp-if'),//用来判断
  plumber = require('gulp-plumber'),//管道工，使任务出错时不中断
  //size = require('gulp-size'),//显示文件大小
  sourcemaps = require('gulp-sourcemaps');//当压缩的JS出错，能根据这个找到未压缩代码的位置 不会一片混乱代码
//plugins = require('gulp-load-plugins')();//自动加载，自动加载所有package.json中devDependencies对象里的依赖,使用插件时调用
////plugins.XX就可以使用。（XX指的是gulp-后面的名字）,使用gulp-load-plugins后，值需要引gulp就可以，不需要再像上面一样一个一个引
//gulp-sourcemaps 当压缩的JS出错，能根据这个找到未压缩代码的位置 不会一片混乱代码


//gulp-useref 将html引用顺序的CSS JS 变成一个文件例如：
// <!-- build:js scripts/main.js --> <script src="1.js"></script><script src="2.js"></script><!--endbuild--> 最后变成<script src="main.js"></script>

//gulp-filter可以把stream里的文件根据一定的规则进行筛选过滤。比如gulp.src中传入匹配符匹配了很多文件，可以把这些文件pipe给gulp-filter作二次筛选，
// 如gulp.src('**/*.js').pipe($.filter(**/a/*.js))，本来选中了所有子文件下的js文件，经过筛选后变成名为a的子文件夹下的js文件。
// 那有人要问了，为什么不直接将需要的筛选传入gulp.src，干嘛要多筛选一步呢？这里面有两种情况：gulp.src与$.filter中间可能需要别的处理，
// 比如我对所有文件做了操作1以后，还需要筛选出一部分做操作2。
//第二种情况就要谈到gulp-filter的另外一个特性：筛选之后还可以restore回去。比如我对所有文件做了操作1，筛选了一部分做操作2，
// 最后要把所有的文件都拷贝到最终的位置。代码如下：
//var filter = $.filter('**/a/*.js');
//gulp.src('**/*.js')
//  .pipe(action1())
//  .pipe(filter)
//  .pipe(action2())
//  .pipe(filter.restore())
//  .pipe(gulp.dest('dist'))
//可以看到，如果没有restore这个操作，那么拷贝到最终位置的文件将只包含被过滤出来的文件，这样一restore，所有的文件都被拷贝了。


//生成开发环境的一系列命令及其步骤，生成生产环境时，也会征用其中一些命令

gulp.task('default', []);
gulp.task('clean-all', ['clean-dev', 'clean-pro']);//删除所有生成文件夹或文件

gulp.task('clean-dev', (cb) => {//删除文件夹或文件
  return del(['./dist.dev'], cb);//所删除文件路径，及回调函数
});

gulp.task('images-dev', () => {//对图片做处理，并移动到其他地方
  return gulp.src('./src/images/**/*.{jpg,png,svg,gif,ico}')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(gulp.dest('./dist.dev/images'));
});

//gulp.task是书写命令，gulp.src是输入或针对某/某些文件，gulp.dest输出到指定文件，gulp.watch监听某/某些文件
//return是为了有返回值，从而书写pipe管道函数
gulp.task('scss-dev', () => {//写一个scss命令,编译所有手写的样式,后期可以修改为所有手写的都@import引入最终的scss里，在编译最终的scss
  //return gulp.src('./src/**/*.scss') //该任务针对的文件,采取合并的时候用这个
  return gulp.src('./src/app.scss') //该任务针对的文件，通过sass编译@import时用这个
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    //.pipe(size({
    //  title: '手动css合并编译前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(gulpif(true, sass()))//该任务调用的模块,这里的gulpif是一个简单的示例，里面还可以写路径文件的字符串，例如'./src/**/*.scss'
    //.pipe(concat('app.css'))//合并其中所有的文件并生成一个新文件app.css,如果用@import去引到一个scss里，基本可以省掉合并的这一步
    .pipe(autoprefixer({//属性加前缀
      browsers: ['last 2 versions'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    //.pipe(size({
    //  title: '手动css合并编译加前缀后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(gulp.dest('./dist.dev/css')); //将会在dist.dev/css下生成app.css
});

gulp.task('compileJs-dev', () => {//写一个compilejs命令,编译合并所有手写js
  //return gulp.src('./src/**/*.js')//常规
  return gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js'])//angular专用
    //该任务针对的文件，使用angular时，合并文件需要遵循一定顺序规则，比如最大的module在最前面，接下来，所有小的module次之（小module之间
    // 无需顺序），剩下的随意。所以gulp.src('./src/**/*.js')可改为gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js']),
    //其中'./src/app.js'指的是最大的文件位置名字一开始就定死的module。
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    //.pipe(size({
    //  title: '手动js编译合并前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(babel({//编译es6转为es5
      presets: ['es2015']
    }))//转换为es6
    .pipe(concat('app.js'))//合并其中所有的文件并生成一个新文件app.js
    //.pipe(size({
    //  title: '手动js编译合并后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(gulp.dest('./dist.dev/js')); //将会在dist.dev/js下生成app.js
});

gulp.task('extractCss-dev', (cb) => {//用来抽取node——modules中外部依赖的项目并放在./dist.dev/plugin/css下
  //var depend = [];//抽取项目的路径数组
  //Object.keys(json.dependencies).forEach((value) => {//遍历son中生产模式下依赖的项目所在的对象dependencies中各个属性的键名
  //  depend.push('./node_modules/' + value + '/' + value + '.css');//并根据该键名生成路径，并添加到数组depend中
  //  depend.push('./node_modules/' + value + '/dist/css/' + value + '.css');//并根据该键名生成路径，并添加到数组depend中
  //});
  ////上面的地址有可能因为包作者的地址存放习惯而不准，因此需要检查实际包地址进行修改或添加上面的地址
  ////上面的这一步会生成很多空地址，这里需要有更好的方法能准确的找到依赖的包（所幸下面的concat方法合并所有地址下的文件，可以排掉空地址）
  //del(['./plugin/css'], cb);//所删除文件路径，及回调函数
  return gulp.src([
      './node_modules/**/bootstrap.css',//框架引入处
    ])//针对该数组中的文件路径操作
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(gulp.dest('./dist.dev/plugin/css'));//将文件输出在./plugin/css文件下
});

gulp.task('extractJs-dev', (cb) => {//用来抽取node——modules中外部依赖的项目并输出在./dist.dev/plugin/js文件夹下
  //var depend = [];//抽取项目的路径数组
  //Object.keys(json.dependencies).forEach((value) => {//遍历son中生产模式下依赖的项目所在的对象dependencies中各个属性的键名
  //  depend.push('./node_modules/' + value + '/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
  //  depend.push('./node_modules/' + value + '/dist/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
  //  depend.push('./node_modules/' + value + '/tmp/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
  //});
  ////上面的地址有可能因为包作者的地址存放习惯而不准，因此需要检查实际包地址进行修改或添加上面的地址
  ////上面的这一步会生成很多空地址，这里需要有更好的方法能准确的找到依赖的包（所幸下面的concat方法合并所有地址下的文件，可以排掉空地址）
  //del(['./plugin/js'], cb);//所删除文件路径，及回调函数
  return gulp.src([
      './node_modules/**/jQuery.js',
      './node_modules/**/angular.js',//框架引入处
    ])//针对该数组中的文件路径操作,按照顺序处理
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(gulp.dest('./dist.dev/plugin/js'));//将新文件输出在./dist.dev/plugin/js文件下
});

gulp.task('inject-dev', () => {
  return gulp.src('./src/index.html')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(inject(gulp.src([
      './dist.dev/plugin/**/jQuery.js',//有些框架之间需要顺序，就在这里单独写
      './dist.dev/plugin/**/angular.js',
      './dist.dev/**/*.js',
      './dist.dev/**/*.css'
    ], { read: false }, { starttag: '<!-- inject:{{ext}} -->' }),
      { relative: false, ignorePath: 'dist.dev/', addRootSlash: false }))
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

gulp.task('browserSync', () => {//服务器和代理的命令
  browserSync.init({//browserSync的初始化的配置
    server: {//server对象
      baseDir: './dist.dev',//要启动文件的目录
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

gulp.task('reload', () => {//浏览器重载，刷新
  browserSync.reload();//重载刷新的方法
});

gulp.task('watch', () => {//写一个监听命令
  return gulp.watch([//监听
      //'./src/**/*.css',//被监听的文件
      'src/**/*.scss',//被监听的文件
      'src/**/*.html',//被监听的文件
      'src/**/*.js',//被监听的文件
      'src/images/**/*.{jpg,png,svg,gif,ico}'//被监听的文件
    ],
    (e) => {
      sequence('images-dev','scss-dev','compileJs-dev', 'inject-dev', 'reload')//监听后要执行的任务,通过sequence按顺序执行,然后返回一个必须执行的函数，该函数的参数是一个函数，如下
      ((err) => {//这个参数函数是用来在出错时抛出错误的
        if (err) {
          console.log(err);
        }//如果出错，抛出错误的
      });
    });
  //['scss','inject','reload'])//监听后要执行的任务
  //.on('change',function(e){//执行回调函数
  //    console.log(1111);
  //  });
});

//生成生产环境的一系列命令及其步骤，会征用开发环境中的命令

gulp.task('clean-pro', (cb) => {//删除文件夹或文件
  return del(['./dist.pro'], cb);//所删除文件路径，及回调函数
});

gulp.task('images-pro', () => {//对图片做处理，并移动到其他地方
  return gulp.src('./src/images/**/*.{jpg,png,svg,gif,ico}')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    //.pipe(size({
    //  title: '图片压缩前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(cache(imagemin({//缓存中取未被修改图片，并压缩
      optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
      progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
      interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
      multipass: true, //类型：Boolean 默认：false 多次优化svg直到完全优化
      svgoPlugins: [{ removeViewBox: false }],//不要移除svg的viewbox属性
      use: [pngquant()] //使用pngquant深度压缩png图片的imagemin插件
    })))
    //.pipe(size({
    //  title: '图片压缩后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(gulp.dest('./dist.pro/images'));
});

gulp.task('scss-pro', () => {//写一个scss命令,编译所有手写的样式,后期可以修改为所有手写的都@import引入最终的scss里，在编译最终的scss
  //return gulp.src('./src/**/*.scss') //该任务针对的文件
  return gulp.src('./src/app.scss') //该任务针对的文件，通过sass编译@import时用这个
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    //.pipe(size({
    //  title: '手动css合并编译前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(gulpif(true, sass()))//该任务调用的模块,这里的gulpif是一个简单的示例，里面还可以写路径文件的字符串，例如'./src/**/*.scss'
    //.pipe(concat('app.min.css'))//合并其中所有的文件并生成一个新文件app.css,如果用@import去引到一个scss里，基本可以省掉合并的这一步
    .pipe(autoprefixer({//属性加前缀
      browsers: ['last 2 versions'],
      cascade: true, //是否美化属性值 默认：true 像这样：
      //-webkit-transform: rotate(45deg);
      //        transform: rotate(45deg);
      remove: true //是否去掉不必要的前缀 默认：true
    }))
    //.pipe(size({
    //  title: '手动css合并编译加前缀后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    //.pipe(size({
    //  title: '手动css压缩前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(base64({//将css中图片地址转为base64
      baseDir: './src',
      extensions: ['png', 'jpg', 'png', 'svg', 'gif', 'ico'],
      maxImageSize: 20 * 1024, // bytes
      debug: false
    }))//转为base64
    .pipe(sourcemaps.init())
    .pipe(minifycss())//压缩css
    .pipe(sourcemaps.write())
    //.pipe(size({
    //  title: '手动css压缩后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(rev())//打上版本号
    .pipe(gulp.dest('./dist.pro/css')); //将会在dist.dev/css下生成app.css
});

gulp.task('extractCss-pro', (cb) => {//用来抽取node——modules中外部依赖的项目并放在./dist.dev/plugin/css下
  //var depend = [];//抽取项目的路径数组
  //Object.keys(json.dependencies).forEach((value) => {//遍历son中生产模式下依赖的项目所在的对象dependencies中各个属性的键名
  //  depend.push('./node_modules/' + value + '/' + value + '.css');//并根据该键名生成路径，并添加到数组depend中
  //  depend.push('./node_modules/' + value + '/dist/css/' + value + '.css');//并根据该键名生成路径，并添加到数组depend中
  //});
  ////上面的地址有可能因为包作者的地址存放习惯而不准，因此需要检查实际包地址进行修改或添加上面的地址
  ////上面的这一步会生成很多空地址，这里需要有更好的方法能准确的找到依赖的包（所幸下面的concat方法合并所有地址下的文件，可以排掉空地址）
  ////del(['./plugin/css'], cb);//所删除文件路径，及回调函数
  return gulp.src([
      './node_modules/**/bootstrap.css',//框架引入处
    ])//针对该数组中的文件路径操作,按照顺序处理
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(concat('common.min.css'))//合并其中所有的文件并生成一个新文件app.css,如果用@import去引到一个scss里，基本可以省掉合并的这一步
    //.pipe(size({
    //  title: '第三方css压缩前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(sourcemaps.init())
    .pipe(minifycss())//压缩css
    .pipe(sourcemaps.write())
    //.pipe(size({
    //  title: '第三方css压缩后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(rev())//打上版本号
    .pipe(gulp.dest('./dist.pro/plugin/css'));//将文件输出在./plugin/css文件下
});

gulp.task('compileJs-pro', () => {//写一个compilejs命令,编译合并所有手写js
  //return gulp.src('./src/**/*.js')//常规
  return gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js'])//angular专用
    //该任务针对的文件，使用angular时，合并文件需要遵循一定顺序规则，比如最大的module在最前面，接下来，所有小的module次之（小module之间
    // 无需顺序），剩下的随意。所以gulp.src('./src/**/*.js')可改为gulp.src(['./src/app.js','./src/**/module.js','./src/**/*.js']),
    //其中'./src/app.js'指的是最大的文件位置名字一开始就定死的module。
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    //.pipe(size({
    //  title: '手动js编译合并前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(babel({//编译es6转为es5
      presets: ['es2015']
    }))//转换为es6
    .pipe(concat('app.min.js'))//合并其中所有的文件并生成一个新文件app.js
    //.pipe(size({
    //  title: '手动js编译合并后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    //.pipe(size({
    //  title: '手动js压缩混淆前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(sourcemaps.init())
    .pipe(uglify({//混淆
      mangle: { except: ['require', 'exports', 'module', '$'] },//排除混淆关键字,默认：true 是否修改变量名
      compress: true,//类型：Boolean 默认：true 是否完全压缩，若想完全压缩，则无法保留注释
      //preserveComments: 'all' //保留所有注释,若保留注释，则无法完全压缩
    }))
    .pipe(sourcemaps.write())
    //.pipe(size({
    //  title: '手动js压缩混淆后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(rev())//打上版本号
    .pipe(gulp.dest('./dist.pro/js')); //将会在dist.pro/js下生成app.min.js
});

gulp.task('extractJs-pro', (cb) => {//用来抽取node——modules中外部依赖的项目并输出在./dist.dev/plugin/js文件夹下
  //var depend = [];//抽取项目的路径数组
  //Object.keys(json.dependencies).forEach((value) => {//遍历son中生产模式下依赖的项目所在的对象dependencies中各个属性的键名
  //  depend.push('./node_modules/' + value + '/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
  //  depend.push('./node_modules/' + value + '/dist/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
  //  depend.push('./node_modules/' + value + '/tmp/' + value + '.js');//并根据该键名生成路径，并添加到数组depend中
  //});
  ////上面的地址有可能因为包作者的地址存放习惯而不准，因此需要检查实际包地址进行修改或添加上面的地址
  ////上面的这一步会生成很多空地址，这里需要有更好的方法能准确的找到依赖的包（所幸下面的concat方法合并所有地址下的文件，可以排掉空地址）
  ////del(['./plugin/js'], cb);//所删除文件路径，及回调函数
  return gulp.src([
    './node_modules/**/jQuery.js',//第三方的框架在这里写,有需要排序的在这里排序写就可以
    './node_modules/**/angular.js',//框架引入且排序出
  ])//针对该数组中的文件路径操作
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    //.pipe(size({
    //  title: '第三方js压缩混淆合并前',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    //.pipe(gulp.dest('./node_modules/plugin'))
    //.pipe(order([//排序，有些框架需要有先后顺序才能使用
    //  '/node_modules/plugin/jQuery.js',
    //  '/node_modules/plugin/angular.js'
    //]))//排序，根据关键字，Object.keys(json.dependencies)是一个数组，关键字数组
    .pipe(concat('common.min.js'))//合并其中所有的文件并生成一个新文件common.js
    .pipe(sourcemaps.init())
    .pipe(uglify({//混淆
      mangle: { except: ['require', 'exports', 'module', '$'] },//排除混淆关键字,默认：true 是否修改变量名
      compress: true,//类型：Boolean 默认：true 是否完全压缩，若想完全压缩，则无法保留注释
      //preserveComments: 'all' //保留所有注释,若保留注释，则无法完全压缩
    }))
    //.pipe(sourcemaps.write())
    //.pipe(size({
    //  title: '第三方js压缩混淆合并后',
    //  gzip:true,
    //  pretty:true,
    //  showFiles:true,
    //  showTotal:true
    //}))
    .pipe(rev())//打上版本号
    .pipe(gulp.dest('./dist.pro/plugin/js'));//将新文件输出在./dist.dev/plugin/js文件下
});

gulp.task('inject-pro', () => {//css、js注入html
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

//gulp.task('default',[...任务名...]);//启动gulp时的默认任务
//gulp.task('default',sequence(...任务名...));//启动gulp时的默认任务,按照顺序呢
//noinspection Eslint
gulp.task('build-dev', sequence('clean-dev', 'images-dev', 'scss-dev','compileJs-dev','extractCss-dev','extractJs-dev','inject-dev', 'browserSync', 'watch'));//构建开发环境下的包
//'clean-dev'清除包  'scss'编译手写样式并连接起来  'extractcss'抽取外部依赖样式并连接起来 'extractjs'抽取外部依赖js并连接起来
//'compilejs'编译手写js并连接起来 'inject'将生成的js和css注入index.html 'browserSync'启动服务 'watch'监听src下文件，然后按顺序sequence(...)并刷新
gulp.task('build-pro', sequence('clean-pro', 'images-pro', 'scss-pro', 'extractCss-pro','compileJs-pro', 'extractJs-pro','inject-pro'));//构建生产环境下的包
//sequence('clean-dev','clean-pro','scss','extractcss','extractjs','compilejs','minify-uglify-rev','minifycss-rev',' ','inject-pro')中最后的inject-pro与
//minify-uglify-rev、minifycss-rev中间必须隔一个任务，否则会导致inject-pro任务执行失败

gulp.task('clean-zip', (cb) => {//删除文件夹或文件
  return del(['./test.zip'], cb);//所删除文件路径，及回调函数
});

gulp.task('zip', ['clean-zip'], () => {//打包压缩zip
  gulp.src('./dist.pro/**/*')//要打包的文件夹或文件
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(size({
      title: '文件打包压缩前',
      gzip:true,
      pretty:true,
      showFiles:true,
      showTotal:true
    }))
    .pipe(zip('test.zip'))//打包并生成的名字
    .pipe(size({
      title: '文件打包压缩后',
      gzip:true,
      pretty:true,
      showFiles:true,
      showTotal:true
    }))
    .pipe(gulp.dest('./'));//将打包后的文件输出位置
});

gulp.task('ftp', () => {//ftp发送zip文件到服务器
  return gulp.src('./test.zip')
    .pipe(plumber({
      errorHandler: (err) => {
        gutil.beep();
        gutil.log(err.toString());
      }
    }))//任务出错不中断
    .pipe(ftp({
      host: '',//服务器地址(必须)
      port: 80,//服务器端口(必须)
      remotePath: '',//对应的服务器文件地址(必须)
      //user: 'anonymous',//ftp账户(必须),如果FTP没有访问限制，可以不填
      //pass:null,//ftp账户密码(必须),如果FTP没有访问限制，可以不填
      //logger:'',//输出文件列表名称,默认在项目根目录生成文件(可选,默认：logger.txt)
      //froot:'',//提单文件前缀(可选，默认：/usr/local/imgcache/htdocs)
      //exp:null,//体验环境地址(可选，默认null)
      //pro:null//正式环境地址(可选，默认null)
    }));
});
