var app = angular.module('AceApp');
app.directive("treeSelectorMnt", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
              param: '='
            , mappedfileds: '='
            , parentdata: '='
            , mappedfields: '='
            , ok: '&'
            , cancel: '&'
        }
        , templateUrl: 'cmp/treeSelectorMnt/treeSelectorMnt-tpl.html'
        , controller: function ($scope, $q, $uibModal, $timeout, HttpService, BroadcastService, PromptService) {
            console.log(">>>treeSelectorMnt scope=", $scope);

            var vm = $scope;

            vm._init = function () {
                if (!vm.param) {
                    console.error("实例参数param未定义");
                    return;
                }
                vm._data = [];
                //由于向tree传递的provider（_data）并没有实现双向绑定，因此只能从wid（_treeModel）中获取实际的选中状态
                vm._treeModel = {};
                vm._multiselect = vm.param.multiselect || false;
                vm._listtype = vm.param.listtype || null;
                vm._cascade = vm.param.cascade || false;
                vm._focused = null;
                vm._parent = null;
                vm._mappedParentsFields = vm.mappedfields || {};

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

                vm._list();
            };

            vm._toFilter = function () {
                if (vm._filter.fields) {
                    //当搜索串不为空时，使用搜索字段对数据进行过滤
                    if (vm._filter.text) {
                        vm._filter.result = vm._data.filter(function (row) {
                            return vm._filter.fields.some(function (field) {
                                if (row[field] === undefined) {
                                    console.error("数据中不存在过滤字段：",field);
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
                        vm._filter.result = vm._data;
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
                        }
                        else if (selectedCount + semiCount > 0) {//至少一个选中或半选
                            node.__parent.__selected = true;
                            node.__parent.__semi = true;
                        }
                        else {//全部未选
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
            vm._list = function () {
                var defer = $q.defer();
                console.log(">>>treeSelectorMnt._list()");
                HttpService.get({
                        url: vm.param.listUrl
                    }
                    , angular.extend({}, vm._focused, vm._mappedParentsFields)
                ).then(function (data) {
                    if (vm.param.root) {
                        var treeRoot = {};
                        treeRoot[vm.param.idfield] = vm.param.root.id;
                        treeRoot[vm.param.textfield] = vm.param.root.name;
                        treeRoot[vm.param.pidfield] = null;
                        data.push(treeRoot);
                    }
                    vm._data = data;
                    vm._data.forEach(function (node) {
                        //如果pidfield属性未定义则将其设置为""（表示一级节点），以避免使用pidfield属性对url参数进行替换时不成功导致请求失败
                        if (node[vm.param.pidfield] == undefined) {
                            node[vm.param.pidfield] = "";
                        }
                        if (node[vm.param.pidfield] === node[vm.param.idfield]) {
                            PromptService.errorPrompt("数据错误，请联系管理员："+vm.param.pidfield+"与"+vm.param.idfield+"相同："+node[vm.param.textfield]+"["+node[vm.param.idfield]+"]");
                        }
                    })
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
                    console.log("tree model nodes:",vm._treeModel.getNodes());
                    console.log("tree model selects:", vm._treeModel.getSelected());
                    console.log("<<<treeSelectorMnt._list() success: ", data);
                });
                console.log("<<<treeSelectorMnt._list() exit");
                return defer.promise;
            }
            vm._checkChildrenAndParentResursive = function (node) {
                vm._checkChildrenRecursive(node);
                vm._checkParentRecursive(node);
            };
            vm._onNodeChecked = function (node) {
                console.log(">>>treeSelectorMnt._onNodeChecked() enter: node=");
                vm._checkChildrenAndParentResursive(node);
                console.log("<<<treeSelectorMnt._onNodeChecked() exit");
            };
            vm._onNodeUnchecked = function (node) {
                console.log(">>>treeSelectorMnt._onNodeUnchecked() enter: node=", node);
                vm._checkChildrenAndParentResursive(node);
                console.log("<<<treeSelectorMnt._onNodeUnchecked() exit");
            };
            vm._onNodeClicked = function (node) {
                console.log(">>>treeSelectorMnt._onNodeClicked() enter: node=", node);
                // if (!vm._focused || !node || (vm._focused && node && vm._focused[vm.param.idfield] !== node[vm.param.idfield])) {
                vm._focused = node;
                // vm._mappedParentsFields[vm.param.idfield] = vm._focused[vm.param.idfield];
                vm._onNodeFocusChanged(node);
                // }
                console.log("<<<treeSelectorMnt._onNodeClicked() exit");
            };

            // tree异步加载
            vm._onloadbranch=function(node, success, fail){
                HttpService.get({
                        url: vm.param.serviceUrls.list
                    }
                    , angular.extend({}, node)
                ).then(function (result) {
                    success(result);
                },function(err){
                    fail(err);
                });
            }
            vm._ok = function () {
                if (vm.ok) {
                    var selected = [];
                    vm._treeModel.getSelected().forEach(function (node, index, array) {
                        if (node)
                            selected.push(node);
                    })
                    //必须使用这种方式才能向&方法传递参数,如果使用vm.onselectchanged(item),那么在parent中无法获得传递过去的item
                    vm.ok()(selected);
                }
            };
            vm._onRefresh = function () {
                console.log(">>>treeSelectorMnt._onRefresh()");
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
                console.log("<<<treeSelectorMnt._onRefresh() exit");
            };
            vm._onNodeFocusChanged = function (row) {
                console.log(">>>treeSelectorMnt._onNodeFocusChanged() enter: row=", row);
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
                console.log("<<<treeSelectorMnt._onNodeFocusChanged() exit");
            };
            vm._init();
            console.log("<<<treeSelectorMntController exit");
        }
    }
});