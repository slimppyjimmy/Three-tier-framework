/**
 * Created by wanggb on 2016/7/7.
 */
app.controller('TabBarController',TabBarController)

TabBarController.$inject=["$scope","$state","$rootScope","$timeout","$q","SidebarList"];


function TabBarController($scope, $state, $rootScope, $timeout,$q, SidebarList) {

    var vm=$scope.vm={};
    vm.items=[];
    vm.tabId="testTabItem";
    vm.options={
        defaultRouter:'template',
        enableSidebarAdd:true,
        enableRouter:true,
        addLevel:1,
        defaultRouterName:'home',

    };
    vm.callbacks={
        $stateChangeSuccess:function(e,e2){
            //console.log(e,e2)
        },
        selectTabItem:function(e){
            //console.log(e)
        },
    }


};
