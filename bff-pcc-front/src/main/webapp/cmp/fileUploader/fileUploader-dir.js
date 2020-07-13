var app = angular.module('AceApp');
app.directive("fileUploader", function ($q, $uibModal, $stateParams, HttpService, BroadcastService) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
              buttonName: '@'
            , buttonId: '@'
            , buttonIcon: '@'
            , buttonClass: '@'
            , buttonStyle: '@'
            , multiSelection: '@'
            , fileTypes: '@'
            , maxSize: '@'
            , executeUrl: '@'
            , modal: '@'
        }
        , templateUrl: 'cmp/fileUploader/fileUploader-tpl.html'
        , controller: function ($scope, $q, $uibModal, HttpService, BroadcastService, $rootScope) {
            console.log(">>>uploader scope=", $scope);
            var vm = $scope.vm = {};

            vm._init = function () {
                // if (!vm.config) {
                //     console.error("配置参数config未定义");
                //     return;
                // }
                // if (!$scope.param) {
                //     console.error("实例参数param未定义");
                //     return;
                // }
                //绑定消息发送和接收事件，接收消息在config.messages中定义。
                //message的id应由配置工具自动生成，然后由配对的sender和receiver使用，最好使用uuid，以防止被其他控件误用
                // BroadcastService.initMessages(vm);

                // vm._mappedParentsFields = {};
                //是否显示控件，主要用于具有parent控件的情况。注意：在template中，不要在最外层div上使用_showWidget，因为如果replace为ture，则div及其参数（包括_showWidget）均会被替换掉，_showWidget将不起作用
                // vm._showWidget = vm._parent || !vm.param.needParent;

                vm.param = {};
                //如果没有指定id，则生成随机id，可以避免统一页面上使用多个控件时无法确定input与wiFileUpload控件的对应关系
                vm.param.buttonId = 158022408;
                vm.param.buttonName = $scope.buttonName || "文件上传";
                vm.param.buttonIcon = $scope.buttonIcon;
                vm.param.buttonClass = $scope.buttonClass;
                vm.param.buttonStyle = $scope.buttonStyle;
                vm.param.multiSelection = $scope.multiSelection;
                vm.param.maxSize = $scope.maxSize;
                vm.param.executeUrl = $scope.executeUrl;
                vm.param.modal = $scope.modal;
                $scope.fileTypes && (vm.param.mimeTypes=[{extensions: $scope.fileTypes}]);

                // if (!vm.param.grid)
                //     console.error("param.grid参数未定义");
            };

            // vm._upload = function () {
            //     var defer = $q.defer();
            //     console.log(">>>uploader._upload() enter");
            //     HttpService.upload({
            //             url: buttonConfig.executeUrl
            //         }
            //         , file
            //         , angular.extend({}, vm._focused, vm._mappedParentsFields)
            //         , buttonConfig.confirm
            //         , buttonConfig.success
            //     ).then(function (result) {
            //         console.log("uploader._upload() success, data=", result);
            //         defer.resolve(result)
            //     });
            //     console.log("<<<uploader._upload() exit");
            //     return defer.promise;
            // };
            vm._init();
            console.log("<<<uploader exit");
        }
        , link: function (scope, elem, attrs) {
            // var options = scope.fileULOptions = {
            //     console.log(scope)
            //     url: attrs['wiUrl'] || ''
            // }
            //在模板中找到input并设置id。不能在template中使用<input id="{{vm.param.id}}"的方式，因为{{vm.param.id}}"是动态生成的，wi-fileupload控件的link执行时，input尚未渲染，因此link中直接使用document.getElementById将无法获的所需的input，从而不会生成triggerDiv覆盖input，所以点击后不会弹出文件选择框
            //获取上传按钮并设置id（template中上传按钮是第一个input）
            elem.context.getElementsByTagName("input")[0].id = scope.vm.param.buttonId;
        }
    }
})
;