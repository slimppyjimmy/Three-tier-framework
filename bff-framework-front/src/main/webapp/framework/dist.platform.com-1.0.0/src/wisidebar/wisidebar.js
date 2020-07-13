(function (factory) {
    'use strict';
    if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(
            typeof angular !== 'undefined' ? angular : require('../angular/angular-1.5.7/angular.min'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['angular'], factory);
    } else {
        // Browser globals
        if (typeof angular === 'undefined')
            throw new Error('error');
        factory(angular);
    }
}(function (angular) {
    'use strict';
    return angular.module('dist.ui.sidebar', ['ngStorage'])
        .directive('wiSideBar', ['$rootScope', 'StorageGet', '$localStorage', 'SAVE_SETTING', '$state', WiSideBarDirective])
        .constant('SAVE_SETTING', true)
        .factory('StorageGet', ['$rootScope', '$localStorage', StorageGet]);

    function WiSideBarDirective($rootScope, StorageGet, $localStorage, SAVE_SETTING, $state) {
        return {
            restrict: 'EA',
            replace: 'true',
            scope: {
                sidebar: '=',
                skinStyle: '=',
                sideConfig: '=',
                callbacks: '=',
            },
            templateUrl: 'framework/dist.platform.com-1.0.0/src/wisidebar/template/wisidebar/wi-side-bar.html',
            link: function ($scope, ele, attr) {
                //some general variables
                $scope.ace = $scope.ace || {};
                //sidebar variables
                $scope.ace.sidebar = {
                    'minimized': false,//used to collapse/expand
                    'toggle': false,//used to toggle in/out mobile menu
                    'reset': false//used to reset sidebar (for sidebar scrollbars, etc)
                };
                /**
                 * @description 返回皮肤字符串
                 * @param {number} index 样式分为1.2.3.4种
                 * @return    {string} 皮肤类名
                 */
                $scope.bodySkin = function (index) {
                    var skin = index;
                    if (skin == 1 || skin == 2) return 'skin-' + skin;
                    else if (skin == 3) return 'no-skin skin-3';
                    return 'no-skin';
                };
                //this fu
                if (SAVE_SETTING) {
                    StorageGet.load($scope, 'ace.sidebar');//load previously saved sidebar properties
                    $scope.$watch('ace.sidebar.minimized', function (newValue) {
                        if (typeof ($localStorage['ace.sidebar']) != 'undefined')
                            $localStorage['ace.sidebar']['minimized'] = newValue;
                    });
                }
                ;
                //these are used to determine if a sidebar item is 'open' or 'active'
                $rootScope.subMenuOpen = {};
                $scope.isSubOpen = function (name) {
                    if (!(name in $rootScope.subMenuOpen)) $rootScope.subMenuOpen[name] = false;
                    return $rootScope.subMenuOpen[name];
                }
                $scope.isActiveItem = function (name) {
                    return $scope.activeItems ? $scope.activeItems[name] : false;
                };

                //监听路由事件代码块
                $rootScope.viewContentLoading = false;
                $rootScope.$on('$stateChangeStart', function (event) {
                    //cfpLoadingBar.start();
                    try {
                        if (typeof ($scope.callbacks.$stateChangeStart) == 'function') {
                            $scope.callbacks.$stateChangeStart(event);
                        }
                    } catch (e) {
                        //console.log(e);
                    }
                    $rootScope.viewContentLoading = true;
                });

                $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
                    //TODO 为什么要将toParams、fromParams设置成一样的？是否是由于inherit默认为true惹的祸？
                    angular.forEach($rootScope.sidebarRecursive, function (item) {
                        if (item.templateUrl===toParams.templateUrl) {
                            toParams.params=item.params;
                            fromParams.params=item.params;
                            return;
                        }
                    });
                    //cfpLoadingBar.start();
                    try {
                        if (typeof ($scope.callbacks.$stateChangeSuccess) == 'function') {
                            $scope.callbacks.$stateChangeSuccess(event, toState, toParams, fromState, fromParams);
                        }

                        //路由激活设置
                        var getParentName = function (name) {
                            var name = (/^(.+)\.[^.]+$/.exec(name) || [null, null])[1];
                            return name;
                        }
                        var activeItems = {};//list of active sidebar item
                        var currentName = toParams.name;
                        activeItems[currentName] = true;
                        //find parents and add them to breadcrumbs, activeItems and subMenuOpen list
                        while ((currentName = getParentName(currentName))) {
                            var state = $state.get(currentName);
                            activeItems[currentName] = true;
                            $rootScope.subMenuOpen[currentName] = true;
                        }
                        $scope.pageTitle = toState.title;//page title
                        $scope.activeItems = activeItems;
                    } catch (e) {
                        //console.log(e);
                    }
                    //cfpLoadingBar.complete();
                    $rootScope.viewContentLoading = false;
                });

                $rootScope.$on('$stateChangeError', function (event, p1, p2, p3) {
                    //cfpLoadingBar.start();
                    try {
                        if (typeof ($scope.callbacks.$stateChangeError) == 'function') {
                            $scope.callbacks.$stateChangeError(event, p1, p2, p3);
                        }
                    } catch (e) {
                        //console.log(e);
                    }
                    //cfpLoadingBar.complete();
                    $rootScope.viewContentLoading = false;
                });
            }
        }
    }

    /**
     * @description 获取本地存储内容
     * @param {directive} $localStorage 本地存储服务

     * @return    {Array} 数组[哈希表结构,树结构]
     */
    function StorageGet($localStorage) {
        this.load = function ($scope, name) {
            $localStorage[name] = $localStorage[name] || {};

            var $ref = $scope;
            var parts = name.split('.');//for example when name is "ace.settings" or "ace.sidebar"
            for (var i = 0; i < parts.length; i++) $ref = $ref[parts[i]];
            //now $ref refers to $scope.ace.settings

            for (var prop in $localStorage[name]) if ($localStorage[name].hasOwnProperty(prop)) {
                $ref[prop] = $localStorage[name][prop];
            }
        }
        return this;
    }
}));


/**
 * json格式转哈希、树状结构
 * @param {json} dataSrc json数据（hash结构）
 * @param {object} opts 配置
 * - idfield id字段的属性名
 * - pidfield 父id的字段的属性名
 * @return    {Array} 数组[哈希表结构,树结构]
 */