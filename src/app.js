'use strict';
/**
 * Created by jin on 2016/12/23.
 */

var TestAngular = angular.module('TestAngular', [
  //各种插件注入
  'HomeAngular',

  'TestAngular.templates',

  'ui.bootstrap',
  'ngAnimate',
  'ui.router'
]);

TestAngular.config(function($stateProvider,$urlRouterProvider){
  //路由设置

  $urlRouterProvider.otherwise('/home');//当跳转不属于下面任一时，跳转此路由

  $stateProvider//常规路由设置
    .state('home', {
      url: '/home',
      template: '<home></home>'
    });
});

TestAngular.config(function($compileProvider,$httpProvider){
  //拦截器及调试


  // 关闭调试模式
  $compileProvider.debugInfoEnabled(false);//false关闭，true开启


  //$httpProvider.interceptors.push('xxx');//写一个拦截器,如下，放到这里，添加到interceptors数组内即可
  //* page拦截器
  //* 用于page返回无list时手动添加新list
  //*/
  //commonModule.factory('ApiListEmptyInterceptor', function ($log, $q, TipService) {
  //
  //  var responseInterceptor = {
  //    response: function (response) {
  //      var deferred = $q.defer();
  //      if (response.config.url.indexOf('page') != -1 && angular.isUndefined(response.data.list)) {
  //        response.data.list = [];
  //      }
  //      if (response.config.url.indexOf('list') != -1 && angular.isUndefined(response.data.list)) {
  //        response.data.list = [];
  //      }
  //      deferred.resolve(response);
  //      return deferred.promise;
  //    }
  //  };
  //
  //  return responseInterceptor;
  //});
  /**
   * 状态码拦截器
   * 在config中push到拦截器数组
   */
  //commonModule.factory('SessionInterceptor', function ($rootScope, $log, $q, SessionService) {
  //
  //  //直接提示的返回码
  //
  //  return {
  //    // optional method
  //    'request': function (config) {
  //      // do something on success
  //      if (config.url.indexOf('pacs') !== -1) {
  //        if (config.method == 'POST') {
  //          config.url += '?JSESSIONID=' + SessionService.getSid();
  //        } else if (config.method == 'GET') {
  //          config.url += '&&JSESSIONID=' + SessionService.getSid();
  //        }
  //      }
  //      return config;
  //    }
  //  };
  //
  //});
});

TestAngular.run(function($rootScope){
  //项目启动初始化
  //$rootScope.animate = {
  //  isOpening:true
  //};
});

angular.module('TestAngular.templates', []);