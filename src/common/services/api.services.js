'use strict';
/**
 * Created by jin on 2017/6/2.
 */
CommonAngular.service('APIService',($http, $q,CONFIG,Upload)=>{

  return {

    sendGet(url,params,isLoading){//get请求方法的封装
      if (!isLoading) {//是否显示加载图标，默认为显示
        //执行显示加载图标的方法
      }
      if (!params) {//参数是否定义/是否为空
        params = {};
      }
      var serverUrl = url + '?' + handleParams(params);
      return $http.get(serverUrl, CONFIG.HTTP_DEFAULTS).success(function (data) {
        if (!isLoading) {
          //关闭显示加载图标的方法
        }
      }).error(function (data) {
        if (!isLoading) {
          //关闭显示加载图标的方法
        }
      });
    },

    sendPost: function (url, params, isLoading) {
      if (!isLoading) {//是否显示加载图标，默认为显示
        //执行显示加载图标的方法
      }
      if (!params) {
        params = {};
      }
      var sendData = handleParams(params);
      var serverUrl = url;//根据实际域名网址扩展

      return $http.post(serverUrl, sendData, CONFIG.HTTP_DEFAULTS).success(function (data) {
        if (!isLoading) {
          //关闭显示加载图标的方法
        }
      }).error(function (data) {
        if (!isLoading) {
          //关闭显示加载图标的方法
        }
      });
    },

    sendMultipart: function (url, params) {//可传图片
      //执行显示加载图标的方法
      var serverUrl = url;//根据实际域名网址扩展
      var deferred = $q.defer();
      Upload.upload({
        url: serverUrl,
        data: params,
        arrayKey: ''
      }).then(function (response) {
        deferred.resolve(response.data);
        //关闭显示加载图标的方法
      }, function (response) {
        deferred.reject(response);
        //关闭显示加载图标的方法
      });

      return deferred.promise;
    },

    getExcelUrl: function(url, params){
      return CONFIG.SERVER_URL + CONFIG.SERVER_PATH + url + handleParams(params) + '&&JSESSIONID=' + '用户sid';
    },

  };

  function handleParams(obj) {//拼接get请求的参数
    for (var key in obj) {//转为字符串
      if (typeof obj[key] === 'number') {
        obj[key] += '';
      } else if (obj[key] === 'undefined') {
        obj[key] = null;
      } else if(typeof obj[key] === 'object'){
        handleParams(obj[key]);
      }
    }
    return 'params=' + btoa(unescape(encodeURIComponent(angular.toJson(obj, false))));
  }

});