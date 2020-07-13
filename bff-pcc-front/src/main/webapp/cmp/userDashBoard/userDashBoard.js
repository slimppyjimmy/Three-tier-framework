var app = angular.module('AceApp');
app.controller("userDashBoard", function ($scope,$q, $uibModal, $stateParams, HttpService, BroadcastService) {
    var vm = $scope;
    //初始化函数
    vm._init=function () {
        vm.getCustomer();
        vm.getExpirelic();
        vm.getShortcut();
        // vm.getProject();
    };
    //获取客户函数
    vm.getCustomer=function () {
        HttpService.get({
            url: "http://vmhost:7951/lmsService/customer/list"
        }).then(function (result) {
            console.log(result.content.length)
            vm._customerNumber=result.content.length
        });
    };
    //获取项目函数
    vm.getProject=function(){
        HttpService.get({
            url: "http://vmhost:7951/lmsService/customer/projects/list"
        }).then(function (result) {
            console.log(result.content.length)
            vm._customerNumber=result.content.length
        });
    };
    //获取即将过期函数
    vm.getExpirelic=function(){
        HttpService.get({
            url: "http://vmhost:7951/lmsService/app/pageSearch"
        }).then(function (result) {
            var arr=[]
            console.log(result.content.length)
            for(var i in result.content){

                if(result.content[i].leaveDays < 8){
                    console.log(result.content[i].leaveDays )
                    arr.push(result.content[i].leaveDays)
                }
            }
            vm._expirelic=arr.length
        });
    };
    vm.getShortcut=function(){
        HttpService.get({
            url: "http://localhost:8080/shortcut/list"
        }).then(function (result) {
            vm.shortcutdata=result
        });
    }
    vm.toAdd=function(){
        var modalInstance = $uibModal.open({
            backdrop: "static"
            , templateUrl: "buz/userMnt/userShortcutSelector.html"
            , controller: function ($scope, $uibModalInstance) {
                $scope.cancel = function () {
                    $uibModalInstance.dismiss();
                };
                $scope.mappedfields = vm.mappedfields;

            }

        })
    }
    vm._init()
})
;