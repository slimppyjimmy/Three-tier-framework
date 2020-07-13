/**
 * @description
 * <pre>
 *     <h2>somp简单对象维护弹出框控件配置</h2>
 *     title 标题
 *     properties 字段数组，包含在控件中显示的所有字段，每个字段将显示为单独的一行，不包含在数组中的字段将不会显示，但其值仍会返回（即不显示的字段不允许修改）每个字段可包含以下配置：
 *     name 名称，与模型对象的属性名对应
 *     type 显示类型，支持：input、password、radio、textarea、list、tree、date
 *     defaultValue 默认值，当模型对象中对应的字段未定义时，将使用此值作对模型对象的对应字段进行初始化，模型对象中对应的字段已定义时无效；可选项
 *     label 字段行左侧的显示名称；必选项
 *     placeholder 字段行右侧的值的提示信息；可选项
 *     maxlength 最大长度；可选项
 *     nullable 是否可空；可选项，未定义时默认为true
 *     readonly 是否只读，为true时字段不能进行修改，未定义时为false；可选项
 *     precondition 前置条件对象，对象包括name、value属性，即当模型数据中name的值对应的字段的值为value的值时才显示此字段；可选项
 *     data 辅助数据源名称，仅对list、tree有效，控件将使用此名称从preparedata中获得一个数组，对于list，数组的每一个元素对应一个选项（即select的一个option），对于tree，数组的每一个元素对应一个节点；可选项，当type为list、tree时为必选项
 *     dataMap 辅助数据源映射数组，仅对list、tree有效，对于list，数组中每个元素的idfield与选项的value对应、textfield与选项的text对应，对于tree，数组中每个元素的idfield、textfiled、pidfield分别与节点的idfield、textfiled、pidfield对应；可选项，当type为list、tree时为必选项
 *     autoSelectRowNo 自动选择的行号，仅对list有效（目的时为了解决创建时模型数据的字段未定义而data中的数据不固定无法确定defaultValue的问题），当模型对象中对应的字段未定义且defaultValue未定义时，将使用此值作对模型数据的对应字段进行初始化，小于0或大于data的长度时将设置为0；可选项
 *     root 根节点，仅对tree有效，如果定义，将在data中附加子数据从而增加一个根节点；可选项
 * {newdata} 模型数据，其值作为字段的页面元素的初始值，以及控件最终的返回值
 * {preparedata} 辅助数据，模型数据之外的其他数据，主要针对list、tree
 * {ok} 点击确定按钮的执行函数
 * {cancel} 点击取消或关闭按的钮执行函数
 * </pre>
 */
var app = angular.module('AceApp');
app.directive("simpleComplexModifyPop", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            param: '='
            , preparedata: '='
            , validateregxdata: '='
            , ok: '&'
            , listmntok: '='
            , cancel: "&"
            , validateregx: "&"
            , forbidcode: "&"
            , todo: "="
            , newdata: "="
            , id:"="
            , mappedfields:"="
        }
        , templateUrl: 'cmp/simpleObjectMnt/simpleComplexModifyPop-tpl.html'
        , controller: function ($scope, $q, $uibModal, HttpService) {
            console.log(">>>simpleObjectModifyPop enter:scope=", $scope);
            var vm = $scope;
            vm.precondition=function(param,paramnext){
                // console.log(param)
                // console.log(paramnext)
                // console.log()
                if(paramnext!== undefined){
                    if($scope.newdata[param.precondition.name]!=param.precondition.value){
                        return true
                    }
                }

                // for(var i in param){
                //     if(param[i].hasOwnProperty('precondition')){
                //         // console.log(param[i])
                //         if()
                //         // console.log(param[i].precondition.name)
                //         // console.log(param[i].precondition.value)
                //     }
                // }
            }

            vm.userSelectordata = {};
            //如果属性类型为tree而且定义了root，则将root添加到prepare数据中
            vm.param.properties.forEach(function (property) {
                if (property.type === "tree" && property.root) {
                    vm.preparedata[property.data].forEach(function (node) {
                        //如果pidfield属性未定义则将其设置为root定义的值，以避免无法与root形成
                        if (node[property.dataMap.pidfield] == undefined) {
                            node[property.dataMap.pidfield] = property.root.idfield;
                        }
                    })
                    var treeRoot = {};
                    treeRoot[property.dataMap.idfield] = property.root.idfield;
                    treeRoot[property.dataMap.textfield] = property.root.textfield;
                    treeRoot[property.dataMap.pidfield] = null;
                    vm.preparedata[property.data].push(treeRoot);
                }
            });
            //以下代码暂时无用
            vm._addPrepare = function (buttonConfig) {
                var defer = $q.defer();
                console.log(">>>simpleObjectModifyPop.addPrepare() enter");
                if (buttonConfig.prepareUrl) {
                    HttpService.get({
                            url: buttonConfig.prepareUrl
                        }
                        , angular.extend({}, vm._focused, vm._mappedParentsFields)
                    ).then(function (result) {
                        console.log("simpleObjectModifyPop.addPrepare() success, data=", result);
                        // vm.prepareData = data;
                        defer.resolve(result)
                    });
                } else {
                    console.log("button 中 prepareUrl 未定义");
                    defer.resolve();
                }
                console.log("<<<simpleObjectModifyPop.addPrepare() exit");
                return defer.promise;
            };
            vm._toAdd = function (buttonConfig) {
                console.log(">>>simpleObjectModifyPop.toAdd()");
                var addModel = (buttonConfig.model || "create").toLowerCase();
                if (!(addModel === "create" || addModel === "select"))
                    console.error("button.model参数值[", buttonConfig.model, "]错误：只能为create或select");
                vm._addPrepare(buttonConfig).then(function (preparedata) {
                    console.log(">>>simpleObjectModifyPop.toAdd() to open modal");
                    var modalInstance = $uibModal.open({
                        backdrop: "static"
                        , templateUrl: buttonConfig.templateUrl
                        , controller: function ($scope, $uibModalInstance) {
                            if (addModel === "create") {
                                $scope.preparedata = preparedata || {};
                                //如果preparedata中设置了defaults，那么将defaults作为newdata的默认值
                                $scope.newdata = preparedata.defaults || {};
                                $scope.ok = function () {
                                    vm._add(buttonConfig, $scope.newdata).then(function (result) {
                                        $uibModalInstance.close();
                                        vm._onNodeModified();
                                        vm._list();
                                    })
                                };
                            } else if (addModel === "select") {
                                $scope.data = preparedata;
                                // $scope.mappedfields = vm._mappedParentsFields;
                                $scope.parentdata = null;
                                $scope.searchprepareurl = buttonConfig.searchPrepareUrl;
                                $scope.dataprepareurl = buttonConfig.loadPrepareUrl;
                                $scope.dataurl = buttonConfig.loadUrl;
                                var ids = [];
                                $scope.ok = function (selected) {
                                    //从选中数据中取出id组成数组
                                    selected.forEach(function (item) {
                                        ids.push(item[vm.param.idfield]);
                                        vm.userSelectordata = item;
                                    });
                                    $uibModalInstance.close();
                                };
                            }
                            $scope.cancel = function () {
                                $uibModalInstance.dismiss();
                            };
                            $scope.mappedfields = vm.mappedfields;

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
                console.log(">>>simpleObjectModifyPop.toAdd()");
            };
            vm._download=function(executeUrl){
                window.open(executeUrl,"_blank");

            }
            vm.fastCopy=function(id){
                var url2=document.getElementById(id)
                url2.select();
                document.execCommand("copy");
            };
            console.log("<<<simpleObjectModifyPop return");
        }
    }
});