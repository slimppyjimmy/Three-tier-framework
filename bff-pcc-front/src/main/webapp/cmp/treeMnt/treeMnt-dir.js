/**
 * @description
 * <pre>
 *     <h2>tree-mnt函数方法描述</h2>
 *     在调用以下两个方法之前，当前节点的选中状态已经被wiTree处理过了（由于设置了cascade=false，wiTree只处理当前节点），即已经是最终的状态
 *     （__selected为true或false，__semi为false），因此只需要处理所有子节点和所有父节点
 *     vm._checkChildrenRecursive() 递归处理所有子节点，每个子节点的选中状态与当前节点完全相同。
 *     递归处理所有子节点，每个子节点的选中状态与当前节点完全相同。
 *     vm._checkParentRecursive()  递归处理所有父节点，每个父节点的选中状态由其所有的直接子节点确定，可能为selected、unselected、semi
 *     vm._initChecksRecursive() 由于初始化数据中仅有选中和未选中两种状态，没有半选状态，因此需要对处于选中状态的非叶子结点进行处理，
 *     当其子节点没有全部处于选中状态时，设置为半选状态
 *     vm._addPrepare() prepareUrl是否需要区分searchPrepareUrl、dataPrepareUrl？prepareUrl与dataUrl也有差别：
 *     data是实际的数据，prepare仅仅是准备数据
 *     vm._asyncList() tree异步加载
 *     vm._onNodeModified() 通知接收者节点有改变
 * </pre>
 */
var app = angular.module('AceApp');
app.directive("treeMnt", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
            , switchCollapse: '&'
        }
        , templateUrl: 'cmp/treeMnt/treeMnt-tpl.html'
        , controller: function ($scope, $q, $uibModal, $timeout, HttpService, BroadcastService, PromptService,$interval,$rootScope) {
            console.log(">>>treeMnt scope=", $scope);

            var vm = $scope;
            //TODO 应为vm，后续需要修改上面的vm为下面的规范模式
            var mm = $scope.vm = {};

            mm.count = 0;
            mm.onNodeMouseEnter = function (event, node) {
                // event.stopPropagation();
                // console.log(">>>treeMnt._onNodeMouseEnter() enter: node=", node, event, mm.count++);
                //发送显示菜单事件
                $scope.$broadcast("popupMenu:show", {mouseEvent: event, menus: vm.param.buttons});
                // console.log("<<<treeMnt._onNodeMouseEnter() exit");
            };
            mm.onNodeMouseLeave = function (node) {
                // event.stopPropagation();
                // console.log(">>>treeMnt._onNodeMouseLeave() enter: node=", node);
                //发送隐藏菜单事件
                $scope.$broadcast("popupMenu:hide");
                // console.log("<<<treeMnt._onNodeMouseLeave() exit");
            };

            mm.onMenuClick = function (buttonConfig, node) {
                console.log(">>>treeMnt._onNodeMouseLeave() enter: node=", node);
                vm._todo(buttonConfig, node);
                console.log("<<<treeMnt._onNodeMouseLeave() exit");
            };
            vm._init = function () {
                if (!vm.config) {
                    PromptService.errorPrompt("控件参数config未定义");
                    return;
                }
                if (!vm.param) {
                    PromptService.errorPrompt("控件参数param未定义");
                    return;
                } else if (!vm.param.idfield) {
                    PromptService.errorPrompt("控件参数param.idfield未定义");
                    return;
                } else if (!vm.param.pidfield) {
                    PromptService.errorPrompt("控件参数param.pidfield未定义");
                    return;
                } else if (!vm.param.listUrl) {
                    PromptService.errorPrompt("控件参数param.listUrl未定义");
                    return;
                }
                //控件必须在初始化时调用BroadcastService.initMessages()以进行消息映射：绑定消息发送和接收事件，接收消息在config.messages中定义。message的id应由配置工具自动生成，然后由配对的sender和receiver使用，最好使用uuid，以防止被其他控件误用
                BroadcastService.initMessages(vm);

                //增删改后是否通知父控件，默认为false
                vm._notifyParent = vm.param.notifyParent || false;
                vm._data = [];
                //由于向tree传递的provider（_data）并没有实现双向绑定，因此只能从wid（_treeModel）中获取实际的选中状态
                vm._treeModel = {};
                vm._multiselect = vm.param.multiselect || false;
                vm._listtype = vm.param.listtype || null;
                vm._cascade = vm.param.cascade || false;
                vm._focused = null;
                vm._parent = null;
                vm._mappedParentsFields = {};
                vm._showWidget = vm._parent || !vm.param.needParent;

                //使用对象保存搜索数据和参数，以避免由于scope的原因导致在模板中无法获取
                vm._filter = {};
                //初始化过滤文本
                vm._filter.text = "";
                //初始化过滤结果数据
                vm._filter.result = vm._data;
                //初始化过滤字段
                vm._filter.fields = vm.param.filterFields ? vm.param.filterFields : [];
                if (vm._filter.fields.length == 0) {
                    //对tree来说暂时仅针对节点text对应的field进行匹配
                    vm._filter.fields.push(vm.param.textfield);
                    //将所有grid中定义的字段均用于匹配
                    // vm.param.grid.columns.forEach(function (row) {
                    //     vm._filter.fields.push(row.data.name);
                    // })
                }
                    vm._searchPrepare();
                vm._list();
            };

            vm._toFilter = function () {
                if (vm._filter.fields) {
                    //当搜索串不为空时，使用搜索字段对数据进行过滤
                    if (vm._filter.text) {
                        vm._filter.result = vm._data.filter(function (row) {
                            return vm._filter.fields.some(function (field) {
                                if (row[field] === undefined) {
                                    PromptService.errorPrompt("数据中不存在过滤字段：" + field);
                                    return false;
                                } else
                                    //如果字段不是字符串类型，则不进行搜索
                                    return typeof row[field] !== "string" ? false : row[field].toLowerCase().indexOf(vm._filter.text.toLowerCase()) >= 0;
                            })
                        });
                    }
                    //当搜索串为空时，恢复使用原始数据
                    else
                        vm._filter.result = vm._data;
                }
            };
            vm._todo = function (buttonConfig, node) {
                buttonConfig.idfield = buttonConfig.idfield || vm.param.idfield;
                buttonConfig.pidfield = buttonConfig.pidfield || vm.param.pidfield;
                node = node || null;
                switch (buttonConfig.type) {
                    case "add":
                        vm._toAdd(buttonConfig, node);
                        break;
                    case "modify":
                        vm._toModify(buttonConfig, node);
                        break;
                    case "delete":
                        vm._delete(buttonConfig, node);
                        break;
                    case "postOneRefresh":
                        vm._postOne(buttonConfig, node, true);
                        break;
                    case "postOneNoRefresh":
                        vm._postOne(buttonConfig, node, false);
                        break;
                    case "postMultiRefresh":
                        vm._postMulti(buttonConfig, true);
                        break;
                    case "postMultiNoRefresh":
                        vm._postMulti(buttonConfig, false);
                        break;
                    case "message":
                        vm._sendMessage(buttonConfig.messageId, node);
                        break;
                    default:
                        PromptService.errorPrompt("不支持的按钮类型：" + buttonConfig.type);
                }
            };
            //在调用以下两个方法之前，当前节点的选中状态已经被wiTree处理过了（由于设置了cascade=false，wiTree只处理当前节点），即已经是最终的状态（__selected为true或false，__semi为false），因此只需要处理所有子节点和所有父节点
            //递归处理所有子节点，每个子节点的选中状态与当前节点完全相同。
            vm._checkChildrenRecursive = function (node) {
                if (vm._cascade) {
                    var children = vm._treeModel.getNodes(vm.param.pidfield, node[vm.param.idfield]);
                    children.forEach(function (child) {
                        child.__selected = node.__selected;
                        child.__parent.__semi = false;
                        vm._checkChildrenRecursive(child);
                    })
                }
            };

            //递归处理所有父节点，每个父节点的选中状态由其所有的直接子节点确定，可能为selected、unselected、semi
            vm._checkParentRecursive = function (node) {
                if (node) {
                    if (vm._cascade && node.__parent) {
                        var children = node.__parent.children;
                        var selectedCount = 0, semiCount = 0;
                        children.forEach(function (child) {
                            if (child.__selected && !child.__semi)
                                selectedCount++;
                            else if (child.__semi)
                                semiCount++;
                        });
                        if (selectedCount == children.length) {//全选
                            node.__parent.__selected = true;
                            node.__parent.__semi = false;
                        } else if (selectedCount + semiCount > 0) {//至少一个选中或半选
                            node.__parent.__selected = true;
                            node.__parent.__semi = true;
                        } else {//全部未选
                            node.__parent.__selected = false;
                            node.__parent.__semi = false;
                        }
                        vm._checkParentRecursive(node.__parent);
                    }
                }
            };

            //由于初始化数据中仅有选中和未选中两种状态，没有半选状态，因此需要对处于选中状态的非叶子结点进行处理，当其子节点没有全部处于选中状态时，设置为半选状态
            vm._initChecksRecursive = function () {
                if (vm._cascade) {
                    vm._data.forEach(function (node) {//_treeModel中无法获取所有节点，只能用_data
                        var modelNode = vm._treeModel.getNode(vm.param.idfield, node[vm.param.idfield]);
                        vm._checkParentRecursive(modelNode);
                    });
                }
            };
            vm._list = function (event) {
                var defer = $q.defer();
                vm.param.refreshInterval=time;
                console.log(">>>treeMnt._list()");
                vm._searchPrepare();
                if(event){
                    $(event.target).attr("disabled","true")
                }
                if (vm._parent || !vm.param.needParent) {
                    var requestParams = {};
                    if (vm._searchBar && vm._searchBar.properties) {
                        // var conditions = "";
                        vm._searchBar.properties.forEach(function (config) {
                            requestParams[config.name] = vm._searchBar.data[config.name] || config.defaultValue;
                        });
                        // url = url + (url.indexOf("?") < 0 ? "?" : "") + conditions;
                    }
                    HttpService.get({
                            url: vm.param.listUrl
                            , params: requestParams
                        }
                        , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    ).then(function (data) {
                        data.forEach(function (node) {
                            //如果pidfield属性未定义则将其设置为""（表示一级节点），以避免使用pidfield属性对url参数进行替换时不成功导致请求失败
                            if (node[vm.param.pidfield] == undefined) {
                                node[vm.param.pidfield] = "";
                            }
                            if (node[vm.param.pidfield] === node[vm.param.idfield]) {
                                PromptService.errorPrompt("数据错误，请联系管理员：" + vm.param.pidfield + "与" + vm.param.idfield + "相同：" + node[vm.param.textfield] + "[" + node[vm.param.idfield] + "]");
                            }
                        })
                        //必须在数据检查之后加入根节点，否则会提示错误
                        if (vm.param.root) {
                            var treeRoot = {};
                            treeRoot[vm.param.idfield] = vm.param.root[vm.param.idfield];
                            treeRoot[vm.param.textfield] = vm.param.root[vm.param.textfield];
                            treeRoot[vm.param.pidfield] = null;
                            data.push(treeRoot);
                        }
                        vm._data = data;
                        //如果不进行remove，_treeModel中包含的是新旧数据的合集，应该是wiTree的bug
                        vm._filter.result.forEach(function (node) {
                            vm._treeModel.remove(node);
                        });
                        vm._filter.text = "";
                        vm._toFilter();
                        // vm._treeModel.loadData(vm._filter.result);
                        //更新provider数据后，model数据并不会同步刷新，而_initChecksRecursive需要使用model数据，因此需要延迟执行
                        $timeout(function () {
                            vm._initChecksRecursive();
                            defer.resolve();
                        }, 200);
                        if(event){
                            $(event.target).removeAttr("disabled")
                        }
                        $('#orgMntLoading').css({
                            "display":"none",
                            "z-index":"-1"
                        });
                        console.log("<<<treeMnt._list() success: ", data);
                    });
                } else {
                    vm._data = [];
                    vm._filter.text = "";
                    vm._toFilter();
                    defer.resolve();
                }
                console.log("<<<treeMnt._list() exit");
                return defer.promise;
            }
            var time=vm.param.refreshInterval
            if(vm.param.refreshInterval && vm.param.refreshInterval!==undefined){//refreshInterval参数存在时才生成定时器
                vm._autoRefresh= $interval(//增加定时器，自动刷新
                    function () {
                        if(vm.param.refreshInterval>0){
                            vm.param.refreshInterval --
                        }else if(vm.param.refreshInterval==0){
                            vm._list()
                            vm.param.refreshInterval=time
                        }
                    },1000
                );
            };
            vm._stopAutoRefresh=function (){//停止定时器
                if(vm._autoRefresh){
                    $interval.cancel(vm._autoRefresh)
                    vm._autoRefresh = null;
                }
            };
            $rootScope.$on('$stateChangeStart', function (angularEvent, current, previous) {//监听路由跳转，执行停止定时器
                vm._stopAutoRefresh();
            });
            vm._checkChildrenAndParentResursive = function (node) {
                vm._checkChildrenRecursive(node);
                vm._checkParentRecursive(node);
            };
            vm._onNodeChecked = function (node) {
                console.log(">>>treeMnt._onNodeChecked() enter: node=");
                vm._checkChildrenAndParentResursive(node);
                console.log("<<<treeMnt._onNodeChecked() exit");
            };
            vm._onNodeUnchecked = function (node) {
                console.log(">>>treeMnt._onNodeUnchecked() enter: node=", node);
                vm._checkChildrenAndParentResursive(node);
                console.log("<<<treeMnt._onNodeUnchecked() exit");
            };
            vm._onNodeClicked = function (node) {
                console.log(">>>treeMnt._onNodeClicked() enter: node=", node);
                // if (!vm._focused || !node || (vm._focused && node && vm._focused[vm.param.idfield] !== node[vm.param.idfield])) {
                vm._focused = node;
                // vm._mappedParentsFields[vm.param.idfield] = vm._focused[vm.param.idfield];
                vm._onNodeFocusChanged(node);
                // }
                console.log("<<<treeMnt._onNodeClicked() exit");
            };
            // tree异步加载
            vm._asyncList = function (node, success, fail) {
                HttpService.get({
                        url: vm.param.listUrl
                    }
                    , angular.extend({}, node)
                ).then(function (result) {
                    success(result);
                }, function (err) {
                    fail(err);
                });
            };
            vm.$on('toSearch',function (event,data) {
                console.log(">>>toSearchTree",data);
                vm._searchBar=data;
                vm._search()
            });
            vm.$on("toDownload",function (event,data) {
                vm._picker=data;
                vm._download()
            });
            vm._searchPrepare = function () {
                var defer = $q.defer();
                console.log(">>>treeMnt._searchPrepare() enter");
                //搜索准备数据仅加载一次
                if (vm._searchBar && !vm._searchBar.preparedata) {
                    if (vm._searchBar.prepareUrl) {
                        HttpService.get({
                                url: vm._searchBar.prepareUrl
                            }
                            , angular.extend({}, vm._mappedParentsFields)
                        ).then(function (result) {
                            console.log("treeMnt._searchPrepare() success, data=", result);
                            vm._searchBar.preparedata = result;
                            defer.resolve();
                        });
                    } else {
                        console.info("param.searchBar.prepareUrl 未定义");
                        defer.resolve();
                    }
                } else
                    defer.resolve();
                console.log("<<<treeMnt._searchPrepare() exit");
                return defer.promise;
            };
            vm._search = function () {
                $("#treeSearchBtn").attr("disabled","true")
                $('#orgMntLoading').css({
                    "display":"block",
                    "z-index":"29999999"
                })
                vm._list();
            };
            //TODO prepareUrl是否需要区分searchPrepareUrl、dataPrepareUrl？prepareUrl与dataUrl也有差别：data是实际的数据，prepare仅仅是准备数据
            vm._addPrepare = function (buttonConfig, node) {
                var defer = $q.defer();
                console.log(">>>treeMnt.addPrepare() enter");
                if (buttonConfig.prepareUrl) {
                    HttpService.get({
                            //如果node未定义（未选中任何节点），则传递空串
                            url: buttonConfig.prepareUrl.replace(":id", node ? node[buttonConfig.idfield] : "")
                        }
                        , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    ).then(function (result) {
                        console.log("treeMnt.addPrepare() success, data=", result);
                        // vm.prepareData = data;
                        defer.resolve(result)
                    });
                } else {
                    defer.resolve();
                }
                console.log("<<<treeMnt.addPrepare() exit");
                return defer.promise;
            };
            vm._modifyPrepare = function (buttonConfig, node) {
                var defer = $q.defer();
                console.log(">>>treeMnt.modifyPrepare() enter");
                if (buttonConfig.prepareUrl) {
                    HttpService.get({
                            url: buttonConfig.prepareUrl.replace(":id", node ? node[buttonConfig.idfield] : "")
                        }
                        , angular.extend({}, node, vm._mappedParentsFields)
                    ).then(function (result) {
                        console.log("treeMnt.modifyPrepare() success, data=", result);
                        // vm.prepareData = data;
                        defer.resolve(result)
                    });
                } else {
                    defer.resolve(null);
                }
                console.log("<<<treeMnt.modifyPrepare() exit");
                return defer.promise;
            };
            vm._toModify = function (buttonConfig, node) {
                console.log(">>>treeMnt.toModify enter");
                vm._load(buttonConfig, node).then(function (loaddata) {
                    vm._modifyPrepare(buttonConfig, node).then(function (preparedata) {
                        var modalInstance = $uibModal.open({
                            backdrop: "static"
                            , templateUrl: buttonConfig.templateUrl
                            , controller: function ($scope, $uibModalInstance) {
                                $scope.preparedata = preparedata || {};
                                //如果preparedata中设置了defaults，那么将defaults作为newdata的默认值，这样就可以使用在loaddata中不存在的属性
                                $scope.newdata = typeof $scope.preparedata.defaults === "object" ? angular.copy($scope.preparedata.defaults) : {};
                                //然后将loaddata复制到newdata中，如果loaddata与defaults中存在重复属性，可保证使用的是loaddata中的数据
                                $scope.newdata = angular.extend($scope.newdata, loaddata);
                                $scope.ok = function () {
                                    vm._modify(buttonConfig, $scope.newdata).then(function (result) {
                                        $uibModalInstance.close();
                                        vm._onNodeModified();
                                        vm._onRefresh();
                                    })
                                };
                                $scope.cancel = function () {
                                    $uibModalInstance.dismiss();
                                }
                            }
                        })
                    })
                })
                // modalInstance.opened.then(function () {//模态窗口打开之后执行的函数
                //     console.log('modal is opened');
                // });
                // modalInstance.result.then(function (result) {
                //     console.log(result);
                // }, function (reason) {
                //     console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会输出cancel
                // });
                console.log(">>>treeMnt.toModify exit");
            };
            vm._toAdd = function (buttonConfig, node) {
                console.log(">>>treeMnt.toAdd()");
                var addModel = (buttonConfig.model || "create").toLowerCase();
                if (!(addModel === "create" || addModel === "select")) {
                    PromptService.errorPrompt("按钮参数model只能为create或select");
                } else if (!buttonConfig.templateUrl) {
                    PromptService.errorPrompt("按钮参数templateUrl未定义");
                } else if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                } else {
                    vm._addPrepare(buttonConfig, node).then(function (preparedata) {
                        console.log(">>>treeMnt.toAdd() to open modal");
                        var modalInstance = $uibModal.open({
                            backdrop: "static"
                            , templateUrl: buttonConfig.templateUrl
                            , controller: function ($scope, $uibModalInstance) {
                                if (addModel === "create") {
                                    $scope.preparedata = preparedata || {};
                                    //如果preparedata中设置了defaults，那么将defaults作为newdata的默认值，这样就可以使用在loaddata中不存在的属性
                                    $scope.newdata = typeof $scope.preparedata.defaults === "object" ? angular.copy($scope.preparedata.defaults) : {};
                                    $scope.ok = function () {
                                        //如果pidfield属性的值未定义（在param未配置输入），则追加当前选中节点id（如果id为null，表示在根节点上）
                                        if ($scope.newdata[buttonConfig.pidfield] === undefined && vm._focused && vm._focused[buttonConfig.idfield])
                                            $scope.newdata[buttonConfig.pidfield] = vm._focused[buttonConfig.idfield];
                                        vm._add(buttonConfig, $scope.newdata).then(function (result) {
                                            $uibModalInstance.close();
                                            if (result)
                                                vm._focused = result;
                                            vm._onNodeModified();
                                            vm._onRefresh();
                                        })
                                    };
                                    $scope.cancel = function () {
                                        $uibModalInstance.dismiss();
                                    }
                                } else if (addModel === "select") {
                                    $scope.data = preparedata;
                                    $scope.mappedfields = vm._mappedParentsFields;
                                    $scope.parentdata = null;
                                    $scope.param = buttonConfig;
                                    var ids = [];
                                    if (!buttonConfig.listUrl) {
                                        PromptService.errorPrompt("按钮参数listUrl未定义");
                                    } else {
                                        $scope.ok = function (selected) {
                                            //从选中数据中取出id组成数组
                                            selected.forEach(function (item) {
                                                ids.push(item[idfield]);
                                            })
                                            console.log("ids=", ids);
                                            vm._add(buttonConfig, ids).then(function (result) {
                                                $uibModalInstance.close();
                                                //由于返回为空，因此不能改变焦点节点
                                                // vm._focused = result[vm.param.idfield];
                                                vm._onNodeModified();
                                                vm._onRefresh();
                                            })
                                        };
                                        $scope.cancel = function () {
                                            $uibModalInstance.dismiss();
                                        }
                                    }
                                }
                            }
                        })
                    })
                }
                // modalInstance.opened.then(function () {//模态窗口打开之后执行的函数
                //     console.log('modal is opened');
                // });
                // modalInstance.result.then(function (result) {
                //     console.log(result);
                // }, function (reason) {
                //     console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会输出cancel
                // });
                console.log(">>>treeMnt.toAdd()");
            };
            vm._delete = function (buttonConfig, node) {
                console.log(">>>treeMnt.del() enter");
                if (!node) {
                    PromptService.errorPrompt("未选择节点，无法进行操作");
                } else if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                } else {
                    var postConfig = {
                        //适应三种情况：
                        //1、通过id删除实体，后端可以忽略data中传递的id
                        //2、通过parentId和id删除关联关系，在url中传递id，data被忽略
                        //3、通过parentId和id删除关联关系，然后在data中传递id进行删除（与批量删除统一接口）
                        url: buttonConfig.executeUrl.replace(":id", node[buttonConfig.idfield])
                        , data: [node[buttonConfig.idfield]]
                    }
                    if (buttonConfig.withOutData) {
                        delete postConfig.data;
                    }
                    HttpService.post(postConfig
                        , angular.extend({}, node, vm._mappedParentsFields)
                        , buttonConfig.confirm
                        , buttonConfig.success
                    ).then(function (data) {
                        console.log("treeMnt.del() success");
                        //重新获取数据,刷新列表。存在问题:list()会在success关闭之前执行,除非使用设置config.success.callback的方式
                        vm._focused = null;
                        vm._onNodeModified();
                        vm._onRefresh();
                    });
                }
                console.log("<<<treeMnt.delete() exit");
            };
            vm._load = function (buttonConfig, node) {
                var defer = $q.defer();
                console.log(">>>treeMnt.load() enter");
                if (!buttonConfig.loadUrl) {
                    PromptService.errorPrompt("按钮参数loadUrl未定义");
                } else if (node) {
                    HttpService.get({
                            url: buttonConfig.loadUrl.replace(":id", node[buttonConfig.idfield])
                        }
                        , angular.extend({}, node, vm._mappedParentsFields)
                    ).then(function (result) {
                        // return data;
                        vm.newData = result;
                        console.log("treeMnt.load() success, data=", result);
                        defer.resolve(result)
                    });
                }
                console.log("<<<treeMnt.load() exit");
                return defer.promise;
            };
            vm._add = function (buttonConfig, data) {
                var defer = $q.defer();
                console.log(">>>treeMnt.add() enter");
                if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                }
                HttpService.post({
                        url: buttonConfig.executeUrl
                        , data: data
                    }
                    , angular.extend({}, data, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("treeMnt.add() success, data=", result);
                    defer.resolve(result)
                });
                console.log("<<<treeMnt.add() exit");
                return defer.promise;
            };
            vm._modify = function (buttonConfig, node) {
                var defer = $q.defer();
                console.log(">>>treeMnt.modify() enter:", node);
                if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                    defer.reject();
                } else {
                    HttpService.post({
                            url: buttonConfig.executeUrl.replace(":id", node[buttonConfig.idfield])
                            , data: node
                        }
                        , angular.extend({}, node, vm._mappedParentsFields)
                        , buttonConfig.confirm
                        , buttonConfig.success
                    ).then(function (result) {
                        console.log("treeMnt.modify() success, data=", result);
                        defer.resolve(result)
                    });
                }
                console.log("<<<treeMnt.modify() exit");
                return defer.promise;
            };
            vm._postOne = function (buttonConfig, node, needRefresh) {
                var defer = $q.defer();
                console.log(">>>treeMnt._postOne() enter:", node);
                if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                    return;
                }
                HttpService.post({
                        url: buttonConfig.executeUrl.replace(":id", node[buttonConfig.idfield])
                        , data: [node[buttonConfig.idfield]]
                    }
                    , angular.extend({}, node, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("treeMnt._postOne() success, data=", result);
                    vm._onNodeModified();
                    if (needRefresh) {
                        vm._onRefresh();
                    }
                    defer.resolve(result)
                });
                console.log("<<<treeMnt._postOne() exit");
                return defer.promise;
            };
            vm._postMulti = function (buttonConfig, needRefresh) {
                var defer = $q.defer();
                console.log(">>>treeMnt._postMulti() enter:", vm._treeModel.getSelected());
                if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                    return;
                }
                var ids = [];
                var idfield = buttonConfig.idfield || vm.param.idfield;
                vm._treeModel.getSelected().forEach(function (node, index, array) {
                    if (node[idfield])
                        ids.push(node[idfield]);
                })
                HttpService.post({
                        url: buttonConfig.executeUrl.replace(":parentId", vm._parent)
                        , data: ids
                    }
                    , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("treeMnt._postMulti() success, data=", result);
                    vm._onNodeModified();
                    if (needRefresh) {
                        vm._onRefresh();
                    }
                    defer.resolve(result)
                });
                console.log("<<<treeMnt._postMulti() exit");
                return defer.promise;
            };
            vm._onRefresh = function () {
                console.log(">>>treeMnt._onRefresh()");
                vm._list().then(function () {
                    var currentNode = null;
                    //单选时支持刷新后恢复选中节点
                    if (!vm.param.multiselect && vm._focused) {
                        vm._data.forEach(function (node) {//forEach无法跳出循环，every可以
                            if (vm._focused[vm.param.idfield] === node[vm.param.idfield]) {
                                // node.__current = true;
                                // node.selected = true;
                                vm._treeModel.select(node);
                                currentNode = node;
                            }
                        })
                    }
                    // if (currentNode)
                    vm._onNodeClicked(currentNode);
                });
                console.log("<<<treeMnt._onRefresh() exit");
            };
            vm._onNodeFocusChanged = function (row) {
                console.log(">>>treeMnt._onNodeFocusChanged() enter: row=", row);
                // BroadcastService.emitMessage("nodeChanged", row[vm.param.idfield], vm);
                var fullData = null;
                if (row) {
                    fullData = {};
                    // node.id = row[vm.param.idfield];
                    // parent.idfield = vm.param.idfield;
                    //data传递当前选中节点数据。注意：不能使用node=row，因为row中可能存在parent字段，将会与node.parent冲突
                    fullData.data = row;
                    //parent传递父控件的选中节点数据
                    fullData.parent = vm._parent;
                    fullData.mappedParentsFields = vm._mappedParentsFields;
                }
                BroadcastService.emitMessage("nodeChanged", fullData, vm);
                console.log("<<<treeMnt._onNodeFocusChanged() exit");
            };
            //通知接收者节点有改变
            vm._onNodeModified = function () {
                console.log(">>>treeMnt._onNodeModified enter:");
                if (vm._notifyParent)
                    BroadcastService.emitMessage("nodeModified", null, vm);
                console.log(">>>treeMnt._onNodeModified exit");
            };
            vm._handleMessage_parentChanged = function (event, parent) {
                console.log(">>>treeMnt._handleMessage_parentChanged enter: event=", event, " parent=", parent);
                vm._parent = parent;
                // vm._showWidget = vm._parent != null || !vm.param.needParent;
                vm._showWidget = vm._parent || !vm.param.needParent;
                if (parent) {
                    //从parent中复制已映射属性
                    vm._mappedParentsFields = angular.extend({}, vm._parent.mappedParentsFields);
                    if (vm.param.parentWidgetDataMap) {
                        vm.param.parentWidgetDataMap.forEach(function (entry) {
                            if (vm._parent && vm._parent.data && vm._parent.data[entry.parentField])
                                vm._mappedParentsFields[entry.currentField] = vm._parent.data[entry.parentField];
                        })
                    }
                }
                vm._onRefresh();
                console.log("<<<treeMnt._handleMessage_parentChanged exit");
            };
            vm._handleMessage_dataModified = function (event) {
                console.log(">>>treeMnt._handleMessage_dataModified enter:", event);
                // vm._parent = parentId;
                // vm._showWidget = vm._parent || !vm.param.needParent;
                // vm._showWidget = vm._parent || !vm.param.needParent;
                vm._onRefresh();
                console.log("<<<treeMnt._handleMessage_dataModified exit");
            };
            vm._init();
            console.log("<<<treeMntController exit");
        }
    }
});