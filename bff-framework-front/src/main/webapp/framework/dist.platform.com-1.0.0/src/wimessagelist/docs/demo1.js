var WiMessageListController=['$scope','$timeout',function ($scope,$timeout) {

 $scope.activityData={
        "first_five":
            [
                {
                    "name" : "院内",
                    "icon" : "fa fa-check btn-warning",
                    "action" : "我院荣获xx荣誉称号. <a href='https://www.baidu.com'>查看</a>",
                    "time" : "1小时前"
                } ,
                {
                    "name" : "审批部",
                    "icon" : "fa fa-check btn-success",
                    "action" : "院内xx项目顺利验收通过!<a >查看</a>",
                    "time" : "2小时前"
                } ,
                {
                    "name" : "院内",
                    "icon" : "fa fa-check btn-success",
                    "action" : "xx领导来我院视察工作.<a >查看</a>",
                    "time" : "5小时前"
                } ,
                {
                    "name" : "财务部",
                    "icon" : "fa fa-picture-o btn-info",
                    "action" : "第三季度 <a>财务报销</a>流程变更",
                    "time" : "5小时前"
                } ,
                {
                    "name" : "人事部",
                    "icon" : "fa fa-check btn-default",
                    "action" : "第二届环杨浦区校园招聘正式启动..",
                    "time" : "8小时前"
                }
            ]
        ,
        "second_five":
            [
                {
                    "name" : "院内",
                    "icon" : "fa fa-pencil-square-o btn-pink",
                    "action" : "xx领导来我院视察工作.<a >查看</a>",
                    "time" : "11小时前"
                } ,
                {
                    "name" : "人事部",
                    "icon" : "fa fa-check btn-default",
                    "action" : "第二届环杨浦区校园招聘正式启动.. ",
                    "time" : "12小时前"
                } ,
                {
                    "name" : "财务部",
                    "icon" : "fa fa-key btn-info",
                    "action" : "第三季度 <a>财务报销</a>流程变更",
                    "time" : "12小时前"
                } ,
                {
                    "name" : "财务部",
                    "icon" : "fa fa-power-off btn-inverse",
                    "action" : "第二季度 <a>财务报销</a>流程变更",
                    "time" : "16小时前"
                } ,
                {
                    "name" : "财务部",
                    "icon" : "fa fa-key btn-info",
                    "action" : "第二季度 <a>财务报销</a>流程变更",
                    "time" : "16小时前"
                }
            ]
    };

  $scope.activityScroll={
        height: '250px',
        mouseWheelLock: true,
        alwaysVisible : true
    };
	
  $scope.isActivityReloading=false;
  $scope.activityReload = function() {
        $timeout(function() {
            $scope.isActivityReloading = false;
        }, 1500);
    };
  $scope.activityConfig={
       title:'公告新闻',
      linkName:'查看更多'
  };
	


}];
angular.module('dist.ui').controller('WiMessageListController',WiMessageListController);