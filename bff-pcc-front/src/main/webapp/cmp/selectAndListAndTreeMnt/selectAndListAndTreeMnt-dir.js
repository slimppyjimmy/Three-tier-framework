var app = angular.module('AceApp');
app.directive("selectAndListAndTreeMnt", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param1: '='
            , param2: '='
            , param3: '='
        }
        , templateUrl: 'cmp/selectAndListAndTreeMnt/selectAndListAndTreeMnt-tpl.html'
        , controller: function ($scope, BroadcastService) {
            console.log(">>>selectAndListAndTreeMnt scope=", $scope);
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
                if (!vm.param3) {
                    console.error("实例参数param3未定义");
                    return;
                }
                //控件必须在初始化时调用BroadcastService.initMessages()以进行消息映射
                BroadcastService.initMessages(vm);
            }

            vm._init()
            console.log("<<<selectAndListAndTreeMnt");
        }
    }
})
;