'use strict';
/**
 * Created by jin on 2016/12/23.
 */

var TestAngular = angular.module('TestAngular', [
  //各种插件注入
  'TestAngular.templates',

  'ui.bootstrap',
  'ui.router'
]);

TestAngular.config(function($stateProvider,$urlRouterProvider){
  //路由设置

  //$urlRouterProvider.otherwise('');//当跳转不属于下面任一时，跳转此路由
  //
  //$stateProvider//常规路由设置
  //  .state('home', {
  //    url: '/home',
  //    template: ''
  //  });
});

TestAngular.config(function(){
  //拦截器
});

TestAngular.run(function(){
  //项目启动初始化
});

angular.module('TestAngular.templates', []);