var app = angular.module('AceApp');
app.directive("listSelectorBuz", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
        }
        , templateUrl: 'cmp/listSelectorBuz/listSelectorBuz-tpl.html'
        , controller: function ($scope, HttpService, BroadcastService) {
            console.log(">>>listSelectorBuz scope=", $scope);

            var vm = $scope;
            vm._init = function () {
                if (!vm.config) {
                    console.error("配置参数config未定义");
                    return;
                }
                if (!vm.param) {
                    console.error("实例参数param未定义");
                    return;
                }
                //控件必须在初始化时调用BroadcastService.initMessages()以进行消息映射
                BroadcastService.initMessages(vm);

                vm.list();
            }

            vm.list = function () {
                console.log(">>>listSelectorBuz.list()");

                vm._griddata = {};
                HttpService.get({
                        url: vm.param.data.url
                    }
                ).then(function (data) {
                    vm._griddata = data;
                    console.log("<<<listSelectorBuz.list() success: ", data);
                });
                console.log("<<<listSelectorBuz.list()");
            }
            vm._onRefresh = function () {
                console.log(">>>listSelectorBuz._onrefresh()");
                vm.list();
                //TODO 是否需要考虑设置为原selectedItem（如果原selectedItem已经不在data中,则设置为null）
                vm._onNodeSelected(null);
                console.log("<<<listSelectorBuz._onrefresh()");
            }

            vm._onSelectChanged = function (node) {
                console.log(">>>listSelectorBuz._onSelectChanged()");
                BroadcastService.emitMessage("nodeChanged", node, vm);
                console.log("<<<listSelectorBuz._onSelectChanged()");
            }
            vm._onNodeSelected = function (node) {
                console.log(">>>listSelectorBuz._onNodeSelected()");
                console.log("item=", node);
                console.log("<<<listSelectorBuz._onNodeSelected()");
            }

            vm._init();
            console.log("<<<listSelectorBuz");
        }
    }
});