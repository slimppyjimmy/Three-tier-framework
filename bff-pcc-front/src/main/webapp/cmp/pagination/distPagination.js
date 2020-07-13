/**
 \* Created by Wanggb with IntelliJ IDEA.
 \*Orgs:DIST
 \*Date:11/1/2016
 \*Time:1:57 PM
 \*Description:程序入口,依赖声明
 */


(function (window, angular, undefined) {
    'use strict';
    var app = angular
        .module('dist.com.pagination',[]);
    app.directive('distPageDir',[function(){
        return {
            restrict:'EA',
            replace:true,
            scope:{
                "config":"="
            },
            template:'<div class="page-dir">' +
            '<button class="btn btn-default " title="首页" ng-click="startOrEndPage(0)">首页</button>' +
            '<button class="btn btn-default " title="上一页" ng-click="prevPage()">上一页</button>' +
            '<span>第</span><input class="form-control input-shadow" type="text" ng-model="jumpPage" ng-keyup="jumpToPage($event)"><span>页</span>' +
            '<button class="btn btn-default " title="下一页" ng-click="nextPage()">下一页</button>' +
            '<button class="btn btn-default " title="尾页" ng-click="startOrEndPage(1)">尾页</button>' +
            '<span>每页</span><select class="form-control input-shadow" ng-model="config.pageSize" ng-options="option for option in config.perPageOptions"></select>' +
            '<span>共<span>{{config.totalPages}}</span>页</span></div>',
            link:function(scope,$element,attr){
                scope.jumpPage=scope.config.pageIndex;
                if(!scope.config.perPageOptions){
                    scope.config.perPageOptions = [5, 10, 20, 50, 100];
                }
                function getPagination(newValue, oldValue) {
                    var config=scope.config;
                    config.pageIndex = parseInt(config.pageIndex) ? parseInt(config.pageIndex) : 1;
                    config.total = parseInt(config.total) ? parseInt(config.total) : 0;
                    config.pageSize = parseInt(config.pageSize) ? parseInt(config.pageSize) : 10;
                    config.totalPages = Math.ceil(config.total/config.pageSize);

                    var flag=false;
                    for(var i = 0; i < config.perPageOptions.length; i++){
                        if(config.perPageOptions[i] == config.pageSize){
                            flag = true;break;
                        }
                    }
                    if(!flag){
                        config.perPageOptions.push(config.pageSize);
                        config.perPageOptions.sort(function(a, b){return a-b});
                    }
                    var tempNew=newValue.split(' '),tempOld=oldValue.split(' ');
                    if(config.onChange&&(tempNew[1]!=tempOld[1]||tempNew[2]=='1'||tempNew[3]!=tempOld[3])){
                        config.isInit=0;config.onChange();
                    } scope.jumpPage=config.pageIndex;
                }
                // 跳转页
                scope.jumpToPage = function(){
                    var config=scope.config;
                    scope.jumpPage = scope.jumpPage.replace(/[^0-9]/g,'');
                    scope.jumpPage=parseInt(scope.jumpPage?scope.jumpPage:1);
                    if(scope.jumpPage>0&&scope.jumpPage<=config.totalPages){
                        config.pageIndex = scope.jumpPage;
                    }else if(scope.jumpPage<1){
                        scope.jumpPage=config.pageIndex=1;
                    }else  scope.jumpPage=config.pageIndex=config.totalPages;
                };
                // prevPage
                scope.prevPage = function(){
                    if(scope.config.pageIndex > 1){
                        scope.config.pageIndex -= 1;
                    }
                };
                // nextPage
                scope.nextPage = function(){
                    if(scope.config.pageIndex < scope.config.totalPages){
                        scope.config.pageIndex += 1;
                    }
                };
                scope.startOrEndPage=function(type){
                    if(!type) scope.config.pageIndex=1;
                    else scope.config.pageIndex=scope.config.totalPages;
                };
                scope.$watch(function() {
                    var newValue = scope.config.total + ' ' +  scope.config.pageIndex+" "+scope.config.isInit + " " + scope.config.pageSize;
                    return newValue;
                }, getPagination);
            }
        };
    }])

})(window, window.angular);