'use strict';
/**
 * Created by jin on 2017/6/1.
 */
homeAngular.factory('HomeService',($rootScope)=>{
//service有三种，1，factory，类似于工厂函数。2，service，类似于构造函数，直接写this，不用像factory一样返回对象，3，provider，在service的基础上，可以在执行前在config里进行配置
//服务（service）是controller之前通信的一种方式，除此之外，还有利用$rootscope以及广播（$on及$broadcast、$emit）来进行通信。

  var factory = {

  };
  return factory;

});