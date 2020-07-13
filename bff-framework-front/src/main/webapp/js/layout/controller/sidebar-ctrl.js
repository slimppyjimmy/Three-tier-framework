/**
 * Created by wanggb on 2016/7/7.
 */
app.controller('SidebarCtrl',SidebarCtrl)

SidebarCtrl.$inject=["$scope","$state","$rootScope","$timeout","$q","SidebarList","SAVE_SETTING","$localStorage","StorageGet","httpRequest"];


function SidebarCtrl($scope, $state, $rootScope, $timeout,$q, SidebarList, SAVE_SETTING, $localStorage, StorageGet,httpRequest) {
    $scope.ace = $scope.$parent.ace;
    $scope.ace.sidebar = $scope.ace.sidebar || {};
    var rootVM=$rootScope.rootVM={};
    var vm=$scope.vm={};// 域名封装
    vm.requestSidebarInfo=requestSidebarInfo;//请求侧边栏sidebar数据
    vm.refreshSidebar=refreshSidebar;//刷新侧边栏sidebar数据
    vm.modifySidebar=modifySidebar;//修改侧边栏sidebar数据
    vm.deleteSidebar=deleteSidebar;//删除侧边栏sidebar数据
    vm.addSidebar=addSidebar;//添加侧边栏sidebar数据

    if(SAVE_SETTING) {
        StorageGet.load($scope, 'ace.sidebar');//load previously saved sidebar properties
        $scope.$watch('ace.sidebar.minimized', function(newValue) {
            $localStorage['ace.sidebar']['minimized'] = newValue;
        });
    }


    /**
     * @description 利用httpRequest服务请求侧边栏sidebar的配置信息
     * @param {String} url, 请求地址
     * @param {Object} params,请求参数
     * @param {String} method = [get|post] 可选值域包括get和post，get是直接请求，post是提交数据
     * @return defer.promise 返回promise链式调用
     */
    function requestSidebarInfo(url,params,method){
        var defer=$q.defer();
        httpRequest.httpRequest(url,params,method).then(function(data){
          var sidebar = SidebarList.getList( $state.get() );
          var sidebarItems=$.parseJSON(data.result);
          for(var i=0;i<sidebarItems.length;i++){      //also for in or $.each
              sidebar.root.push(sidebarItems[i]);
              console.log(sidebarItems[i]);
          }
          $scope.sidebar=sidebar;
            defer.resolve(data);
          },function(data){
            var sidebar = SidebarList.getList( $state.get() );
          $scope.sidebar=sidebar;
            defer.reject(data);
          console.log(sidebar);
      })
        return defer.promise;
    }


    //都去JSON条
   /* var defer=$q.defer();
    $.getJSON('asset/data/common/sidebar.json',function(data){
        defer.resolve(data);
        $scope.sidebar=data;
    });
    return defer.promise;
    */

    vm.requestSidebarInfo('json/read',{},'post');

    /**
     * @description 利用httpRequest服务刷新侧边栏sidebar
     * @return defer.promise 提供链式调用
     */
    function refreshSidebar(url,params,method){
        var defer= $q.defer();
        vm.requestSidebarInfo(url,params,method).then(function(data){
            defer.resolve(data);
            console.log("refresh sidebar successfully!")
        },function(data){
            defer.reject(data);
            console.log("refresh sidebar failed!");
        })
        return defer.promise;
    }


    /**
     * @description 修改侧边栏sidebar
     * @return defer.promise 提供链式调用
     */
    function modifySidebar(){

    }
    /**
     * @description 添加侧边栏sidebar
     * @return defer.promise 提供链式调用
     */
    function addSidebar(){

    }
    /**
     * @description 删除侧边栏sidebar
     * @return defer.promise 提供链式调用
     */
    function deleteSidebar(){

    }




    ////
    //make a list of sidebar items using router states in angular/js/app.js
/*
    var list1={"icon" : "fa fa-tasks", "level-1":true,"name":"menu1" ,"title":"新建一级1"};
    var list2={ "level-2":true,"name":"menu1" ,"title":"新建二级1","url":""};
    var list3={ "level-2":true,"name":"menu1" ,"title":"新建二级2","url":"template","routerURL":'template/content/tplCustomer/item1.html'};
    var list4={ "level-3":true,"name":"menu1" ,"title":"新建三级1","url":"template","routerURL":'template/content/tplCustomer/item2.html'};
    var list5={ "level-3":true,"name":"menu1" ,"title":"新建三级2","url":"template","routerURL":'template/content/tplCustomer/item3.html'};

    var list6={"icon" : "fa fa-whatsapp", "level-1":true,"name":"menu2" ,"title":"新建一级2"};
    var list7={ "level-2":true,"name":"menu2" ,"title":"新建二级1","url":""};
    var list8={ "level-2":true,"name":"menu2" ,"title":"新建二级2","url":"template"};
    var list9={ "level-3":true,"name":"menu2" ,"title":"新建三级1","url":"template"};
    var list10={ "level-3":true,"name":"menu2" ,"title":"新建三级2","url":"template"};

    list2.submenu=[list4,list5];
    list1.submenu=[list2,list3];
    list7.submenu=[list9,list10];
    list6.submenu=[list7,list8];
    sidebar.root.push(list1,list6);
     var params={params:JSON.stringify(list)};
    httpRequest.httpRequest('json/write',params,'post').then(function(data){
        console.log(data);
    },function(data){
        console.log("wrong return!")

    })

    $scope.sidebar=sidebar;*/

    $scope.routerChange=function(params){
        $rootScope.directorURL=params;
    }


    //these are used to determine if a sidebar item is 'open' or 'active'
    $rootScope.subMenuOpen = {};
    $rootScope.isSubOpen = function(name) {
        if( !(name in $rootScope.subMenuOpen) ) $rootScope.subMenuOpen[name] = false;
        return $rootScope.subMenuOpen[name];
    }
    $rootScope.isActiveItem = function(name) {
        return $rootScope.activeItems ? $rootScope.activeItems[name] : false;
    }

};
