'use strict';
/**
 * Created by jin on 2017/6/2.
 */
CommonAngular.factory('DemoInterceptor',($rootScope,$q,$injector)=>{
  var demoInterceptor = {

    request(config){//拦截发起的请求
      var deferred = $q.defer();

      //deferred.reject(config);//reject、resolve二选一
      deferred.resolve(config);



      //var $http = $injector.get('$http');
      //return deferred.promise.then(function() {//return二选一
      //  return $http(config.config);
      //});

      return deferred.promise;
    },
    requestError(config){//拦截发起失败的请求
      var deferred = $q.defer();

      //deferred.reject(config);//reject、resolve二选一
      deferred.resolve(config);



      //var $http = $injector.get('$http');
      //return deferred.promise.then(function() {//return二选一
      //  return $http(config.config);
      //});

      return deferred.promise;
    },
    response(response){//拦截响应
      var deferred = $q.defer();

      //deferred.reject(response);//reject、resolve二选一
      deferred.resolve(response);



      //var $http = $injector.get('$http');
      //return deferred.promise.then(function() {//return二选一
      //  return $http(response.config);
      //});

      return deferred.promise;
    },
    responseError(response){//拦截后台调用失败的响应
      var deferred = $q.defer();

      //deferred.reject(response);//reject、resolve二选一
      deferred.resolve(response);



      //var $http = $injector.get('$http');
      //return deferred.promise.then(function() {//return二选一
      //  return $http(response.config);
      //});

      return deferred.promise;
    }

  };

  return demoInterceptor;

});