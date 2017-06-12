'use strict';
/**
 * Created by jin on 2017/6/1.
 */
HomeAngular.directive('home', function () {

  return {

    restrict: 'EA',//E为元素，A为属性，C为样式，M为注释
    scope: false,//默认为false，1.false为继承父scope，且修改子scope同样影响并作用父scope，2.true为继承，但修改子不影响父，相当于深复制一版，3.scope是一个对象时，为独立scope，与父完全没有关系，只属于自己。
    templateUrl: 'home/home.html',
    transclude: false,//默认为false，1.为false时，替换目标元素里所有元素，2.为true时，保留目标元素里的内容，并把元内容放在<div ng-transclude></div>
    controller: 'HomeController',
    //controllerAs:Vm,//将controller对象命名为Vm
    compile(element, attributes){//目标元素及属性，这是后处于编译阶段，无scope
      //用于收集指令，编译模板，可以作用到所有的子指令，然后返回一系列的link函数等待执行（只运行一次）；
      return {//这是compile的对象，返回后成为link

        pre(scope, element, attributes) {//编译基本完成，具备作用域scope，element, attributes同上
          //运行于Compile之后但是在子指令关联之前，个人认为，这里可以做一些Scope的计算或赋值之类的，然后再去绑定，
          //此时由于DOM尚未绑定，进行DOM变形将有可能导致运行异常，不建议在此阶段进行（运行多次）；
        },
        post(scope, element, attributes, ctrl) {//这个就是link函数，如果里面不写pre和post这两个函数，就可以在compile后面再跟一个link链接函数，具备作用域scope，element, attributes同上，ctrl表示此指令的controller对象
          //主要用于绑定DOM和Scope，这时候可以进行DOM变形或绑定事件。其实PostLink就是Link（运行多次）；
          //项目执行顺序是：config=>run=>compile=>pre=>controller=>post(既link)。
        }

      };
    },
    //controller($scope){//这是一种controller的写法，还可以独立出去,但是得添加上面的controller属性，如下
    //
    //}

  };

});

HomeAngular.controller('HomeController', ($scope, $timeout, $state)=> {//controller另一种写法

  $scope.flagVm = {
    isHome: false,
  };
  $timeout(()=> {
    $scope.flagVm.isHome = true;
  }, 50);

  $scope.isHomeTransform = ()=> {
    $scope.flagVm.isHome = false;

    $timeout(()=> {
      $state.go('opening');
    }, 1000);
  };


});