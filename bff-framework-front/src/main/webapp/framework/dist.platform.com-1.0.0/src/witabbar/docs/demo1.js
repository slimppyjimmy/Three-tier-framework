var WiTabBarController=['$scope',function ($scope) {
var vm=$scope.vm={};
    vm.items=[{title:'新建',style:'btn-default',name:'approve.new',linkURL:''},{title:'在办箱',style:'btn-primary',name:'approve.handling'},
        {title:'已办箱',style:'btn-info',name:'approve.completed'},{title:'废件箱',style:'btn-success',name:'approve.abolished'},
    ]
    vm.tabId="testTabItem";
    vm.options={
        defaultRouter:'template',
        enableSidebarAdd:true,
        enableRouter:true,

    };
    vm.callbacks={
        $stateChangeSuccess:function(e){
            console.log(e)
        },
        selectTabItem:function(e){console.log(e)},
    }

}];
angular.module('dist.ui').controller('WiTabBarController',WiTabBarController);