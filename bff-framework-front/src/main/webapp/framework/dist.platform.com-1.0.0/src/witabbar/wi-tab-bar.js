/**
 * Created by wanggb on 2016/8/18.
 */
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
    return angular.module('dist.ui.tabbar', [])
        .directive('wiTabBar', ['$timeout', '$rootScope', '$state', '$localStorage', '$sessionStorage', WiNavButtonDirective]);

    function WiNavButtonDirective($timeout, $rootScope, $state, $localStorage, $sessionStorage) {
        return {
            restrict: 'EA',
            replace: 'true',
            scope: {
                items: '=',
                tabId: '=',
                options: '=',
                callbacks: '=',
                AllTabItems: '=?',
                addTabItem: '&',
            },
            templateUrl: 'framework/dist.platform.com-1.0.0/src/witabbar/template/witabbar/wi-tab-bar.html',
            link: function ($scope, ele, attr) {
                var vm = $scope.vm = {};
                var defaultOptions = {customRouterUrl: "/"}
                $scope.options = $.extend({}, defaultOptions, $scope.options);
                $scope.options.addLevel = checkAddLevel();
                //$scope.AllTabItems={};//保存所有的Tab栏信息
                //$scope.currentTabLevelLabel={};//当前tab数组中，选中项的标签
                //$scope.currentTab=[];
                $rootScope.sidebarRecursive = ele.extend(true, [], $sessionStorage.WiTabBarCurrentTab) || []; // 存放所有按钮的路由地址、params数据，main-ctrl.js中也会使用这个变量
                $scope.AllTabItems = $sessionStorage.WiTabBarAllTabItems || {};
                $scope.currentTabLevelLabel = $sessionStorage.WiTabBarCurrentTabLevelLabel || {};//当前tab数组中，选中项的标签
                $scope.currentTab = $sessionStorage.WiTabBarCurrentTab || [];
                $scope.activeItem = $sessionStorage.WiTabBarActiveItem || {
                    title: '',
                    style: 'btn-default',
                    name: '',
                    templateUrl: ''
                };
                //当前点击激活项目
                $scope.activeItem.templateUrl !== '' && customHref($scope.activeItem); // 主动触发路由

                $scope.$watch('AllTabItems', function () {
                    $sessionStorage.WiTabBarAllTabItems = $scope.AllTabItems;
                }, true);
                $scope.$watch('currentTabLevelLabel', function () {
                    $sessionStorage.WiTabBarCurrentTabLevelLabel = $scope.currentTabLevelLabel;
                }, true);
                $scope.$watch('currentTab', function () {
                    $sessionStorage.WiTabBarCurrentTab = $scope.currentTab;
                }, true);
                $scope.$watch('activeItem', function () {
                    $sessionStorage.WiTabBarActiveItem = $scope.activeItem;
                }, true);
                vm.setActiveItem = setActiveItem;//点击激活调用的方法
                vm.scroll = activeScroll; //点击左右两侧按钮时调用的方法
                vm.initTabItem = initTabItem;//初始化tab栏
                vm.isTabTemplateUrlEqual = isTabTemplateUrlEqual;//判断当前激活项与view中item的Url是否相等
                vm.tabStatus = {        //tab栏状态信息
                    showLeftTabButton: true,
                    disableLeftTabButton: true,
                    showRightTabButton: true,
                    disableRightTabButton: false
                }
                vm.$scroll = null; //滚动条ID
                vm.removeTabItem = removeTabItem;//删除tab控件
                vm.customHref = customHref;
                /**
                 * @description  checkAddLevel检查options中addLevel属性是否存在，并设置默认值
                 * @return {number} 返回设置等级0 1 2 others
                 * */
                function checkAddLevel() {
                    if (typeof $scope.options.addLevel == 'undefined') {
                        return 1;
                    } else {
                        return $scope.options.addLevel
                    }
                }

                /**
                 * @description  addTabItem，添加tab项
                 * @return null
                 * */
                function initTabItem() {

                }

                /**
                 * @description  customHref 手动实现路由跳转，手动激活路由
                 * @return {null} null
                 * */
                function customHref(item) {
                    var tempItem = item;
                    if (null == tempItem.name) {
                        tempItem.name = $scope.options.defaultRouterName;
                    }
                    if (null == tempItem.templateUrl) {
                        tempItem.templateUrl = {};
                    }
                    $state.go('template', tempItem);
                }

                /**
                 * @description   isTabTemplateUrlEqual 判断当前激活tab项templateUrl属性与目标templateUrl属性是否相等
                 * @return {Boolean} 返回布尔量
                 * */
                function isTabTemplateUrlEqual(activeItem, targetItem) {
                    try {
                        if ((typeof activeItem.templateUrl == 'undefined' && typeof targetItem.templateUrl == 'undefined') || ({} == activeItem.templateUrl && {} == targetItem.templateUrl)) {
                            return true;
                        } else {
                            return activeItem.templateUrl == targetItem.templateUrl;
                        }
                    } catch (e) {
                        console.error(e);
                    }
                }

                function removeTabItem(item) {
                    var targetTabIndex = $scope.currentTab.indexOf(item);
                    //待删除的项是否为当前活动的tab页
                    if (item.name == $scope.activeItem.name && item.templateUrl == $scope.activeItem.templateUrl) {
                        if (-1 == targetTabIndex) {//没找到不做更改
                        }
                        //index为0 且数组长度为1
                        else if (0 == targetTabIndex && 1 == $scope.currentTab.length) {
                            $state.go($scope.options.defaultRouterName, {});//跳转至默认页面
                            $scope.currentTab.pop();//删除当前tab数组页
                        }
                        //index为0 且数组长度大于1
                        else if (0 == targetTabIndex && 1 != $scope.currentTab.length) {
                            $state.go('template', $scope.currentTab[1]);//跳转至index为1的tab路由，且附带template参数
                            $scope.currentTab.splice(targetTabIndex, 1);//删除当前项
                        }
                        //index大于1
                        else if (1 <= targetTabIndex) {
                            $state.go('template', $scope.currentTab[targetTabIndex - 1]);//直接路由跳转到待删除前一页
                            $scope.currentTab.splice(targetTabIndex, 1);//删除选中数组
                        } else {
                        }
                    }
                    //不是活动页则直接移出不做路由跳转
                    else {
                        if (-1 == targetTabIndex) {
                        } else {
                            $scope.currentTab.splice(targetTabIndex, 1);//删除选中数组
                        }
                    }
                    try {
                        $scope.AllTabItems[$scope.currentTabLevelLabel] = $scope.currentTab;//更新$AllTabItems中的数据,用于本地存储保存
                    } catch (e) {
                        console.log(e);
                    }
                    //$scope.$digest($scope.currentTab);
                }

                /**
                 * @description 左右点击时调用过的方法;
                 * @params {Object} e 传入tab栏jQuery对象
                 * @return null
                 * */
                function activeScroll(e) {
                    var $scroll = vm.$scroll
                    if (null == e) return;
                    if ('up' == e) {
                        $scroll.mCustomScrollbar("scrollTo", "left", {
                            scrollInertia: 30
                        });
                    } else if ('down' == e) {
                        $scroll.mCustomScrollbar("scrollTo", "right", {
                            scrollInertia: 30
                        });
                    } else {

                    }
                }

                /**
                 * @description 此处激活tab栏相关选项;
                 * @params {Object} index 传入tab栏选中对象索引
                 * @return null
                 * */
                function setActiveItem(item) {
                    var activeItem = item;
                    $scope.activeItem = activeItem;
                }

                /**
                 * @description 初始化设置滚动条样式;
                 * @params {Object} $element 传入tab栏jQuery对象
                 * @return null
                 * */
                function setTabScrollStyle($element) {
                    $element.mCustomScrollbar({
                        axis: "x",
                        //horizontalScroll:true,
                        callbacks: {
                            onOverflowX: function () {
                                vm.tabStatus.showLeftTabButton = vm.tabStatus.showRightTabButton = true;
                                $scope.$digest(vm.tabStatus);
                                console.log("onOverflowX")
                            },
                            onScrollStart: function () {
                                console.log("onScrollStart")
                            },
                            onScroll: function () {
                                vm.tabStatus = {
                                    showLeftTabButton: true,
                                    disableLeftTabButton: false,
                                    showRightTabButton: true,
                                    disableRightTabButton: false,
                                };
                                //console.log("onScroll");
                            },
                            onTotalScroll: function () {
                                if (this.mcs.leftPct >= 100) {
                                    vm.tabStatus = {
                                        showLeftTabButton: true,
                                        disableLeftTabButton: false,
                                        showRightTabButton: true,
                                        disableRightTabButton: true,
                                    };
                                }
                                console.log("onTotalScroll");
                            },
                            onTotalScrollBack: function () {
                                if (this.mcs.leftPct <= 0) {
                                    vm.tabStatus = {
                                        showLeftTabButton: true,
                                        disableLeftTabButton: true,
                                        showRightTabButton: true,
                                        disableRightTabButton: false,
                                    };
                                }
                                console.log("onTotalScrollBack")
                            },
                            onOverflowXNone: function () {
                                vm.tabStatus.showLeftTabButton = vm.tabStatus.showRightTabButton = false;
                                $scope.$digest(vm.tabStatus);
                                console.log("onOverflowXNone")
                            },
                            onTotalScrollOffset: 0,
                            onTotalScrollBackOffset: 0,
                            alwaysTriggerOffsets: true,
                            whileScrolling: false,
                            whileScrollingInterval: 30
                        },
                        advanced: {
                            updateOnContentResize: true,
                            autoUpdateTimeout: 200,
                            updateOnSelectorChange: 'true'
                        }
                    })

                }

                $scope.$on('$stateChangeStart', function (event) {
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

                $scope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                    // console.log('tab bar:$stateChangeSuccess', toState, toParams, fromState, fromParams);
                    //cfpLoadingBar.start();
                    try {
                        if (typeof ($scope.callbacks.$stateChangeSuccess) == 'function') {
                            $scope.callbacks.$stateChangeSuccess(event, toState, toParams, fromState, fromParams);
                        }
                    } catch (e) {
                        console.log(e)
                    }
                    try {
                        if (typeof ($scope.options.enableSidebarAdd) == 'undefined' || toState.name == $scope.customRouterUrl || typeof ($scope.options.enableRouter) == 'undefined' || $scope.options.enableRouter == false) {

                        } else {
                            if ($scope.options.enableSidebarAdd) {
                                //cfpLoadingBar.complete();
                                var item = {
                                    title: toParams.title
                                    , style: 'btn-default'
                                    , name: toParams.name || ''
                                    , templateUrl: toParams.templateUrl || ''
                                    , customParam: toParams.customParam || ''
                                };//list of active
                                checkCurrentTab($scope, item, toState, toParams);
                                vm.setActiveItem(item);
                                //console.log(toState,toParams,fromParams)
                            }
                        }
                    } catch (e) {
                        console.log(e);
                    }
                    try {
                        for (var i = 0; i < $scope.items.length; i++) {
                            if (toState.name == $scope.items[i].name) {
                                $scope.callbacks.selectTabItem($scope.items[i]);
                                console.log("recall success!");
                                break;
                            }
                        }
                        vm.$scroll.mCustomScrollbar("update");
                    } catch (e) {
                        console.log(e);
                    }
                    //console.log($scope.activeItem)
                    //$scope.$apply($scope.activeItem.templateUrl);

                    //启动自动关闭前一个tab功能
                    var closeTarget = toParams.closeTab || false;
                    if (closeTarget) {
                        var currentTabs = $scope.currentTab || [];
                        var fromParamsName = '';
                        if (typeof fromParams != 'undefined') {
                            fromParamsName = fromParams.name || '';
                        }

                        for (var i = 0; i < currentTabs.length; i++) {
                            if (currentTabs[i].templateUrl == fromParams.templateUrl && currentTabs[i].name == fromParamsName && fromParams.templateUrl != toParams.templateUrl && fromParams.params != toParams.params) {
                                $scope.currentTab.splice(i, 1);
                            }
                        }
                    }
                    $rootScope.viewContentLoading = false;
                });

                $scope.$on('$stateChangeError', function (event, p1, p2, p3) {
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


                //tab itemlevel change start
                /**
                 * @description checkCurrentTab 设置当前显示tab数组
                 * @params {toState} 路由对象
                 * @params {$scope} $scope 当前作用于对象
                 * @return null 直接修改$scope变量，无返回值
                 * */
                function checkCurrentTab($scope, item, toState, toParams) {
                    var levelLabels = item.name.split('.');
                    switch ($scope.options.addLevel) {
                        case 0: {
                            var levelLabel = 'default';
                            checkAllTabItemsStatus($scope, levelLabel, item, toState, toParams);
                            break;
                        }
                        case 2: {
                            var levelLabel = levelLabels[0] + (levelLabels[1] || '') + '';
                            checkAllTabItemsStatus($scope, levelLabel, item, toState, toParams);
                            break;
                        }
                        default: {
                            var levelLabel = levelLabels[0] + '';
                            checkAllTabItemsStatus($scope, levelLabel, item, toState, toParams);
                            break;
                        }
                    }
                }

                // tab itemlevel change end
                /**
                 * @description checkAllTabItemsStatus 检查当前所有tab数组中（$scope.AllTabItems）levelLabel标签对应的属性数组是否存在，并添加
                 * @params {string} levelLabel需要检测的标签
                 * @params {object} item 待加入的tab item
                 * @params {$scope} $scope 当前作用于对象
                 * @return null 直接修改$scope变量，无返回值
                 * */
                function checkAllTabItemsStatus($scope, levelLabel, item, toState, toParams) {

                    if (null == $scope.currentTabLevelLabel) {
                        $scope.currentTabLevelLabel = "_DEFAULTWITABBARLABEL_";
                    }
                    var label = levelLabel ? levelLabel : $scope.currentTabLevelLabel;
                    //未添加过levelLabel时
                    if (typeof $scope.AllTabItems[label] == 'undefined') {
                        $scope.AllTabItems[label] = [];
                        $scope.AllTabItems[label].push(item);
                    }
                    //已添加过levelLabel时
                    else {
                        var status = -1;
                        for (var i = 0; i < $scope.AllTabItems[label].length; i++) {
                            if ($scope.AllTabItems[label][i].name == item.name) {
                                status = i;
                                break;
                            }
                        }
                        //未打开过的item，增加一个tab到最后
                        if (-1 == status) {
                            $scope.AllTabItems[label].push(item);
                        }
                        //未打开过的item，替换原有tab（有可能附加参数不同，如果不替换，当点击sidebar或其他tab在切换回原tab时可能由于参数的问题导致数据不正常）
                        else {
                            $scope.AllTabItems[label][i] = item;
                        }
                    }
                    $scope.currentTab = $scope.AllTabItems[label];
                    $scope.currentTabLevelLabel = label;
                    //$scope.$digest($scope.currentTab);
                }

                $timeout(enableTabScroll, 0);

                //使能tab控件的滚动条
                function enableTabScroll() {
                    vm.$scroll = $("#" + $scope.tabId);
                    setTabScrollStyle(vm.$scroll);//设置浏览器样式，相关回调事件。
                }
            }

        }
    }
}));

