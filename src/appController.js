'use strict';
/**
 * Created by jin on 2017/2/17.
 */
/* body上绑定的controller，可以代替$rootScope进行其他全局设置
*/
TestAngular.controller('TestAngularController', function ($rootScope, $scope,$timeout) {

  $scope.flagVm = {//控制本页面元素显示隐藏的对象,初始为false隐藏
    isOpening:false,//控制片头图片
    isMainView:false//控制主路由
  };
  $timeout(function(){
    //不加时间延迟，无动画效果，因为这是一载入就触发的动画，还处于compile的时候dom节点和动画还没绑定到一起，所以操作$scope.isOpening无法得到响应
    $scope.flagVm.isOpening = true;
  });

  $scope.isOpeningTransform = isOpeningTransform;//控制片头图片隐藏，主路由显示

  function isOpeningTransform(){//控制片头图片隐藏，主路由显示
    //这里之所以用两个变量实现，是因为所有变量在compile阶段都是undefined，如果用一个变量控制，另一个必然会是'！某变量'，就会出现短暂的闪现
    $scope.flagVm.isOpening = false;
    $scope.flagVm.isMainView = true;
  }

});