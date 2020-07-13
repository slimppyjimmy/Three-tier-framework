var app = angular.module('AceApp');
app.directive("simpleSelect", function ($q, $uibModal, $stateParams, HttpService, BroadcastService) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
        }
        , templateUrl: 'cmp/simpleSelect/simpleSelect-tpl.html'
        , controller: function ($scope, $q, $uibModal, HttpService, BroadcastService) {
            console.log(">>>simpleSelectController scope=", $scope);
            var vm = $scope;

            vm._init = function () {
                if (!vm.config) {
                    console.error("配置参数config未定义");
                    return;
                }
                if (!vm.param) {
                    console.error("实例参数param未定义");
                    return;
                }
                //控件必须在初始化时调用BroadcastService.initMessages()以进行消息映射
                BroadcastService.initMessages(vm);
                vm.idfield = vm.param.dataMap.idfield;
                vm.textfield = vm.param.dataMap.textfield;
                vm._listdata = [];
                vm._autoSelectFirstRow = vm.param.autoSelectFirstRow === undefined ? true : vm.param.autoSelectFirstRow;
                vm._parent = null;
                vm._mappedParentsFields = {};
                vm._showWidget = vm._parent || !vm.param.needParent;
                vm.selectctrlid = vm.uuid()
                vm._list();
            };


            vm.uuid = function () {
                var s = [];
                var hexDigits = "0123456789ABCDEF";
                for (var i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";

                var uuid = s.join("");
                return uuid;
            }
            vm._list = function (event) {
                if(event){//刷新过程中禁用按钮
                    $(event.target).attr("disabled","true")
                }
                var defer = $q.defer();
                console.log(">>>simpleSelect.list() enter");
                if (!vm.param.url) {
                    console.error("控件参数url未定义");
                    defer.resolve();
                }
                else {
                    if (vm._parent || !vm.param.needParent) {
                        HttpService.get({
                                url: vm.param.url
                            }
                            , angular.extend({}, vm._focused, vm._mappedParentsFields)
                        ).then(function (data) {
                                vm._listdata = data;
                                // vm._onNodeFocusChanged(null);//TODO 暂时设置为不选中
                                if (data && data.length > 0 && vm._autoSelectFirstRow) {

                                    // var selectGuid = selectCtrl.value;
                                    // if (selectGuid != vm.selectedId) {
                                    //     vm.selectedId = selectGuid;
                                    // }
                                    var selectorStr = "[choosenId="+vm.selectctrlid+"]";
                                    var selectCtrl = $(selectorStr)[0];
                                    var selectedValue = undefined;
                                    if(selectCtrl.value!=undefined){
                                        selectedValue = selectCtrl.value;
                                    }
                                    $(selectorStr).find("option").remove();
                                    for(var i=0;i<vm._listdata.length;i++){
                                        var item = vm._listdata[i];
                                        var option = new Option(item[vm.textfield],item[vm.idfield]);
                                        if(option.value == selectedValue){
                                            option.selected = true;
                                        }
                                        selectCtrl.options.add(option);
                                    }
                                    selectCtrl.onchange=function(e){
                                        vm._onNodeFocusChanged(selectCtrl.value);
                                    }
                                    if(selectCtrl.value!=null){
                                        vm._onNodeFocusChanged(selectCtrl.value);
                                    }else{
                                        // 默认加载第一条数据
                                        vm._onNodeFocusChanged(vm._listdata[0][vm.idfield]);
                                    }
                                }
                                if(event){//刷新请求后取消禁用
                                    $(event.target).removeAttr("disabled")
                                }
                                console.log("<<<simpleSelect.list() success: ", data);
                                defer.resolve();
                            }
                        );
                    }
                    else {
                        defer.resolve();
                    }
                }
                console.log("<<<simpleSelect.list() exit");
                return defer.promise;
            }
            ;
// vm._onSelectChanged = function () {
//     console.log(">>>simpleSelect.onSelected()");
//     BroadcastService.emitMessage("nodeChanged", vm._focused, vm);
//     console.log("<<<simpleSelect.onSelected()");
// };

            vm._findRowData = function (guid) {
                for (var i = 0; i < vm._listdata.length; i++) {
                    var row = vm._listdata[i];
                    if (guid == row[vm.param.dataMap.idfield]) {
                        return row;
                    }
                }
                return undefined;
            }

            vm._onNodeFocusChanged = function (guid) {
                var row = vm._findRowData(guid);
                console.log(">>>simpleSelect._onNodeFocusChanged() enter: row=", row);
                var fullData = null;
                if (row) {
                    fullData = {};
                    //data传递当前选中节点数据。注意：不能使用node=row，因为row中可能存在parent字段，将会与node.parent冲突
                    fullData.data = row;
                    //parent传递父控件的选中节点数据
                    fullData.parent = vm._parent;
                    fullData.mappedParentsFields = vm._mappedParentsFields;
                }
                BroadcastService.emitMessage("nodeChanged", fullData, vm);
                console.log("<<<simpleSelect._onNodeFocusChanged() exit");
            };
            vm._handleMessage_parentChanged = function (event, parent) {
                console.log("_handleMessage_parentChanged enter: event=", event, " parent=", parent);
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
                vm._list();
                console.log("_mappedParentsFields", vm._mappedParentsFields);
            };
//绑定消息发送和接收事件，接收消息在config.messages中定义。
//message的id应由配置工具自动生成，然后由配对的sender和receiver使用，最好使用uuid，以防止被其他控件误用
            vm._init();
            console.log("<<<simpleSelectController exit");
        }
    }
})
;