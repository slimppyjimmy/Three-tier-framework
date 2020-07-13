var app = angular.module('AceApp');
app.directive("listSelectorMnt", function () {
    return {
        restrict: 'AE'
        , replace: false
        , scope: {
            param: '='
            , parentdata: '='
            , mappedfields: '='
            , searchprepareurl: '='
            , dataprepareurl: '='
            , dataurl: '='
            , ok: '&'
            , cancel: '&'
        }
        , templateUrl: 'cmp/listSelectorMnt/listSelectorMnt-tpl.html'
        , controller: function ($scope, $q, HttpService) {
            console.log(">>>listSelectorMnt enter scope=", $scope);

            var vm = $scope;

            vm._init = function () {
                if (!vm.param) {
                    console.error("实例参数param未定义");
                    return;
                }
                vm._listdata = {};
                //使用对象保存搜索数据和参数，以避免由于scope的原因导致在模板中无法获取
                vm._filter = {};
                //初始化搜索结果数据
                vm._filter.result = vm._listdata;
                //初始化搜索字段
                vm._filter.fields = vm.param.filterFields ? vm.param.filterFields : [];
                if (vm._filter.fields.length == 0) {
                    vm.param.grid.columns.forEach(function (row) {
                        vm._filter.fields.push(row.data.name);
                    })
                }
                //初始化搜索框
                vm._filter.text = "";

                //注意不能直接在vm上定义checked,否则会导致全选框的ng-model重新定义一个checked属性,从而导致此处定义的checked并没有绑定到checkbox上
                vm._checked = {};

                vm._mappedParentsFields = angular.extend({}, vm.mappedfields);
                if (vm.param.parentWidgetDataMap && vm.parentdata) {
                    vm.param.parentWidgetDataMap.forEach(function (entry) {
                        if (vm.parentdata[entry.parentField])
                            vm._mappedParentsFields[entry.currentField] = vm.parentdata[entry.parentField];
                    })
                }

                //初始化搜索条
                vm._showSearchBar = false;
                if (vm.param.searchBar) {
                    vm._searchBar = angular.extend({}, vm.param.searchBar);
                    vm._searchBar.enterToSearch = vm._searchBar.enterToSearch === undefined ? true: vm._searchBar.enterToSearch;
                    vm._searchBar.properties = vm._searchBar.properties || [];
                    vm._searchBar.preparedata = null;
                    vm._searchBar.data = {};
                }
                else
                    vm._searchBar = null;

                if (!vm.param.grid)
                    console.error("param.grid参数未定义");

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
                        vm._list();
                        console.log('pageChange')
                    }

                    console.log(vm._pageConfig);
                }
                vm._searchPrepare();
                //如果autoLoadData==true，则加载列表数据。autoLoadData默认值为true
                if ((vm.param.autoLoadData === undefined) || vm.param.autoLoadData)
                    vm._list();
            };
            vm._toFilter = function () {
                if (vm._filter.fields) {
                    //当搜索串不为空时，使用搜索字段对数据进行过滤
                    if (vm._filter.text) {
                        vm._filter.result = vm._listdata.filter(function (row) {
                            return vm._filter.fields.some(function (field) {
                                if (row[field] === undefined) {
                                    console.error("数据中不存在过滤字段：", field);
                                    return false;
                                }
                                else
                                //如果字段不是字符串类型，则不进行搜索
                                    return typeof row[field] !== "string" ? false : row[field].toLowerCase().indexOf(vm._filter.text.toLowerCase()) >= 0;
                            })
                        });
                    }
                    //当搜索串为空时，恢复使用原始数据
                    else
                        vm._filter.result = vm._listdata;
                }
            };
            vm._searchPrepare = function () {
                var defer = $q.defer();
                console.log(">>>listSelectorMnt._searchPrepare() enter");
                //搜索准备数据仅加载一次
                if (vm._searchBar && !vm._searchBar.preparedata) {
                    if (vm.searchprepareurl) {
                        HttpService.get({
                                url: vm.searchprepareurl
                            }
                            , angular.extend({}, vm._mappedParentsFields)
                        ).then(function (result) {
                            console.log("listSelectorMnt._searchPrepare() success, data=", result);
                            vm._searchBar.preparedata = result;
                            vm._showSearchBar = true;
                            defer.resolve();
                        });
                    }
                    else {
                        vm._showSearchBar = true;
                        defer.resolve();
                    }
                }
                else
                    defer.resolve();
                console.log("<<<listSelectorMnt._searchPrepare() exit");
                return defer.promise;
            };
            vm._search = function () {
                if (vm._pageConfig) {
                    vm._pageConfig.pageIndex = 1;
                    vm._list();
                }
            };
            vm._searchBarKeyPressed = function (e) {
                var keycode = window.event ? e.keyCode : e.which;
                if (vm._searchBar.enterToSearch && keycode == 13) {
                    vm._search();
                }
            };
            vm._list = function () {
                console.log(">>>listSelectorMntBuz.list()");

                // vm._griddata = {};
                vm._searchPrepare();
                var url = vm.dataurl;
                if (vm.mappedfields) {
                    for (var key in vm.mappedfields) {
                        url.replace(':'+key, vm.mappedfields[key]);
                    }
                }
                //暂时通过$stateParams传递额外的动态参数（这些参数不能在静态url中提供，而是执行时产生的，如日志查询本身是静态参数，在任务中查询日志会添加taskId等动态参数）
                if (vm.param.stateParamNames)
                    vm.param.stateParamNames.forEach(function (name) {
                        url = url.replace(":" + name, vm._stateParams[name] || "");
                    });
                var requestParams = {};
                if (vm._searchBar && vm._searchBar.properties) {
                    // var conditions = "";
                    vm._searchBar.properties.forEach(function (config) {
                        requestParams[config.name] = vm._searchBar.data[config.name];
                    });
                    // url = url + (url.indexOf("?") < 0 ? "?" : "") + conditions;
                }
                if (vm.param.pagination) {
                    requestParams.pageIndex = vm._pageConfig.pageIndex;
                    requestParams.pageSize = vm._pageConfig.pageSize;
                }
                HttpService.get({
                        url: url
                        , params: requestParams
                    }
                    , angular.extend({}, vm._focused, vm._mappedParentsFields)
                ).then(function (data) {
                    if (vm.param.pagination) {
                        vm._pageConfig.total = data.totalElements || 0;
                        vm._listdata = data.content;
                        //当总数大于每页行数时才显示分页条
                        if (vm._pageConfig.total <= vm._pageConfig.pageSize) {
                            vm._showPageBar = false;
                        } else {
                            vm._showPageBar = true;
                        }
                    }
                    else
                        vm._listdata = data;
                    vm._resetCheckedData();
                    vm._filter.text = "";
                    vm._toFilter();
                    console.log("<<<listSelectorMntBuz.list() success: ", data);
                });
                console.log("<<<listSelectorMntBuz.list()");
            };
            vm._ok = function () {
                if (vm.ok) {
                    var selected = [];
                    vm._checked.rows.forEach(function (item, index) {
                        if (item)
                            selected.push(vm._filter.result[index]);
                    });
                    //必须使用这种方式才能向&方法传递参数,如果使用vm.onselectchanged(item),那么在parent中无法获得传递过去的item
                    vm.ok()(selected);
                }
            };
            vm._resetCheckedData = function () {
                if (vm._listdata) {
                    vm._checked.all = false;
                    vm._checked.rows = new Array(vm._listdata.length);
                    //将所有checkbox与全选框的状态保持一致
                    for (var i = 0; i < vm._listdata.length; i++)
                        vm._checked.rows[i] = vm._checked.all;
                }
            }
            //全选checkbox状态改变时调用
            vm._changeOnes = function () {
                for (var i = 0; i < vm._checked.rows.length; i++)
                    vm._checked.rows[i] = vm._checked.all;
            };
            //全选chekbox所在的td点击后调用
            vm._allClick = function () {
                vm._checked.all = !vm._checked.all;
                vm._changeOnes();
            };
            //行checkbox状态改变时调用
            vm._changeAll = function () {
                var checked = true;
                vm._checked.rows.forEach(function (item) {
                    checked = checked && item;
                });
                vm._checked.all = checked;
            };
            //行checkbox所在tr或td被点击时调用
            vm._oneClick = function (index) {
                vm._checked.rows[index] = !vm._checked.rows[index];
                vm._changeAll();
            };
            //行被双击时调用
            vm._dblClick = function (item) {
                vm._ok(item);
            };

            //行checkbox所在tr或td被点击时调用(单选)
            vm.prevChecked= null;
            vm._checkedOne = function (index) {
                if (!(vm.prevChecked === null)) vm._checked.rows[vm.prevChecked] = false;
                vm._checked.rows[index] = true;
                vm._changeAll();
                vm.prevChecked=index;
            };
            vm._onRefresh = function () {
                console.log(">>>listSelectorMntBuz._onrefresh()");
                vm.list();
                //TODO 是否需要考虑设置为原selectedItem（如果原selectedItem已经不在data中,则设置为null）
                vm._onNodeSelected(null);
                console.log("<<<listSelectorMntBuz._onrefresh()");
            };

            vm._onSelectChanged = function (node) {
                console.log(">>>listSelectorMntBuz._onSelectChanged()");
                BroadcastService.emitMessage("nodeChanged", node, vm);
                console.log("<<<listSelectorMntBuz._onSelectChanged()");
            };
            vm._onNodeSelected = function (node) {
                console.log(">>>listSelectorMntBuz._onNodeSelected()");
                console.log("item=", node);
                console.log("<<<listSelectorMntBuz._onNodeSelected()");
            };

            vm._init();
            console.log("<<<listSelectorMnt");
        }
    }
})
;