'use strict';
/**
 * Created by jin on 2016/12/23.
 */

//module名首字母大写；
//var的module的变量首字母大写；
//controller首字母大写
//指令首字母小写

var TestAngular = angular.module('TestAngular', [
  //各种插件注入
  'OpeningAngular',
  'HomeAngular',
  'CommonAngular',

  'TestAngular.templates',

  'ui.bootstrap',
  'ngAnimate',
  'ui.router',
  'ngFileUpload'
]);

TestAngular.config(($urlRouterProvider, $stateProvider)=> {
  //路由设置

  $urlRouterProvider.otherwise('/opening');//当跳转不属于下面任一时，跳转此路由

  $stateProvider//常规路由设置
  .state('opening', {
    url: '/opening',
    template: '<opening></opening>'
  })
  .state('home', {
    url: '/home',
    template: '<home></home>'
  });
});


TestAngular.config(($httpProvider, $compileProvider)=> {
  //拦截器及调试,拦截器拦截的是所有的http请求


  // 关闭调试模式
  $compileProvider.debugInfoEnabled(false);//false关闭，true开启

  $httpProvider.interceptors.push('DemoInterceptor');//写一个拦截，添加到interceptors数组内即可

});

TestAngular.run(($rootScope)=> {
  //项目启动初始化
  //$rootScope.animate = {
  //  isOpening:true
  //};
  var width = document.documentElement.clientWidth;
  var html = document.getElementsByTagName('html')[0];
  html.style.fontSize = width / 10 + 'px';
  console.log('html字体大小是', width / 25);
});

angular.module('TestAngular.templates', []);