'use strict';
/**
 * Created by jin on 2017/6/2.
 */
OpeningAngular.directive('opening', ()=> {
  return {
    restrict: 'EA',
    templateUrl: 'opening/opening.html',
    controller: 'OpeningController'
  };
});

OpeningAngular.controller('OpeningController', ($scope, $timeout, $state)=> {

  $scope.flagVm = {//控制本页面元素显示隐藏的对象,初始为false隐藏
    isOpening: false,//控制片头图片
  };
  $timeout(()=> {
    //加50ms延迟是为了能保证compile的时候dom节点成功绑定ng-show和动画钩子，否则会出现由于未成功绑定ng-show和动画钩子而导致的动画无效
    $scope.flagVm.isOpening = true;
  }, 50);

  $scope.isOpeningTransform = ()=> {//控制片头图片隐藏，主路由显示
    //所有变量在compile阶段都是undefined，如果用'！某变量'，就可能出现短暂的错误显示
    $scope.flagVm.isOpening = false;

    $timeout(()=> {
      $state.go('home');
    }, 1000);
  };

  $scope.starMove = (e)=> {

    e.currentTarget.children[0].style.marginTop = -document.documentElement.clientHeight / 10 -  e.clientY / 10 + 'px';
    e.currentTarget.children[0].style.marginLeft = -document.documentElement.clientWidth / 10 -  e.clientX / 10 + 'px';

    e.currentTarget.children[1].style.marginTop = e.clientY / 15 + 'px';
    e.currentTarget.children[1].style.marginLeft = e.clientX / 15 + 'px';

  };

});