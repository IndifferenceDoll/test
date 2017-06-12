html:
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

       路由配置里
      ...
      url: '/home{type}{state}',
      ...

      跳转的位置
      ...
      $state.go('home', { type: 0, state: 1 });
      ...

      home的controller里
      console.log($state.params.type,$state.params.state);
      console.log($state.current.name,$state.current.url,$state.current.template);