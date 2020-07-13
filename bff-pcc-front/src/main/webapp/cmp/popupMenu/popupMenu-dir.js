var app = angular.module('AceApp');
app.directive("popupMenu", function () {
    return {
        restrict: 'E'
        , replace: true
        , scope: {
            model: '='
            , onmenuclick: '&'
        }
        , templateUrl: 'cmp/popupMenu/popupMenu.html'
        , controller: function ($scope, $window) {
            console.log(">>>popupMenu.controller scope=", $scope);
            var vm = $scope.vm = {};
            $scope.init = function () {
                console.log(">>>popupMenu.controller().init() enter ", $scope.pidfield);
                //angular.copy(vm.model, $scope.model);
                vm.model = $scope.model || {};
                //TODO 在当前元素中menuBar的y坐标是否跟随鼠标变化，为true时菜单y坐标完全跟随鼠标，为false时菜单y坐标固定（居于当前元素区域的中央/第一次进入元素时鼠标的y坐标？），默认为false（不变）。注意：暂时x坐标始终会跟随鼠标变化
                vm.model.verticalFollow = vm.model.verticalFollow || false;
                //TODO 当前元素的包裹区域，menuBar右下不能超出此区域的右下，如果超出，需要调整menuBar的位置
                // vm.model.clientRectangle = vm.model.clientRectangle || {};
                //menu的显示方向，可为垂直、水平，垂直时每个menuItem一行，显示icon和name，如果icon不存在则显示默认icon；水平时所有menuItem显示在一行上，仅显示icon，当鼠标移动到icon上时使用tips显示name，如果icon不存在
                vm.model.mode = vm.model.mode || 'horizontal';
                //TODO menuBar的样式类
                vm.model.barClass = vm.model.barClass || 'popup-menu-bar-class';
                //TODO menuItem的样式类
                vm.model.itemClass = vm.model.itemClass || 'popup-menu-item-class';
                vm.onmenuclick = $scope.onmenuclick() || angular.noop;
                //接收显示菜单事件，args包含两部分：一是鼠标事件（用于定位菜单），二是menu数据
                $scope.$on("popupMenu:show", function (event, args) {
                    console.log(">>>popupMenu.controller().event.popupMenu:show enter ", event, args);
                    // event.preventDefault();
                    vm.left = args.mouseEvent.clientX;
                    vm.top = args.mouseEvent.clientY;//+$window.event.scrollTop;
                    //TODO 需要解决：显示菜单后，当鼠标移动到菜单上时，会触发菜单所属元素的mouseenter和mouseleave事件，导致菜单闪动
                    //TODO 如果icon没有设置，那么是设置默认class还是直接显示name？
                    vm.model.menus = args.menus || [{"icon": "fa-warning", "name": "菜单未定义"}];
                    vm.showWidget = true;
                    console.log(">>>popupMenu.controller().event.popupMenu:show exit");
                });
                //接收隐藏菜单事件
                $scope.$on("popupMenu:hide", function (event) {
                    console.log(">>>popupMenu.controller().event.popupMenu:hide enter ", event);
                    // event.preventDefault();
                    vm.showWidget = false;
                    console.log(">>>popupMenu.controller().event.popupMenu:hide exit");
                });

                console.log("<<<popupMenu.controller().init() return");
            };
            $scope.init();

            console.log("<<<popupMenu.controller() return");
        }
    }
})
//TODO 是否使用service暴露show、hide方法
// .service();