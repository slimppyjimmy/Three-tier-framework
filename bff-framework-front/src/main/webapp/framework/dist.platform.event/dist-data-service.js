/**
 * Created by wanggb on 2016/7/20.
 */


//采用UMD：兼容AMD、CommonJS模块规范的
~function (root, factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['angular'], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory(require('angular'));
    } else if (root.hasOwnProperty('angular')) {
        factory(root.angular);
    }

}(this, function (angular)
{
    'use strict';
    // In cases where Angular does not get passed or angular is a truthy value
    // but misses .module we can fall back to using window.
    angular = (angular && angular.module ) ? angular : window.angular;

    /**
     * @description DataService服务对应的处理函数
     * @params {null} null，
     * @return
     */
    DataService.$inject = [];

    function DataService() {

        //私有属性共享数据存放根属性
        var Data = {};//参数存放对象
        var bindPropertys = [];  //当前已注册的URL的详细信息；
        var watchPropertys = [];//监听的详细信息
        //私有方法
        /**
         * @description 修改绑定列表信息
         * @params {String}
         * @return null
         */
        function setBindProperty(propertyName, scope) {
            var findProperty = -1;
            for (var i in bindPropertys) {
                if (bindPropertys[i].name == propertyName) {
                    findProperty = i;
                }
            }
            if (-1 != findProperty) {
                bindPropertys[findProperty].bindNumber += 1;
                bindPropertys[findProperty].scope.push(scope);
            } else {
                var propertyName = {"name": propertyName, "bindNumber": 1, "scope": [scope]};
                bindPropertys.push(propertyName);
            }

        }

        /**
         * @description 修改监听列表信息
         * @params {String}
         * @return null
         */
        function setWatchProperty(propertyName, scope) {
            var findProperty = -1;
            for (var i in watchPropertys) {
                if (watchPropertys[i].name == propertyName) {
                    findProperty = i;
                }
            }
            if (-1 != findProperty) {
                watchPropertys[findProperty].watchNumber += 1;
                watchPropertys[findProperty].scope.push(scope);
            } else {
                var propertyName = {"name": propertyName, "watchNumber": 1, "scope": [scope]};
                watchPropertys.push(propertyName);
            }

        }

        /**
         * @description 将当前作用域（$scope）中的某个属性（scopePropertyName）与DataService中的某个属性绑定起来（propertyName），实现数据更新
         * @params {String} propertyName, 需要绑定到DataService中属性的名称，
         * @params {Object} $scope, 目标作用域；
         * @params {String} 需要绑定到目标作用域的某个属性名称；
         * @return this
         */
        function bindScope(propertyName, $scope, scopePropertyName) {
            var $this = this; //保存this指针
            if (null == propertyName || null == $scope || null == scopePropertyName) {     //参数不能为空
                console.log("binding failed! both $scopeValue and object can not be null!");
            } else {
                setBindProperty(propertyName, $scope);//设置参数信息
                $scope[propertyName] = $this.Data; //将propertyName与DataService关联起来
                $scope.$watch(propertyName, function () { //创建监控函数，当DataService中Data数据发生改变时更新作用域数据
                    $scope[scopePropertyName] = $this.Data[propertyName];//将propertyName与ScopePropertyName关联起来
                }, true)
            }
            return $this;
        };


        /**
         * @description 获取DataService中的某个属性（propertyName）的值
         * @params {String} propertyName, 需要绑定到DataService中属性的名称，
         * @return 目标URL对应的值
         */
        function getValue(propertyName) {
            if (null == propertyName) {
                return {"status": "propertyName is invalid!"};
            } else {
                return this.Data[propertyName];
            }
        };


        /**
         * @description 设置DataService中的某个属性（propertyName）的值
         * @params {String} propertyName, 需要绑定到DataService中属性的名称，
         * @params {Object} value, 需要更新DataService中属性的值，
         * @return null
         */
        function setValue(propertyName, value) {
            var $this = this;
            if (null == propertyName) {
                console.log("property name is invalid!");
            } else {
                Data[propertyName] = value;
                console.log(" set value completely!");
            }
            return $this;
        };


        /**
         * @description 设置DataService中的某个属性（propertyName）的值
         * @params {String} propertyName, 需要绑定到DataService中属性的名称，
         * @params {Object} $scope, 当前作用域，
         * @params {function} recallHandle(newValue,oldValue), 回调函数，
         * @return returnData //状态信息
         */
        function registerWatcher(propertyName, $scope, recallHandle) {
            var $this = this; //保存this指针
            if (null == propertyName || null == recallHandle) {     //参数不能为空
                console.log("binding failed! both $scopeValue and object can not be null!");
            } else {
                setWatchProperty(propertyName, $scope);//设置参数信息
                $scope[propertyName] = $this.Data; //将propertyName与DataService关联起来
                $scope.$watch(propertyName, function (newValue, oldValue) {
                    if (oldValue[propertyName] != newValue[propertyName]) {
                        recallHandle(newValue[propertyName], oldValue[propertyName]);//调用回调函数
                    }
                    console.log("binding recallHandler completely")
                }, true)
            }
            return $this;
        };


        /**
         * @description 返回propertyName信息列表
         * @params null，
         * @return bindInfo 所有与作用域绑定的列表信息   watchInfo 所有监听列表信息
         */
        function getPropertyInfo() {
            return {"bindInfo": bindPropertys, "watchInfo": watchPropertys};
        }

        //返回公共方法
        return {
            Data: Data,//数据根对象
            bindScope: bindScope,//绑定到当前作用域
            getValue: getValue,//获取目标标识下对象值
            setValue: setValue,//设置目标标识下对象值
            registerWatcher: registerWatcher,//注册回调函数
            getPropertyInfo: getPropertyInfo,//返回属性列表信息
        };
    };


    /**
     * @description BroadcastService服务对应的处理函数
     * @params {null} null，
     * @return
     */
    BroadcastService.$inject = ["$rootScope"];

    function BroadcastService($rootScope) {
        //private variables
        var _DEFAULT_URL_ = '_DEFAULT_URL_';//默认发送标识；
        var URLInfos = [];//当前已注册的URL的详细信息；


        //转发连接的消息:阻止消息向上传播,然后向下广播
        function forwardMessage(event, data) {
            console.log(">>>forwardMessage(): event=", event, " data=", data);
            //只对emit消息进行处理（emit消息的stopPropagation==null）,因为自己也会收到broadcast消息,如果对broadcast消息也进行处理,就会死循环
            if (event.stopPropagation) {
                //阻止继续冒泡
                event.stopPropagation();
                //向下广播
                event.currentScope.$broadcast(event.name, data);
            }
            console.log("<<<forwardMessage()");
        }

        //处理多个消息连接:凡是连接的消息,均阻止消息向上传播,然后向下广播
        function initMessages(scope) {
            console.log(">>>initMessages() enter");
            if (scope) {
                if (scope.config && scope.config.messages) {
                    scope.config.messages.forEach(function (message) {
                        console.log(">>>initMessages().message", message);
                        if (message.type === "forward") {
                            console.log("forward message on: scope=", scope, " message=", message.id);
                            scope.$on(message.id, forwardMessage);
                            // scope.$on(message.id, function (event, data) {
                            //     // console.log("forwardMessage: scope=", scope, " event=", event, " data=", data);
                            //     //只对emit消息进行处理（emit消息的stopPropagation==null）,因为自己也会收到broadcast消息,如果对broadcast消息也进行处理,就会死循环
                            //     if (event.stopPropagation) {
                            //         //阻止继续冒泡
                            //         event.stopPropagation();
                            //         //向下广播
                            //         // console.log("broadcast: scope=", scope, " event=", event, " data=", data);
                            //         scope.$broadcast(event.name, data);
                            //     }
                            //     console.log("forwardMessage");
                            // });
                        }
                        else if (message.type === "in") {
                            var handler = "_handleMessage_" + message.name;
                            if (scope[handler]) {
                                console.log("in message on: scope=", scope, " message=", message.id, " handler=", scope[handler]);
                                scope.$on(message.id, scope[handler]);
                            }
                            else
                                console.error("消息接收者的config中未定义处理此消息的方法:", handler);
                        }
                    })
                }
            }
            else
                console.error("参数scope未定义");
            console.log("<<<initMessages() return");
        }

        function emitMessage(name, data, scope) {
            console.log(">>>emitMessage():name=", name, ", data=", data, ", scope=", scope);
            scope = scope || $rootScope;
            if (scope.config && scope.config.messages) {
                var messages = scope.config.messages.filter(function (message) {
                    if (message && message.type == "out" && message.name == name)
                        return true;
                });
                //如果在消息配置中找到匹配的的消息，将name转换为id后冒泡
                if (messages.length > 0) {
                    if (messages.length > 1)
                        console.error("消息名[" + name + "]被重复配置,请检查scope.config.messages");
                    else {
                        if (messages[0].id) {
                            console.log("emit message id=" + messages[0].id + " with data=" + data);
                            scope.$emit(messages[0].id, data);
                        }
                        else
                            console.error("消息名[" + name + "]未设置id,请检查scope.config.messages");
                    }
                }
                //如果在消息配置中未找到匹配的的消息，则不进行name和id的转换，直接进行冒泡
                else {
                    scope.$emit(name, data);
                }
            }
            //如果没有消息配置，则不进行name和id的转换，直接进行冒泡
            else {
                scope.$emit(name, data);
            }
            console.log("<<<emitMessage()");
        }

        //private functions
        /**
         * @description 修改URL列表信息
         * @params {String} URL, 广播标识符，
         * @return null
         */
        function setURLInfo(URLName, scope) {
            var findURL = -1;
            for (var i in URLInfos) {
                if (URLInfos[i].URLName == URLName) {
                    findURL = i;
                }
            }
            if (-1 != findURL) {
                URLInfos[findURL].recallFunctionNumber += 1;
                URLInfos[findURL].scope.push(scope);
            } else {
                var URLInfo = {"URLName": URLName, "recallFunctionNumber": 1, "scope": [scope]};
                URLInfos.push(URLInfo);
            }

        }

        //public functions
        /**
         * @description 从上级作用域(parentScope)向其子作用域发送广播
         * @params {String} URL, 广播标识符，
         * @params {Object} Data, 附带参数，
         * @params {Scope} parentScope, 广播发送起始作用域，
         * @return $this //当前服务对象，以供链式调用
         */
        function broadcastData(URL, Data, parentScope) {
            var $this = this;
            if (null == URL) URL = _DEFAULT_URL_;//默认URL
            if (null == parentScope) parentScope = $rootScope;//默认根目录
            parentScope.$broadcast(URL, Data); //发送广播
            return $this;  //链式调用
        }

        /**
         * @description 在当前作用域($Scope)注册广播监听事件
         * @params {String} URL, 广播标识符，
         * @params {Scope} $scope, 待注册事件的作用域，
         * @params {Function} recallHandler, 事件监听回调函数，
         * @return $this //当前服务对象，以供链式调用
         */
        function onBroadcastData(URL, $scope, recallHandler) {
            var $this = this;
            if (null == URL) URL = _DEFAULT_URL_;//默认URL
            if (null == $scope && null == recallHandler) {
                console.log("register recallHandler failed because \" $scope\" or \"recallHandler\" is invalid!");
            } else {
                setURLInfo(URL, $scope);
                $scope.$on(URL, function (event, args) {  //注册事件监听函数
                    recallHandler(event, args);
                    console.log("register recallHandler completely")
                });
            }
            return $this;//链式回调
        }

        /**
         * @description 返回URL信息列表
         * @params null，
         * @return URLInfo
         */
        function getURLInfo() {
            return URLInfos;
        }

        //返回公共方法
        return {
            "broadcastData": broadcastData//发送广播
            , "onBroadcastData": onBroadcastData//注册监听函数
            , "getURLInfo": getURLInfo//获取列表信息
            , "emitMessage": emitMessage
            , "initMessages": initMessages
        }
    }


    /**
     * @description IframeService服务对应的处理函数
     * @params {null} null，
     * @return
     */
    IframeService.$inject = ["$rootScope", "$window"];

    function IframeService($rootScope, $window) {

        //private variable
        var handlers = [];
        //private function

        //private function
        function UserException(mark, message) {
            this.mark = mark;
            this.message = message;
            this.Type = "UserException!";
        }

        //public function
        /**
         * @description 在$window中注册消息监听事件,当作用域$scope销毁是取消注册监听
         * @params {String} type, 监听消息类型，
         * @params {Scope} $scope, 待注册事件的作用域，
         * @params {Function} recallHandler, 事件监听回调函数，
         * @return $this //当前服务对象，以供链式调用
         */
        function addIframeListener(type, $scope, handler) {
            var $this = this;
            if (typeof type !== 'String' && null !== $scope && null == handler) {
                throw new UserException("Add Iframe Listener Failed!", "Params Invalid!");
            } else {
                var handlerFn = function (event) {
                    console.log("add listener action!")
                    handler(event);
                    $scope.$apply();
                };
                $window.addEventListener(type, handlerFn, false);
                $scope.$on("$destroy", function () {
                    $window.removeEventListener(type, handlerFn, false);
                    console.log("remove action!")
                });
            }
            return $this;

        }


        /**
         * @description 向iframe发送消息
         * @params {String} idString, iframe id，
         * @params {object} message, 向iframe发送的消息，
         * @return $this //当前服务对象，以供链式调用
         */
        function postSubIframeMessage(idString, message) {
            if (null == idString || !$(idString)) {
                throw new UserException("Iframe String Invalid", "Dom is null or Select failed!")
            }
            var $this = this;
            var href = $window.location.href;
            var domain = href.split("//")[0] + '//' + window.location.host;
            var iframeTargets = [];
            iframeTargets.push($(idString)[0]);
            try {
                for (var i in iframeTargets) {
                    iframeTargets[i].contentWindow.postMessage(message, domain);
                }
            } catch (e) {
                throw new UserException("Post Message Exception", e);
            }
            return $this;
        }


        //返回监听对象
        return {
            addIframeListener: addIframeListener,//注册监听的方法
            postSubIframeMessage: postSubIframeMessage,//向Iframe发送消息的方法
        }
    }

    /**
     * @description HttpService
     * @params {null} null，
     * @return
     */
    HttpService.$inject = ["$q", "$http", "$state", "$location", "$window", "$rootScope", "$sce"];

    function HttpService($q, $http, $state, $location, $window, $rootScope, $sce) {

        /**
         * @description 判断是否有layer弹出框
         * @params {null} null，
         * @return
         */
        function isLayerLoad() {
            if (layer) {
                return true;
            } else {
                console.error("无法弹出提示框，请引入layer插件")
                return false;
            }
        };

        function htmlEscape(str) {
            return String(str)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/\n/g, '<br/>');
        }

        /**
         * @description messagerPrompt消息提示框
         * @params {null} null，
         * @return
         */
        function messagePrompt(title, message, icon) {
            var msg = htmlEscape(message);
            if (isLayerLoad()) {
                layer.alert(
                    msg || '（提示信息为空）'
                    , {
                        title: title || '提示'
                        , icon: icon || 2
                        , offset: '200px' //如果不设置offset，在Mac中offsetTop被自动计算为了1145，超出了屏幕，无法显示promt，不清楚是layer的问题还是mac的问题，暂时设置为绝对数值
                    }
                )
            } else {
                alert(msg || '提示:（提示信息为空）');
            }
        };


        /**
         * @description messagerPrompt消息提示框
         * @params {null} null，
         * @return
         */
        function confirmPrompt(config) {
            var msg = htmlEscape(config.message);
            if (isLayerLoad()) {
                layer.confirm(
                    // layer.alert(
                    msg || '（提示信息为空）'
                    , {
                        time: config.time || 0
                        , icon: config.icon || 3
                        , skin: config.skin || 'layui-layer-lan'
                        , shift: config.shift || 0 //动画类型
                        , offset: '200px' //如果不设置offset，在Mac中offsetTop被自动计算为了1145，超出了屏幕，无法显示promt，不清楚是layer的问题还是mac的问题，暂时设置为绝对数值
                        // , end: config.callback
                        // , zIndex: 2147483647
                    }
                    , function (index) {
                        console.log("confirmPrompt() callback");
                        config.callback();
                        layer.close(index);
                    }
                )
            } else {
                alert(msg || '提示:（提示信息为空）');
            }
        };

        /**
         * @description messagerPrompt消息提示框
         * @params {null} null，
         * @return
         */
        function successPrompt(config) {
            var msg = htmlEscape(config.message);
            if (isLayerLoad()) {
                layer.alert(
                    msg || '（提示信息为空）'
                    , {
                        time: config.time || 2000
                        , icon: config.icon || 1
                        , skin: config.skin || 'layui-layer-molv'
                        , shift: config.shift || 0 //动画类型
                        , end: config.callback
                        , offset: '200px' //如果不设置offset，在Mac中offsetTop被自动计算为了1145，超出了屏幕，无法显示promt，不清楚是layer的问题还是mac的问题，暂时设置为绝对数值
                    }
                )
            } else {
                alert(msg || '提示:（提示信息为空）');
            }
        };

        /**
         * @description messagerPrompt消息提示框
         * @params {null} null，
         * @return
         */
        function errorPrompt(message, callback) {
            var msg = htmlEscape(message);
            if (isLayerLoad()) {
                layer.alert(
                    msg || '（提示信息为空）'
                    , {
                        title: '失败'
                        , icon: 2
                        , skin: 'layui-layer-red'
                        , shift: 0 //动画类型
                        , end: callback
                        , offset: '200px' //如果不设置offset，在Mac中offsetTop被自动计算为了1145，超出了屏幕，无法显示promt，不清楚是layer的问题还是mac的问题，暂时设置为绝对数值
                    }
                )
            } else {
                alert(msg || '提示:（提示信息为空）');
            }
        };

        function iframeRequest(url) {
            console.log(">>>HttpService.authenticate() enter:url=", url);
            var defer = $q.defer();
            var iframe = $('<iframe/>', {
                src: url
                , style: 'height: 100%; width: 100%; position: fixed; top: 0; left: 0; z-index:99999999'
            });
            //添加iframe对象到body中，遮盖整个页面
            //TODO 需要在top中打开
            iframe.appendTo('body');
            var closeLogin = function (e) {
                //当收到dasc_authenticated时，表示认证已通过
                if (e.data.indexOf("DASC_CLOSE_IFRAME") === 0) {
                    //删除监听器
                    window.removeEventListener('message', closeLogin, false);
                    //删除iframe
                    iframe.remove();
                    defer.resolve(e.data.substring("DASC_CLOSE_IFRAME".length + 1));
                    console.log("<<<HttpService.authenticate() success");
                }
            };
            //监听iframe使用postMessage发送的message
            window.addEventListener('message', closeLogin, false);
            console.log("<<<HttpService.authenticate() exit");
            return defer.promise;
        }

        /**
         * @description httpRequest http请求接口
         * @params {Object} 请求参数
         * @urlVars {Object} url变量，用于替换url中以":"开头的变量
         * @return promise
         */
        function httpRequest(params, urlVars, confirm, success) {
            console.log(">>>httpRequest() enter: params=", params, ", urlVars=", urlVars, ", confirm=", confirm, ", success=", success);
            var defer = $q.defer();
            var resultData = {};
            if (params && params.url.toLowerCase().indexOf("http") < 0) {
                params.url = ($rootScope.defaultServiceUrl[$rootScope.defaultServiceUrl.length - 1] === "/" ? $rootScope.defaultServiceUrl.substr(0, $rootScope.defaultServiceUrl.length - 1) : $rootScope.defaultServiceUrl)
                    + "/"
                    + (params.url[0] === "/" ? params.url.substr(1, params.url.length) : params.url);
            }
            //if (userId)
            var userId = -2;
            params.url = params.url.replace(":userId", userId);
            //如果url中的变量与urlVars的属性名相同，则将变量替换为对应的属性值
            if (urlVars) {
                for (var varName in urlVars) {
                    params.url = params.url.replace(":" + varName, urlVars[varName]);
                }
            }
            //如果不增加header，后台无法判断请求为ajax调用
            params.headers = angular.extend(params.headers || {}, {'X-Requested-With': 'XMLHttpRequest'});
            params.withCredentials = true;
            if (params && params.data && typeof params.data === 'object')
                params.data = angular.toJson(params.data);
            var confirming = angular.copy(confirm);//confirm?confirm.clone():confirm;
            var doRequest = function () {
                console.log(">>>doRequest() enter: url=", params.url);
                $http(params).then(function (data) {
                    console.log(">>>doRequest().then enter");
                    if (data && data.data) {
                        var resultData = data.data.data;
                        switch (data.data.status) {
                            case 'success': {
                                if (success)
                                    successPrompt(success);
                                defer.resolve(resultData);
                                break;
                            }
                            case 'unauthenticated':
                            case 'kickout':
                            case 'authorizationError':
                                iframeRequest(resultData).then(function (loginName) {
                                    //如果前后端用户相同，再次调用请求
                                    if (!$rootScope.user || $rootScope.user.loginName && $rootScope.user.loginName === loginName) {
                                        httpRequest(params, urlVars, confirm, success).then(
                                            function (data2) {
                                                // iframe.remove();
                                                defer.resolve(data2);
                                            }
                                            , function () {
                                                // $iframe.remove;
                                                defer.reject();
                                            }
                                        );
                                    }
                                    //否则，需要刷新整个页面以避免新用户看到老用户的界面
                                    else
                                        top.document.location.href = $rootScope.url.index;
                                })
                                break;
                            case 'error': {
                                messagePrompt('请求执行失败', data.data.message, 0)
                                defer.reject();
                                break;
                            }
                            case 'fail': {
                                messagePrompt('请求执行失败', data.data.message, 2);
                                defer.reject();
                                break;
                            }
                            default: {
                                messagePrompt('请求执行失败', 'status为空或非法', 2);
                                defer.reject();
                            }
                        }
                        ;
                    } else {
                        // messagePrompt('请求执行失败', '返回数据为空', 2);
                        // defer.reject();
                    }
                    console.log("<<<doRequest().then return");

                }, function (data) {
                    switch (data.status) {
                        case 404:
                            errorPrompt("服务地址[" + data.config.url + "]不存在，请通知系统管理员");
                            break;
                        case -1:
                            errorPrompt("请求被拒绝，请通知系统管理员检查服务是否开启");
                            break;
                        default:
                            errorPrompt(data.statusText);
                    }
                    defer.reject();
                    console.log("<<<doRequest() return");
                });
            }
            if (confirming) {
                confirming.callback = doRequest;
                confirmPrompt(confirming);
            }
            else
                doRequest();
            console.log("<<<httpRequest() return");
            return defer.promise;
        }

        /**
         * @description httpRequest http请求接口
         * @params {Object} 请求参数，
         * @return promise
         */
        function add(params, urlVars, confirm, success) {
            console.log(">>>httpService.add enter")
            var defer = $q.defer();

            if (!params) {
                errorPromt("参数params未定义", function () {
                    defer.reject();
                })
            }
            else {
                params.method = 'post';
                params.headers = {'Content-Type': 'application/json;charset=UTF-8'};
                httpRequest(params, urlVars, confirm, success)
                    .then(function (data) {
                        defer.resolve(data);
                    })
                ;
            }
            console.log("<<<httpService.add return");
            return defer.promise;
        }

        /**
         * @description httpRequest http请求接口
         * @params {Object} 请求参数，
         * @return promise
         */
        function modify(params, urlVars, confirm, success) {
            console.log(">>>httpService.modify enter")
            var defer = $q.defer();

            if (!params) {
                errorPromt("参数params未定义", function () {
                    defer.reject();
                })
            }
            else {
                params.method = 'put';
                params.headers = {'Content-Type': 'application/json;charset=UTF-8'};
                httpRequest(params, urlVars, confirm, success)
                    .then(function (data) {
                        defer.resolve(data);
                    })
                ;
            }
            console.log("<<<httpService.modify return")
            return defer.promise;
        }

        /**
         * @description httpRequest http请求接口
         * @params {Object} 请求参数，
         * @return promise
         */
        function del(params, urlVars, confirm, success) {
            console.log(">>>httpService.del enter")
            var defer = $q.defer();

            if (!params) {
                errorPromt("参数params未定义", function () {
                    defer.reject();
                })
            }
            else {
                params.method = 'delete';
                params.headers = {'Content-Type': 'application/json;charset=UTF-8'};
                httpRequest(params, urlVars, confirm, success)
                    .then(function (data) {
                        defer.resolve(data);
                    })
                ;
            }
            console.log("<<<httpService.del return")
            return defer.promise;
        }

        /**
         * @description httpRequest http请求接口
         * @params {Object} 请求参数，
         * @return promise
         */
        function get(params, urlVars, confirm, success) {
            console.log(">>>httpService.get enter")
            var defer = $q.defer();

            if (!params) {
                errorPromt("参数params未定义", function () {
                    defer.reject();
                })
            }
            else {
                params.method = 'get';
                // params.headers= {'Content-Type': 'application/json;charset=UTF-8'};
                httpRequest(params, urlVars, confirm, success)
                    .then(function (data) {
                        defer.resolve(data);
                    });
            }
            console.log("<<<httpService.get return")
            return defer.promise;
        }

        /**
         * @description httpRequest http请求接口
         * @params {Object} 请求参数，
         * @return promise
         */
        function post(params, urlVars, confirm, success) {
            console.log(">>>httpService.post enter")
            var defer = $q.defer();

            if (!params) {
                errorPromt("参数params未定义", function () {
                    defer.reject();
                })
            }
            else {
                params.method = 'post';
                params.headers = {'Content-Type': 'application/json;charset=UTF-8'};
                httpRequest(params, urlVars, confirm, success)
                    .then(function (data) {
                        defer.resolve(data);
                    })
                ;
            }
            console.log("<<<httpService.post return")
            return defer.promise;
        }

        /**
         * @description postByFormData通过post
         * @params {null} null，
         * @return
         */
        function postByFormData(url, params) {
            var defer = $q.defer();
            var resultData = {};
            if (url) {
                var params = {
                    url: url || '',
                    data: params || '',
                    method: 'post'
                };
                httpRequest(params).then(function (data) {
                    defer.resolve(data);
                }, function (data) {
                    defer.reject(data);
                })
            } else {
                resultData = {
                    "status": 'error',
                    "data": 'invalid url',
                    "stackTraceMessage": 'invalid url'
                };
                defer.reject(resultData);
                messagePrompt("url 地址有误", 2);
            }
            ;
            return defer.promise;
        };

        /**
         * @description postByFormParams通过post params
         * @params {null} null，
         * @return
         */
        function postByParams(url, params) {
            var defer = $q.defer();
            var resultData = {};
            if (url) {
                var params = {
                    url: url || '',
                    params: params || '',
                    method: 'post'
                };
                httpRequest(params).then(function (data) {
                    defer.resolve(data);
                }, function (data) {
                    defer.reject(data);
                })
            } else {
                resultData = {
                    "status": 'error',
                    "data": 'invalid url',
                    "stackTraceMessage": 'invalid url'
                };
                defer.reject(resultData);
                messagePrompt('url 地址有误', 2);
            }
            ;
            return defer.promise;
        };


        /**
         * @description getByFormParams通过get params
         * @params {null} null，
         * @return
         */
        function getByParams(url, params) {
            var defer = $q.defer();
            var resultData = {};
            if (url) {
                var params = {
                    url: url || '',
                    params: params || '',
                    method: 'get'
                };
                httpRequest(params).then(function (data) {
                    defer.resolve(data);
                }, function (data) {
                    defer.reject(data);
                })
            } else {
                resultData = {
                    "status": 'error',
                    "data": 'invalid url',
                    "stackTraceMessage": 'invalid url'
                };
                defer.reject(resultData);
                messagePrompt('url 地址有误', 2);
            }
            ;
            return defer.promise;
        };

        /**
         * @description getByFormParams通过get params
         * @params {null} null，
         * @return
         */
        function getByFormData(url, params) {
            var defer = $q.defer();
            var resultData = {};
            if (url) {
                var params = {
                    url: url || '',
                    data: params || '',
                    method: 'get'
                };
                httpRequest(params).then(function (data) {
                    defer.resolve(data);
                }, function (data) {
                    defer.reject(data);
                })
            } else {
                resultData = {
                    "status": 'error',
                    "data": 'invalid url',
                    "stackTraceMessage": 'invalid url'
                };
                defer.reject(resultData);
                messagePrompt('url 地址有误', 2);
            }
            ;
            return defer.promise;
        };

        //返回监听对象
        return {
            add: add,
            modify: modify,
            del: del,
            get: get,
            post:post,
            messagePrompt: messagePrompt,
            successPrompt: successPrompt,
            confirmPrompt: confirmPrompt,
            errorPrompt: errorPrompt,
            httpRequest: httpRequest,
            postByFormData: postByFormData,//post by form data
            postByParams: postByParams,//post by params
            getByFormData: getByFormData,//get by form data
            getByParams: getByParams,//get by params
        }
    }

    //模块返回的公共服务
    return angular
        .module("dist.data.service", [])
        .factory("DataService", DataService)
        .factory("BroadcastService", BroadcastService)
        .factory("IframeService", IframeService)
        .factory("HttpService", HttpService);

});
