var WiSideBarController=['$scope',function ($scope) {


                $scope.sidebar= {
                    "root": [
                        {
                            "url": "home",
                            "icon": "fa fa-home",
                            "title": "主页",
                            "controller": "",
                            "name": "home",
                            "level-1": true
                        },
                        {
                            "abstract": true,
                            "title": "业务审批",
                            "icon": "fa fa-edit",
                            "template": "<ui-view/>",
                            "name": "approve",
                            "url": "approve",
                            "level-1": true,
                            "submenu": [
                                {
                                    "url": "approve.new",
                                    "title": "新建",
                                    "name": "approve.new",
                                    "level-2": true
                                },
                                {
                                    "url": "approve.handling",
                                    "title": "在办箱",
                                    "name": "approve.handling",
                                    "level-2": true
                                },
                                {
                                    "url": "approve.completed",
                                    "title": "已办箱",
                                    "name": "approve.completed",
                                    "level-2": true
                                },
                                {
                                    "url": "approve.abolished",
                                    "title": "废件箱",
                                    "name": "approve.abolished",
                                    "level-2": true
                                },
                                {
                                    "url": "approve.retreated",
                                    "title": "退件箱",
                                    "controller": "",
                                    "name": "approve.retreated",
                                    "level-2": true
                                }
                            ]
                        },
                        {
                            "abstract": true,
                            "title": "系统维护",
                            "icon": "fa fa-tachometer",
                            "template": "<ui-view/>",
                            "name": "system",
                            "url": "system",
                            "level-1": true,
                            "submenu": [
                                {
                                    "abstract": true,
                                    "title": "角色管理",
                                    "template": "<ui-view/>",
                                    "name": "system.admin",
                                    "url": "system.admin",
                                    "level-2": true,
                                    "submenu": [
                                        {
                                            "url": "system.admin.new",
                                            "title": "新建",
                                            "controller": "",
                                            "name": "system.admin.new",
                                            "level-3": true
                                        },
                                        {
                                            "url": "system.admin.manage",
                                            "title": "管理",
                                            "controller": "",
                                            "name": "system.admin.manage",
                                            "level-3": true
                                        },
                                        {
                                            "url": "system.admin.delete",
                                            "title": "删除",
                                            "controller": "",
                                            "name": "system.admin.delete",
                                            "level-3": true
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "abstract": true,
                            "title": "代码测试",
                            "icon": "fa fa-tachometer",
                            "template": "<ui-view/>",
                            "name": "debug",
                            "url": "debug",
                            "level-1": true,
                            "submenu": [
                                {
                                    "url": "debug.factory",
                                    "title": "服务通信",
                                    "controller": "",
                                    "name": "debug.factory",
                                    "level-2": true
                                },
                                {
                                    "url": "debug.iframe",
                                    "title": "IFRAME",
                                    "controller": "",
                                    "name": "debug.iframe",
                                    "level-2": true
                                },
                                {
                                    "abstract": true,
                                    "title": "TABLE",
                                    "icon": "",
                                    "template": "<ui-view/>",
                                    "name": "debug.table",
                                    "url": "debug.table",
                                    "level-2": true,
                                    "submenu": [
                                        {
                                            "url": "debug.table.smart",
                                            "title": "Smart",
                                            "controller": "",
                                            "name": "debug.table.smart",
                                            "level-3": true
                                        },
                                        {
                                            "url": "debug.table.uiGridDemo1",
                                            "title": "UiGridDemo1",
                                            "controller": "",
                                            "name": "debug.table.uiGridDemo1",
                                            "level-3": true
                                        },
                                        {
                                            "url": "debug.table.uiGridDemo2",
                                            "title": "UiGridDemo2",
                                            "controller": "",
                                            "name": "debug.table.uiGridDemo2",
                                            "level-3": true
                                        }
                                    ]
                                },
                                {
                                    "url": "debug.pagination",
                                    "title": "Pagination",
                                    "controller": "",
                                    "name": "debug.pagination",
                                    "level-2": true
                                },
                                {
                                    "url": "debug.chart",
                                    "title": "Chart",
                                    "controller": "",
                                    "name": "debug.chart",
                                    "level-2": true
                                },
                                {
                                    "url": "debug.developNorm",
                                    "title": "开发规范",
                                    "controller": "",
                                    "name": "debug.developNorm",
                                    "level-2": true
                                }
                            ]
                        }
                    ]
                };
                $scope.bodystyle=4;
                $scope.sideConfig={
                       minimized:false,
                       hover:false,
                       highlight:true,
                       fixed:false,
                       compact:false,
                 };
                $scope.callbacks={
                    $stateChangeStart:function(e){
                        console.log("$stateChangeStart");
                    },
                    $stateChangeSuccess:function(e){
                        console.log("$stateChangeSuccess");
                    },
                    $stateChangeError:function(e){
                        console.log("$stateChangeError");
                    }
                }

}];
angular.module('dist.ui').controller('WiSideBarController',WiSideBarController);