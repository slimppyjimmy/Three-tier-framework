/**
 * Created by wanggb on 2016/8/2.
 */

angular.module("AceApp")
    .controller("HomeController",HomeController)

HomeController.$inject=["$scope","$http","$window","uiGridConstants",'$timeout','DataService'];

function HomeController($scope,$http,$window,uiGridConstants,$timeout,DataService){
    DataService.setValue("_TABBAR_",false);
    $scope.gridOptions = {
        enableHorizontalScrollbar:0,
        enableVerticalScrollbar:0,
        showGridFooter:false,
        showColumnFooter:true,
        enableRowSelection:true,
        enableRowHeaderSelection: false,
        multiSelect:false,
        enableSorting: true,
        rowHeight:30,
        enableGridMenu:true,
        columnDefs: [
            { field: '项目编号', width: '10%',footerCellTemplate: '<div class="ui-grid-cell-contents" >总数：5</div>' },
            { field: '项目名称', width: '25%',  },
            { field: '当前环节', width: '10%' },
            { field: '建设单位', width: '25%',  },
            { field: '承诺办结日期', width: '10%' },
            { field: '剩余时间', width: '10%',footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">超期：4</div>'  },
            { field: '操作', width: '10%', footerCellTemplate: '<div class="ui-grid-cell-contents" >代办：4</div>'}
        ]
    };

    $http.get('asset/data/ui-table/dist-smart-plan.json')
        .success(function(data) {
            $scope.gridOptions.data = data;
        });

    $scope.getTableHeight = function() {
        var rowHeight = 30; // your row height
        var headerHeight = 30; // your header height
        var scrollHeight=29;
        return {
            height: ($scope.gridOptions.data.length * rowHeight + headerHeight+scrollHeight) + "px"
        };
    };

    $scope.series = ['收件','退件','已办'];
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.options={
        legend: { display: true},
    }
    $scope.data = [
        [500, 600, 700, 800, 400, 580, 4000],
        [100, 20, 50, 150, 50, 80, 2100],
        [400, 480, 650, 650, 350, 500, 1900]
    ];

    $scope.labels2 = ["收件", "退件", "已办"];
    $scope.data2 = [10000, 3000, 7000];


    $scope.testLayer=function() {
//加载层-风格2
        layer.load(0);
//此处演示关闭
        setTimeout(function () {
            layer.closeAll('loading');
        }, 2000);
    };


    //图片新闻
    $scope.myInterval = 2000;
    var slides = $scope.slides = [];
    $scope.addSlide = function() {
        var index = 1 + slides.length%5;
        slides.push({
            image: 'asset/img/page' + index + '.jpg',
            text: ['智慧','创新','Lots of','Surplus'][slides.length % 4] + ' ' +
            ['协同', '洞察', 'Felines', 'Cutes'][slides.length % 4]
        });
    };
    for (var i=0; i<2; i++) {
        $scope.addSlide();
    }



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



    $scope.$on('$destroy',function(){
        DataService.setValue("_TABBAR_",true);
        console.log("destroy works!")
    })





}