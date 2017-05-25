'use strict';
/**
 * Created by jin on 2016/12/23.
 */

var TestAngular = angular.module('testAngular', [
  //各种插件注入
  'testAngular.templates',

  'bootstrap',
  'jQuery'
]);

TestAngular.config(function(){
  //路由设置
});

TestAngular.config(function(){
  //拦截器
});

TestAngular.run(function(){
  //项目启动初始化
});