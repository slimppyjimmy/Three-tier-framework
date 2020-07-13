var app = angular.module('AceApp');
app.directive("listAndFiveListMnt", function (BroadcastService) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param1: '='
            , param2: '='
            , param3: '='
            , param4: '='
            , param5: '='
            , param6: '='
            , expandClass: '@'
            , collapseClass: '@'
        }
        , templateUrl: 'cmp/listAndFiveListMnt/listAndFiveListMnt-tpl.html'
        , controller: function ($scope, BroadcastService,HttpService) {
            console.log(">>>listAndFiveListMnt scope=", $scope);
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
                    console.error("实例参数param1未定义");
                    return;
                }
                if (!vm.param3) {
                    console.error("实例参数param3未定义");
                    return;
                }
                if (!vm.param4) {
                    console.error("实例参数param4未定义");
                    return;
                }
                if (!vm.param5) {
                    console.error("实例参数param5未定义");
                    return;
                }
                if (!vm.param6) {
                    console.error("实例参数param6未定义");
                    return;
                }
                // if (!vm.param7) {
                //     console.error("实例参数param7未定义");
                //     return;
                // }
                getResource(HttpService,vm);
                //控件必须在初始化时调用BroadcastService.initMessages()以进行消息映射
                BroadcastService.initMessages(vm);
                vm._initCollapse();
            }

            /**
             * 初始化可折叠控件：只要有一个控件设置为了可折叠，那么所有同级控件均自动为可折叠；如果多个控件配置为展开，那么只有第一个会被展开，其他控件均被设置为折叠
             * @private
             */
            vm._initCollapse = function () {
                vm._collapseableControls = [];
                vm._collapseableControls.push(vm.param2);
                vm._collapseableControls.push(vm.param3);
                vm._collapseableControls.push(vm.param4);
                vm._collapseableControls.push(vm.param5);
                vm._collapseableControls.push(vm.param6);

                var collapseableCount = 0;
                vm._collapseableControls.forEach(function (param) {
                    if (param.collapsed != undefined){
                        collapseableCount++;
                    }
                    param._heightClass = vm.expandClass || '';
                });
                if (collapseableCount > 0){
                    var expanded = false;
                    vm._collapseableControls.forEach(function (param) {
                        param._collapsed = true;
                        if (param.collapsed == false && !expanded) {
                            expanded = true;
                            param._collapsed = false;
                        }
                        else {
                            param.collapsed = true;
                        }
                        param._heightClass = (param._collapsed ? vm.collapseClass : vm.expandClass) || '';
                    });
                }

            };
            /**
             * 处理右侧所有控件的折叠：保证只有一个控件能够展开，即：如果当前控件改为折叠，则不影响其他控件，否则，其他控件均改为折叠
             * @param selected 当前控件参数
             * @param toCollapsed 需要设置的折叠状态
             * @private
             */
            vm._switchCollapse = function (selected, toCollapsed) {
                vm._collapseableControls.forEach(function (param) {
                    if (param === selected) {
                        param._collapsed = toCollapsed;
                    } else {
                        param._collapsed = true;
                    }
                    param._heightClass = (param._collapsed ? vm.collapseClass : vm.expandClass) || '';
                })
            };

            vm._init();
            console.log("<<<listAndFiveListMnt");
        }
    }
})
;