1   html:
        <section ui-view="header"  style="width: 200px;height: 200px;background: pink;">
              <!--视图header-->
        </section>

        <section ui-view="body" style="width: 200px;height: 200px;background: red;">
              <!--视图body-->
        </section>


        <section ui-view="footer" style="width: 200px;height: 200px;background: blue;">
              <!--视图footer-->
        </section>

    js:
      $stateProvider//常规路由设置
        .state('opening', {
          url: '/opening',
          views: {
            'header': { template: '<div>视图header</div>' },
            'body': { template: '<div>视图body</div>' },
            'footer': { template: '<div>视图footer</div>' }
          }
        })
        .state('home', {
          url: '/home',
          views: {
          'header': { template: '<div>视图header2</div>' },
          'body': { template: '<div>视图body2</div>' },
          'footer': { template: '<div>视图footer2</div>' }
        }
          }
        });
     根据路由名走，每一个路由名下有三个视图（视图是用来存放每一个路由内容的容器）或更多。
     所以每一个路由页面都有三个区域，每一个路由的配置里，都必须把内容放到对应的视图容器里，否则将不显示。
     如果只写其中某几个视图的模板内容，那么其他的视图容器依然存在，只是其中将不显示内容。

2          路由配置里
          ...
          url: '/home/{type}/{state}',
          url: '/home/:type/:state',
          url: '/home/{type:规则}/{state:规则}',
          例：url: '/home/{type:[0-9]{1,8}}/{state:[0-9]{1,8}}',
          ‘/user/{id:.*}’或‘/user/*id’//匹配所有以user开始的url 并将剩余参数传给id （?这个待研究）
          ...

          跳转的位置
          ...
          $state.go('home', { type: 0, state: 1 });//传参
          ...
          <a ui-sref="home({type: 0, state: 1})">...</a>//传参
          ...

          home的controller里
          $stateParams或者$state.params是一样的
          console.log($state.params.type,$state.params.state);
          console.log($state.current.name,$state.current.url,$state.current.template);

3       相对路径
          $stateProvider
          .state("parent", {//父路由
              url: '/parent',
              template:'...'
          })
          .state("parent.child", {//子路由
              url: '/child',
              template:'...'
          })
          ‘parent’将匹配…./index.html#/parent； ‘parent.child’将匹配…./index.html#/parent/child。
          绝对路径
          .state("parent.child", {
              url: '^/child',
              template:'<div>child</div>'
          })
          ’parent’将匹配…./index.html#/parent； ‘parent.child’将匹配…./index.html#/child。


4 $urlRouterProvider 在这里有两个主要目的。一是建立一个默认路由，用于管理未知的URL（统一跳转到某处）。

 app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
     $urlRouterProvider.otherwise('/');
     ...
 }]);


 二是监听浏览器地址栏URL的变化，重定向到路由定义的状态中。

 app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
     $urlRouterProvider
         .when('/legacy-route', {
             redirectTo: '/'
         });
 }]);