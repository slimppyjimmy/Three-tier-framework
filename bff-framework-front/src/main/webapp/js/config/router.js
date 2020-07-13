/**
 * Created by Wanggb on 2016/9/25.
 * 路由配置页面
 */
angular.module("AceApp")
    .config(function ($stateProvider, $urlRouterProvider) {
        //注意：不能转到template，因为state中url已经改为了/
        $urlRouterProvider.otherwise('/');
        $stateProvider
            //使用统一的state，ui-view加载的页面通过参数来动态指定
            .state('template', {
                //如果将templateUrl之外的其他参数配置在url中，不仅多余，而且地址栏中的url很难看，如设置url为/:templateUrl?:name&:title&:customParam，则地址栏将会显示为/#/pcc~2fuserMnt~2fuserMnt.html?name=用户管理&titile=用户管理&customParam=%7B"guid":"e6226da2-60f7-405f-bb30-4a371eb8ef92"%7D，
                url: '/:templateUrl',
                icon: 'fa fa-desktop',
                templateUrl: function ($params) {
                    console.log("$stateProvider.state.templateUrl $params=", $params);
                    return $params.templateUrl;
                },
                name: function ($params) {
                    return $params.name || 'home';
                },
                title: function ($params) {
                    return $params.title || 'home';
                },
                //自定义参数，除了templateUrl、name、title外，其他的参数可以通过此参数传递，可以是任意类型（包括对象）
                customParam: function ($params) {
                    return $params.customParam;
                },
                //显式定义params，既可以传递参数，又可以避免在url中暴露参数
                params: {templateUrl: null, name: null, title: null, customParam: null},
                controller: function () {
                },
                resolve: {}
            })
    });