var app = angular.module('AceApp');
app.directive("listSelector", function () {
    return {
        restrict: 'AE'
        , replace: false
        , scope: {
            param: '='
            , data: '='
            , ok: '&'
            , cancel: '&'
        }
        , templateUrl: 'cmp/listSelector/listSelector-tpl.html'
        , controller: function ($scope) {
            console.log(">>>listSelector enter scope=", $scope);

            var vm = $scope;

            vm._init = function () {
                if (!vm.param) {
                    console.error("实例参数param未定义");
                    return;
                }
                if (!vm.data)
                    console.error("参数data未定义");

                //使用对象保存搜索数据和参数，以避免由于scope的原因导致在模板中无法获取
                vm._filter = {};
                //初始化搜索结果数据
                vm._filter.result = vm.data;
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
                vm._checked.all = false;
                vm._checked.rows = new Array(vm.data.length);
                //将所有checkbox与全选框的状态保持一致
                for (var i = 0; i < vm.data.length; i++)
                    vm._checked.rows[i] = vm._checked.all;
            };
            vm._toFilter = function () {
                if (vm._filter.fields) {
                    //当搜索串不为空时，使用搜索字段对数据进行过滤
                    if (vm._filter.text) {
                        vm._filter.result = vm.data.filter(function (row) {
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
                        vm._filter.result = vm.data;
                }
            };
            vm._ok = function () {
                if (vm.ok) {
                    var selected = [];
                    vm._checked.rows.forEach(function (item, index) {
                        if (item)
                            selected.push(vm._filter.result[index]);
                    })
                    //必须使用这种方式才能向&方法传递参数,如果使用vm.onselectchanged(item),那么在parent中无法获得传递过去的item
                    vm.ok()(selected);
                }
            };
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
            }
            //行被双击时调用
            vm._dblClick = function (item) {
                vm._ok(item);
            };

            vm._init();
            console.log("<<<listSelector");
        }
    }
})
;