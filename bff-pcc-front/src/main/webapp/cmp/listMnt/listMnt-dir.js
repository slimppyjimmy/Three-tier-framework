/**
 * @description
 * <pre>
 *     <h2>list-mnt函数方法描述</h2>
 *     vm._init() 初始化未定义的控件参数
 *     vm._download() 处理下载中的控件
 *     vm._toFilter()对搜索框进行过滤
 *     vm._getConditionResult() 给表格标记不同的样式：在template里面配置precondition
 *     vm._todo() 定义按钮的类型 ：template里面点击vm._todo（）
 *     函数传入buttonConfig, row两个参数内容，通过switch循环根据buttonConfig.type的类型判断需要调用的函数
 *     vm._searchPrepare() 搜索条数据准备
 *     vm._addPrepare() 添加按钮准备  buttonConfig 当前按钮的配置参数
 *     vm._modifyPrepare 修改按钮准备 row 行数据
 *     vm._toModify() 修改
 *     vm._toAdd() 新建 buttonConfig 当前按钮的配置参数，配置信息
 *     vm._list() 刷新list列表控件，添加refreshInterval参数后执行自动刷新
 *     vm._help() 帮助list列表控件
 *     vm._delete() 删除控件
 *     vm._load() 加载
 *     vm._postOne() 对单行执行post操作 needRefresh 执行后是否刷新控件
 *     vm._postMulti() 对选中行执行post操作
 *     vm._modify() 修改
 *     vm._handleMessage_parentChanged() 定义所有的消息接收事件  event  接收消息的事件
 *     vm._changeOnes 全选checkbox状态改变时改变checkbox状态
 *     vm._allClick() 全选chekbox所在的td点击后调用
 *     vm._changeAll 行checkbox状态改变改变全选checkbox状态
 *     vm._oneClick 行checkbox所在tr或td被点击时调用
 * </pre>
 */
var app = angular.module('AceApp');
app.directive("listMnt", function ($q, $uibModal, $stateParams, HttpService, BroadcastService, PromptService) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
            , switchCollapse: '&'
            , ok: '&'
            , cancel: '&'
        }
        , templateUrl: 'cmp/listMnt/listMnt-tpl.html'
        , controller: function ($scope, $q, $uibModal, HttpService, BroadcastService, $rootScope, PromptService,$interval) {
            console.log(">>>listMntController scope=", $scope);
            var vm = $scope;
            /**
             * 初始化未定义的控件参数
             * @private
             */
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
                } else if (!vm.param.listUrl) {
                    PromptService.errorPrompt("控件参数param.listUrl未定义");
                    return;
                }
                //控件必须在初始化时调用BroadcastService.initMessages()以进行消息映射：绑定消息发送和接收事件，接收消息在config.messages中定义。message的id应由配置工具自动生成，然后由配对的sender和receiver使用，最好使用guid，以防止被其他控件误用
                BroadcastService.initMessages(vm);

                //配置文件里面param.grid的indexColumn属性，配置headName、style两个属性，用来显示列表控件前面的序号
                //默认false不显示序号列，默认conf为序号，宽为10%
                vm.indexColumnConf = {headName: "序号", style: "width:10%"};
                vm.showIndexColumn = false;
                if (vm.param.grid && vm.param.grid.indexColumn) {
                    // 如果配置了grid.indexColumn属性，那么页面就显示序号列
                    vm.showIndexColumn = true;
                    //如果配置了名字和样式，就把配置文件的值赋到indexColumnConf上
                    if (vm.param.grid.indexColumn["headName"]) {
                        vm.indexColumnConf.headName = vm.param.grid.indexColumn["headName"];
                    }
                    if (vm.param.grid.indexColumn["style"]) {
                        vm.indexColumnConf.style = vm.param.grid.indexColumn["style"];
                    }
                }
                //使用对象保存搜索数据和参数，以避免由于scope的原因导致在模板中无法获取
                vm._filter = {};
                vm._filter.selectAll = false;
                //注意不能直接在vm上定义checked,否则会导致全选框的ng-model重新定义一个checked属性,从而导致此处定义的checked并没有绑定到checkbox上
                vm._checked = {};
                vm._selected = {};
                //初始化搜索结果数据
                vm._filter.result = vm.data;
                //初始化搜索字段
                vm._filter.fields = vm.param.filterFields ? vm.param.filterFields : [];
                if (vm._filter.fields.length == 0) {
                    //将所有grid中定义的字段均用于匹配
                    vm.param.grid.columns.forEach(function (row) {
                        vm._filter.fields.push(row.data.name);
                    })
                }
                //初始化搜索框
                vm._filter.text = "";
                vm._parent = null;
                //增删改后是否通知父控件，默认为false
                vm._notifyParent = vm.param.notifyParent || false;
                //从$stateParams中获取动态参数（主要用于通过不同的参数打开同一个界面，如在菜单中直接打开日志管理与在任务管理中点击查询日志打开日志管理）
                if ($stateParams && $stateParams.customParam) {
                    vm._stateParams = $stateParams.customParam;
                }
                vm._focused = null;
                vm._mappedParentsFields = {};
                //是否显示控件，主要用于具有parent控件的情况。注意：在template中，不要在最外层div上使用_showWidget，因为如果replace为ture，则div及其参数（包括_showWidget）均会被替换掉，_showWidget将不起作用
                vm._showWidget = vm._parent || !vm.param.needParent;
                vm._listdata = [];
                //vm._checked.rows = node[selected];
                //初始化搜索条
                if (!vm.param.grid) {
                    PromptService.errorPrompt("控件参数param.grid未定义");
                    return;
                }
                vm.getDatepickerTime = function (selector) {//获取日期拾取器input值
                    var element = $(selector)[0];
                    if (element) {
                        return $(selector)[0].getElementsByTagName('input')[0].value.replace(new RegExp("/", "gm"), '-');
                    }
                };
                /**
                 * 处理控件中下载按钮
                 * @param
                 * @private
                 */
                vm._download = function () {
                    var _url, _prepareUrl;
                    var time1 = vm.getDatepickerTime("[selector=startDate]");
                    var time2 = vm.getDatepickerTime("[selector=endDate]");
                    if (time1 == null || time1.trim() == "" || time2 == null || time2.trim() == "") {
                        PromptService.messagePrompt("警告！！！", "下载审计日志必须要指明开始/结束日期!!!")
                    } else {
                        _url = $rootScope.defaultServiceUrl + "/" + vm._picker.url.replace('time1', time1).replace('time2', time2);
                        if (vm._picker.prepareUrl) {
                            _prepareUrl = $rootScope.defaultServiceUrl + "/" + vm._picker.prepareUrl.replace('time1', time1).replace('time2', time2);
                        }
                        //暂时通过$stateParams传递额外的动态参数（这些参数不能在静态url中提供，而是执行时产生的，如日志查询本身是静态参数，在任务中查询日志会添加taskId等动态参数）

                        var urlVars = angular.extend({}, vm._focused, vm._mappedParentsFields);
                        if (urlVars) {
                            for (var varName in urlVars) {
                                _url = _url.replace(":" + varName, urlVars[varName]);
                                if (vm._picker.prepareUrl) {
                                    _prepareUrl = _prepareUrl.replace(":" + varName, urlVars[varName]);
                                }
                            }
                        }
                        if (vm._searchBar) {
                            var paramName = vm._searchBar.properties[0].name;
                            var queryData = vm._searchBar.data[paramName];
                            if (queryData != null && queryData.trim() != "") {
                                if (_url.indexOf("?") > 0) {
                                    _url += "&" + paramName + "=" + queryData;
                                    if (vm._picker.prepareUrl) {
                                        _prepareUrl += "&" + paramName + "=" + queryData;
                                    }
                                } else {
                                    _url += "?" + paramName + "=" + queryData;
                                    if (vm._picker.prepareUrl) {
                                        _prepareUrl += "?" + paramName + "=" + queryData;
                                    }
                                }
                            }
                        }
                        if (vm._picker.prepareUrl) {
                            HttpService.get({
                                url: _prepareUrl
                            }).then(function (data) {
                                if (data.actualCount > data.maxDownloadCount) {
                                    PromptService.confirmPrompt({
                                        message: "查询到审计日志条数: " + data.actualCount + " 实际将要下载前 " + data.maxDownloadCount + " 条",
                                        callback: function () {
                                            window.open(_url, "_blank");
                                        }
                                    });
                                }
                                window.open(_url, "_blank");
                            }, function (data) {
                                PromptService.errorPrompt("无法下载审计日志：" + data);
                            });
                        } else {
                            window.open(_url, "_blank");
                        }
                    }
                };

                /**
                 * 初始化分页条 ：在template里面配置参数pagination设置pageSize每页显示的列表的条数
                 * @param pagination 当前控件的参数
                 * @private
                 */
                vm._showPageBar = false; //初始化分页条为不显示

                if (vm.param.pagination) {
                    //分页条配置
                    vm._pageConfig = {
                        pageIndex: 1, //默认显示页号
                        pageSize: vm.param.pagination.pageSize, //默认页大小
                        total: 0, //总共记录条数
                        isInit: 0, //初始化
                        onChange: pageChange//点击事件
                    };

                    function pageChange() {
                        vm._onRefresh();
                        console.log('pageChange')
                    }

                    console.log(vm._pageConfig);
                }
                if (vm._showWidget)
                    vm._searchPrepare();
                //如果autoLoadData==true，则加载列表数据。autoLoadData默认值为true
                if ((vm.param.autoLoadData === undefined) || vm.param.autoLoadData)
                    vm._onRefresh();
                getResource(HttpService,vm);
            };//初始化函数结束
            /**
             * 对搜索框进行过滤
             * @private
             */
            vm._toFilter = function () {
                // vm._filter.text="gao";
                if (vm._filter.fields) {
                    //当搜索串不为空时，使用搜索字段对数据进行过滤
                    if (vm._filter.text) {
                        vm._filter.result = vm._listdata.filter(function (row) {
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
                        vm._filter.result = vm._listdata;
                }
                if (vm.param.checkbox) {
                    vm._changeAll();
                }

            };
            /**给表格标记不同的样式：在template里面配置precondition
             * @param precondition
             * @param row 当前行
             * @private
             */
            vm._getConditionResult = function (precondition, row) {
                var isTrue;
                if (precondition.logicType == "or") {
                    for (var i = 0; i < precondition.conditions.length; i++) {
                        var condition = precondition.conditions[i];
                        if (condition.precondition) {
                            vm._getConditionResult(condition.precondition, row);
                        }
                        isTrue = eval(row[condition.name] + condition.operator + condition.value);
                        if (isTrue) { // 只要有一个条件满足，就返回结果
                            return condition.result;
                        }
                    }
                } else if (precondition.logicType == "and") {
                    for (var i = 0; i < precondition.conditions.length; i++) {
                        var condition = precondition.conditions[i];
                        if (condition.precondition) {
                            vm._getConditionResult(condition.precondition, row);
                        }
                        isTrue = eval(row[condition.name] + condition.operator + condition.value);
                        if (!isTrue) { // 只要有一个条件不满足，就退出函数
                            return;
                        }
                    }
                    if (isTrue) { // 如果每个条件都满足，才返回结果
                        return precondition.result;
                    }
                } else {
                    console.log('vm._getConditionResult,配置了错误的logicType，只能是：and/or');
                }
            };
            /**
             * 定义按钮的类型 ：template里面点击vm._todo（）函数传入buttonConfig, row两个参数内容，通过switch循环根据buttonConfig.type的类型判断需要调用的函数
             * @param buttonConfig 当前按钮的配置参数
             * @param node  行数据
             * @private
             */
            vm._todo = function (buttonConfig, node) {
                buttonConfig.idfield = buttonConfig.idfield || vm.param.idfield;
                buttonConfig.pidfield = buttonConfig.pidfield || vm.param.pidfield;
                node = node || null;
                switch (buttonConfig.type) {
                    case "add":
                        vm._toAdd(buttonConfig);
                        break;
                    case "modify":
                        vm._toModify(buttonConfig, node);
                        break;
                    case "delete":
                        vm._delete(buttonConfig, node);
                        break;
                    case "postOneRefresh":
                        vm._postOne(buttonConfig, node, true);
                        break
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
                    case "download":
                        vm._listDownload(buttonConfig,node)
                        break;
                    case "batch":
                        vm._batch(buttonConfig,node)
                        break;
                    default:
                        PromptService.errorPrompt("不支持的按钮类型：" + buttonConfig.type);
                }
            };
            /*
            * 接受searcbar发起的事件与数据
            * */
            vm.$on('toSearch',function (event,data) {
                console.log(">>>toSearchList",data);
                vm._searchBar=data;
                vm._search(vm._searchBar)
            });
            vm.$on("toDownload",function (event,data) {
                vm._picker=data;
                vm._download()
            });
            //监听同步任务复制成功消息，执行list刷新
            vm.$on("copyTaskSuccess",function (event,data) {
                vm._list();
            })
            /**
             * 搜索条数据准备
             * @private
             */
            vm._searchPrepare = function () {
                var defer = $q.defer();
                console.log(">>>listMnt._searchPrepare() enter");
                //搜索准备数据仅加载一次
                if (vm._searchBar && !vm._searchBar.preparedata) {
                    if (vm._searchBar.prepareUrl) {
                        HttpService.get({
                                url: vm._searchBar.prepareUrl
                            }
                            , angular.extend({}, vm._mappedParentsFields)
                        ).then(function (result) {
                            console.log("listMnt._searchPrepare() success, data=", result);
                            vm._searchBar.preparedata = result;
                            defer.resolve();
                        });
                    } else {
                        console.info("param.searchBar.prepareUrl 未定义");
                        defer.resolve();
                    }
                } else
                    defer.resolve();
                console.log("<<<listMnt._searchPrepare() exit");
                return defer.promise;
            };
            vm._search = function (data) {
                if (vm._pageConfig) {
                    vm._pageConfig.pageIndex = 1;
                    $("#searchBtn").attr("disabled","true");//搜索时禁用按钮
                    $('#userMntLoading').css({//搜索时增加蒙层
                        "display":"block",
                        "z-index":"19891010"
                    });
                    vm._list();
                }else if(data.prepareUrl){
                    vm._list();
                }
            };
            /**
             * 添加按钮准备
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @private
             */
            vm._addPrepare = function (buttonConfig,guid) {
                var defer = $q.defer();
                console.log(">>>listMnt.addPrepare() enter");
                if (buttonConfig.prepareUrl) {
                    var _buttonConfigPrepareUrl=buttonConfig.prepareUrl
                    if(guid){
                        console.log(guid)
                        _buttonConfigPrepareUrl=_buttonConfigPrepareUrl+guid
                    }
                    HttpService.get({
                            url: _buttonConfigPrepareUrl
                        }
                        , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    ).then(function (result) {
                        console.log("listMnt.addPrepare() success, data=", result);
                        // vm.prepareData = data;
                        defer.resolve(result)
                    });
                } else {
                    console.log("button 中 prepareUrl 未定义");
                    defer.resolve();
                }
                console.log("<<<listMnt.addPrepare() exit");
                return defer.promise;
            };
            /**
             * 修改按钮准备
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @param row 修改数据行的参数
             * @private
             */
            vm._modifyPrepare = function (buttonConfig, row) {
                var defer = $q.defer();
                console.log(">>>listMnt.modifyPrepare() enter");
                if (buttonConfig.prepareUrl) {
                    HttpService.get({
                            url: buttonConfig.prepareUrl.replace(":id", row[vm.param.idfield])
                        }
                        , angular.extend({}, row, vm._mappedParentsFields)
                    ).then(function (result) {
                        console.log("listMnt.modifyPrepare() success, data=", result);
                        // vm.prepareData = data;
                        defer.resolve(result)
                    });
                } else {
                    console.log("button 中 prepareUrl 未定义");
                    defer.resolve();
                }
                console.log("<<<listMnt.modifyPrepare() exit");
                return defer.promise;
            };
            /**
             * 修改
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @param row 修改数据行的参数
             * @private
             */
            vm._toModify = function (buttonConfig, row) {
                console.log(">>>listMnt.toModify enter");
                if (buttonConfig.templateUrl) {
                    vm._load(buttonConfig, row).then(function (loaddata) {
                        vm._modifyPrepare(buttonConfig, row).then(function (preparedata) {
                            var modalInstance = $uibModal.open({
                                backdrop: "static"
                                , templateUrl: buttonConfig.templateUrl
                                , controller: function ($scope, $uibModalInstance) {
                                    $scope.preparedata = preparedata || {};
                                    //如果preparedata中设置了defaults，那么将defaults作为newdata的默认值，这样就可以使用在loaddata中不存在的属性
                                    $scope.newdata = typeof $scope.preparedata.defaults === "object" ? angular.copy($scope.preparedata.defaults) : {};
                                    //然后将loaddata复制到newdata中，如果loaddata与defaults中存在重复属性，可保证使用的是loaddata中的数据
                                    $scope.newdata = angular.extend($scope.newdata, loaddata);
                                    if (buttonConfig.hasSonModal) {
                                        $scope.newdata.hasSonModal = true;
                                    }
                                    $scope.ok = function () {
                                        vm._modify(buttonConfig, $scope.newdata).then(function (result) {
                                            $uibModalInstance.close();
                                            vm._onNodeModified();
                                            vm._onRefresh();
                                        })
                                        // TODO 临时办法，不应该在通用组件中写入死数据
                                        if($scope.newdata.confirmLoginPwd || $scope.newdata.confirmSignPwd || $scope.newdata.newLoginPwd || $scope.newdata.newSignPwd ){
                                            $scope.newdata.confirmLoginPwd='';
                                            $scope.newdata.confirmSignPwd='';
                                            $scope.newdata.newLoginPwd='';
                                            $scope.newdata.newSignPwd='';
                                        }
                                    };
                                    $scope.cancel = function () {
                                        $uibModalInstance.dismiss();
                                    };
                                    //验证用户输入格式是否合法
                                    $scope.validateregxdata = vm._validateregxData;
                                    $scope.validateregx = vm._validateregx;
                                    $scope.forbidcode = vm._forbidCode;
                                }
                            })
                        })
                    });
                } else {
                    vm._modify(buttonConfig, row).then(function (result) {
                        vm._onNodeModified();
                        vm._onRefresh();
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

                console.log(">>>listMnt.toModify exit");
            };
            /**
             * 新建
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @private
             */
            vm._toAdd = function (buttonConfig,paramGuid) {
                console.log(">>>listMnt.toAdd()");
                var addModel = (buttonConfig.model || "create").toLowerCase();
                if (!(addModel === "create" || addModel === "select")) {
                    PromptService.errorPrompt("button.model参数值[" + buttonConfig.model + "]错误：只能为create或select");
                    return;
                }
                vm._addPrepare(buttonConfig,paramGuid).then(function (preparedata) {
                    console.log(">>>listMnt.toAdd() to open modal");
                    var modalInstance = $uibModal.open({
                        backdrop: "static"
                        , templateUrl: buttonConfig.templateUrl
                        , controller: function ($scope, $uibModalInstance) {
                            vm.toPrepare=function (data) {
                                console.log(9595)
                                $scope.preparedata=data

                            };
                            vm._toPrepare=function(data){
                                console.log(9696)
                                console.log(data)
                              $scope.preparedata.projects=data.projects

                            };

                            if (addModel === "create") {
                                $scope.preparedata = preparedata || {};
                                //如果preparedata存在，并且设置了defaults，那么将defaults作为newdata的默认值
                                $scope.newdata = (preparedata && preparedata.defaults) || {};
                                $scope.ok = function (userSelectordata) {
                                    if (buttonConfig.hasSonModal && userSelectordata) {
                                        $scope.newdata = {
                                            "hasSonModal": true,
                                            "agentGuids": [userSelectordata.guid]
                                        };
                                    }
                                    vm._add(buttonConfig, $scope.newdata).then(function (result) {
                                        if(buttonConfig.hasOwnProperty("closeAndOpen")){
                                            vm._toAdd(buttonConfig.closeAndOpen,result.guid)
                                        }
                                        $uibModalInstance.close();
                                        vm._onNodeModified();
                                        vm._onRefresh();
                                    })
                                };
                            } else if (addModel === "select") {
                                $scope.data = preparedata;
                                $scope.mappedfields = vm._mappedParentsFields;
                                $scope.parentdata = null;
                                $scope.searchprepareurl = buttonConfig.searchPrepareUrl;
                                $scope.dataprepareurl = buttonConfig.loadPrepareUrl;
                                $scope.dataurl = buttonConfig.loadUrl;
                                var ids = [];
                                $scope.ok = function (selected) {
                                    //从选中数据中取出id组成数组
                                    selected.forEach(function (item) {
                                        ids.push(item[buttonConfig.idfield || vm.param.idfield]);
                                    });
                                    console.log("ids=", ids);
                                    vm._add(buttonConfig, ids).then(function (result) {
                                        $uibModalInstance.close();
                                        vm._onNodeModified();
                                        vm._onRefresh();
                                    })
                                };
                            }
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss();
                            };

                            //验证用户输入格式是否合法
                            $scope.validateregxdata = vm._validateregxData;
                            $scope.validateregx = vm._validateregx;
                            $scope.forbidcode = vm._forbidCode;
                            $scope.mappedfields = vm._mappedParentsFields;
                        }
                    })
                });
                // modalInstance.opened.then(function () {//模态窗口打开之后执行的函数
                //     console.log('modal is opened');
                // });
                // modalInstance.result.then(function (result) {
                //     console.log(result);
                // }, function (reason) {
                //     console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会输出cancel
                // });
                console.log(">>>listMnt.toAdd()");
            };
            /**
             * 刷新list列表控件
             * 添加refreshInterval参数后执行自动刷新
             * @private
             */
            vm._list = function (event) {
                if(event){//折叠的组件未展开时，不执行刷新
                    if(vm.param._collapsed){//判断需要展开的组件是否展开，不展开则不执行_list()函数
                        return
                    }
                }
                var defer = $q.defer();
                vm.param.refreshInterval=time;
                console.log(">>>listMnt.list() enter");
                if(event){//刷新时禁用按钮
                    $(event.target).attr("disabled","true")
                }
                if (vm._showWidget) {
                    vm._searchPrepare();
                    var url = vm.param.listUrl;
                    //暂时通过$stateParams传递额外的动态参数（这些参数不能在静态url中提供，而是执行时产生的，如日志查询本身是静态参数，在任务中查询日志会添加taskId等动态参数）
                    if (vm.param.stateCustomParams && vm._stateParams)
                        vm.param.stateCustomParams.forEach(function (name) {
                            url = url.replace(":" + name, vm._stateParams[name] || "");
                        });
                    if (vm.param.stateCustomParams && !vm._stateParams) {
                        url = url.split("?")[0];
                    }
                    var requestParams = {};
                    if (vm._searchBar && vm._searchBar.properties) {
                        // var conditions = "";
                        vm._searchBar.properties.forEach(function (config) {
                            requestParams[config.name] = vm._searchBar.data[config.name] || config.defaultValue;
                        });
                        // url = url + (url.indexOf("?") < 0 ? "?" : "") + conditions;
                    }
                    if (vm.param.pagination) {
                        requestParams.pageIndex = vm._pageConfig.pageIndex;
                        requestParams.pageSize = vm._pageConfig.pageSize;
                    }
                    //
                    if (vm._searchBar && vm._searchBar._dateBox) {
                        requestParams.startTime = vm.getDatepickerTime("[selector=startDate]");
                        requestParams.endTime = vm.getDatepickerTime("[selector=endDate]");
                    }
                    HttpService.get({
                            url: url
                            , params: requestParams
                        }
                        , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    ).then(function (data) {
                        if (vm.param.pagination && data !== null && data !== undefined) {
                            vm._pageConfig.total = data.totalElements || 0;
                            vm._listdata = data.content;
                            //当总数大于每页行数时才显示分页条
                            if (vm._pageConfig.total <= vm._pageConfig.pageSize) {
                                vm._showPageBar = false;
                            } else {
                                vm._showPageBar = true;
                            }
                        } else {
                            vm._listdata = data ? data : [];
                        }
                        if(event){//刷新后取消禁用
                            $(event.target).removeAttr("disabled")
                        }
                        vm._filter.text = "";
                        vm._toFilter();
                        $('#userMntLoading').css({
                            "display":"none",
                            "z-index":"-1"
                        });
                        console.log("<<<listMnt.list() success: ", data);
                        defer.resolve();
                    });
                } else {
                    defer.resolve();
                }
                //在展开list的最后都要判断是否需要进行展开，如果配置了默认不展开那么久不显示
                if (vm.param.defaultHidden) {
                    vm.ishidden = true;
                }
                console.log("<<<listMnt.list() exit");
                return defer.promise;
            };
            vm._onRefresh = function () {
                console.log(">>>listMnt._onRefresh()");
                vm._list().then(function () {
                    var currentNode = null;
                    //支持刷新后恢复选中节点
                    //TODO treeMnt需要multiSelect为false
                    if (vm._focused) {
                        vm._filter.result.forEach(function (node) {//forEach无法跳出循环，every可以
                            if (vm._focused[vm.param.idfield] === node[vm.param.idfield]) {
                                // node.__current = true;
                                // node.selected = true;
                                // vm._treeModel.select(node);
                                currentNode = node;
                            }
                        })
                    }
                    // if (currentNode)
                    vm._onNodeClicked(currentNode);
                });
                console.log("<<<listMnt._onRefresh() exit");
            };
            var time=vm.param.refreshInterval;
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
            vm._add = function (buttonConfig, data) {
                var defer = $q.defer();
                if (buttonConfig.encriptPwd != undefined) {
                    encriptPwd(data);
                }
                var relUrl = buttonConfig.executeUrl,
                    relData = data;
                // 对添加代理人的特殊处理。。。。TODO 通用控件坚决不能使用，必须改正
                if (data.hasSonModal) {
                    relUrl = relUrl.replace(':beginTime', $('#beginTime input').val()).replace(':endTime', $('#endTime input').val());
                    relData = relData.agentGuids;
                }

                console.log(">>>listMnt.add() enter");
                HttpService.post({
                        url: relUrl
                        , data: relData
                    }
                    , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("simpleObjectAdd.add() success, data=", result);
                    defer.resolve(result)
                });
                console.log("<<<listMnt.add() exit");
                return defer.promise;
            };
            /**
             * 帮助list列表控件
             * @private
             */
            vm._help = function(help){
                var modalInstance = $uibModal.open({
                    backdrop: "static"
                    , templateUrl:"cmp/simpleObjectMnt/simpleObjectTips-tpl.html"
                    , controller: function ($scope, $uibModalInstance) {
                        $scope.preparedata = help
                        $scope.ok = function () {
                            $uibModalInstance.close();
                        };
                    }
                })

            }
            /**
             * 删除
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @param row 选中删除行的参数
             * @private
             */
            vm._delete = function (buttonConfig, row) {
                console.log(">>>listMnt.del() enter");
                    HttpService.post({
                            //适应三种情况：
                            //1、通过id删除实体，后端可以忽略data中传递的id
                            //2、通过parentId和id删除关联关系，在url中传递id，data被忽略
                            //3、通过parentId和id删除关联关系，然后在data中传递id进行删除（与批量删除统一接口）
                            url: buttonConfig.executeUrl.replace(":id", row[vm.param.idfield])
                            , data: [row[vm.param.idfield]]//注意：不能使用_focused，因为按钮事件比行选中事件先执行
                        }

                        , angular.extend({}, row, vm._mappedParentsFields)
                        , buttonConfig.confirm
                        , buttonConfig.success
                    ).then(function (data) {
                        console.log("listMnt.del() success");
                        //重新获取数据,刷新列表。存在问题:list()会在success关闭之前执行,除非使用设置config.success.callback的方式
                        vm._focused = null;
                        vm._onNodeModified();
                        vm._onRefresh();
                    });
                console.log("<<<listMnt.delete() exit");
            };
            vm._listDownload = function (buttonConfig, row) {
                console.log(">>>listMnt.del() enter");
                console.log(buttonConfig)
                console.log(row)
                if(buttonConfig && row){
                    var applicationGuid=[]
                    applicationGuid.push(row.guid)
                    HttpService.post({
                            url: buttonConfig.executeUrl
                            , data: applicationGuid
                        }
                        , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    ).then(function (result) {
                        window.open( $rootScope.lmsServiceUrl+result,"_blank");
                    });
                }

            };
            vm._batch=function(buttonConfig, row){
                if(buttonConfig.model.toLowerCase()=="delay"){
                    var selectIds=[]
                    vm._filter.result.forEach(function (item) {
                        if(item.selected && item.selected==true){
                            selectIds.push(item[buttonConfig.idfield || vm.param.idfield]);
                        }
                    });
                    if(selectIds.length==0){
                        PromptService.errorPrompt("请选择需要延期的许可证");
                        return
                    }
                    var modalInstance = $uibModal.open({
                        backdrop: "static"
                        , templateUrl: buttonConfig.templateUrl
                        , controller: function ($scope, $uibModalInstance) {
                                $scope.ok = function (selected) {
                                    vm._tobatch(buttonConfig, row).then(function (result) {
                                        $uibModalInstance.close();
                                        vm._onNodeModified();
                                        vm._onRefresh();
                                    })
                                };
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss();
                            };
                        }
                    });
                }else if(buttonConfig.model.toLowerCase()=="delete"){
                    var selectIds=[]
                    vm._filter.result.forEach(function (item) {
                        if(item.selected && item.selected ==true){
                            selectIds.push(item[buttonConfig.idfield || vm.param.idfield]);
                        }
                    });
                    if(selectIds.length==0){
                        PromptService.errorPrompt("请选择需要删除的内容");
                        return
                    }
                    console.log(selectIds)
                    HttpService.post({
                            url: buttonConfig.executeUrl
                            , data: selectIds//
                        }
                        , angular.extend({}, row, vm._mappedParentsFields)
                        , buttonConfig.confirm
                        , buttonConfig.success
                    ).then(function (result) {
                        vm._focused = null;
                        vm._onNodeModified();
                        vm._onRefresh();
                    });
                }else if(buttonConfig.model.toLowerCase()=="download"){
                    var selectIds=[]
                    vm._filter.result.forEach(function (item) {
                        if(item.selected && item.selected ==true){
                            selectIds.push(item[buttonConfig.idfield || vm.param.idfield]);
                        }
                    });
                    if(selectIds.length==0){
                        PromptService.errorPrompt("请选择需要下载的许可证");
                        return
                    }
                    HttpService.post({
                            url: buttonConfig.executeUrl
                            , data: selectIds//
                        }
                        , angular.extend({}, row, vm._mappedParentsFields)
                        , buttonConfig.confirm
                        , buttonConfig.success
                    ).then(function (result) {
                        window.open(buttonConfig.serviceUrl+result,"_blank");
                        vm._focused = null;
                        vm._onNodeModified();
                        vm._onRefresh();
                    });
                }

            };
            vm._tobatch=function(buttonConfig,row){
                var defer = $q.defer();
                var databox={}
                var selectIds=[]
                vm._filter.result.forEach(function (item) {
                    if(item.selected && item.selected==true){
                        selectIds.push(item[buttonConfig.idfield || vm.param.idfield]);
                    }
                });
                console.log(selectIds)
                var expireDate=$('#expireDate input').val().replace(/-/g,".");
                databox.guid=selectIds;
                databox.expireDate=expireDate
                HttpService.post({
                        url: buttonConfig.executeUrl
                        , data: databox
                    }
                    , angular.extend({}, row, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (data) {
                    vm._onNodeModified();
                    vm._onRefresh();
                    defer.resolve(data)
                });
                return defer.promise;
            }
            /**
             * 加载
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @param row  修改加载行的数据
             * @private
             */
            vm._load = function (buttonConfig, row) {
                var defer = $q.defer();
                console.log(">>>listMnt.load() enter");
                if (!buttonConfig.loadUrl) {
                    PromptService.errorPrompt("按钮参数loadUrl未定义");
                } else if (row) {
                    HttpService.get({
                            url: buttonConfig.loadUrl.replace(":id", row[vm.param.idfield])
                        }
                        , angular.extend({}, row, vm._mappedParentsFields)
                    ).then(function (result) {
                        //对修改应用实例做特殊处理  TODO返回了无效的数据
                        if(result.applyDate && result.createDate && result.expireDate){
                            delete result.applyDate;
                            delete result.createDate;
                            delete result.expireDate;
                        }
                        // return data;
                        vm._newData = result;
                        console.log("listMnt.load() success, data=", result);
                        defer.resolve(result)
                    });
                }
                console.log("<<<listMnt.load() exit");
                return defer.promise;
            };
            vm._add = function (buttonConfig, data) {
                var defer = $q.defer();
                if (buttonConfig.encriptPwd != undefined) {
                    encriptPwd(data);
                }
                var relUrl = buttonConfig.executeUrl,
                    relData = data;
                // 对添加代理人的特殊处理。。。。TODO 通用控件坚决不能使用，必须改正
                if (data.hasSonModal) {
                    relUrl = relUrl.replace(':beginTime', $('#beginTime input').val()).replace(':endTime', $('#endTime input').val());
                    relData = relData.agentGuids;
                }
                if(buttonConfig.isDownload){
                    relUrl = relUrl
                    data.expireDate=$('#expireDate input').val().replace(/-/g,".");
                    data.guid=[data.guid]
                    relData = data
                }
                console.log(">>>listMnt.add() enter");
                HttpService.post({
                        url: relUrl
                        , data: relData
                    }
                    , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("simpleObjectAdd.add() success, data=", result);
                    defer.resolve(result)
                });
                console.log("<<<listMnt.add() exit");
                return defer.promise;
            };
            /**
             * 对单行执行post操作
             * @param buttonConfig 按钮配置
             * @param row 行数据
             * @param needRefresh 执行后是否刷新控件
             * @returns
             */
            vm._postOne = function (buttonConfig, row, needRefresh) {
                var defer = $q.defer();
                console.log(">>>listMnt._postOne() enter:", row);
                if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                    return;
                }
                HttpService.post({
                        url: buttonConfig.executeUrl.replace(":id", row[buttonConfig.idfield])
                        , data: [row[buttonConfig.idfield]]
                    }
                    , angular.extend({}, row, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("listMnt._postOne() success, data=", result);
                    vm._onNodeModified();
                    if (needRefresh) {
                        vm._onRefresh();
                    }
                    defer.resolve(result)
                });
                console.log("<<<listMnt._postOne() exit");
                return defer.promise;
            };
            /**
             * 对选中行执行post操作
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @param row 需要保存数据行的参数
             * @private
             */
            vm._postMulti = function (buttonConfig, needRefresh) {
                var defer = $q.defer();
                if (!buttonConfig.executeUrl) {
                    PromptService.errorPrompt("按钮参数executeUrl未定义");
                    return;
                }
                var ids = [];
                vm._filter.result.forEach(function (row) {
                    if (row.selected == true)
                        ids.push(row[vm.param.idfield]);
                });

                HttpService.post({
                        url: buttonConfig.executeUrl.replace(":parentId", vm._parent)
                        , data: ids
                    }
                    , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("listMnt._postMulti() success, data=", result);
                    vm._onNodeModified();
                    if (needRefresh) {
                        vm._onRefresh();
                    }
                    defer.resolve(result)
                });
                console.log("<<<listMnt._postMulti() exit");
                return defer.promise;
            };

            // vm._upload = function (buttonConfig, file) {//尚未测试，暂时保留
            //     var defer = $q.defer();
            //     console.log(">>>listMnt._upload() enter");
            //     HttpService.upload({
            //             url: buttonConfig.executeUrl
            //         }
            //         , file
            //         , angular.extend({}, vm._focused, vm._mappedParentsFields)
            //         , buttonConfig.confirm
            //         , buttonConfig.success
            //     ).then(function (result) {
            //         console.log("simpleObjectAdd._upload() success, data=", result);
            //         defer.resolve(result)
            //     });
            //     console.log("<<<listMnt._upload() exit");
            //     return defer.promise;
            // };
            /**
             * 修改
             * @param buttonConfig 当前按钮的配置参数，配置信息
             * @param row  修改行的数据
             * @private
             */
            vm._modify = function (buttonConfig, row) {
                var defer = $q.defer();
                if (buttonConfig.encriptPwd != undefined) {
                    encriptPwd(row);
                }
                var relUrl = buttonConfig.executeUrl;
                // 对添加代理人的特殊处理。。。。TODO 通用控件坚决不能使用，必须改正
                $('#submitBtn').attr("disabled","true");
                $('#loading').css({
                    "display":"block",
                    "z-index":"19891010"
                });
                if (row.hasSonModal) {
                    relUrl = relUrl.replace(':beginTime', $('#beginTime input').val()).replace(':endTime', $('#endTime input').val());
                }

                //对审批许可证做特殊处理
                if(buttonConfig.approval){
                   relUrl=buttonConfig.executeUrl
                    for(var i in row){
                        if(i !== "sign" && i !== "guid" && i !== "auditOpinion" && i !== "licenseRequestGuid" ){
                            delete row[i]
                        }
                    }
                }
                if(buttonConfig.isDownload){
                    console.log($scope)
                    console.log(row)
                    if(typeof row.guid=="string"){
                        row.guid=[row.guid]
                    }
                    relUrl = relUrl
                    row.expireDate=$('#expireDate input').val().replace(/-/g,".");

                }
                //对修改客户做特殊处理，去掉时间
                if(buttonConfig.isModifyCustomer){
                    if(row.creatDate){
                        delete row.creatDate
                    }
                }
                HttpService.post({
                        url: relUrl.replace(":id", row[vm.param.idfield])
                        , data: row
                    }
                    , angular.extend({}, row, vm._mappedParentsFields)
                    , buttonConfig.confirm
                    , buttonConfig.success
                ).then(function (result) {
                    console.log("simpleObjectAdd.modify() success, data=", result);
                    console.log(row)
                    defer.resolve(result)
                });
                console.log("<<<listMnt.add() exit");
                return defer.promise;
            };
            //专用于messageButtons
            vm._sendMessage = function (messageId, data) {
                console.log(">>>listMnt._sendMessage() enter");
                BroadcastService.emitMessage(messageId, data, vm);
                console.log("<<<listMnt._sendMessage() exit");
            };
            vm._onNodeClicked = function (row) {
                console.log(">>>listMnt._onNodeClicked() enter");
                // if (!vm._focused || vm._focused[vm.param.idfield] !== row[vm.param.idfield]) {
                vm._focused = row;
                // vm._mappedParentsFields[vm.param.idfield] = vm._focused[vm.param.idfield];
                vm._onNodeFocusChanged(row);
                // }
                console.log("<<<listMnt._onNodeClicked() exit");
            };
            vm._onNodeFocusChanged = function (row) {
                console.log(">>>listMnt._onNodeFocusChanged() enter");
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
                console.log("<<<listMnt._onNodeFocusChanged() exit");
            };
            //通知接收者节点有改变
            vm._onNodeModified = function () {
                console.log(">>>listMnt._onNodeModified enter:");
                if (vm._notifyParent)
                    BroadcastService.emitMessage("nodeModified", null, vm);
                console.log(">>>listMnt._onNodeModified exit");
            };
            //验证用户输入格式是否合法
            vm._validateregxData = {'default': false};
            vm._validateregx = function (name, regx, value) {
                var validateregx = new RegExp(regx);
                if (validateregx.test(value)) {
                    vm._validateregxData[name] = false;
                } else {
                    vm._validateregxData[name] = true;
                }
                vm._validateregxData['default'] = true;
            };
            // 输入telephone、mobilephone、postcode只能输数字和-
            vm._forbidCode = function (name) {
                if (name == 'telephone' || name == 'mobilephone' || name == 'postcode' || name == 'sortNo') {
                    if (!(event.keyCode == 46) && !(event.keyCode == 8) && !(event.keyCode == 37) && !(event.keyCode == 39) && !(event.keyCode == 189) && !(event.keyCode == 109) || (event.keyCode == 32))
                        if (!((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)))
                            event.returnValue = false;
                }
            };

            /**
             * 定义所有的消息接收事件
             * @param event  接收消息的事件
             * @param parent
             * @private
             */
            vm._handleMessage_parentChanged = function (event, parent) {
                console.log(">>>listMnt.handleMessage_parentChanged enter: event=", event, " parent=", parent);
                vm._parent = parent;
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
                console.log("<<<listMnt._handleMessage_parentChanged exit");
            };
            vm._handleMessage_dataModified = function (event) {
                console.log(">>>listMnt._handleMessage_dataModified enter:", event);
                vm._onRefresh();
                console.log("<<<listMnt._handleMessage_dataModified exit");
            };

            /**
             * 多选框
             * @param item
             * @param row
             * @private
             */
            //全选checkbox状态改变时改变checkbox状态
            vm._changeOnes = function (selectAll) {
                //如果有数据才进行改变
                if (vm._filter.result && vm._filter.result.length > 0) {
                    vm._filter.result.forEach(function (item) {
                        item.selected = selectAll;

                    })
                }
            };
            //全选chekbox所在的td点击后调用
            vm._allClick = function (selectAll) {
                // vm.selectAll = !vm.selectAll;
                vm._changeOnes(selectAll);

            };
            //行checkbox状态改变改变全选checkbox状态
            vm._changeAll = function () {

                var selected = true;
                if (vm._filter.result && vm._filter.result.length > 0) {
                    vm._filter.result.forEach(function (item) {
                        selected = selected && item.selected;
                    });
                }
                //如果没有数据，则全选checkbox不选中
                else {
                    selected = false;
                }
                vm._filter.selectAll = selected;
            };
            //行checkbox所在tr或td被点击时调用
            vm._oneClick = function (item) {
                //item.selected = ! item.selected;
                vm._changeAll();
            };
            vm._init();
            console.log("<<<listMntController exit");
        }
    }
})
;