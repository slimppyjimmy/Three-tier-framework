/**
 * Created by wanggb on 2016/7/6.
 */
angular.module("AceApp")
    .controller("simpleObjectMntController", SimpleObjectMntController);

SimpleObjectMntController.$inject = ["$scope", '$q', '$stateParams', 'HttpService', 'BroadcastService', '$uibModal'];

function SimpleObjectMntController($scope, $q, $stateParams, HttpService, BroadcastService, $uibModal) {
    console.log(">>>simpleObjectMntController scope=", $scope);
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
        //绑定消息发送和接收事件，接收消息在config.messages中定义。
        //message的id应由配置工具自动生成，然后由配对的sender和receiver使用，最好使用uuid，以防止被其他控件误用
        BroadcastService.initMessages(vm);

        vm._parent = null;
        //增删改后是否通知父控件，默认为false
        vm._notifyParent = vm.param.notifyParent || false;
        //从$stateParams中获取动态参数（主要用于通过不同的参数打开同一个界面，如在菜单中直接打开日志管理与在任务管理中点击查询日志打开日志管理）
        if ($stateParams && $stateParams.params) {
            //由于params是通过url传递进来的,只能是字符串,因此必须要转换为对象
            //TODO 为什么$stateParams传过来的是单引号?
            vm._stateParams = angular.fromJson($stateParams.params.replace(/\'/g, "\""));
            // if (vm._stateParams.parentId) {
            //     vm._parent = {};
            //     vm._parent.id = vm._stateParams.parentId;
            // }
        }
        vm._mappedParentsFields = {};
        //是否显示控件，主要用于具有parent控件的情况。注意：在template中，不要在最外层div上使用_showWidget，因为如果replace为ture，则div及其参数（包括_showWidget）均会被替换掉，_showWidget将不起作用
        vm._showWidget = vm._parent || !vm.param.needParent;
        //不能设置为null，否则在模板中使用ng-init对属性使用defaultValue进行初始化时，会导致表单字段只能获取defaultValue而无法获取到属性值
        vm._data = {};

        vm._refresh();
    };

    //验证用户输入格式是否合法
    vm._validateregxData={'default':false};
    vm._validateregx=function (name, regx, value) {
        var validateregx=new RegExp(regx);
        if (validateregx.test(value)) {
            vm._validateregxData[name]=false;
        } else {
            vm._validateregxData[name]=true;
        }
        vm._validateregxData['default']=true;
    };
    // 输入telephone、mobilephone、postcode只能输数字和-
    vm._forbidCode=function(name){
        if (name=='telephone' || name=='mobilephone' || name=='postcode'|| name=='sortNo') {
            if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39)&&!(event.keyCode==189)&&!(event.keyCode==109)||(event.keyCode==32))
                if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)))
                    event.returnValue=false;
        }
    };


    vm._todo = function (buttonConfig, row) {
        console.log("_todo:", buttonConfig, row);
        row = row || null;
        switch (buttonConfig.type) {
            case "load":
                vm._load(buttonConfig.loadUrl);
                break;
            case "add":
                vm._toAdd(buttonConfig);
                break;
            case "modify":
                vm._toModify(buttonConfig, row);
                break;
            case "delete":
                vm._delete(buttonConfig, row);
                break;
            case "save":
                vm._modify(buttonConfig, row);
                break;
            case "message":
                vm._sendMessage(buttonConfig.messageId, row);
                break;
            default:
                console.error("不支持的按钮类型[", buttonConfig.type, "]，请使用：load、modify、message");
        }
    };
    vm._modifyPrepare = function (buttonConfig, row) {
        var defer = $q.defer();
        console.log(">>>simpleObjectMnt.modifyPrepare() enter");
        if (buttonConfig.prepareUrl) {
            HttpService.get({
                    url: buttonConfig.prepareUrl.replace(":id", vm._data[vm.param.idfield])
                }
                , angular.extend({}, row, vm._mappedParentsFields)
            ).then(function (result) {
                console.log("simpleObjectMnt.modifyPrepare() success, data=", result);
                // vm.prepareData = data;
                defer.resolve(result)
            });
        }
        else {
            console.log("param.serviceUrls.modifyPrepare 未定义");
            defer.resolve(null);
        }
        console.log("<<<simpleObjectMnt.modifyPrepare() exit");
        return defer.promise;
    };
    vm._toModify = function (buttonConfig) {
        console.log(">>>simpleObjectMnt.toModify enter:buttonConfig=", buttonConfig);
        vm._load(buttonConfig.loadUrl).then(function (loaddata) {
            vm._modifyPrepare(buttonConfig).then(function (preparedata) {
                var modalInstance = $uibModal.open({
                    backdrop: "static"
                    , templateUrl: buttonConfig.templateUrl
                    , controller: function ($scope, $uibModalInstance) {
                        $scope.preparedata = preparedata || {};
                        //如果preparedata中设置了defaults，那么将defaults作为newdata的默认值，这样就可以使用在loaddata中不存在的属性
                        $scope.newdata = typeof $scope.preparedata.defaults === "object" ? angular.copy($scope.preparedata.defaults) : {};
                        //然后将loaddata复制到newdata中，如果loaddata与defaults中存在重复属性，可保证使用的是loaddata中的数据
                        $scope.newdata = angular.extend($scope.newdata, loaddata);
                        console.log("_data:", vm._data, ", newdata:", $scope.newdata);
                        $scope.ok = function () {
                            vm._modify(buttonConfig, $scope.newdata).then(function (result) {
                                $uibModalInstance.close();
                                vm._onNodeModified();
                                vm._refresh();
                            });
                            if($scope.newdata){ //TODO 临时写法，提交后，清空输入框密码
                                $scope.newdata.confirmLoginPwd='';
                                $scope.newdata.confirmSignPwd='';
                                $scope.newdata.newLoginPwd='';
                                $scope.newdata.newSignPwd='';
                                $scope.newdata.oldLoginPwd='';
                                $scope.newdata.oldSignPwd='';
                            }
                        };
                        $scope.cancel = function () {
                            $uibModalInstance.dismiss();
                        };


                        //验证用户输入格式是否合法
                        $scope.validateregxdata=vm._validateregxData;
                        $scope.validateregx=vm._validateregx;
                        $scope.forbidcode=vm._forbidCode;

                    }
                })
            });
        });
        // modalInstance.opened.then(function () {//模态窗口打开之后执行的函数
        //     console.log('modal is opened');
        // });
        // modalInstance.result.then(function (result) {
        //     console.log(result);
        // }, function (reason) {
        //     console.log(reason);//点击空白区域，总会输出backdrop click，点击取消，则会输出cancel
        // });
        console.log(">>>simpleObjectMnt.toModify exit");
    };
    vm._refresh = function () {
        console.log(">>>simpleObjectMnt._refresh() enter");
        vm._load(vm.param.loadUrl).then(function (data) {
            vm._data = data;
        });
        console.log("<<<simpleObjectMnt._refresh() exit");
    }
    vm._load = function (loadUrl) {
        var defer = $q.defer();
        console.log(">>>simpleObjectMnt._load() enter");
        HttpService.get({
                url: loadUrl
            }
            , angular.extend({}, vm._data, vm._mappedParentsFields)
        ).then(function (result) {
            console.log("simpleObjectMnt._load() success, result=", result);
            defer.resolve(result)
        });
        console.log("<<<simpleObjectMnt._load() exit");
        return defer.promise;
    };
    vm._modify = function (buttonConfig, data) {
        var defer = $q.defer();
        if (buttonConfig.encriptPwd != undefined) {
            encriptPwd(data);
        }
        console.log(">>>simpleObjectMnt.modify() enter");
        HttpService.post({
                url: buttonConfig.executeUrl
                , data: data
            }
            , angular.extend({}, data, vm._mappedParentsFields)
            , buttonConfig.confirm
            , buttonConfig.success
        ).then(function (result) {
            console.log("simpleObjectMnt.modify() success, data=", result);
            defer.resolve(result)
        });
        console.log("<<<simpleObjectMnt.add() exit");
        return defer.promise;
    };

    //专用于messageButtons
    vm._sendMessage = function (messageId, data) {
        console.log(">>>simpleObjectMnt._sendMessage() enter");
        BroadcastService.emitMessage(messageId, data, vm);
        console.log("<<<simpleObjectMnt._sendMessage() exit");
    };
    //通知接收者节点有改变
    vm._onNodeModified = function () {
        console.log(">>>simpleObjectMnt._onNodeModified enter:");
        if (vm._notifyParent)
            BroadcastService.emitMessage("nodeModified", null, vm);
        console.log(">>>simpleObjectMnt._onNodeModified exit");
    };
    //定义所有的消息接收事件
    vm._handleMessage_parentChanged = function (event, parent) {
        console.log(">>>simpleObjectMnt.handleMessage_parentChanged enter: event=", event, " parent=", parent);
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
        vm._refresh();
        console.log("<<<simpleObjectMnt._handleMessage_parentChanged exit");
    };
    vm._handleMessage_dataModified = function (event) {
        console.log(">>>simpleObjectMnt._handleMessage_dataModified enter:", event);
        vm._refresh();
        console.log("<<<simpleObjectMnt._handleMessage_dataModified exit");
    };

    vm._init();
    console.log("<<<simpleObjectMntController exit");
};

