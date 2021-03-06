var app = angular.module('AceApp');
app.directive("listAndListMnt", function (BroadcastService) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param1: '='
            , param2: '='
        }
        , templateUrl: 'cmp/listAndListMnt/listAndListMnt-tpl.html'
        , controller: function ($scope, BroadcastService,HttpService) {
            console.log(">>>listAndListMnt scope=", $scope);
            var vm = $scope;

            vm._init = function () {
                if (!vm.config) {
                    console.error("配置参数config未定义");
                    return;
                }
                if (!vm.param1) {
                    console.error("实例参数param1未定义");
                    return;
                }
                if (!vm.param2) {
                    console.error("实例参数param2未定义");
                    return;
                }
                getResource(HttpService,vm);
                //控件必须在初始化时调用BroadcastService.initMessages()以进行消息映射
                BroadcastService.initMessages(vm);
            }
            vm._init();
            console.log("<<<listAndListMnt");
        }
    }
})
;