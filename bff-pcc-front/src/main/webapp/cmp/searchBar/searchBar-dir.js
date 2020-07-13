/**
 * @description
 * <pre>
 *     <h2>searchBar函数方法描述</h2>
 *    vm._init() 初始化searchbar，将数据双向绑定到 vm._searchBar.data;初始化searchBar中的datepicker
 *    初始化searchBar中的日期拾取器和下载按钮的接口地址，整合数据
 *    vm._search() 搜索点击函数,执行完初始化后调用一次
 *    vm._download() 下载函数
 *    vm._searchBarKeyPressed() 搜索框键盘输入监听函数
 * </pre>
 */
var app = angular.module('AceApp');
app.directive("searchbar", function () {
    return {
        restrict: 'AE'
        , replace: false
        , scope: {
            "config":"="
        }
        , templateUrl: 'cmp/searchBar/searchBar-tpl.html'
        , controller: function ($scope) {
            console.log(">>>searchbar scope=", $scope);
            var vm = $scope;
            /*
            * 初始化函数
            * */
            vm._init = function(){
                //初始化searchbar，将数据双向绑定到 vm._searchBar.data
                if ( vm.config) {
                    vm._searchBar = angular.extend({}, vm.config);
                    vm._searchBar.enterToSearch = vm._searchBar.enterToSearch === undefined ? true : vm._searchBar.enterToSearch;
                    vm._searchBar.properties = vm._searchBar.properties || [];
                    vm._searchBar.preparedata = null;
                    vm._searchBar.data = {};
                } else{
                    vm._searchBar = null;
                }
                //初始化searchBar中的datepicker
                // 初始化searchBar中的日期拾取器和下载按钮的接口地址，整合数据
                if (vm._searchBar && vm._searchBar.properties && vm._searchBar.properties.some(item => item.type =="date") ) {//三个条件判断，当searchBar配置了date才会进行初始化
                    var dateBox=new Object()
                    var newArr=[];
                    for (var i = 0; i <vm._searchBar.properties.length ; i++) {
                        if(vm._searchBar.properties[i].type=="date"){
                            newArr.push(vm._searchBar.properties[i])
                        }
                    }
                    if(vm._searchBar.buttons) {
                        dateBox.prepareUrl = vm._searchBar.buttons[0].prepareUrl;
                        dateBox.url = vm._searchBar.buttons[0].url;
                    }
                        dateBox.properites=newArr;
                        vm._searchBar._dateBox=angular.extend({},dateBox);


                }
                //初始化完成后调用一次_search()
                vm._search()
            };
            //搜索点击函数
            vm._search = function(){//点击时使用$emit发送事件并打包数据给父组件发起ajax请求
                vm.$emit("toSearch",vm._searchBar)
            };
            //下载函数
            vm._download = function(){
              vm.$emit("toDownload", vm._searchBar._dateBox)
            };
            //搜索框键盘输入监听函数
            vm._searchBarKeyPressed = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                console.log("key pressed:", keycode);
                if (vm._searchBar.enterToSearch && keycode == 13) {
                    vm._search();
                }
            };
            vm._init();
            console.log(">>>searchbar success");
        }
    }
});