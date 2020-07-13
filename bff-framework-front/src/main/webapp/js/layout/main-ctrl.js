/**
 * Created by wanggb on 2016/7/6.
 */
angular.module("AceApp")
    .constant('SAVE_SETTING', true)
    .controller("MainController",MainController)

MainController.$inject=["$scope","$timeout","$http","$location","$rootScope","LoadXML",'SidebarList','$state','DataService'];

function MainController($scope,$timeout,$http,$location,$rootScope,LoadXML,SidebarList,$state,DataService){

         //some general variables
         var vm=$scope.vm={};
         $scope.ace={};
         $scope.ace.path = {
             'assets': 'asset' //used in page templates when linking to images, etc
         };
         $scope.ace.site = {
             brand_text : 'Ace Admin',
             brand_icon : 'fa fa-leaf',
             version : '1.4'
         };

          //此块区域配置sidebar显示样式、数据、动作等
         //sidebar config beginning
         // $scope.sidebar=SidebarList.getList( $state.get() );
          $scope.bodystyle=4;
          $scope.bodySkin = function(index) {
             var skin =index;
            if( skin == 1 || skin == 2 ) return 'skin-'+skin;
            else if( skin == 3 ) return 'no-skin skin-3';
            return 'no-skin';
         };
           $scope.callbacks={
                $stateChangeStart:function(e){
                    //console.log("$stateChangeStart");
                },
                $stateChangeSuccess:function(e,toState){
                    //console.log($rootScope.activeItems);
                    //console.log("$stateChangeSuccess");
                },
                $stateChangeError:function(e){
                    //console.log("$stateChangeError");
                }
            }
          DataService.bindScope("_TABBAR_",$scope,'tabbarShow');
          DataService.setValue("_TABBAR_",true);
    //sidebar config ending

    function strToJson(str){
        var json = (new Function("return " + str))();
        return json;
    }
    var string="{'templateUrl':'template/content/tplAdmin/delete.html','name':'system.admin.delete','title':'删除'}";
    console.log(strToJson(string));

    /**
     * 临时测试更改后的sidebar 开始
     * */
    $.getJSON('asset/data/common/sidebar.json',function(data){
        $scope.sidebar=data.root;
        $scope.sideConfig=data.config;
        console.log($scope.sidebar);
    });

 /**
     * 临时测试更改后的sidebar 结束
     * */


        $scope.getUrl=function(){
            var defaultURL='base/template/common/404.html';
            var directorURL= $.extend(defaultURL,$rootScope.testURL);

            return $rootScope.directorURL;
        }
        //viewContentLoading is used in angular/views/index.html to show/hide content and progress bar (spinner icon) when loading new pages
/*
     $rootScope.viewContentLoading = false;
     $rootScope.$on('$stateChangeStart', function(event) {
     //cfpLoadingBar.start();
     $rootScope.viewContentLoading = true;

     //also hide sidebar in mobile view when navigating to a new state
     $scope.ace.sidebar.toggle = false;
     });
     $rootScope.$on('$stateChangeSuccess', function(event){
     //cfpLoadingBar.complete();
     $rootScope.viewContentLoading = false;
     });
     $rootScope.$on('$stateChangeError', function(event, p1, p2, p3){
     //cfpLoadingBar.complete();
     $rootScope.viewContentLoading = false;
     });
     */



        //in templates with use 'getData' to retrieve data dynamically and cache them for later use! data is located inside 'angular/data' folders
        //you don't need this and it's only a convenience for this demo
        //example: getData('comments', 'dashboard')

        $rootScope.appData = $rootScope.appData || {};
        $rootScope.appDataRequest = {};
        $rootScope.getData = function(dataName, type) {
            var type = type || 'page';
            var dataKey = null, dataPath = null;
            if(type == 'page') {
                var pageName = $location.path().match(/([\-a-z]+)$/)[0];
                dataKey = 'page-'+pageName+'-'+dataName;
                dataPath = 'data/pages/'+pageName+'/'+dataName+'.json';
            }
            else {
                dataKey = type+'-'+dataName;
                dataPath = 'asset/data/'+type+'/'+dataName+'.json';
            }

            if (!dataPath) return;
            if (dataKey in $rootScope.appData) return $rootScope.appData[dataKey];

            if( !(dataKey in $rootScope.appData) && !(dataKey in $rootScope.appDataRequest) ) {
                $rootScope.appDataRequest[dataKey] = true;

                $http.get(dataPath).success(function(data) {
                    $rootScope.appData[dataKey] = data;
                });
            }
        };
        $rootScope.getCommonData = function(dataName) {
            return $rootScope.getData(dataName, 'common');
        };

    vm.configData={
        userImage:'asset/img/user.jpg',

    }
    vm.navbar={
        "tasks": {
            "count": 2,
            "latest": [{
                "title": "业务审批",
                "percentage": 65
            },
                {
                    "title": "在办事项",
                    "percentage": 35,
                    "progress-bar-type": "danger"
                }]
        },

        "notifications": {
            "count": 4,
            "latest": [{
                "title": "新接事项",
                "icon": "fa fa-comment",
                "icon-class": "btn-pink",
                "badge": "+12",
                "badge-class": "badge-info"
            },
                {
                    "title": "监察预警",
                    "icon": "fa fa-user",
                    "icon-class": "btn-primary"
                },
                {
                    "title": "决策报告",
                    "icon": "fa fa-shopping-cart",
                    "icon-class": "btn-success",
                    "badge": "+8",
                    "badge-class": "badge-success"
                },
                {
                    "title": "公文通知",
                    "icon": "fa fa-twitter",
                    "icon-class": "btn-info",
                    "badge": "+11",
                    "badge-class": "badge-info"
                }]
        },

        "messages": {
            "count": 5,
            "latest": [{
                "name": "张三",
                "img": "avatar.png",
                "time": "1分钟以前",
                "summary": "相关会议通知已发送给您，请注意查收 ..."
            },
                {
                    "name": "李四",
                    "img": "avatar3.png",
                    "time": "20分钟以前",
                    "summary": "办理审批业务通知已收到，预计xx年xx月 ..."
                },
                {
                    "name": "王五",
                    "img": "avatar4.png",
                    "time": "3:15 pm",
                    "summary": "相关会议通知已发送给您，请注意查收 ..."
                },
                {
                    "name": "王薇",
                    "img": "avatar2.png",
                    "time": "1:33 pm",
                    "summary": "办理审批业务通知已收到，预计xx年xx月 ..."
                },
                {
                    "name": "坦克",
                    "img": "avatar5.png",
                    "time": "10:09 am",
                    "summary": "相关会议通知已发送给您，请注意查收  ..."
                }]
        }
    }
    };

