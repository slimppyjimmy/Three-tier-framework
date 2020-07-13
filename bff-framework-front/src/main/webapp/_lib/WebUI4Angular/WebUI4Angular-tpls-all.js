angular.module("ui.wisoft",["ui.wisoft.tpls","ui.wisoft.position","ui.wisoft.transition","ui.wisoft.bindHtml","ui.wisoft.popup","ui.wisoft.resizelistener","ui.wisoft.dialog","ui.wisoft.collapse","ui.wisoft.menu","ui.wisoft.imageview","ui.wisoft.progress","ui.wisoft.common","ui.wisoft.alert","ui.wisoft.fileupload","ui.wisoft.carousel","ui.wisoft.accordion","ui.wisoft.messagetip","ui.wisoft.my97datepicker","ui.wisoft.panel","ui.wisoft.combobox","ui.wisoft.popupbutton","ui.wisoft.button","ui.wisoft.datagrid","ui.wisoft.camerascanner","ui.wisoft.searchinput","ui.wisoft.tabset","ui.wisoft.tilelist","ui.wisoft.tooltip","ui.wisoft.dividedbox","ui.wisoft.tree"]);
angular.module("ui.wisoft.tpls",["template/accordion/wi-accordion-group.html","template/accordion/wi-accordion.html","template/button/wi-button.html","template/camerascanner/camerascannerTemplate.html","template/imageview/imageviewTemplate.html","template/carousel/carousel.html","template/carousel/slide.html","template/combobox/comboboxTemplate.html","template/datagrid/datagridTemplate.html","template/dividedbox/wi-dividedbox-group.html","template/dividedbox/wi-dividedbox.html","template/fileupload/wi-fileupload.html","template/imageview/imageviewTemplate.html","template/menu/wi-menu.html","template/panel/wi-panel.html","template/popupbutton/popupbuttonTemplate.html","template/tree/treeTemplate.html","template/progress/wi-progress.html","template/searchinput/wi-searchinput.html","template/tebset/tabsetTemplate.html","template/tebset/tabTemplate.html","template/tilelist/tilelistTemplate.html","template/tooltip/tooltip-html-unsafe-popup.html","template/tooltip/tooltip-popup.html","template/tree/treeTemplate.html"]);
'use strict';
angular.module('ui.wisoft.alert', ['ui.wisoft.dialog'])

/**
 * @ngdoc service
 * @name ui.wisoft.alert.wiAlert
 *
 * @description
 * wiAlert 用来弹出常用的五种提醒弹出框：info,warning,error,success,confirm，它们有固定的图标和默认的标题，使用时仅需要指定提醒内容，当然你也可以自己指定标题。
 * wiAlert的弹出框都是模态的，它会中断用户的其它操作，请在适当的场景中使用。
 *
 */
    .factory('wiAlert',['$q','wiDialog',function($q,wiDialog){

        var privateMethods = {
            showAlert: function (opts,type) {
                var content,defaultIconClass,defaultTitle;
                //如果直接传递字符串，则将字符串作为提醒内容
                angular.isString(opts)? content=opts: content=opts.content;

                //各种类型Alert的默认图标
                defaultIconClass = {info:'icon-info-sign',error:'icon-remove-sign',warn:'icon-exclamation-sign',
                             success:'icon-ok-sign',confirm:'icon-question-sign'};

                //各种类型Alert的默认标题
                defaultTitle={info:'提示',warn:'警告',error:'失败',success:'成功','confirm':'提示'}

                var tpl =  ['<div class="wi-clearf">',
                     '<div class="wi-alert-icon" ><span class="' + (opts.iconClass||defaultIconClass[type]) + '"></span></div>',
                     '<div class="wi-alert-simple-cont" >' + content + '</div></div>',
                     '<div class="wi-alert-toolbar">',
                     '<input type="button" value='+(opts.yesLabel||"确定")+' ng-click=confirm("YES")'+' class="wi-btn" /></div>'
                ];

                //confirm有确定和取消两个按钮，其余只有确定一个按钮
                if(type==='confirm'){
                    tpl.splice(4, 0, '<input type="button" value='+(opts.noLabel||"取消")+' ng-click=confirm("NO")'+' class="wi-btn wi-dialog-okClose" />');
                }

                var options = {
                    closeByEscape: false,
                    closeByDocument: false,
                    overlay:true,
                    dialogInIframe:false,// 默认在顶层窗口弹出
                    plain: true,
                    title: opts.title||defaultTitle[type],
                    withoutHead:false,
                    width: opts.width||300,
                    template:tpl.join('')
                };
                  //不写下面这句是为了禁止覆盖某些属性
//                angular.extend(options, opts);

                var p = $q.defer(),yesFunc=angular.noop,noFunc=angular.noop;
                p.promise=wiDialog.openConfirm(options);
                p.promise.yes=function(callback){
                    yesFunc=callback;//设置点击确定后的回调函数
                    return p.promise;//支持链式调用
                }
                p.promise.no=function(callback){
                    noFunc=callback;//设置点击取消后的回调函数
                    return p.promise;//支持链式调用
                }
                p.promise.then(function(data){
                    data==='YES'?yesFunc():data==='NO'?noFunc():angular.noop();
                })
                //返回的promise里定义了yes和no方法用来设置回调函数，设置的回调函数在按钮点击事件发生后执行。
                return p.promise;
            }
        }
        //opts: width,yeslabel,nolabel,content,title,iconClass
        var publicMethods = {

            /**
             * @ngdoc method
             * @name ui.wisoft.alert.wiAlert#info
             * @methodOf ui.wisoft.alert.wiAlert
             * @description 一般信息提示框
             *
             * @param {Object} options 参见confirm的参数说明。
             *
             * @return {Object} 返回一个promise,可以直接在返回对象的.yes()中进行点击确定后的处理。
             *
             */
            info:function(opts){
                return privateMethods.showAlert(opts,'info');
            },
            /**
             * @ngdoc method
             * @name ui.wisoft.alert.wiAlert#warn
             * @methodOf ui.wisoft.alert.wiAlert
             * @description 警告信息提示框
             *
             * @param {Object} options 参见confirm的参数说明。
             *
             * @return {Object} 返回一个promise,可以直接在返回对象的.yes()中进行点击确定后的处理。
             *
             */
            warn:function(opts){
                return privateMethods.showAlert(opts,'warn');
            },
            /**
             * @ngdoc method
             * @name ui.wisoft.alert.wiAlert#error
             * @methodOf ui.wisoft.alert.wiAlert
             * @description 失败信息提示框
             *
             * @param {Object} options 参见confirm的参数说明。
             *
             * @return {Object} 返回一个promise,可以直接在返回对象的.yes()中进行点击确定后的处理。
             *
             */
            error:function(opts){
                return privateMethods.showAlert(opts,'error');
            },
            /**
             * @ngdoc method
             * @name ui.wisoft.alert.wiAlert#success
             * @methodOf ui.wisoft.alert.wiAlert
             * @description 操作成功信息提示框
             *
             * @param {Object} options 参见confirm的参数说明。
             *
             * @return {Object} 返回一个promise,可以直接在返回对象的.yes()中进行点击确定后的处理。
             *
             */
            success:function(opts){
                return privateMethods.showAlert(opts,'success');
            },
            /**
             * @ngdoc method
             * @name ui.wisoft.alert.wiAlert#confirm
             * @methodOf ui.wisoft.alert.wiAlert
             * @description 需要用户同意后才能进行其他操作的提示框。
             *
             * @param {Object} options 可以仅指定提示内容，也可以修改默认属性，可以修改的参数如下：<br>
             * {<br>
             * width： 提示框的宽度，默认为300<br>
             * title：提示框的标题，支持html值。各种alert的默认标题 {info:'提示',warn:'警告',error:'失败',success:'成功','confirm':'提示'}<br>
             * content：提示内容，支持html值，如：<span class="alertTitle">确定删除吗？</span><br>
             * iconClass：提示框内容区域的图标样式。<br>
             * yesLabel：按钮名称，默认为：确定<br>
             * noLabel：按钮名称，默认为：取消<br>
             *  }
             *
             *
             * @return {Object} 返回一个promise,可以直接在返回对象的.yes()或.no()中对确定或取消进行处理。
             *
             */
            confirm:function(opts){
                return privateMethods.showAlert(opts,'confirm');
            }
        };

        return publicMethods;
    }])

angular.module('ui.wisoft.accordion', ['ui.wisoft.collapse','ui.wisoft.resizelistener'])
    .constant('accordionConfig', {
        emptyHeight: 2//空的 accordion 高度（上下边框）
        ,headHeight: 32// 标题栏默认高度，32px
    })
    .controller('AccordionController', ['$scope', '$attrs','$element','$log','accordionConfig', function ($scope, $attrs,$elem,$log,accordionConfig) {
        var ctrl = this;
        /* 尺寸处理 */
        var ac_height = undefined;// $scope.ac_height 的临时变量，用户定义的高度字符串
        (function(){
            // 尺寸类型的属性处理方法（其他组件中也存在类似方法，依赖于 scope），可接受的值：数字、数字开头、scope 对象（数字、数字开头）
            var getSizeFromAttr = function(attr){
                if(!attr) return;
                var size;
                if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                    size = attr;
                }else{// 非数字开始，可能是 scope 对象
                    size = $scope.$eval(attr);
                }
                Number(size) && (size += 'px');// 是数字则加上单位 px
                return size;
            };
            $scope.ac_width = getSizeFromAttr($attrs['width'],'warn: accordion 的 width="'+ $attrs['width'] +'"定义不合法!');
            // controller 中需使用 ac_height 计算内容部分高度，若未定义高度，则由 accordionGroup 内容撑开
            ac_height = $scope.ac_height
                = getSizeFromAttr($attrs['height'],'warn: accordion 的 height="'+ $attrs['height'] +'"定义不合法!');// accordion 的 height
            if(ac_height && ac_height.indexOf('%')>0)// 若高度为 %，设置当前容器实际高度，需要监听 resize，修改容器高度
                $scope.ac_hIsPCT = true;
        })();
        ctrl.headHeight = $scope.$eval($attrs['headheight']);// 标题栏高度
        !angular.isNumber(ctrl.headHeight) && (ctrl.headHeight = accordionConfig.headHeight);
        // 是否限制只打开一个 accordionGroup，若定义了 height，只能为 true
        var oneOpen = ac_height ? true : $scope.$eval($attrs['oneopen']) || false;

        // accordion groups，所有面板的 scope
        ctrl.groups = [];
        ctrl.panelStyle = {};//设置每个accordion body的高度等样式
        var openedGroups = [];//临时保存设置为打开的accordionGroup，但每次执行addGroup()后它只保留最后一个设置为打开的accordionGroup

        //判断是否需要关闭其他 accordionGroup，需要时关闭
        ctrl.closeOthers = function (openGroup) {
            if(!oneOpen || openGroup.byOther==true) return;
            angular.forEach(ctrl.groups, function (group) {
                if (group !== openGroup && group.isOpen) {
                    group.isOpen = false;
                    group.byOther = true;
                }
            });
        };

        // 若 accordion 定义了高度，当所有 accordionGroup 都已关闭，则打开 closeScope 相邻的 accordionGroup
        ctrl.adjust = function(closeScope){ // closeScope 是正在关闭的 accordionGroup 的 scope
            if(!ac_height) return;
            var index = ctrl.groups.indexOf(closeScope);
            if(index == ctrl.groups.length-1){// 关闭的是最后一项
                if(!ctrl.groups[index-1].isOpen){
                    ctrl.groups[index-1].isOpen=true;
                    ctrl.groups[index-1].byOther=true;
                }
            }else{
                if(!ctrl.groups[index+1].isOpen){
                    ctrl.groups[index+1].isOpen=true;
                    ctrl.groups[index+1].byOther=true;
                }
            }
        };

        // wi-accordion-group 指令调用该方法将自己保存到this.groups中
        ctrl.addGroup = function (groupScope, _index) {
            groupScope.panelStyle = ctrl.panelStyle;
            if(angular.isDefined(_index)){ //_index 有值时，将 groupScope 插入到指定位置，因 ng-repeat 等影响可能导致 addGroup 的顺序与 DOM 不一致，故引入 _index
                ctrl.groups.splice(_index, 0, groupScope);
            }else{
                ctrl.groups.push(groupScope);
            }
            /* 开始设置各 accordionGroup 的打开状态 */
            if(groupScope.isOpen){
                openedGroups.push(groupScope);
            }
            if(oneOpen && openedGroups.length > 1){// 至多打开一个，超过时关闭前一个
                if(openedGroups[0].isOpen){
                    openedGroups[0].isOpen = false;
                    openedGroups[0].byOther = true;
                }
                openedGroups.shift();
            }
            if(ac_height && openedGroups.length == 0){// 设置了高度，至少打开一个，无打开时打开第一个
                if(!ctrl.groups[0].isOpen){
                    ctrl.groups[0].isOpen = true;
                    (ctrl.groups.length>1) && (ctrl.groups[0].byOther = true);
                }
                openedGroups.push(ctrl.groups[0]);
            }
            calcCHeight();
        };

        // accordionGroup 销毁时，在其指令中监听调用
        ctrl.removeGroup = function (group) {
            var index = ctrl.groups.indexOf(group);
            if (index !== -1) {
                ctrl.groups.splice(index, 1);
            }
            calcCHeight();
        };

        /* 内容部分高度设置（前提：定义了整体高度） */
        var calcCHeight = (ac_height) ? function(){
            var times = ctrl.groups.length;
            // 设置每个accordionGroup的高度,宽度自动撑满不需要设置
            if($scope.ac_hIsPCT){// %，设置当前容器实际高度
                var trueHeight=parseInt(ac_height)*0.01*$elem[0].parentElement.clientHeight;
                ctrl.panelStyle.cheight = trueHeight-(times*ctrl.headHeight+accordionConfig.emptyHeight)+'px';
            }else{
                ctrl.panelStyle.cheight = 'calc('+ac_height+' - '+(times*ctrl.headHeight+accordionConfig.emptyHeight)+'px)';
            }
        } : angular.noop;
        ctrl.resizeH = function(){
            calcCHeight();
            ctrl.groups.map(function(group){
                group.panelStyle.cheight=ctrl.panelStyle.cheight;
            });
        }
    }])

/**
 * @ngdoc directive
 * @name ui.wisoft.accordion.directive:wiAccordion
 * @restrict EA
 *
 * @description
 * wiAccordion是一个折叠面板，如果给定显示区域比较小，就可以考虑使用这个组件。
 *
 * @param {object=} wiid 若定义了此属性，可供调用接口。<br />
 *   .element() 获取当前 accordion 对应的 jqlite 元素，<br />
 *   .options() 获取当前用户设置：{ width,height }，<br />
 *   .panels() 获取所有面板对应的 scope 集合。<br />
 *   .getSelect() 获取选中的面板对应的 scope。<br />
 *   .getGroup(which) 获取指定 heading或index 的面板对应的 scope。<br />
 *   .toggle(which) 切换指定 heading或index 的面板的选中状态。<br />
 *   .reCompute() 重新适应尺寸（当其祖先元素由隐藏改为显示时，可能需要手动调用此方法，以重新计算尺寸）。
 * @param {number|length=} width 宽度，用来设定整个accordion的宽度，不指定宽度则面板的宽度是父容器的100%。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {number|length=} height 高度, 指定此属性后，每个折叠面板都拥有同样的高度，不指定则每个面板的高度是根据内容自适应的。<br />
 *   说明同 width。
 * @param {number=} headheight 标题栏高度的数值。不带单位“px”，默认为 32。
 * @param {boolean=} oneopen 是否只能打开一个 accordion，默认为 false，若定义了 height，此属性默认为 true，且用户设置不生效。
 * @param {function=} onselect 打开面板后的回调方法，参数：index(当前面板索引位置),scope(面板对应的 scope)。
 * @param {function=} onunselect 关闭面板后的回调方法，参数：index(当前面板索引位置),scope(面板对应的 scope)。
 */
    .directive('wiAccordion', ['wiResizeListener','$timeout',function (wiResizeListener,$timeout) {
        return {
            restrict: 'EA',
            controller: 'AccordionController',
            transclude: true,
            replace: true,
            scope:{
                wiid: '='
                ,onselect: '&'
                ,onunselect: '&'
            },
            templateUrl: 'framework/dist.platform.com-1.0.0/src/accordion/template/accordion/wi-accordion.html',
            link: function (scope, elem, attrs, accordionCtrl) {
                //console.log(accordionCtrl.groups.length)？？？？？为什么带ng-repeat的group获取不到？？？？？？
                //-----因为使用了ng-repeat后先执行accordion的link后执行accordionGroup的link，执行顺序改变了
                /* 事件监听 */
                accordionCtrl.onSelect = scope.onselect();
                accordionCtrl.onUnselect = scope.onunselect();

                scope.ac_width && elem.css('width', scope.ac_width);// 已在 ctrl 中计算
                $timeout(accordionCtrl.resizeH, 0);// 若祖先元素存在自定义指令，可能造成 link 时高度未同步至DOM，延迟计算
                var regResizeEventListener = function(){
                    wiResizeListener.addResizeListener(elem[0].parentElement, function(){
                        scope.$evalAsync(accordionCtrl.resizeH);
                    });
                };
                // accordion 父容器或者窗口高度变化时重新计算内容高度 -- 需在模板和文档都设置完成后运行，否则 IE 等浏览器显示异常
                if(scope.ac_hIsPCT){// 需要监听 resize
                    regResizeEventListener();
                }

                /* 开放接口，需定义双向绑定的 wiid */
                if(attrs.wiid && angular.isObject(scope.wiid)){
                    angular.extend(scope.wiid, {
                        element: function(){// 返回对应的 DOM
                            return elem;
                        }
                        ,options: function(){
                            return {
                                width: scope.ac_width // 组件实际宽度
                                ,height: scope.ac_height // 组件实际高度
                            };
                        }
                        ,panels: function(){ // 返回所有 accordion-group 对应的 scope 集合
                            return accordionCtrl.groups;
                        }
                        ,getSelect: function(){ // 返回选中项的 scope
                            var groups=accordionCtrl.groups;
                            for(var i=0;i<groups.length;i++){
                                if(groups[i].isOpen) return groups[i];
                            }
                        }
                        ,getGroup: function(which){ // 返回指定 heading/index 对应的 scope
                            var groups=accordionCtrl.groups;
                            if(angular.isNumber(which)){
                                return groups[which];
                            }
                            for(var i=0;i<groups.length;i++){
                                if(groups[i].heading==which) return groups[i];
                            }
                        }
                        ,toggle: function(which){ // 选中指定项
                            var groups=accordionCtrl.groups;
                            if(angular.isNumber(which)){
                                groups[which].isOpen = !groups[which].isOpen;
                                return;
                            }
                            for(var i=0;i<groups.length;i++){
                                if(groups[i].heading==which){
                                    groups[i].isOpen = !groups[i].isOpen;
                                    return;
                                }
                            }
                        }
                        ,reCompute: (scope.ac_hIsPCT) ?// 需要监听 resize
                            function(){
                                regResizeEventListener();
                            } : angular.noop
                    });
                }

                // 标识是否完成 link，此后 link 的 accordionGroup （ng-repeat 等造成）需判断在 DOM 中的位置
                accordionCtrl.acLinked = true;
            }
        };
    }])

/**
 * @ngdoc directive
 * @name ui.wisoft.accordion.directive:wiAccordionGroup
 * @restrict EA
 *
 * @description
 * wiAccordionGroup是wiAccordion的一个面板，wiAccordionGroup只能作为wiAccordion的子指令来使用，不能单独使用。
 *
 * @param {string=} heading 头部显示文字, heading是单向绑定的，你可以设置为一个确定的字符串，或者设置为scope中的一个变量。
 * @param {boolean=} isOpen 是否展开，设定 wiAccordionGroup 是否展开，isOpen 是双向绑定的，所以应设置为 scope 中的一个变量，而不能直接是 true 或者 false。<br />
 * 初始化时若未定义，默认为false
 */
    .directive('wiAccordionGroup', function () {
        return {
            require: '^wiAccordion',         // 必须在 wi-accordion 组件中
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: 'pcc/template/accordion/wi-accordion-group.html',
            scope: {
                heading: '@'
                ,isOpen: '=?'
//                ,isDisabled: '=?'//去除该属性，基本不会用
            },
            controller: function () {
                var ctrl = this;
                ctrl.setHeading = function (element) {
                    ctrl.heading = element;
                };
            },
            link: function (scope, element, attrs, accordionCtrl) {
                angular.isUndefined(scope.isOpen) && (scope.isOpen = false); // 若未定义 isOpen，默认为关闭
                scope.byOther = false;// 是否是受别的 accordionGroup 影响而改变了状态
                scope.style = {
                    headheight: accordionCtrl.headHeight ? accordionCtrl.headHeight + 'px': undefined // 从 controller 中获取标题高度
                };
                var _index = undefined;
                if(accordionCtrl.acLinked){// accordion 指令 link 完成，后 link 的 accordionGroup 需判断 DOM 索引
                    angular.forEach(element[0].parentElement.children, function(child, index){
                        if(child == element[0])
                            _index = index;
                    });// 可用于判断 group 的索引
                }
                accordionCtrl.addGroup(scope, _index);

                scope.$watch('isOpen', function (value, oldValue) {
                    var index=accordionCtrl.groups.indexOf(scope);
                    if(value){
                        accordionCtrl.onSelect && accordionCtrl.onSelect(index,scope);
                    }else{
                        accordionCtrl.onUnselect && accordionCtrl.onUnselect(index,scope);
                    }
                    if(scope.byOther){
                        scope.byOther = false;
                    }else if(value !== oldValue){
                        if (value) {//打开，在 accordionCtrl 中判断是否需要关闭其他 accordionGroup
                            accordionCtrl.closeOthers(scope);
                        }else{// 关闭，需判断是否需要打开其他 accordionGroup，从 toggleOpen 中移过来，外部可能会直接修改 isOpen
                            accordionCtrl.adjust(scope);
                        }
                    }
                });

                scope.toggleOpen = function () {
//                    if (!scope.isDisabled) {
                        scope.isOpen = !scope.isOpen;
//                    }
                };

                scope.$on('$destroy', function () {
                    accordionCtrl.removeGroup(scope);
                });
            }
        };
    })

/**
 * @ngdoc directive
 * @name ui.wisoft.accordion.directive:wiAccordionHeading
 * @restrict EA
 *
 * @description
 * wiAccordionHeading只能作为wiAccordionGroup的子指令来使用，它可以使用一个html片段来设定面板的头部显示。如果你希望头部显示的不仅仅是简单的文字，
 * 比如还有图片，按钮等更复杂的显示，就需要使用到这个子指令。使用方法见<a href="index_demo.html" target="_blank">demo</a>文档。
 *
 */
    .directive('wiAccordionHeading', function () {
        return {
            restrict: 'EA',
            transclude: true,   // 获取内容作为 heading
            template: '',       // 移除定义时的 element
            replace: true,
            require: '^wiAccordionGroup',
            link: function (scope, element, attr, accordionGroupCtrl, transclude) {
                // 将 heading 传递到 accordionGroup 的控制器，使自定义内容载入到模板中正确的位置
                // transclude 方法的第二个参数将克隆 elements，使其在 ng-repeat 中不出现异常
                accordionGroupCtrl.setHeading(transclude(scope, function () {}));
            }
        };
    })

    // 在 accordionGroup 模板中使用，标识引用 heading 的位置，必须提供 accordionGroup 控制器，以获得引入的 element
    // <div class="accordion-group">
    //   <div class="accordion-heading" ><a ... accordion-transclude="heading">...</a></div>
    //   ...
    // </div>
    .directive('wiAccordionTransclude', function () {
        return {
            require: '^wiAccordionGroup',
            link: function (scope, element, attr, controller) {
                scope.$watch(function () {
                    return controller[attr.wiAccordionTransclude];
                }, function (heading) {
                    if (heading) {
                        element.html('');
                        //设置accordion group的head的时候，可以直接设置html，当需要设置图片和文字样式的时候会比较有用
                        element.append(heading);
                    }
                });
            }
        };
    });
angular.module('ui.wisoft.bindHtml', [])

/**
 * @ngdoc directive
 * @name ui.wisoft.bindHtml.directive:bindHtmlUnsafe
 * @restrict A
 *
 * @description
 * bindHtmlUnsafe 可以指定该元素中的内容。
 *
 * @param {string} bindHtmlUnsafe 绑定了该元素内容的 scope 中的对象名（其值可以为 html 代码段的字符串，或 jqlite 元素）
 *
 */
    .directive('bindHtmlUnsafe', function () {
        return function (scope, element, attr) {
            element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
            scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
                if(!value) return;
                if(typeof value == 'string')
                    element.html(value || '');
                else{
                    element.empty().append(value);
                }
            });
        };
    });
/**
 * Created by QianQi on 2014/11/10.
 */

angular.module('ui.wisoft.button', [])
/**
 * @ngdoc directive
 * @name ui.wisoft.button.directive:wiButton
 * @restrict E
 *
 * @description
 * wiButton 是按钮。
 *
 * @param {string=} label 按钮文字内容。
 * @param {number|length=} width 按钮的宽度，未定义时根据文字自适应，若同时指定 width,height 内容溢出时将隐藏。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {number|length=} height 按钮的高度，未定义时为默认高度，若同时指定 width,height 内容溢出时将隐藏。<br />
 *   说明同 width。
 * @param {string=} iconl 左 icon 图片路径。
 * @param {string=} iconr 右 icon 图片路径。
 * @param {string=} witype 按钮类型，可选项：'submit','reset','button'，默认：'button'
 * @param {boolean=} disabled 禁用。
 *
 */
    .directive('wiButton', [function(){
        return{
            restrict: 'E',
            templateUrl: 'pcc/template/button/wi-button.html',
            replace: true,
            transclude: true,
            scope: {},
            link: function(scope, elem, attrs){
                var parentScope = scope.$parent;
                // 尺寸类型的属性处理方法（其他组件中也存在类似方法，依赖于 scope），可接受的值：数字、数字开头、scope 对象（数字、数字开头）
                var getSizeFromAttr = function(attr){
                    if(!attr) return;
                    var size;
                    if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                        size = attr;
                    }else{// 非数字开始，可能是 scope 对象
                        size = parentScope.$eval(attr);
                    }
                    Number(size) && (size += 'px');// 是数字则加上单位 px
                    return size;
                };

                scope.btnOptions = {
                    label: attrs['label'] || '',
                    width: getSizeFromAttr(attrs['width']) || null,
                    height: getSizeFromAttr(attrs['height']) || null,
                    iconl: attrs['iconl'] || '',
                    iconr: attrs['iconr'] || '',
                    type: attrs['witype'] || 'button'
                };
                if(scope.btnOptions.width && scope.btnOptions.height){
                    elem.css('overflow','hidden');
                }
                if(attrs.hasOwnProperty('disabled') && attrs['disabled'] != 'false'){// 是否禁用
                    elem[0].disabled = true;
                }
                elem[0].setAttribute('type',scope.btnOptions.type);
            }
        }
    }]);

'use strict';
angular.module('ui.wisoft.camerascanner',['ui.wisoft.alert', 'ui.wisoft.dialog', 'ui.wisoft.imageview'])

    /**
     * @ngdoc directive
     * @name ui.wisoft.camerascanner.directive:wiCamerascanner
     * @restrict E
     *
     * @description
     * 拍照上传
     *
     * @param {string=} url 上传地址.
     * @param {boolean=} toPdf 是否转pdf，默认为true.
     * @param {function=} uploadComplete 上传完成回调.
     *
     */
    .directive('wiCamerascanner',['wiAlert', 'wiDialog', function (wiAlert, wiDialog) {
        return {
            restrict:'E',
            transclude:true,
            templateUrl: 'pcc/template/camerascanner/camerascannerTemplate.html',
            replace:true,
            scope: {
                url:'@'// 上传地址
                ,uploadcomplete:'&'// 上传完成回调
                ,topdf:'@'// 是否转pdf，默认为true
            },
            link: function (scope,element,attrs) {

                var cam = element.find('OBJECT')[0];// 摄像头
                var photoMain = document.querySelector('.wi-camerascanner-main');
                var photo = angular.element(document.querySelector('.wi-camerascanner'));
                var photoList = document.querySelector('.wi-camerascanner-list');// 图片列表div
                var headSelect = document.querySelector('.wi-camerascanner-head-select');// 视频设备选择
                var divLoad = document.createElement("div");// 正在生产图片...
                divLoad.setAttribute('class', 'wi-camerascanner-photo wi-camerascanner-wait');
                var captureBtn = document.querySelector('.wi-camerascanner-btn');// 拍照按钮

                // 供as调用
                window["_webcam_"] = {
                    "debug": function(type, message) {
                        if(type === 'cams') {
                            createSelector(message);
                        } else {
                            scope.debug(type, message)
                        };
                    }
                }

                var sl;
                // 设备选择下拉框
                function createSelector(str) {
                    sl=document.createElement("select");
                    for(var i=str.length-1; i>=0; i--){
                        var name = str[i];
                        name = name.substring(0, name.indexOf(' ('));
                        var item=new Option(name,i);
                        sl.add(item);
                    }
                    sl.onchange = function(){
                        var val = sl.options[sl.options.selectedIndex].value;
                        cam['selectCamera'](val);
                    }
                    headSelect.appendChild(sl);
                    headSelect.style.visibility = 'visible';
                }

                // 调试信息
                scope.debug = function(type, message) {

                    switch (type) {
                        case 1:// 未检测到摄像头
                            wiAlert.error(message);
                            break;
                        case 2:// 无法连接到摄像头
                            wiAlert.error(message);
                            break;
                        case 3:// 上传失败
                            wiAlert.error(message);
                            break;
                        case 4:// 正在生成pdf

                            break;
                        case 5:// 上传成功
                            scope.close();
                            wiAlert.success('上传成功')
                                .yes(function(){
                                    scope.uploadcomplete() && scope.uploadcomplete()(message);
                                })
                            break;
                        case 6:// 连接到摄像头
                            break;
                        default:
                            console.log(type + ": " + message);
                    }
                }

                // 打开摄像头
                scope.open = function() {
                    var docHeight = document.documentElement.clientHeight;
                    photoMain.style['margin-top'] = (docHeight > 592 ? (docHeight-592)/2 : 2) + 'px';
                    photo.removeClass('wi-camerascanner-hide')
                    var val;
                    if(sl) {
                        val = sl.options[sl.options.selectedIndex].value;
                    }
                    cam['openCamera'](val);
                }

                // 关闭摄像头
                scope.close = function() {
                    cam['closeCamera'] && cam['closeCamera']();
                    while (photoList.hasChildNodes()) {
                        photoList.removeChild(photoList.lastChild);
                    }
                    photo.addClass('wi-camerascanner-hide');
                    _index = 0;
                }

                // 旋转
                scope.rotate = function(degree) {
                    cam['rotate'](degree);
                }

                // 重置裁剪区域
                scope.resetCut = function() {
                    cam['resetCut']();
                }

                scope.camResolution = '1200*1600';
                // 切换分辨率
                scope.resolution = function() {
                    var arr = scope.camResolution.split('*');
                    cam['resolution'](arr[0], arr[1]);
                }

                // 拍照
                captureBtn.addEventListener('click', capture, false);

                function capture() {
                    if(_index===20) {
                        wiAlert.warn('不能超过20张，请分批操作');
                    } else {
                        // 正在生成图片
                        var arr = cam['prepareCapture']();
                        divLoad.style.width = '222px';
                        divLoad.style.height = 220/arr[0]*arr[1]+2+'px';
                        photoList.insertBefore(divLoad, photoList.firstChild);

                        setTimeout(function(){
                            show(cam['capture'](null, null, 100));
                        }, 0)
                    }
                }

                var _index = 0, currentIndex;
                // 显示缩略图
                function show(data) {

                    photoList.removeChild(divLoad);

                    var div = document.createElement('div');
                    div.setAttribute('class', 'wi-camerascanner-photo');
                    div.setAttribute('index', _index+'');
                    div.setAttribute('id', '_cam_list_div_'+_index);
                    div.setAttribute('_width', data[1]);
                    div.setAttribute('_height', data[2]);

                    var canvas = document.createElement('canvas'),
                        context = canvas.getContext("2d");

                    canvas.setAttribute('width', data[1]);
                    canvas.setAttribute('height', data[2]);

                    var img = new Image();

                    img.onload = function() {
                        context.drawImage(img, 0, 0, data[1], data[2]);

                        canvas.style.width = '220px';
                        canvas.style.height = 220/data[1]*data[2]+'px';

                        div.style.width = '222px';
                        div.style.height = 220/data[1]*data[2]+2+'px';

                        context.drawImage(context.canvas,0,0);

                        // 双击查看
                        canvas.onclick = function () {
                            scope.$apply(function(){
                                currentIndex = Number(div.getAttribute('index'));
                                getImage(data[1], data[2]);
                                cam.style.visibility = 'hidden';
                            })
                        }

                        div.appendChild(canvas);

                        var a = document.createElement('a');
                        a.setAttribute('href', 'javascript:void(0);');
                        a.setAttribute('class', 'icon-remove');

                        // 移除
                        a.onclick = function () {
                            scope.$apply(function(){

                                var idx = Number(div.getAttribute('index'));
                                cam['removeImg'](idx);

                                photoList.removeChild(div);

                                var brother = photoList.children[idx];
                                while(brother) {
                                    brother.setAttribute('index', idx);
                                    brother.setAttribute('id', '_cam_list_div_'+idx);
                                    brother = photoList.children[++idx];
                                }

                                _index--;
                            })
                        }

                        div.appendChild(a);

                        var txt = document.createElement('div');
                        txt.innerHTML = 'img'+_index;
                        txt.setAttribute('contenteditable', true);

                        div.appendChild(txt);

                        div.onmouseover = function(){
                            txt.style.display = 'block';
                        }

                        div.onmouseout = function(){
                            txt.style.display = 'none';
                        }


                        photoList.insertBefore(div, photoList.firstChild);

                        _index++;
                    }

                    img.src = 'data:image/jpg;base64,' + data[0];

                }

                // 上一个
                scope.previous = function() {
                    if(currentIndex > 0) {
                        currentIndex--;
                    } else {
                        currentIndex = _index-1;
                    }
                    getImage();
                }

                // 下一个
                scope.next = function() {
                    if(currentIndex < _index-1) {
                        currentIndex++;
                    } else {
                        currentIndex = 0;
                    }
                    getImage();
                }

                // 图片查看关闭
                scope.viewClose = function() {
                    cam.style.visibility = 'visible';
                }

                // 获取image数据
                function getImage() {
                    var div = document.getElementById('_cam_list_div_'+currentIndex);
                    var w = Number(div.getAttribute('_width'));
                    var h = Number(div.getAttribute('_height'));
                    scope.imagedata = photoList.children[currentIndex].children[0].getContext("2d").getImageData(0, 0, w, h);
                }

                // 上传
                scope.upload = function() {
                    cam.style.visibility = 'hidden';
                    wiDialog.openConfirm({
                        template: 'cameraScannerConfirm',
                        width:300,
                        title:'请输入文件名'
                    }).then(function (value) {
                        // TODO 文件名不能为空 需加入表单验证
						// 是否转PDF，由第三个参数控制boolean，默认为true
                        if(value) {
                            cam['upload'] && cam['upload'](scope.url, value, !scope.topdf || 'false' != scope.topdf);
                        } else {
                            cam.style.visibility = 'visible';
                        }
                    }, function () {
                        cam.style.visibility = 'visible';
                    });
                }
            }
        };
    }])

/**
 * @ngdoc overview
 * @name ui.wisoft.carousel
 *
 * @description
 * 图片滑动显示组件
 *
 */
angular.module('ui.wisoft.carousel', ['ui.wisoft.transition'])
    .controller('CarouselController', ['$scope', '$timeout', '$transition', function ($scope, $timeout, $transition) {
        var self = this,
            slides = self.slides = $scope.slides = [],
            currentIndex = -1,
            currentTimeout, //定时任务的promise
            isPlaying;
        self.currentSlide = null;

        var destroyed = false;
        /* direction: "prev" or "next" 即可以向左或向右滑动*/
        self.select = $scope.select = function (nextSlide, direction) {
            var nextIndex = slides.indexOf(nextSlide);
            //Decide direction if it's not given
            if (direction === undefined) {
                direction = nextIndex > currentIndex ? 'next' : 'prev';
            }
            if (nextSlide && nextSlide !== self.currentSlide) {
                if ($scope.$currentTransition) {
                    $scope.$currentTransition.cancel();
                    //Timeout so ng-class in template has time to fix classes for finished slide
                    $timeout(goNext);
                } else {
                    goNext();
                }
            }
            function goNext() {
                // Scope has been destroyed, stop here.
                if (destroyed) {
                    return;
                }
                //If we have a slide to transition from and we have a transition type and we're allowed, go
                if (self.currentSlide && angular.isString(direction) && !$scope.noTransition && nextSlide.$element) {
                    //We shouldn't do class manip in here, but it's the same weird thing wisoft does. need to fix sometime
                    nextSlide.$element.addClass('wi-slide-' + direction);
                    //强制回流(重新布局)，调用offsetWidth会处罚浏览器进行重新布局
                    var reflow = nextSlide.$element[0].offsetWidth;

                    //重新将所有的slide的各相关属性为false
                    angular.forEach(slides, function (slide) {
                        angular.extend(slide, {direction: '', entering: false, leaving: false, active: false});
                    });
                    angular.extend(nextSlide, {direction: direction, active: true, entering: true});//将下一个sclide状态设置为entering（进入）
                    angular.extend(self.currentSlide || {}, {direction: direction, leaving: true});//将当前的slide状态设置为leaving（离开）

                    $scope.$currentTransition = $transition(nextSlide.$element, {});
                    //We have to create new pointers inside a closure since next & current will change
                    (function (next, current) {
                        $scope.$currentTransition.then(
                            function () {
                                transitionDone(next, current);
                            },
                            function () {
                                transitionDone(next, current);
                            }
                        );
                    }(nextSlide, self.currentSlide));
                } else {
                    transitionDone(nextSlide, self.currentSlide);
                }
                self.currentSlide = nextSlide;
                currentIndex = nextIndex;
                //每次切换slide都重新启动定时器
                restartTimer();
            }

            //将通过设置class来实现同时只显示一张图片，一开始slide区域 display:none,参见css中.carousel-inner > .item
            function transitionDone(next, current) {
                angular.extend(next, {direction: '', active: true, leaving: false, entering: false});
                angular.extend(current || {}, {direction: '', active: false, leaving: false, entering: false});
                $scope.$currentTransition = null;
            }
        };
        $scope.$on('$destroy', function () {
            destroyed = true;
        });

        /* Allow outside people to call indexOf on slides array */
        self.indexOfSlide = function (slide) {
            return slides.indexOf(slide);
        };

        //向右滑动
        $scope.next = function () {
            var newIndex = (currentIndex + 1) % slides.length;

            //如果当前有transition尚未执行结束，则禁止触发新的transtion
            if (!$scope.$currentTransition) {
                return self.select(slides[newIndex], 'next');
            }
        };

        //向左滑动
        $scope.prev = function () {
            var newIndex = currentIndex - 1 < 0 ? slides.length - 1 : currentIndex - 1;

            //如果当前有transition尚未执行结束，则禁止触发新的transtion
            if (!$scope.$currentTransition) {
                return self.select(slides[newIndex], 'prev');
            }
        };

        $scope.isActive = function (slide) {
            return self.currentSlide === slide;
        };

        $scope.$watch('interval', restartTimer);
        $scope.$on('$destroy', resetTimer);

        function restartTimer() {
            //取消当前的任务
            resetTimer();
            var interval = +$scope.interval;
            if (!isNaN(interval) && interval >= 0) {
                currentTimeout = $timeout(timerFn, interval);
            }
        }

        //如果当前有定时任务则取消当前的任务
        function resetTimer() {
            if (currentTimeout) {
                $timeout.cancel(currentTimeout);
                currentTimeout = null;
            }
        }

        function timerFn() {
            if (isPlaying) {
                $scope.next();
                restartTimer();
            } else {
                $scope.pause();
            }
        }

        //鼠标leave的时候就开始滑动展示图片
        $scope.play = function () {
            if (!isPlaying) {
                isPlaying = true;
                restartTimer();
            }
        };

        //mouseenter时暂停滑动
        $scope.pause = function () {
            //如果允许暂停滑动
            if (!$scope.noPause) {
                isPlaying = false;
                resetTimer();
            }
        };

        //添加一个滑块
        self.addSlide = function (slide, element) {
            slide.$element = element;
            slides.push(slide);
            //if this is the first slide or the slide is set to active, select it
            if (slides.length === 1 || slide.active) {
                self.select(slides[slides.length - 1]);
                if (slides.length == 1) {
                    $scope.play();
                }
            } else {
                slide.active = false;
            }
        };

        self.removeSlide = function (slide) {
            //get the index of the slide inside the carousel
            var index = slides.indexOf(slide);
            slides.splice(index, 1);
            if (slides.length > 0 && slide.active) {
                if (index >= slides.length) {
                    self.select(slides[index - 1]);
                } else {
                    self.select(slides[index]);
                }
            } else if (currentIndex > index) {
                currentIndex--;
            }
        };

    }])

    /**
     * @ngdoc directive
     * @name ui.wisoft.carousel.directive:wiCarousel
     * @restrict EA
     *
     * @description
     * wiCarousel 是图片滑动显示的组件
     *
     * @param {number=} interval 时间间隔, 毫秒为单位, 设置两个图片滑动切换的时间间隔。.
     * @param {boolean=} noTransition 是否禁止图片切换时的动画过度效果。
     * @param {boolean=} noPause 是否禁止暂停滑动 (默认情况下，鼠标移动到图片上时就会暂停滑动图片).
     *
     *
     */
    .directive('wiCarousel', [function () {
        return {
            restrict: 'EA',
            transclude: true,
            replace: true,
            controller: 'CarouselController',
            require: 'wiCarousel',//????为什么自己require自己
            templateUrl: 'pcc/template/carousel/carousel.html',
            scope: {
                interval: '=',
                noTransition: '=',
                noPause: '='
            }
        };
    }])

    /**
     * @ngdoc directive
     * @name ui.wisoft.carousel.directive:wiSlide
     * @restrict EA
     *
     * @description
     * 创建一个slide，只能作为 wiCarousel 的子指令使用，另见：{@link ui.wisoft.carousel.directive:wiCarousel wiCarousel}.
     *
     * @param {boolean=} active 模型绑定, 设定 slide 当前是否为激活状态.
     *
     *
    */
    .directive('wiSlide', function () {
        return {
            require: '^wiCarousel',
            restrict: 'EA',
            transclude: true,
            replace: true,
            templateUrl: 'framework/dist.platform.com-1.0.0/src/carousel/template/carousel/slide.html',
            scope: {
                active: '=?'
            },
            link: function (scope, element, attrs, carouselCtrl) {
                carouselCtrl.addSlide(scope, element);
                //destroy时将slide从slides数组中移除
                scope.$on('$destroy', function () {
                    carouselCtrl.removeSlide(scope);
                });

                scope.$watch('active', function (active) {
                    if (active) {
                        carouselCtrl.select(scope);
                    }
                });
            }
        };
    });

angular.module('ui.wisoft.collapse', ['ui.wisoft.transition'])
/**
 * @ngdoc directive
 * @name ui.wisoft.collapse.directive:wiCollapse
 * @restrict A
 *
 * @description
 * wiCollapse 用于实现元素的折叠展开操作，若元素需指定高度，请在 style 中定义 height，否则无法获取，将默认为 auto。<br />
 * IE9 及以下版本不支持动画；此外，若将 height 设置为 'calc(……)'，切换时将跳过动画。
 *
 * @param {boolean} wiCollapse true 时折叠，false 时展开。
 */
    .directive('wiCollapse', ['$transition', function ($transition) {
        return {
            link: function (scope, element, attrs) {
                var initialAnimSkip = true // 初始化时，是否跳过动画
                    ,currentTransition
                    ,oldCssH;// 记录原始定义的 css 中的 height

                function doTransition(change) {// 过渡到 change ( class 名、函数、style 集合)
                    var newTransition = $transition(element, change);
                    if (currentTransition) {// 取消正在执行的 transition
                        currentTransition.cancel();
                    }
                    currentTransition = newTransition;
                    newTransition.then(newTransitionDone, newTransitionDone);//transition （成功，失败）时执行回调函数，返回新的 promise 对象
                    return newTransition;

                    function newTransitionDone() {// transition 完成后执行
                        if (currentTransition === newTransition) {
                            currentTransition = undefined;
                        }
                    }
                }

                function getCssH(){
                    var h = element[0].style.height;
                    (h=='' || h=='0px') && (h='auto');// 未定义初始高度则为 auto
                    return h;
                }

                function expand() {// 展开
                    !oldCssH && (oldCssH = getCssH());
                    if (initialAnimSkip || oldCssH.indexOf('calc')>=0) {//calc 在IE中无法识别并进行动画，直接跳过
                        initialAnimSkip = false;
                        expandDone();
                    } else {
                        element.removeClass('wi-collapse').addClass('wi-collapsing');// 过渡效果
                        doTransition({ height: oldCssH=='auto'?element[0].scrollHeight + 'px':oldCssH }).then(expandDone);
                    }
                }

                function expandDone() {// 展开动作完成时的状态
                    element.removeClass('wi-collapsing wi-collapse');
                    element.css({height: oldCssH});
                }
                function collapse() {// 折叠
                    !oldCssH && (oldCssH = getCssH());
                    if (initialAnimSkip || oldCssH.indexOf('calc')>=0) {//calc 在IE中无法识别并进行动画，直接跳过
                        initialAnimSkip = false;
                        collapseDone();
                    } else {
                        // transitions 对 height: auto 无效，需要指定初始 height
                        (oldCssH=='auto') && element.css({ height: element[0].scrollHeight + 'px' });
                        // 触发 reflow，使 height 更新 —— 上一步似乎已经达到这个效果
                        var x = element[0].offsetWidth;// 去掉后折叠时 360 中不出现动画
                        element.addClass('wi-collapsing');
                        doTransition({ height: 0 }).then(collapseDone);
                    }
                }

                function collapseDone() {// 折叠动作完成时的状态
                    element.removeClass('wi-collapsing').addClass('wi-collapse');
                    element.css({height: 0});
                }

                scope.$watch(attrs.wiCollapse, function (shouldCollapse) {// 监听 collapse 属性，true 则折叠，false 则展开
                    if (shouldCollapse) {
                        collapse();
                    } else {
                        expand();
                    }
                });
            }
        };
    }]);

'use strict';
angular.module('ui.wisoft.combobox',['ui.wisoft.popup'])

    .constant('comboboxConfig',{
        liHeight: 18, // 弹出框li高度
        emptyMenuHeight: 12 // 弹出框空内容时高度 2 *（border + padding）
    })

    // 前端匹配
    .filter('comboboxFilter', ['comboboxService', function (comboboxService) {
        return function (data, key, labelField, groupfield) {
            var result;

            if(!key || key.length===0) {
                result = data;
            } else {
                result = [];

                angular.forEach(data, function (item) {
                    if(0===item[labelField].toLowerCase().indexOf(key.toLowerCase())) {
                        result.push(item);
                    }
                })
            }

            groupfield && (result = comboboxService.initData(result, labelField, groupfield));

            return result;
        }
    }])

    .factory('comboboxService', function () {
        var comboboxService = {};

        // 分组数据转换（数据源，label 域，group 域）TODO 未考虑数据源顺序
        comboboxService.initData = function (data, labelfield, groupfield) {
            var result = [], group = {};
            angular.forEach(data, function (item) {
                if(item[groupfield] && !group[item[groupfield]]) {
                    var gp = {};
                    gp[labelfield] = item[groupfield];
                    gp['isGroup'] = true;
                    result.push(gp);
                    result.push(item);
                    group[item[groupfield]] = gp;
                } else {
                    result.push(item);
                }
            });
            return result;
        };
        return comboboxService;
    })

/**
 * @ngdoc directive
 * @name ui.wisoft.combobox.directive:wiCombobox
 * @restrict E
 *
 * @description
 * 下拉框
 *
 * @param {array=} dataprovider 数据源.
 * @param {object=} selecteditem 默认选中条目.
 * @param {pixels=} dropdownwidth 弹出框宽度(不含单位：px)。未定义时，若定义了纯数字的 width,默认为 width,否则默认由文本自动撑.
 * @param {string=} labelfield 显示字段，默认为"name".
 * @param {string=} groupfield 分组字段.
 * @param {string=} rowcount 显示行数，默认为"5".
 * @param {boolean=} editable 是否可输入，默认为"true".
 * @param {boolean=} multiselect 多选.
 * @param {boolean=} enable 是否可用.
 * @param {number|length=} width 组件宽度，默认为 150px。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {function=} itemchange 选中条目改变事件.
 *
 */
    .directive('wiCombobox',['$filter','$timeout','comboboxService','comboboxConfig',
        function ($filter, $timeout, comboboxService, comboboxConfig) {
            return {
                restrict:'E',
                templateUrl: 'pcc/template/combobox/comboboxTemplate.html',
                replace:true,
                scope: {
                    //Properties
                    dataprovider:'='// 数据源
                    ,itemrenderer:'@'// 自定义渲染
                    ,labelfield:'@'// 显示字段，默认为"name"
                    ,valuefield:'@'// 值字段
                    ,groupfield:'@'// 分组字段
                    ,wimodel:'='// 值对象
                    ,labelfunction:'&'// 自定义显示文本
                    ,prompt:'@'// 提示文本，默认为"--请选择--"
                    ,rowcount:'@'// 显示行数，默认为"5"
                    ,rowheight:'@'// 行高
                    ,selecteditem:'='// 所选条目，默认为null
                    ,editable:'@'// 是否可输入，默认为"true"，TODO 输入时autoComplete，
                    ,multiselect:'@'// 多选
                    ,enable:'@'// 是否可用
                    //Events
                    ,itemchange:'&'// 所选条目改变
                },
                require: 'wiPopup',
                link: function (scope,element,attrs,popupCtrl) {
                    var parentScope = scope.$parent,
                        vm = scope.vm = {},
                        input = element.find('INPUT');// 文本框
                    /**
                     * 根据wimodel设置初始选中条目
                     * itemChange的时候同步更新wimodel
                     */
                    // 初始化
                    vm.labelfield = scope.labelfield || 'name';// 用于显示的字段名
                    vm.valuefield = scope.valuefield || 'value';// 值字段
                    vm.prompt = scope.prompt || '--请选择--';
                    vm.editable = scope.editable !== 'false';
                    vm.enable = scope.enable;
                    vm.selecteditem = scope.selecteditem || null;
                    // 分组数据处理
                    if(scope.groupfield) {
                        vm.dataprovider = comboboxService.initData(scope.dataprovider, vm.labelfield, scope.groupfield);
                    } else {
                        vm.dataprovider = scope.dataprovider;
                    }
                    vm.rowcount = Math.min(vm.dataprovider.length, scope.rowcount || 5);// 下拉菜单显示行数 TODO 数据量动态变化
                    scope.multiselect && input.attr("readOnly",'true');// 多选禁止输入
                    !vm.editable && input.attr("readOnly",'true');// 只读
                    vm.selectedindex = vm.selecteditem ? vm.dataprovider.indexOf(vm.selecteditem) : -1;// 默认选中条目 - 默认为 -1

                    // 从属性获取 dropdownwidth，弹出部分的宽度
                    var dropdownwidth = parentScope.$eval(attrs['dropdownwidth']);
                    (!angular.isNumber(dropdownwidth)) && (dropdownwidth = undefined);
                    // 从属性获取 width，并处理
                    (function(attr){
                        if(!attr) return;
                        var width;
                        if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                            width = attr;
                        }else{// 非数字开始，可能是 scope 对象
                            width = parentScope.$eval(attr);
                        }
                        if(Number(width)){
                            element.css('width', width + 'px');
                            (!dropdownwidth) && (dropdownwidth = width);// 若未定义 dropdownwidth，则为 width
                        }else{
                            element.css('width', width);
                        }
                    })(attrs['width']);

                    // 向 popup 服务中传递弹出项配置
                    popupCtrl.popupOptions.height = comboboxConfig.emptyMenuHeight + comboboxConfig.liHeight * vm.rowcount;
                    popupCtrl.popupOptions.width = dropdownwidth;
                    vm.selecteditem && (vm._text = vm.selecteditem[vm.labelfield]);// input 中显示选中项 label

                    if(scope.wimodel != undefined) {
                        angular.forEach(vm.dataprovider, function (item, index) {
                            if(item[vm.valuefield] == scope.wimodel) {
                                vm._text = item[vm.labelfield];
                                vm.selectedindex = index;
                            }
                        });
                    }

                    // 若定义了 enable，监听禁用状态
                    if(attrs.hasOwnProperty('enable')){
                        scope.$watch('enable', function (oldValue, newValue) {
                            if(oldValue !== newValue) {
                                vm.enable = (oldValue === 'false');
                            }
                        });
                    }

                    /* 事件监听 */
                    var _onFocus = false;// 标记是否聚焦
                    input[0].addEventListener('focus', focus);
                    function focus(event) {// 聚焦已关闭的 combobox，打开
                        if(!vm.isopen) {
                            scope.$apply(function () {
                                vm.isopen = true;// 在 popup 服务中，焦点转移至 element
                                _onFocus = true;
                            });
                        }
                        event.stopPropagation();
                    }
                    element[0].addEventListener('blur',function(){// 失焦时修改 _onFocus - 失焦时由 popup 服务关闭
                        _onFocus = false;
                    });
                    input[0].addEventListener('click', inputClick);
                    function inputClick(event) {
                        if(_onFocus && vm.isopen) {// 若 _onFocus=true 且已打开，修改 _onFocus，此时聚焦元素为 element
                            _onFocus = false;
                            event.stopPropagation();// 禁止冒泡，防止在 popup 中再次修改 vm.isopen
                        }
                    }

                    // 列表项点击事件 - data：被点击的列表项数据
                    vm.itemClickHandler = function (data,event) {
                        if(data['isGroup']) {
                            // 阻止事件传播，不关闭弹出框
                            event.stopPropagation();
                            return;
                        }
                        if(scope.multiselect) {// 多选
                            event.stopPropagation();
                            data['_checked'] = !data['_checked'];// 修改选中状态
                            var txt = [],selItems = [];// 所有选中项文本及选中项
                            angular.forEach(scope.dataprovider, function (item) {
                                if(item['_checked']) {
                                    txt.push(item[vm.labelfield]);
                                    selItems.push(item);
                                }
                            });

                            vm.selecteditem = selItems;
                            vm._text = txt.join('; ');
                            // TODO 多选时model如何传

                        } else {// 单选
                            if(data != vm.selecteditem) {
                                scope.itemchange() && scope.itemchange()(data);
                            }
                            vm.selecteditem = data;
                            vm.selectedindex = vm.dataprovider.indexOf(vm.selecteditem);
                            vm._text = data[vm.labelfield];
                            scope.wimodel = data[vm.valuefield];
                        }
                    };

                    // 根据输入的内容过滤下拉框数据
                    vm.inputChange = function () {
                        $timeout(function(){
                            vm.dataprovider = $filter('comboboxFilter')(scope.dataprovider,vm._text,vm.labelfield,scope.groupfield);
                            if(!vm.isopen){
                                vm.isopen = true;
                            }
                            vm.selectedindex = ((vm.dataprovider.length > 0 && vm._text.length > 0) ? 0 : -1);
                            // 选中第一个非group
                            while(vm.dataprovider[vm.selectedindex]
                                && vm.dataprovider[vm.selectedindex]['isGroup']
                                && vm.selectedindex < vm.dataprovider.length) {
                                vm.selectedindex ++;
                            }
                        },0)
                    };

                    // 上、下、回车
                    vm.keydownHandler = function (event) {
                        var keyCode = event.keyCode;

                        // 上
                        if(keyCode === 38) {
                            do {
                                (vm.selectedindex !== 0 && vm.selectedindex !== -1) ? vm.selectedindex-- : vm.selectedindex = vm.dataprovider.length - 1;
                            } while(vm.dataprovider[vm.selectedindex]['isGroup'] && vm.selectedindex>=0);
                        }
                        // 下
                        else if(keyCode === 40) {
                            do {
                                vm.selectedindex < (vm.dataprovider.length - 1) ? vm.selectedindex++ : vm.selectedindex = 0;
                            } while(vm.dataprovider[vm.selectedindex]['isGroup'] && vm.selectedindex < vm.dataprovider.length);
                        }
                        // 回车
                        else if(keyCode === 13) {
                            if(vm.isopen) {
                                vm.dataprovider = $filter('comboboxFilter')(scope.dataprovider,'',vm.labelfield,scope.groupfield);
                                vm.selectedindex = vm.dataprovider.indexOf(vm.selecteditem);
                            } else {
								var selitem = vm.dataprovider[vm.selectedindex];
								if(vm.selecteditem != selitem) {
									scope.itemchange() && scope.itemchange()(selitem);
								}
                                vm.selecteditem = selitem;
                                vm.selecteditem && (vm._text = vm.selecteditem[vm.labelfield]) && (scope.wimodel = vm.selecteditem[vm.valuefield]);
                            }
                        }
                        else return;

                        $timeout(function () {
                            popupCtrl.popupOptions.elem[0].scrollTop = comboboxConfig.liHeight * vm.selectedindex;// 滚动到选中项
                        })
                    };

                    // TODO 是否需要，若需要未考虑 input.focus
                    vm.clickHandler = function () {
                        popupCtrl.popupOptions.elem[0].scrollTop = comboboxConfig.liHeight * vm.selectedindex;
                        if(vm.isopen) {
                            vm.dataprovider = $filter('comboboxFilter')(scope.dataprovider,'',vm.labelfield,scope.groupfield);
                        }
                    }

                }
            };
        }]);
'use strict';
/**
 * 解决使用$http.post时,springmvc后台获取不到参数的问题。
 * angularjs的$http.post不同于jquery，需要进行处理以便springmvc后台可以正常获得参数值。
 */
var wiResetHttpProvider = ['$httpProvider', function($httpProvider) {
    // Use x-www-form-urlencoded Content-Type
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    /**
     * The workhorse; converts an object to x-www-form-urlencoded serialization.
     * @param {Object} obj
     * @return {String}
     */
    var param = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;

        for(name in obj) {
            value = obj[name];

            if(value instanceof Array) {
                for(i=0; i<value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value instanceof Object) {
                for(subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            }
            else if(value !== undefined && value !== null)
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }

        return query.length ? query.substr(0, query.length - 1) : query;
    };

    // Override $http service's default transformRequest
    $httpProvider.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}];

angular.module('ui.wisoft.common', [])
    .config(wiResetHttpProvider)//解决使用$http.post时,springmvc后台获取不到参数的问题。
    .factory('wiCommonSev',[function(){
        return{
            // 尺寸类型的属性处理方法（其他组件中也存在类似方法，依赖于 scope），可接受的值：数字、数字开头、scope 对象（数字、数字开头）
            getSizeFromAttr :function(attr, scope){
                if(!attr) return;
                var size;
                if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                    size = attr;
                }else if(scope){// 非数字开始，可能是 scope 对象
                    size = scope.$eval(attr);
                }
                Number(size) && (size += 'px');// 是数字则加上单位 px
                return size;
            }
        };
    }]);
angular.module('ui.wisoft.datagrid',['ui.wisoft.bindHtml', 'ui.wisoft.resizelistener'])
    .constant('dgConf',{
        'defaultColWidth': 120 // 未指定列宽时最小的列宽
        ,'miniColWidth': 60 // 拖动列时最小的列宽
        ,'pageBarHeight': 30 // pageBar 高度
        ,'headerHeight': 50 // 表格头部默认行高
        ,'rowHeight': 40 // 表格内容部分行高
        ,'scrollBarSize': 17 // 滚动条尺寸
        ,'leftColWidth': 30 // 序号、复选框列宽度
        ,'dragDivWidth': 3 // 监听拖拽的 DIV 宽度
        ,'dgBorder': 1 // 整个组件的外部边框 size
        ,'treeIndent': 16 // 树中子节点缩进
    })

    .value('excelTemplate',{'worksheet_template':'<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:html="http://www.w3.org/TR/REC-html40"><Styles><Style ss:ID="Default" ss:Name="Normal"><Alignment ss:Vertical="Center"/><Borders/><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000"/><Interior/><NumberFormat/><Protection/></Style><Style ss:ID="s62"><NumberFormat ss:Format="Short Date"/></Style><Style ss:ID="s63"><Font ss:FontName="宋体" x:CharSet="134" ss:Size="11" ss:Color="#000000" ss:Bold="1"/></Style></Styles><Worksheet ss:Name="Sheet1"><Table>{{COLUMNS}}{{ROWS}}</Table><WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel"><PageSetup><Header x:Margin="0.3"/><Footer x:Margin="0.3"/><PageMargins x:Bottom="0.75" x:Left="0.7" x:Right="0.7" x:Top="0.75"/></PageSetup><Unsynced/><Selected/><FreezePanes/><FrozenNoSplit/><SplitHorizontal>1</SplitHorizontal><TopRowBottomPane>1</TopRowBottomPane><ActivePane>2</ActivePane><Panes><Pane><Number>3</Number><ActiveRow>2</ActiveRow><ActiveCol>1</ActiveCol></Pane></Panes><ProtectObjects>False</ProtectObjects><ProtectScenarios>False</ProtectScenarios></WorksheetOptions></Worksheet></Workbook>'
        ,'column_template':'<Column ss:Width="{{WIDTH}}"/>'
        ,'head_template':'<Row ss:Height="14.25" ss:StyleID="s63">{{CELL}}</Row>'
        ,'row_template':'<Row ss:AutoFitHeight="0">{{CELL}}</Row>'
        ,'cell_template':'<Cell><Data ss:Type="String">{{NAME}}</Data></Cell>'
        ,'cell_template_date':'<Cell ss:StyleID="s62"><Data ss:Type="DateTime">{{NAME}}</Data></Cell>'
        ,'cell_template_number':'<Cell><Data ss:Type="Number">{{NAME}}</Data></Cell>'})

    .factory('dgService', ['excelTemplate',function (excelTemplate) {
        return{
            isEmptyRow: function(obj){
                for (var name in obj){
                    return false;
                }
                return true;
            },
            allChecked: function (dataprovider) {
                if(dataprovider && dataprovider.length > 0){
                    for(var i= 0, item; i<dataprovider.length; i++){
                        item = dataprovider[i];
                        if(!this.isEmptyRow(item) && !item.__ischecked) return false;// 有非空行未选中，则返回 true
                    }
                }
                return true;
            },
            uncheckAll:function(pagedata){
                angular.forEach(pagedata,function(data){
                    data.__ischecked=false;
                })
            },
            base64: function (string) {
                return window.btoa(unescape(encodeURIComponent(string)));
            },
            isDate: function (RQ) {
                var date = RQ+'';
                var result = date.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);

                if (result == null)
                    return false;
                var d = new Date(result[1], result[3] - 1, result[4]);
                return (d.getFullYear() == result[1] && (d.getMonth() + 1) == result[3] && d.getDate() == result[4]);
            },
            table2excel: function (rows, colwidths) {
                var col_data = '',
                    row_data = '';
                angular.forEach(colwidths, function(val){
                    col_data += excelTemplate.column_template.replace('{{WIDTH}}', val*3/4);
                });

                for (var i = 0, length = rows.length; i < length; i++) {
                    var cells = rows[i],
                        cell_data = '';
                    for(var j=0, len = cells.length; j<len; j++) {
                        if(this.isDate(cells[j])){
                            cell_data += excelTemplate.cell_template_date.replace('{{NAME}}', cells[j]+'T00:00:00.000');
                        }else if(angular.isNumber(cells[j])){
                            cell_data += excelTemplate.cell_template_number.replace('{{NAME}}', cells[j]);
                        }else{
                            cell_data += excelTemplate.cell_template.replace('{{NAME}}', cells[j]);
                        }
                    }
                    if(i===0){
                        row_data += excelTemplate.head_template.replace('{{CELL}}', cell_data);
                    }else{
                        row_data += excelTemplate.row_template.replace('{{CELL}}', cell_data);
                    }
                }

                return excelTemplate.worksheet_template.replace('{{COLUMNS}}', col_data).replace('{{ROWS}}', row_data);
            },
            table2excelByIE: function (rows, colwidths) {
                var oXL = null;
                try {
                    oXL = new ActiveXObject("Excel.Application");
                } catch(e) {
                    oXL = new ActiveXObject("ET.Application");
                }

                try {
                    var oWB = oXL.Workbooks.Add();
                    var oSheet = oWB.ActiveSheet;

                    angular.forEach(colwidths, function (val,index) {
                        oSheet.Columns(index+1).ColumnWidth = val/8;
                    })

                    for (var i = 0, length = rows.length; i < length; i++) {
                        for(var j=0, len = rows[i].length; j<len; j++) {
                            if(i===0) {
                                oSheet.Cells(i+1,j+1).Font.Bold = true;
                                oSheet.Cells(i+1,j+1).Font.Size = 11;
                            }
                            if(!this.isDate(rows[i][j]) && !angular.isNumber(rows[i][j])) {
                                oSheet.Cells(i+1,j+1).NumberFormatLocal = "@";
                            }
                            oSheet.Cells(i+1,j+1).value = rows[i][j];
                        }
                    }

                    oXL.Visible = true;
                    oXL.UserControl = true;
                } catch(e) {
                    oXL.Application.Quit();
                    console.error(e)
                } finally {
                    oXL = null;
                }

                //oXL.SaveAs("C:\\TEST.XLS");
            }
        };
    }])

/**
 * @ngdoc directive
 * @name ui.wisoft.datagrid.directive:wiDatagrid
 * @restrict E
 *
 * @description
 * 数据表格
 *
 * @param {object=} wiid 供外部调用.
 * @param {function=} wiid.getSelectedItems 获取选中条目 多选.
 * @param {function=} wiid.getSelectedItem 获取选中条目 单选.
 * @param {array=} dataprovider 数据源，若定义了 dataurl，此属性失效.
 * @param {string=} dataurl 请求数据的url，若定义了此属性，dataprovider 失效.
 * @param {string=} params 请求数据的参数（lx, keyword, start, limit）.
 * @param {string=} pagemode 分页模式：client:前台分页 server：后台分页 none:不启用分页(将隐藏分页工具条).
 * @param {function=} itemclick 单击事件.（itemclick和itemdoubleclick不能同时设置）
 * @param {function=} itemdoubleclick 双击事件.（itemclick和itemdoubleclick不能同时设置）
 * @param {object=} columns 通过数据源实现的列定义.
 * @param {number=} lockcolumns 锁定前几列.
 * @param {function=} rowcolorfunction 设置行颜色.
 * @param {boolean=} showno 显示行序号，默认为 false，不显示序号.
 * @param {boolean=} multiselect 多选，默认为 false，不显示复选框.
 * @param {string=} treefield 树节点字段.
 * @param {boolean=} collapse 初始化时树型节点是否折叠，false 时展开，默认为 true。
 * @param {function=} itemopen 节点展开，动态获取子节点数据 children[]。itemopen(data, callback))<br />参数：data 要展开的节点数据，callback 回调函数，获取 children[] 后，需手动执行 callback(data, children[]).
 * @param {number|percent=} width 宽度.指令直接从属性值attrs['width']获取数字(不含单位：px)或百分比.
 * @param {number|percent=} height 高度.指令直接从属性值attrs['height']获取数字(不含单位：px)或百分比.
 * @param {number=} headerheight 表头的行高.(不含单位：px),默认为 50.
 * @param {number=} rowheight 表内容的行高.(不含单位：px),默认为 40.
 * @param {boolean=} wordwrap 单元格内容是否支持自动换行，默认为 false，若定义了 lockcolumn，此属性失效。
 * @param {array=} pageselect 每页显示数量.默认为：[20,30,40,50,60]
 * @param {boolean=} showexcel 显示excel按钮.
 * @param {boolean=} showrefresh 显示刷新按钮.
 * @param {number=} pagebarHeight 分页栏高度.(不含单位：px),默认为 30.
 * @param {string=} pagebarrenderer 自定义工具条.
 *
 */
    .directive('wiDatagrid',['$compile','$templateCache','$http','$timeout','$q','$parse','wiResizeListener','dgService','dgConf',function($compile,$templateCache,$http,$timeout,$q,$parse,wiResizeListener,dgService,dgConf){
        return{
            restrict:'E',
            transclude:true,
            replace:true,
            scope: {
                wiid:'=',
                columns:'=',// 通过数据源设置的列定义
//                dataprovider:'=',// 数据源
                itemclick:'&',// 单击事件
                itemdoubleclick:'&',// 双击事件 - 不能与单击事件同时定义？
                treefield:'@',//树节点字段
//                collapse:'@',//树型节点是否展开，true:全不展开，false:全展开，默认不展开
                itemopen:'&',//节点展开事件

                //样式
                rowheight:'@',// 数据行行高
                hscrollpolicy:'@',// overflow-x？
                vscrollpolicy:'@',// overflow-y？
                rowcolorfunction:'&',//设置行的颜色

                //pagebar属性
                pageselect:'=',//每页显示数量数组，默认为：[20,30,40,50,60]
                dataurl:'@',//请求数据的url
                params:'=',//请求数据的参数
                success:'&',//请求成功后的回调事件
                error:'&',//请求失败后的回调事件
                showexcel:'@',//显示excel按钮
                excelexport:'&',//excel导出回调事件
                showrefresh:'@',//显示刷新按钮
                pagemode:'@',//分页模式：client:前台分页 server：后台分页 none:不启用分页(将隐藏分页工具条)
                pagebarrenderer:'@'//自定义工具条
            },
            templateUrl:'template/datagrid/datagridTemplate.html',
            controller: ['$scope',function ($scope) {
                $scope.maxLevel = 0;// 表头部分的最大层级数
                $scope.heads = [];// 第一行
                $scope.columnDefs = [];// 列集合（不含 group）

                // 子指令 column 调用定义列
                this.addColumnDef = function(column) {
                    $scope.columnDefs.push(column);
                };

                var columns = [];// 临时列定义，子指令 group 定义时从中获取 column
                // 将 childColumn 加入到临时列定义队列，供 group 指令从中获取
                this.addChildCol = function(column){
                    columns.push(column);
                };
                // 删除并返回列定义中的第一个 column
                this.getChildCol = function(){
                    return columns.shift();
                };

                // 获取表头信息 - top 部分第一行信息
                this.addHeadDef = function(head, maxLevel) {
                    $scope.heads.push(head);
                    if(maxLevel > $scope.maxLevel) $scope.maxLevel = maxLevel;
                };
            }],
            link:function(scope,element,attrs,datagridCtrl){
                //整个表格主要分为5块区域：左上，右上，左下，右下和分页工具条
                var divChildren = element.children(),
                    leftTopDiv = divChildren.eq(0),//左上div,锁定表头区域
                    rightTopDiv = divChildren.eq(1),//右上div，表头区域
                    leftBottomDiv = divChildren.eq(2),//左下div，锁定列区域
                    rightBottomDiv = divChildren.eq(3),//右下div,内容滚动区域
                    pagebarDiv = divChildren.eq(4),//分页工具条
                    dragline = divChildren.eq(5),//拖拽表头时显示的线
                    maskDiv = divChildren.eq(6),//遮罩层
                    ngTranscludeDiv = divChildren.eq(7);//ngTranscludeDiv
                var colDefs = scope.columnDefs //列定义信息，代码中访问频率较高，定义成局部变量可以提升性能
                    ,defaultColWidth = dgConf.defaultColWidth //默认列宽,未指定列宽时最小的列宽
                    ,document = window.document
                    ,gridParentElement = element[0].parentElement //datagrid 的父元素
                    ,reqParams = scope.params || {} // 向 dataurl 请求数据时需要的参数
                    ,initColsW = [] // 记录用户初始化时定义的列宽
                    ,unWidthCols = []; //未指定宽度的列下标
                /**
                 * griddata 用来保存表格数据
                 * 分为以下几种情况：
                 *  a)前台分页：griddata 保存所有页的数据,pagedata 则只保存当页数据
                 *  b)不分页：griddata 和 pagedata一样，都是保存所有页的数据
                 *  c)后台分页：griddata 和 pagedata一样，都只保存当页的数据
                 */
                var griddata = undefined
                    ,pagedata = scope.pagedata = [];//用于当页显示的数据
                /* 处理用户定义的尺寸值，使之合法 */
                var width = attrs['width']
                    ,height = attrs['height'];
                if(!angular.isNumber(width)){// 非数字
                    if(Number(width)){// 可以转换为数值
                        width = Number(width);
                    }else if (!angular.isString(width) || width.indexOf('%') == -1) {// 不合法的值都以 100% 计算
                        width = '100%';
                    }
                }
                if(!angular.isNumber(height)){// 非数字
                    if(Number(height)){// 可以转换为数值
                        height = Number(height);
                    }else if (!angular.isString(height) || height.indexOf('%') == -1) {// 不合法的值都以 100% 计算
                        height = '100%';
                    }
                }
                element.css({'width': width +(angular.isNumber(width)?'px':''),'height': height +(angular.isNumber(height)?'px':'')}); // 整个组件尺寸
                var divStyle = {
                    'topHeight': scope.$eval(attrs['headerheight']) || dgConf.headerHeight // leftTop、rightTop 的高度，获取层级后会调整
                    ,'pagebarHeight': scope.$eval(attrs['pagebarHeight']) || dgConf.pageBarHeight //pagebar高度
                    ,'leftWidth': 0
                    ,'rightWidth': 0
                };
                var staticSize= angular.isNumber(width) && angular.isNumber(height);// 尺寸固定

                /**
                 * 检测obj是否是空对象(不包含任何可读属性)。
                 * 方法既检测对象本身的属性，也检测从原型继承的属性(因此没有使hasOwnProperty)。
                 */
                var isEmptyObject = dgService.isEmptyRow;

                /**
                 * 若定义了 columns，获取定义的列，在 initScope 及 initHeadArray 前执行
                 * 遍历 children，将修改 parent 的 colspan、maxLevel、children
                 */
                var getColsByColumns = function(){// TODO 若定义了 columns 属性，是否忽略通过子指令定义的列
                    if(!scope.columns) return;
                    var maxLevel;// 记录顶层 group 的最大层级（含自身）-每个顶层 group 定义时设置为1
                    var manageChildren = function(cols, parent){
                        angular.forEach(cols, function(col){
                            var obj;
                            if(col.children){// group
                                obj = {
                                    level: parent.level + 1// 子层级为父层级+1，需在 manageChildren 前设置
                                    ,parent: parent
                                    ,type: 'childGroup' //标识此对象为非顶层的group
                                    ,text: col.headtext || ''
                                    ,colspan: 0
                                    ,children: []
                                };
                                manageChildren(col.children, obj);// 递归设置 children
                                if(obj.colspan == 0) obj.colspan = 1;// 若 group 下未定义列，默认占一列
                                parent.colspan += obj.colspan;// 将包含的列数累加到 parent
                            }else{// column
                                obj = {
                                    level: parent.level + 1// 子层级为父层级+1
                                    ,parent: parent
                                    ,type: 'childColumn' //标识此对象为非第顶层的column(直接在datagrid下的column)
                                    ,text: col.headtext || ''
                                    ,colspan: 1
                                    ,datafield: col.datafield
                                    ,itemrenderer: col.itemrenderer
                                    ,headrenderer: col.headrenderer
                                    ,width: col.width
                                    ,sortable: col.sortable
                                    ,align: col.align||'center'
                                };
                                parent.colspan ++;// parent 列数加1
                                datagridCtrl.addColumnDef(obj);// 加入列定义
                            }
                            if(obj.level > maxLevel) maxLevel = obj.level;
                            parent.children.push(obj);
                        });
                    };
                    angular.forEach(scope.columns,function(col){
                        var head;
                        if(col.children){// 顶层 group
                            maxLevel = 1;
                            head = {
                                level : 1 //顶层层级为1
                                ,type : 'topGroup'//标识此对象为顶层的group
                                ,text : col.headtext || ''
                                ,colspan: 0
                                ,children : [] // 用来存储顶层group的子元素，子元素如果是group，则子元素也有children属性
                            };
                            manageChildren(col.children, head);// 处理 children 时可能会改变 maxLevel
                            head.maxLevel = maxLevel;// 最大层级数
                            if(head.colspan == 0) head.colspan = 1;// 若 group 下未定义列，默认占一列
                        }else{// 顶层 col
                            head = {
                                level: 1 //顶层层级为1
                                ,type: 'topColumn'// 标识为顶层的column，即直接在datagrid下的column
                                ,text: col.headtext || ''
                                ,colspan: 1
                                ,datafield: col.datafield
                                ,itemrenderer: col.itemrenderer
                                ,headrenderer: col.headrenderer
                                ,width: col.width
                                ,sortable: col.sortable
                                ,align: col.align||'center'
                            };
                            datagridCtrl.addColumnDef(head);// 加入列定义
                            maxLevel = 1;
                        }
                        datagridCtrl.addHeadDef(head, maxLevel);
                    });
                };

                /* 初始化 scope */
                var initScope = function(){
                    scope.rightW = 0;// 右侧表格实际宽度 - 如不定义宽度，将导致：单元格自动隐藏失效、表格宽度异常等
                    scope.lockcolumns = Math.min((scope.$eval(attrs['lockcolumns']) || 0),colDefs.length); // 锁定的列数，默认不锁定列，若超过总列数，lockcolumn 取总列数
                    scope._wordwrap = (scope.lockcolumns>0) ? false : scope.$eval(attrs['wordwrap']);// 单元格内容是否支持自动换行，定义了锁定列时，禁止换行
                    scope.isCheckAll = false;// 是否全部选中
                    scope.showno = scope.$eval(attrs['showno']) || false;// 是否显示序号，默认不显示
                    scope.multiselect = scope.$eval(attrs['multiselect']) || false;// 是否支持多选（显示复选框列），默认不支持

                    // 分页相关
                    scope.selectedPageSize = scope.pageselect ? scope.pageselect[0] : 20;//每页显示数量默认值
                    scope.pageNum = 1;//当前页索引
                    scope.pageStart = (scope.pageNum - 1) * scope.selectedPageSize + 1;// 当前页中第一条数据的序号
                    scope.pageCount = 1;//总页数
                    scope.dataCount = 0;//总条数
                    /**
                     * 改变每页显示的数量时，跳转到第一页
                     * angular会运行完watch中的方法才更新UI,这导致size换为较大时pagesize下拉框会在页面上停留大约400～500ms
                     * 使用$timeout可以使得下拉框UI立即更新，运算后的数据绑定放到下一轮的UI更新，这样可以获得更好的用户体验，
                     * 使用$timeout会触发新的一次digest(在angularjs的$digest()里加上打印语句就可以看到加上$timeout后会执行两次digest)
                     */
                    scope.$watch('selectedPageSize',function(newValue,oldValue){
                        if(newValue != oldValue){
                            $timeout(function(){
                                getGridData();// 重新获取 griddata
                            })
                        }
                    });
//                    scope.isclear = false;//表示是否当前正在清空数据

//                    scope.collapse = (scope.collapse!='false');
                    scope.collapse = (attrs['collapse']!='false');
                    scope._rowheight = scope.rowheight||dgConf.rowHeight;//默认值，td 高度
                    /**
                     *  将所有设置的labelfunction存储在scope.lblFuns对象中
                     *  以column的datafield为key,值为设置的labfunction本身
                     */
                    scope.lblFuns=(function(){
                        var lblFuns={};
                        angular.forEach(colDefs,function(colDef){
                            if(colDef.labfunction){
                                lblFuns[colDef.datafield] = colDef.labfunction();
                            }
                        });
                        return lblFuns;
                    })();

                    // 数据源控制
                    if(scope.dataurl){ // 定义了 dataurl，则 dataprovider 失效
                        scope.dataprovider = undefined;
                    }
                    else{
                        var _setDataprovider
                            ,parentScope = scope.$parent;
                        if (attrs.dataprovider) {// 有 dataprovider 属性，监听
                            var _getDataprovider = $parse(attrs.dataprovider);
                            _setDataprovider = _getDataprovider.assign;
                            scope.dataprovider = _getDataprovider(parentScope);
                            _setDataprovider && parentScope.$watch(_getDataprovider, function(val, wasVal) {
                                if(val !== wasVal) scope.dataprovider = val;
                            });
                        }else{// 未定义 dataurl
                            scope.dataprovider = [];
                        }
                        /**
                         * 监听dataprovider的变化
                         * 用户进行了重新检索等操作改变了dataprovider后，重新跳转到第一页
                         * 下面的写法很不好，整理好getAndSetPageData后需要修改。。。。。。
                         */
                        scope.$watchCollection('dataprovider',function(newValue, oldValue){
                            if(newValue != oldValue){
                                if(!scope.dataprovider) scope.dataprovider=[];
                                //如果清空了数据，则计算页面空间可以显示多少空行，向dataprovider中添加相应数据的空对象 - 不再支持补白
                                if(scope.dataprovider.length==0){
                                    scope.isclear = true;
                                    pagedata.length=0;
                                }else{
                                    getGridData();// 重新获取数据并显示第一页
                                    scope.isclear ? scope.dataCount=0 : null;
                                    scope.isclear = false;
                                }
                                if(_setDataprovider){
                                    _setDataprovider(parentScope, newValue);// 同时修改数据源
                                }
                            }
                        });
                    }
                };

                // TODO 必须保证在所有列定义完成后运行，以确保获得正确的 maxLevel
                /**
                 * 根据 scope.maxLevel 创建用于存放 head 部分各行的数组 headarray
                 * 多表头的实现是借助于table的rowspan和colspan来实现的
                 * headarray的行数等于最大层级数
                 * 每一行都是一个数组对象，用来存储每个列td的信息
                 */
                var initHeadArray = function(){
                    var heads = [];
                    for (var h = 0; h < scope.maxLevel;) {
                        heads[h++] = [];
                    }
                    return heads;
                };
                /**
                 * 递归函数，根据表头 scope.heads（第一行） 完成 scope.headarray（所有行） 的内容填充
                 * controller中准备好的head信息是一组一组的信息，它可以是datagrid下的column或者顶层的group。
                 * initHeads函数将head信息根据其 type，补充每个td元素的信息（rowspan、colspan），并存储到headarray的恰当位置
                 * rowIndex: 当前处理的 heads 对应的行号，由父元素计算得出后传入
                 * - head.type: head 有四种类型：顶层group,顶层column，非顶层group,非顶层column
                 * - head.rowspan：行并行数，标明该td占用多少行
                 * - head.colspan：合并列数，标明该td占用多少列 - deleted 已经在列定义 columnDefs 和 heads 时已经设置好
                 * - head.rowindex：行索引，标明该td属于第几行 - deleted 初始化后不再使用，删除
                 * - head.colindex: 列索引，标明该td在整个表头中是第几列
                 */
                var initHeads=function (heads, rowIndex) {
                    angular.forEach(heads, function (head) {
                        switch (head.type){
                            //顶层的column
                            case 'topColumn':{
                                (head.datafield == scope.treefield) && (head.align = 'left');
                                head.colindex = colIndex++;
                                head.rowspan = scope.maxLevel;
                                break;
                            }
                            //顶层的group
                            case 'topGroup':{
                                head.colindex = colIndex;
                                head.rowspan = scope.maxLevel - head.maxLevel + 1;//顶层 group 的 rowspan = 总行数 - 自身包含的层级 + 1;
                                initHeads(head.children, rowIndex + head.rowspan);//递归调用，下一层的行索引 = 当前行索引 + 占用行数
                                break;
                            }
                            //非顶层的column
                            case 'childColumn':{
                                (head.datafield == scope.treefield) && (head.align = 'left');
                                head.colindex = colIndex++;
                                head.rowspan = scope.maxLevel - rowIndex;//column下已经不能有子column，所以 rowspan = 总行数 - 行索引
                                break;
                            }
                            //非顶层的group
                            case 'childGroup':{
                                head.colindex = colIndex;
                                head.rowspan=1;
                                initHeads(head.children, rowIndex + head.rowspan);//递归调用
                                break;
                            }
                        }
                        headarray[rowIndex].push(head);
                    })
                };

                /* 设置模板(左下和右下区域的模板是动态拼接的) */
                var setTemplate=function(){
                    var colItem
                        ,labFunField
                        ,treefield = scope.treefield
                        ,treeIndent = dgConf.treeIndent
                        ,leftCols = 0;// 左侧 div 总列数，最后一行（滚动条留白）合并所有列
                    // 返回 startIndex 到 endIndex 列的单元格 DOM 字符串
                    var getTds = function(startIndex, endIndex){
                        var str = '';
                        for(var i=startIndex; i < endIndex; i++){
                            colItem=colDefs[i];
                            str+='<td style="text-align:'+colItem.align+'">';
                            //设置了 itemrender 就仅使用 itemrender,不管是不是还设置了 labfunction
                            if(colItem.itemrenderer){
                                str+='<span ng-include src="\''+colItem.itemrenderer+'\'"></span></td>';
                            }else{
                                if(treefield && colItem.datafield==treefield){
                                    // 子节点空出一定宽度，这样看起来像树，空出的宽度 = 节点层级 × treeIndent
                                    str+='<span ng-if="pdata[\'__level\']" style="display:inline-block;"' +
                                        ' ng-style="{width:('+treeIndent+'*pdata[\'__level\'])+\'px\'}"></span>';
                                    // 若有子节点，显示收缩/展开的图标，!!确保children长度为0时允许展开延迟加载的节点 TODO id 不唯一
                                    str+='<span ng-if="!!pdata[\'children\']" class="treespan icon-{{pdata[\'__close\']?\'plus\':\'minus\'}}"></span>';
                                    str+='<span ng-if="pdata[\'__loading\']" class="wi-datagrid-tree-loading"></span>';// 延迟加载的数据加载时的动画
                                }
                                //labfunction是可以返回一段html的，所以这里使用了bind-html指令
                                if(colItem.labfunction){
                                    labFunField = colItem.datafield + "_lblFun";
                                    str+= '<span bind-html-unsafe=lblFuns["'+colItem.datafield+'"](pdata)></span></td>';
                                }else{
                                    str+='<span>{{pdata[\''+colItem.datafield+'\']}}</span></td>';
                                }
                            }
                        }
                        return str;
                    };

                    //左下方锁定列数据显示区域
                    var getleftBottom=function(){
                        var str="";
                        if(scope.showno){
                            leftCols++;
                            str+='<td class="wi-datagrid-keycol"><span ng-if="pdata">{{pdata["__index"]}}</span></td>';
                        }
                        if(scope.multiselect){// TODO id 不唯一
                            leftCols++;
                            str+='<td class="wi-datagrid-keycol">'+
                                '<input ng-if="pdata[\'__level\']==0"' +
                                ' type="checkbox" class="wi-checkbox" ng-checked="pdata.__ischecked" /></td>';
                        }
                        leftCols += scope.lockcolumns;
                        str += getTds(0, scope.lockcolumns);
                        return str;
                    };
                    //右下方数据显示区域
                    var getRightBottom=function(){
                        var str="",
                            start = 0;// 默认右侧表格中第一列的在 colDefs 中的索引为 0
                        if(!scope.lockcolumns){// 无锁定列
                            if(scope.showno){
                                str+='<td class="wi-datagrid-keycol"><span ng-if="pdata">{{pdata["__index"]}}</span></td>';
                            }
                            if(scope.multiselect){// TODO id 不唯一
                                str+='<td class="wi-datagrid-keycol">'+
                                    '<input ng-if="pdata[\'__level\']==0"' +
                                    ' type="checkbox" class="wi-checkbox" ng-checked="pdata.__ischecked" /></td>';
                            }
                        }else{// 有锁定列，从第一列非锁定列开始
                            start = scope.lockcolumns;
                        }
                        str += getTds(start, colDefs.length);
                        return str;
                    };

                    if(scope.lockcolumns>0){
                        leftBottomDiv.find('tr').eq(0)
                            .attr('ng-repeat','pdata in pagedata track by $index')
                            .attr('ng-if','!pdata["__hide"]')
                            .attr('data-dg-pindex','{{::$index}}')
                            .html(getleftBottom());
                        leftBottomDiv.find('tr').eq(1).find('td').attr('colspan', leftCols);// 锁定列的情况下左下需要多出一行为滚动条补齐
                    }
                    rightBottomDiv.find('tr').eq(0)
                        .attr('ng-repeat','pdata in pagedata track by $index')
                        .attr('ng-if','!pdata["__hide"]')
                        .attr('data-dg-pindex','{{::$index}}')
                        .html(getRightBottom());// IE9 报错
                    ngTranscludeDiv.remove();// 移除ng-transclude的div
                    $compile(element)(scope);
                };

                // 计算并设置表格的相关样式，高、宽、列宽、行高等 - isInit = true，初始化阶段
                var computeStyle = function(isInit) {
                    (isInit !== true) && (isInit = false);// isInit 可能为事件对象，此处规范为布尔值
                    if(!isInit && staticSize) return;// 非初始化时，若长宽均为数字，不影响内部尺寸，返回
                    var caculateWidth = function(){ //列宽计算
                        var avgColWidth //未指定列宽列的平均宽度
                            ,allCols = 0 //列宽（含border）总和
                            ,preCols = 0 //非用户自定义列的列（序号、复选框）宽总和，若显示，总在表格最左侧
                            ,leftCols = 0 //左侧表格中列宽总和
                            ,unAsignedCols; //组件可见区域中可分配的宽度
                        //处理列宽，计算已定义的列宽总和
                        angular.forEach(colDefs, function (col,index) {
                            // 初始化，将用户定义的列宽存入 initColsW，将未设置列宽的列索引存入 unWidthCols 以便之后的计算
                            if(isInit){
                                var initColW = col.width;
                                if(angular.isNumber(initColW)){// 数字
                                    initColsW.push(initColW);
                                }else if(angular.isString(initColW)){
                                    if( /^\s*\d+\.?\d*%\s*$/.test(initColW)){// 合法的 % 数
                                        initColsW.push(initColW);
                                    }else if(/^\s*\d+\.?\d*\s*$/.test(initColW)){// 合法 number
                                        initColW = Number(initColW);
                                        initColsW.push(initColW);
                                    }else{// 标记为未定义列宽
                                        initColW = undefined;
                                        initColsW.push(initColW);
                                        unWidthCols.push(index);
                                    }
                                }else{// 标记为未定义列宽
                                    initColW = undefined;
                                    initColsW.push(initColW);
                                    unWidthCols.push(index);
                                }
                            }
                            // 为用户初始化定义列宽的列确定宽度 - 全部转换为数字
                            var colW = initColsW[index];
                            if(angular.isString(colW)){// 已定义的 % 列
                                colW = Math.round(scope._width * Number(colW.replace('%','')) / 100);
                            }
                            if(angular.isDefined(colW)){// 已定义的列
                                col.width = colW;
                                allCols += colW;// 累加到列宽总和
                            }
                        });
                        scope.multiselect && (preCols += dgConf.leftColWidth);// 允许多选
                        scope.showno && (preCols += dgConf.leftColWidth);// 显示序号
                        allCols += preCols;

                        //剩余列宽总和 = datagrid 内容部分总宽度 - 纵向滚动条（始终存在）- 已经给定的列宽总和
                        unAsignedCols = scope._width - dgConf.scrollBarSize - allCols;
                        avgColWidth = Math.floor(unAsignedCols/unWidthCols.length);
                        if(avgColWidth < defaultColWidth) { //如果计算出出平均列宽小于默认列宽，直接定义为默认列宽
                            angular.forEach(unWidthCols,function(index){
                                colDefs[index].width = defaultColWidth;
                                allCols += defaultColWidth;
                                unAsignedCols -= defaultColWidth;
                            });
                        }else {
                            angular.forEach(unWidthCols, function(index, m){
                                if(m == unWidthCols.length - 1){
                                    colDefs[index].width = unAsignedCols;
                                    allCols += unAsignedCols;
                                    unAsignedCols = 0;
                                }else{
                                    colDefs[index].width = avgColWidth;
                                    allCols += avgColWidth;
                                    unAsignedCols -= avgColWidth;
                                }
                            });
                        }

                        // 计算左侧列宽总和
                        if(scope.lockcolumns) {
                            //锁定列占用的总宽度
                            leftCols += preCols;
                            for(var i = scope.lockcolumns-1; i>-1; i--) {
                                leftCols += Number(colDefs[i].width);
                            }
                        }
                        divStyle.leftWidth = leftCols;
                        divStyle.rightWidth = scope._width - leftCols;
                        scope.rightW = allCols - leftCols; // 修改右侧表格宽度
                    };

                    if(isInit){
                        // 初始化表格内容部分宽度和高度
                        scope._width = (angular.isString(width) ?
                            Math.round(gridParentElement.clientWidth * Number(width.replace('%', '')) / 100) : width) // 百分比:数值
                            - 2*dgConf.dgBorder;// 减去 datagrid 组件的边框
                        scope._height = (angular.isString(height) ?
                            Math.round(gridParentElement.clientHeight * Number(height.replace('%', '')) / 100) : height) // 百分比:数值
                            - 2*dgConf.dgBorder;// 减去 datagrid 组件的边框

                        // 计算列宽等
                        caculateWidth();
                        rightBottomDiv.css('overflow-x',scope.hscrollpolicy || 'auto');// 只在初始化时定义
                    }else{
                        if(angular.isString(width)){// 宽度若为字符串，转为数值后，还需重新计算列宽等
                            scope._width = Math.round(gridParentElement.clientWidth * Number(width.replace('%', '')) / 100) - 2*dgConf.dgBorder;
                            caculateWidth();
                        }
                        if(angular.isString(height)){// 高度若未字符串，只需转为数值
                            scope._height = Math.round(gridParentElement.clientHeight * Number(height.replace('%', '')) / 100) - 2*dgConf.dgBorder;
                        }
                    }

                    var topHeight = divStyle.topHeight // 存入局部变量，提高多次读取效率
                        ,leftWidth = divStyle.leftWidth
                        ,pagebarHeight = divStyle.pagebarHeight
                        ,bottomHeight = scope._height - topHeight - pagebarHeight; // bottom 高度：表格内容高度 - Top 高度 - 工具栏高度
                    leftTopDiv.css({width:leftWidth+'px',height:topHeight+'px'});
                    rightTopDiv.css({width:divStyle.rightWidth+'px',height:topHeight+'px',left:leftWidth+'px'});
                    leftBottomDiv.css({width:leftWidth+'px',height:bottomHeight+'px',top:topHeight+'px'});
                    rightBottomDiv.css({width:divStyle.rightWidth+'px',height:bottomHeight+'px',
                        top:topHeight+'px',left:leftWidth+'px'});
                    pagebarDiv.css({height:pagebarHeight+'px',lineHeight:(pagebarHeight-5)+'px',
                        top:scope._height - pagebarHeight+'px'});
                };

                // 将滚动条重置为初始位置 - getGridData, doPage 中调用
                var resetScrollbar = function(){
                    rightBottomDiv[0].scrollLeft = 0;
                    rightBottomDiv[0].scrollTop = 0;
                };
                // 设置当前页绑定所需要的数据，添加序号，将树形数据转为普通 - getGridData, doPage, sort 中调用
                var setPageData = function(deferred) {
                    var pageNum = scope.pageNum
                        ,pageSize = scope.selectedPageSize;
                    scope.pageStart = (pageNum - 1) * pageSize + 1;// 当前页中第一条数据显示的序号
                    var temp = [];
                    pagedata.length = 0;// 清空当页数据
                    if(scope.pagemode === 'none' || scope.pagemode === 'server'){// 不分页或后台分页
                        temp = griddata;
                    }
                    else{// 前台分页，从 griddata 中分离出当前页数据
                        var start = (pageNum-1) * pageSize;
                        temp = griddata.slice(start, start + pageSize);// 返回区间内的数据
                    }

                    /**
                     * 为根节点加上额外的属性，方便模板的数据绑定
                     * __level：节点行所属层级，根节点行的 level 为 0，根据层级递增
                     * 根节点属性：
                     * __index：行索引（只有根节点行显示，其余节点行是不显示的） - 应在其他位置定义，非 treefield 表格应直接跳出
                     * 子节点属性：
                     * __hide：是否显示
                     * 父节点属性：
                     * __close：是否展开子树
                     */
                    if(scope.treefield) {
                        /**
                         * 数据源由树形转普通。
                         * 节点数据存储在 children 属性中
                         *  @param data 当前层级的行数据集合
                         *  @param lvl 树型 datagrid 节点行所属层级
                         */
                        (function tempInitData(data, lvl) {
                            for (var i = 0; i < data.length; i++) {
                                var node = data[i];
                                if(isEmptyObject(node)) return;
                                if(lvl){// 子节点行
                                    node['__hide'] = scope.collapse;
                                    node['__level'] = lvl;
                                }else{// 根节点行
                                    node['__index'] = scope.pageStart + i;
                                    node['__level'] = 0;
                                }
                                pagedata.push(node);
                                if (node['children']) {
                                    node['__close'] = scope.collapse;
                                    tempInitData(node['children'], node['__level'] + 1);
                                }
                            }
                        })(temp);
                    }
                    else {
                        angular.forEach(temp, function(node, i){
                            if(isEmptyObject(node)) return;
                            node['__index'] = scope.pageStart + i;
                            node['__level'] = 0;
                            pagedata.push(node);
                        });
                    }
                    // 不进行行补白：resize 时引起 num 变化；数据源变化或翻页，引起 visibleRowCount 和 dataCount 变化；展开/关闭树节点，引起 visibleRowCount 变化；支持自动换行时，无法确定 num
                    scope.isCheckAll = dgService.allChecked(pagedata);//是否全部选中 TODO 待查验

                    /**
                     * 设置 pagedata,处理行的 rowcolorfunction
                     * 如果设置了 rowcolorfun 则对每行数据添加一个 __rowcolor 属性
                     */
                    if(attrs.rowcolorfunction){
                        // datagrid 的行颜色 function
                        var rowColorFun = scope.rowcolorfunction();
                        angular.forEach(pagedata, function(rowObj){
                            !isEmptyObject(rowObj) ?
                                rowObj.__rowcolor=rowColorFun(rowObj) :
                                null;
                        })
                    }

                    deferred && deferred.resolve('success');
                };
                // 从 dataurl 获取第 pagenum（从 1 开始）页的数据
                var getDataFromUrl = function(pagenum, deferred){
                    var pageSize = scope.selectedPageSize;
                    angular.extend(reqParams, {
                        start: pageSize * (pagenum-1) // 数据起始索引
                        ,limit: ("server" === scope.pagemode) ? // 后台分页
                            pageSize : // 当前页最多显示的数据行数
                            -1 // 前台分页或不分页，不限制行数
                    });
                    $http.post(scope.dataurl,reqParams)// 根据dataurl和参数获取列表数据
                        .success(function(result) {
                            if(result.success) {// 查询成功
                                if(reqParams.start==0) {
                                    scope.dataCount = result.data.total;// 总数据数
                                    scope.pageCount = Math.max(Math.ceil(result.data.total/pageSize),1);// 总页数
                                }
                                griddata = result.data.rows;
                                deferred.resolve('success');
                            } else {// 查询失败
                                console.error('wiDataGrid', result.msg);// 输出错误信息
                            }
                        });
                };
                // 设置 griddata，并显示首页数据（初始化、数据源变化、后台分页翻页、刷新时调用），将改变 scope.dataCount,scope.pageCount
                var getGridData = function(){
                    maskDiv.css('visibility', 'visible');// 加载过程中显示遮罩层
                    var deferred = $q.defer()
                        ,pagenum = 1;
                    griddata = undefined;
                    scope.pageNum = pagenum;
                    if(scope.dataurl){// 从 dataurl 获取数据
                        getDataFromUrl(pagenum, deferred);
                    }else{// 从 dataprovider 获取数据
                        griddata = scope.dataprovider;
                        !griddata && (griddata=[]);
                        scope.dataCount = griddata.length;
                        scope.pageCount = Math.max(Math.ceil(scope.dataCount/scope.selectedPageSize),1);// 总页数
                        deferred.resolve('success');
                    }
                    deferred.promise
                        .then(function(){
                            setPageData();
                            resetScrollbar();
                            maskDiv.css('visibility','hidden');
                        });
                };

                //刷新事件处理，刷新后跳转到首页
                scope.dorefresh = function () {
                    getGridData();
                };
                // 跳转到第 pagenum 页（不分页时不会显示触发元素，故不考虑）
                scope.doPage = function (pagenum) {
                    pagenum = Math.min(pagenum, scope.pageCount);// 跳转页码不能超过总页码
                    pagenum = Math.max(pagenum, 1);// 跳转页码不能小于 1
                    if(pagenum == scope.pageNum) return;// 当前页，不需跳转
                    maskDiv.css('visibility','visible');// 加载过程中显示遮罩层
                    scope.pageNum = pagenum;
                    var deferred = $q.defer();
                    ('server' === scope.pagemode) ?
                        getDataFromUrl(pagenum, deferred) : // 后台分页
                        deferred.resolve('success'); // 前台分页
                    deferred.promise.then(function(){
                        setPageData();
                        resetScrollbar();// 将滚动条重置为初始位置
                        maskDiv.css('visibility','hidden');
                    });
                };
                //直接跳转页面处理，对应键盘事件
                scope.gotoPage = function(event){
                    if(event.keyCode == 13){// Enter
                        scope.doPage(parseInt(angular.element(event.target).val()));
                    }
                };

                // 当前排序字段，正序or倒序
                scope.sortcolumn = {'datafield':undefined,'direction':undefined};
                /**
                 * 排序，根据 index 列排序
                 * 前台分页：griddata 排序，更新 pagedata
                 * 后台分页：对当前页（pagedata 与 griddata 相同）排序
                 * 不分页：对当前页（pagedata 与 griddata 相同）排序
                 */
                scope.sort = function(index) {
                    var columnItem = scope.columnDefs[index];
                    if(!columnItem.sortable) return;// 不可排序
                    var datafield = columnItem.datafield;
                    // 如果是当前字段，则反序
                    if(scope.sortcolumn.datafield == datafield) {
                        scope.sortcolumn.direction = -scope.sortcolumn.direction;
                    } else {
                        scope.sortcolumn.datafield = datafield;
                        scope.sortcolumn.direction = 1;
                    }
                    griddata.sort(function(x,y) {
                        var _x = x[datafield],
                            _y = y[datafield],
                            _dir = scope.sortcolumn.direction;
                        if (_x < _y)        { return -_dir; }
                        else if (_x > _y)   { return _dir; }
                        return 0;
                    });
                    setPageData();// 更新当前页的数据
                };

                // 全选checkbox的处理，仅针对当前页
                scope.checkAll = function(){
                    var chkState = scope.isCheckAll = !scope.isCheckAll;
                    for(var i=pagedata.length-1;i>-1;i--){
                        //非空对象才处理
                        !isEmptyObject(pagedata[i]) ?
                            pagedata[i].__ischecked = chkState :
                            null;
                    }
                };

                /**
                 * 向 wiid 对象添加方法
                 * 使得当组件声明了wid以后，可以使用类似 wiid.someFun() 的方式来调用 datagrid 的某些常用方法和属性
                 * 注意：datagrid必须已经显示完毕才能调用wid中的方法
                 */
                var setWiid = function(){
                    /* 开放接口，需定义双向绑定的 wiid */
                    if(scope.wiid && angular.isObject(scope.wiid)){
                        //取得选中行的行数据
                        scope.wiid.getSelectedItems=function(){
                            var selectedItems = [];
                            angular.forEach(pagedata,function(item){
                                item.__ischecked ? selectedItems.push(item) : null;
                            });
                            return selectedItems;
                        };
                        scope.wiid.getSelectedItem=function(){
                            for(var i=0;i<pagedata.length;i++){
                                if(pagedata[i].__ischecked)
                                    return pagedata[i];
                            }
                        };
                        scope.wiid.refresh = function(){
                            scope.dorefresh();
                        };
                        scope.wiid.reCompute = (staticSize) ?// 固定尺寸，不需监听 resize
                            angular.noop : function(){
                            regResizeEventListener();
                        };
                    }
                };

                /* 拖动列时的事件处理 */
                var regDragColumnEventListener = function(){
                    var miniColWidth = dgConf.miniColWidth,//拖动列时最小的列宽
                        currentTd = null,// 当前拖动的 td 对象
                        currentCol,// 当前拖拽列数据源
                        startX= 0,// 开始拖拽时的鼠标位置，鼠标按下时获取
                        isLock,// 正在移动的是锁定列
                        pleft;// datagrid 内容起始位置，鼠标按下时获取

                    var mouseMoveFun = function (e) { // datagrid 鼠标移动事件，开始拖拽后才监听
                        if(!currentTd || !currentCol) return;
                        var distance = e.clientX - startX,
                            curItemBcr = currentTd.getBoundingClientRect();
                        // 不能小于最小列宽
                        var toX = Math.max(curItemBcr.right + distance, curItemBcr.left + miniColWidth)
                            - Math.ceil(dgConf.dragDivWidth/2) - pleft;// 减去 datagrid 本身的位置，及 follow 的 宽/2
                        // 超出 datagrid 范围
                        if(toX > scope._width) return;
                        dragline.css('left',toX + 'px');// followbar 的位置
                    };
                    var mouseUpFun = function(e){
                        if(!currentTd || !currentCol) return;
                        var index = currentCol.colindex // 拖拽列 index
                            ,oldValue = colDefs[index].width // 所在原始宽度
                            ,newValue;
                        newValue = Math.max(oldValue + e.clientX - startX, miniColWidth);

                        var indexInUnCols = unWidthCols.indexOf(index);
                        if(indexInUnCols>=0){// 原始未定义列宽
                            unWidthCols.splice(indexInUnCols, 1);
                        }
                        initColsW[index] = newValue;

                        var distance = newValue - oldValue;
                        colDefs[currentCol.colindex].width = newValue;

                        if(isLock){// resize 的是左侧锁定列，需修改各 div 宽度
                            divStyle.leftWidth += distance;
                            divStyle.rightWidth -= distance;
                            leftTopDiv.css({width:divStyle.leftWidth +'px'});
                            rightTopDiv.css({width:divStyle.rightWidth+'px',left:divStyle.leftWidth+'px'});
                            leftBottomDiv.css({width:divStyle.leftWidth+'px'});
                            rightBottomDiv.css({width:divStyle.rightWidth+'px',left:divStyle.leftWidth+'px'});
                        }else{// resize 的是右侧内容列，需修改右侧 table 宽度
                            scope.rightW += distance;
                        }
                        scope.$digest();// 更新视图中 colDefs[currentCol.colindex].width 及 rightW
                        currentTd = currentCol = undefined;
                        dragline.css('display','none');
                        element.removeClass('wi-resizing wi-unselectable');
                        // 结束监听
                        element[0].removeEventListener('mousemove',mouseMoveFun);
                        document.removeEventListener('mouseup',mouseUpFun);
                    };
                    // 拖拽开始
                    scope.startColumnDrag = function(e, colItem, isLockCol) {
                        if(!currentTd) return;
                        isLock = isLockCol;
                        pleft = element[0].getBoundingClientRect().left + dgConf.dgBorder;
                        /**
                         * x:设置或者是得到鼠标相对于目标事件的父元素的外边界在x坐标上的位置。
                         * clientX:相对于客户区域的x坐标位置，不包括滚动条，就是正文区域。
                         * offsetX:设置或者是得到鼠标相对于目标事件的父元素的内边界在x坐标上的位置。
                         * screenX:相对于用户屏幕。
                         */
                        startX = e.clientX;// 开始拖拽时的鼠标位置
                        dragline.css({
                            left:(currentTd.getBoundingClientRect().right - pleft - Math.ceil(dgConf.dragDivWidth/2)) + 'px',// resizebar 的右侧显示
                            display:'block',
                            height:scope._height - divStyle.pagebarHeight + 'px'});
                        element.addClass('wi-resizing wi-unselectable');

                        currentCol = colItem;// 标记触发拖动的单元格 head 对象
                        document.addEventListener('mousemove',mouseMoveFun);// 拖拽中
                        document.addEventListener('mouseup',mouseUpFun);// 拖拽结束
                    };

                    scope.headMousemove = function(e){// 未进行拖拽，根据鼠标位置判断鼠标外观
                        if(!!currentCol) return;// 若正在拖拽，直接返回
                        var tdElem = e.target
                            ,x = e.clientX;
                        while(tdElem.tagName != 'TD'){
                            if(tdElem.tagName == 'BODY'){
                                element.removeClass('wi-resizing');
                                currentTd = undefined;
                                return; // 上层未找到 td，可能在 table 外部移动
                            }
                            tdElem = tdElem.parentNode;
                        }
                        var bcr = tdElem.getBoundingClientRect();
                        if(x > bcr.right - dgConf.dragDivWidth && x <= bcr.right){
                            element.addClass('wi-resizing');
                            currentTd = tdElem;
                        }else{
                            element.removeClass('wi-resizing');
                            currentTd = undefined;
                        }
                    };
                    scope.headMouseleave = function(){
                        if(!currentTd || !currentCol) // 未开始拖拽，移出单元格时，鼠标变回默认
                            element.removeClass('wi-resizing');
                    };
                };

                //右下方数据区域的滚动事件处理（存在锁定列时需要保持同步）
                var regScrollEventListener = function(){
                    // 记录当前数据滚动条位置
                    var scrollPosition = {'currentTop':0,'currentleft':0};
                    // 监听滚动条滚动事件
                    rightBottomDiv[0].addEventListener('scroll', function (event) {
                        var d=event.target;
                        //垂直滚动
                        if(d.scrollTop != scrollPosition.currentTop){
                            scrollPosition.currentTop = leftBottomDiv[0].scrollTop = d.scrollTop;
                        }
                        //水平滚动
                        if(d.scrollLeft != scrollPosition.currentleft){
                            scrollPosition.currentleft = rightTopDiv[0].scrollLeft = d.scrollLeft;
                        }
                    });
                };

                /**
                 * 注册行点击处理事件
                 * 将datagrid事件注册在div上，这样可以减少事件的数量，降低内存使用
                 */
                var regItemClickEventListener = function(){
                    //调整垂直滚动条位置，防止点击的数据在列表底部时，展开后数据看不到
//                    var adjustVScrollbarPosition=function(event,item){
//                        if(!item.__close){
//                            var pagebarY =pagebarDiv[0].getBoundingClientRect().top;//分页工具条的Y坐标
//                            var eventY = event.y;//事件源的Y坐标
//                            var valuedHeight=pagebarY-eventY-scope._rowheight;//可用区域高度(要减去事件源占用的行高)
//                            var needHeight=scope._rowheight*item.children.length;//显示子节点需要的高度
//                            //如果可用区域高度不够用，则将滚动条向下滚动相应的偏移量+17(滚动条高度)
//                            if(valuedHeight<needHeight){
//                                rightBottomDiv[0].scrollTop=rightBottomDiv[0].scrollTop+(needHeight-valuedHeight)+dgConf.scrollBarSize;
//                            }
//                        }
//                    };

                    /**
                     * 延迟加载时，动态添加节点
                     * addNode是一个回调函数，页面注册了itemopen方法后才会调用
                     * @param node 点击的节点
                     * @param children 新获取的子节点数据
                     */
                    var addNode = function (node, children) {
                        node['__loading'] = false;
                        if(angular.isArray(children)) {
                            var index = pagedata.indexOf(node);
                            angular.forEach(children, function (child) {
                                //如果子节点仍有子孙，则将其设置为收缩状态
                                if(child['children']) {
                                    child['__close'] = true;
                                }
                                child['__hide'] = false;//节点设置为显示
                                child['__level'] = node['__level'] ? node['__level']+1 : 1;

                                //在当前节点后加入准备好的节点数据
                                pagedata.splice(index+1, 0, child);
                                index++;
                            });

                            //将子节点数据存储在当前点击节点的children属性中
                            node['children'] = children;
                        }
                        scope.$digest();
                    };

                    /**
                     * treeGrid节点折叠展开
                     */
                    var toggleNode = function (node) {
                        node['__close'] = !node['__close'];
                        /**
                         * 子节点总数为 0，且支持延迟加载（设置了 itemopen），展开时调用 itemopen 方法
                         * 完成后通过回调 addNode 完成子节点显示
                         */
                        if(node['children'] && node['children'].length==0 && !node['__close'] && scope.itemopen()) {
                            node['__loading'] = true;
                            scope.itemopen()(node, addNode);
                        }
                        // 展开或收缩
                        else {
                            // 展开或收缩所有子孙
                            (function setChildrenHide(children, hide) {
                                angular.forEach(children, function (child) {
                                    child['__hide'] = hide || !child['__hide'];//节点是否显示取反
                                    //如果是当前操作是收缩并且子节点还有子孙是未收缩状态，则递归处理，最终将每一个节点的__close属性都设置为true
                                    if(node['__close'] && child['children'] && !child['children']['__close']) {
                                        child['__close'] = true;
                                        setChildrenHide(child['children'], true);
                                    }
                                })
                            })(node['children']);
                        }
                    };

                    var doItemClick = function (event) {
                        var ele = event.target;
                        if(!ele) return;
                        var isTreespan=((' ' + ele.className +  ' ').indexOf('treespan') >= 0);// 判断事件源，折叠/展开操作
                        while(ele.tagName != 'TR' && ele.parentElement){// 循环查找事件源的父元素直至找到 TR 元素,data-dg-pindex 属性保存了该行索引
                            ele = ele.parentElement;
                        }
                        if(ele.tagName != 'TR' || ele.getAttribute('data-dg-pindex') == null) return;// 非 tr 或无 data-dg-pindex 属性
                        var idx = Number(ele.getAttribute('data-dg-pindex'))
                            ,item = pagedata[idx];// 点击的行对应的数据
                        //空白行不处理
                        if(isEmptyObject(item)) return;
                        //如果点击的是树的展开或收缩图标则停止事件冒泡
                        if(isTreespan){
                            event.stopPropagation();
                            toggleNode(item);
                            scope.$digest();
                            //调整垂直滚动条位置，防止点击的数据在列表底部时，展开后数据看不到
//                            setTimeout(function(){//ui更新后调整，不需要刷新数据所以不用$timeout
//                                adjustVScrollbarPosition(event,item);
//                            },0);
                        }
                        else{
                            // 若不支持多选，将选中一行时，取消所有选中行
                            if(!item.__ischecked && !scope.multiselect){
                                dgService.uncheckAll(pagedata);
                            }
                            item.__ischecked = !item.__ischecked;// 切换当前行选中状态
                            scope.isCheckAll = dgService.allChecked(pagedata);// 是否全部选中
                            scope.$digest();//更新显示
                            attrs.itemclick && scope.itemclick()(item, event);
                        }
                    };

                    var doItemDblClick = function (event) {
                        var ele = event.target;
                        if(!ele) return;
                        while(ele.tagName != 'TR' && ele.parentElement){// 循环查找事件源的父元素直至找到 TR 元素,data-dg-pindex 属性保存了该行索引
                            ele = ele.parentElement;
                        }
                        if(ele.tagName != 'TR' || ele.getAttribute('data-dg-pindex') == null) return;// 非 tr 或无 data-dg-pindex 属性
                        var idx = Number(ele.getAttribute('data-dg-pindex'))
                            ,item = pagedata[idx];// 点击的行对应的数据
                        //空白行不处理
                        if(isEmptyObject(item)) return;
                        attrs.itemdoubleclick && scope.itemdoubleclick()(item);
                    };

                    if(attrs.itemdoubleclick) {
                        leftBottomDiv[0].addEventListener('dblclick',doItemDblClick);
                        rightBottomDiv[0].addEventListener('dblclick',doItemDblClick);
                    }
                    leftBottomDiv[0].addEventListener('click',doItemClick);
                    rightBottomDiv[0].addEventListener('click',doItemClick);
                };

                // 导出excel
                scope.export2excel = function(event){
                    // 获取数据测试(当前页)
                    // TODO
                    var rowdata=[],celldata=[],colwidths=[];

                    angular.forEach(scope.columnDefs, function (col) {
                        celldata.push(col.text);
                        colwidths.push(col.width);
                    });
                    rowdata.push(celldata);

                    angular.forEach(pagedata, function (data) {
                        celldata = [];
                        angular.forEach(scope.columnDefs, function (col) {
                            if(col.labfunction){
                                celldata.push(col.labfunction()(data));
                            }else{
                                celldata.push(data[col.datafield]);
                            }
                        });
                        rowdata.push(celldata);
                    });

                    // 获取需要导出的数据，当前页、某几页或全部，上限500条

                    // 调用labFunction转换数据

                    // 将数据转换成xml或csv后导出

                    // 方法一
//                window.open('data:application/vnd.ms-excel,\ufeff'
//                    + divchildren[3].innerHTML.replace(/ /g, '%20'));

                    // 方法二
                    if(navigator.userAgent.indexOf("MSIE")>0) {
                        dgService.table2excelByIE(rowdata, colwidths);
                    } else {
                        var uri = 'data:application/vnd.ms-excel;base64,';
                        event.currentTarget.href = uri + dgService.base64(dgService.table2excel(rowdata, colwidths));
                    }
                };

                //datagrid父容器或者窗口大小变化时改变datagrid大小 -- 需在模板和文档都设置完成后运行，否则 IE 等浏览器显示异常
                var regResizeEventListener = function(){
                    // 监听 datagrid 大小改变
                    wiResizeListener.addResizeListener(gridParentElement,function(){
                        scope.$evalAsync(computeStyle);// 原使用apply，可能在其他组件$watch触发的事件中，故修改
                    });
//                    wiResizeListener.addResizeListener(document, function () {
//                        scope.$apply(computeStyle);
//                    });  // TODO 是否需要删除
                };

                /** ----- link 主体流程 ----- **/
                // 若定义了 columns，获取定义的列，在 initScope 及 initHeadArray 前执行
                getColsByColumns();
                // TODO 因依赖 colDefs 及 maxLevel，必须保证在所有列定义完成后运行，以确保获得正确的 maxLevel
                divStyle.topHeight *= scope.maxLevel;// top 部分高度根据 maxLevel 调整
                // 初始化 scope
                initScope();
                var headarray = scope.headarray = initHeadArray(),//保存头部信息，长度等于最大层级数，其元素对应每一行的列数据集合
                    colIndex = 0;//记录头部的每个td在整个头部中所处的列索引位置
                // 整理datagrid的多表头信息，从第 0 行开始
                initHeads(scope.heads, 0);
                // 设置模板(左下和右下区域的模板是动态拼接的)
                setTemplate();
                // 计算并设置表格的相关样式，高、宽、列宽、行高等 - 参数 true，初始化阶段
                $timeout(function(){computeStyle(true)},0);// 若祖先元素存在自定义指令，可能造成 link 时高度未同步至DOM，延迟计算
                getGridData();// 获取数据并显示第一页
                setWiid();
                /* 拖动列时的事件处理 */
                regDragColumnEventListener();
                // 右下方数据区域的滚动事件监听（存在锁定列时需要保持同步）
                regScrollEventListener();
                // 行点击事件监听
                regItemClickEventListener();
                //datagrid父容器或者窗口大小变化时改变datagrid大小 -- 需在模板和文档都设置完成后运行，否则 IE 等浏览器显示异常
                !staticSize && regResizeEventListener();
            }
        }
    }])

/**
 * @ngdoc directive
 * @name ui.wisoft.datagrid.directive:wiDatagridColumn
 * @restrict E
 *
 * @description
 * 列
 *
 * @param {string=} headtext 标题文本.
 * @param {string=} datafield 字段名称.
 * @param {string=} itemrenderer 自定义单元格.通过 &lt;script type=&quot;text/ng-template&quot;&gt;&lt;/script&gt; 嵌入模板内容，其中 pdata 对应该行数据.
 * @param {string=} headrenderer 自定义标题.通过 &lt;script type=&quot;text/ng-template&quot;&gt;&lt;/script&gt; 嵌入模板内容.
 * @param {function=} labfunction 自定义单元格文本.labfunction(data),data 对应该行数据,返回要显示的内容.
 * @param {number|percent=} width 宽度.指令直接从属性值 attrs['height'] 获取数字(px)或百分比.
 * @param {boolean=} sortable 排序.
 * @param {string=} align 对齐方式.
 */
    .directive('wiDatagridColumn', function () {
        return {
            restrict:'E',
//            template:"<div></div>",
            scope: {
                labfunction:'&'//自定义单元格内容处理（格式化等）函数
            },
            require:'^wiDatagrid',
            link: function (scope,element,attrs,datagridCtrl) {
                var col = {// 列信息
                    text: attrs['headtext']
                    ,colspan: 1
                    ,datafield : attrs['datafield']
                    ,itemrenderer : attrs['itemrenderer']
                    ,headrenderer : attrs['headrenderer']
                    ,width : attrs['width']
                    ,sortable : attrs['sortable']
                    ,align : attrs['align']|| 'center'
                };
                attrs.labfunction ? col.labfunction = scope.labfunction:null;//设置了labfunction才放到col中，scope.labfunction永远是有值的

                /**
                 * 如果wi-datagrid-column没有放在group中，则将其加入到头部定义的数组中
                 * 不设置rowspan，其 rowspan = scope.maxLevel，需要在datagrid中进行设置
                 */
                if(element[0].parentElement.tagName != "WI-DATAGRID-COLUMN-GROUP") {
                    col.type = 'topColumn';
                    col.level = 1;
                    datagridCtrl.addHeadDef(col, 1);
                }else{
                    col.type = 'childColumn';
                    datagridCtrl.addChildCol(col);
                }
                datagridCtrl.addColumnDef(col);
            }
        };
    })

/**
 * @ngdoc directive
 * @name ui.wisoft.datagrid.directive:wiDatagridColumnGroup
 * @restrict E
 *
 * @description
 * 多表头分组
 *
 * @param {string=} text 标题文本.
 *
 */
    .directive('wiDatagridColumnGroup', function () {
        return {
            restrict:'E',
            require:'^wiDatagrid',
            link: function (scope,element,attrs,datagridCtrl) {
                // 只处理顶层的wi-datagrid-column-group,非顶层直接返回不做处理
                if(element[0].parentElement.tagName == "WI-DATAGRID-COLUMN-GROUP") return;

                var group = {
                    level: 1 //顶层group层级为1
                    ,type: 'topGroup' //标识此对象为顶层的group
                    ,text: attrs['text'] || ''
                    ,colspan: element.find('wi-datagrid-column').length //group占用的列数总是等于其所有子元素中column的数量，column总是只占用1列.
                    ,children: []//用来存储顶层group的子元素，子元素如果是group，则子元素也有children属性
                };

                var maxLevel = 1;// 最大层级，用来表示顶层 group(含本身) 的层级
                //通过递归设定每个column-group的信息，将其存储在顶层的group对象中
                var initGroup = function(children, parent){
                    angular.forEach(children, function (child) {
                        var obj;
                        // 子为 wi-datagrid-column-group
                        if(child.tagName == 'WI-DATAGRID-COLUMN-GROUP') {
                            obj = {
                                level: parent.level + 1 // 子层级为父层级+1，需在对 children 调用 initGroup 前设置
                                ,type: 'childGroup' //标识此对象为非顶层的group
                                ,text: child.getAttribute('TEXT') || ''
                                ,colspan: angular.element(child).find('wi-datagrid-column').length // -- 可能为 0
                                ,children: []//用来存储子元素信息
                            };
                            child.children && initGroup(child.children, obj);// 递归设置children
                        }
                        // 子为 wi-datagrid-column
                        else if(child.tagName == 'WI-DATAGRID-COLUMN') {
                            obj = datagridCtrl.getChildCol();// 从 临时列定义 中删除并返回第一个定义的列
                            obj.level = parent.level + 1;// 子层级为父层级+1
                        }
                        obj.parent = parent;
                        maxLevel = Math.max(maxLevel, obj.level);
                        parent.children.push(obj);
                    });
                };
                initGroup(element[0].children, group);
                group.maxLevel = maxLevel;//maxLevel 表示顶层 group 拥有的层级数
                datagridCtrl.addHeadDef(group, maxLevel);
            }
        };
    });
'use strict';
angular.module('ui.wisoft.dialog', ['ui.wisoft.position'])

/**
 * @ngdoc service
 * @name ui.wisoft.dialog.wiDialog
 *
 * @description
 * wiDialog 用来弹出模态的窗口service，常见的简单提示框、confirm对话框以及更复杂的弹出框都可以使用wiDialog。
 */
	.provider('wiDialog', function () {

		var $el = angular.element;
		var isDef = angular.isDefined;
		var style = (document.body || document.documentElement).style;
		var animationEndSupport = isDef(style.animation) || isDef(style.WebkitAnimation) || isDef(style.MozAnimation) || isDef(style.MsAnimation) || isDef(style.OAnimation);
		var animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
		var forceBodyReload = false;

        //参数默认值
		var defaults = this.defaults = {
//			className: 'wi-dialog-theme-default',
			plain: false,//是否允许使用字符串作为template
			showClose: true,//关闭按钮
			closeByDocument: false,//点击页面关闭dialog
			closeByEscape: true,//点击键盘ESC关闭dialog
            overlay:true//模态弹出框
		};

		this.setForceBodyReload = function (_useIt) {
			forceBodyReload = _useIt || false;
		};

		var globalID = 0, dialogsCount = 0, closeByDocumentHandler, defers = {};

		this.$get = ['$document', '$templateCache', '$compile', '$q', '$http', '$rootScope', '$timeout', '$window', '$controller','$position',
			function ($document, $templateCache, $compile, $q, $http, $rootScope, $timeout, $window, $controller, $position) {
				var $body = $document.find('body');
				if (forceBodyReload) {
					$rootScope.$on('$locationChangeSuccess', function () {
						$body = $document.find('body');
					});
				}

                var _document,_$window,_$body;

				var privateMethods = {
					onDocumentKeydown: function (event) {
						if (event.keyCode === 27) {
							publicMethods.closeOne('$escape');
						}
					},

					//设置padding(原始padding+传入的参数width)，并将原始的padding保存到$body中
					setBodyPadding: function (width) {
						var originalBodyPadding = parseInt(($body.css('padding-right') || 0), 10);
						$body.css('padding-right', (originalBodyPadding + width) + 'px');
						$body.data('ng-dialog-original-padding', originalBodyPadding);
					},

					//重置padding
					resetBodyPadding: function () {
						var originalBodyPadding = $body.data('ng-dialog-original-padding');
						if (originalBodyPadding) {
							$body.css('padding-right', originalBodyPadding + 'px');
						} else {
							$body.css('padding-right', '');
						}
					},

					closeDialog: function ($dialog, value) {
						var id = $dialog.attr('id');
						if (typeof window.Hammer !== 'undefined') {
							window.Hammer($dialog[0]).off('tap', closeByDocumentHandler);
						} else {
							$dialog.unbind('click');
						}

						//如果当前是关闭最后一个dialog,则unbind键盘事件keydown
						if (dialogsCount === 1) {
							$body.unbind('keydown');
						}

						if (!$dialog.hasClass("wi-dialog-closing")) {
							dialogsCount -= 1;
						}

						if (animationEndSupport) {
							$dialog.unbind(animationEndEvent).bind(animationEndEvent, function () {
								$dialog.scope().$destroy();
								$dialog.remove();
                                $dialog.css({visiblity:'hidden'})
								if (dialogsCount === 0) {
									$body.removeClass('wi-dialog-open');
									privateMethods.resetBodyPadding();
								}
								$rootScope.$broadcast('wiDialog.closed', $dialog);
							}).addClass('wi-dialog-closing');
						} else {
							$dialog.scope().$destroy();
							$dialog.remove();
							if (dialogsCount === 0) {
								$body.removeClass('wi-dialog-open');
								privateMethods.resetBodyPadding();
							}
							$rootScope.$broadcast('wiDialog.closed', $dialog);
						}
						//dialog关闭后调用resolve，设置defers[id].promise的值
						if (defers[id]) {
							defers[id].resolve({
								id: id,
								value: value,
								$dialog: $dialog,
								remainingDialogs: dialogsCount
							});
							delete defers[id];
						}
					}
				};

				var publicMethods = {

                    /**
                     * @ngdoc method
                     * @name ui.wisoft.dialog.wiDialog#open
                     * @methodOf ui.wisoft.dialog.wiDialog
                     * @description 打开dialog的最基本的方法。
                     *
                     * @param {Object} options
                     * {<br>
                     *  template : String类型，值可以为ng-template的ID, html片段的URL  或者 直接使用字符串(需要将plain设为true)<br>
                     *  plain  : Boolean类型，开启字符串作为模板，默认false<br>
                     *  scope  : Object类型。如果传递了scope,该scope将作为弹出框的父scope。<br>
                     *  controller  : String类型，指定弹出框使用的controller名称<br>
                     *  showClose  : Boolean类型，显示关闭按钮，默认 true<br>
                     *  closeByEscape  : Boolean类型，通过ESC关闭dialog,默认 true<br>
                     *  closeByDocument  : Boolean类型，通过点击页面关闭dialog,默认 true<br>
                     *  overlay: Boolean类型，指定是否模态弹出，默认为true<true>
                     *  dialogInIframe  : 是否在iframe中居中显示，默认情况下所有的弹出框都是在最外层的页面中弹出（开发时一般不采用单一APP，所以应用功能实际上会被放在iframe中）<br>
                     *  }
                     *
                     * @return {Object}
                     * {
                     *   id: 弹出框的id.<br>
                     *   closePromise: 关闭窗口的promise，通过该promise可以监听弹出框关闭。<br>
                     *   close: 关闭当前弹出框
                     * }
                     *
                     */
					open: function (opts) {
						var self = this;
						var options = angular.copy(defaults);

						opts = opts || {};
						angular.extend(options, opts);

						globalID += 1;

                        self.latestID = 'widialog' + globalID;

                        var defer;
                        defers[self.latestID] = defer = $q.defer();//以最新打开的dialog的id为key创建一个新的deffer

                        //如果参数中没有指定scope,则创建$rootScope的一个子域作为dialog实例的作用域
                        var scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
                        var $dialog, $dialogParent, $dialogOverlay;

						$q.when(loadTemplate(options.template)).then(function (template) {
							template = angular.isString(template) ?
								template :
									template.data && angular.isString(template.data) ?
								template.data :
								'';

							//将载入的模板文件放入$templateCache中保存，下次使用时可以直接从$templateCache中取
							$templateCache.put(options.template, template);
							// z-index 由 $position 统一管理
							self.$result = $dialog = $el('<div id="widialog' + globalID + '" class="wi-dialog" style="z-index:'+ $position.getZIndex() +'" ></div>');

                            var htmlstr = [
                                    '<div dialog-draggable="wi-dialog-head" id="wiDialogMain' + globalID + '" class="wi-dialog-main">',
                                    '<div class="wi-dialog-head">' + (options.title || "") + '<span class="wi-dialog-close icon-remove"></span></div>',
                                    '<div class="wi-dialog-content">' + template + '</div></div>'
                            ];
                            //设置不显示header
                            if(options.withoutHead){
                                htmlstr=[
                                        '<div id="wiDialogMain' + globalID + '" class="wi-dialog-main">',
                                        '<div class="wi-dialog-content">' + template + '<span class="wi-dialog-close icon-remove"></span></div></div>'
                                ];
                            }
                            $dialog.html(htmlstr.join(''));

                            //如果设置了模态
                            if(options.overlay===true){
                                $dialog.prepend('<div class="wi-dialog-overlay"></div>');
                            }


						    //实例化controller
							if (options.controller &&
                                (angular.isString(options.controller) ||
                                    angular.isFunction(options.controller))) {
                                //为dialog 实例化controller
                                var controllerInstance = $controller(options.controller, {
                                    $scope: scope,
                                    $element: $dialog
                                });
                                //将controllerInstance实例保存到$dialog中,有何用处？？？？？？
                                $dialog.data('$ngDialogControllerController', controllerInstance);
							}

//							if (options.className) {
//								$dialog.addClass(options.className);
//							}

							//dialog页面中可以直接通过wiDialogData访问open方法传递过来的data值
							if (options.data && angular.isString(options.data)) {
								var firstLetter = options.data.replace(/^\s*/, '')[0];
								scope.wiDialogData = (firstLetter === '{' || firstLetter === '[') ? angular.fromJson(options.data) : options.data;
							} else if (options.data && angular.isObject(options.data)) {
								scope.wiDialogData = angular.fromJson(angular.toJson(options.data));
							}

                            //iframe处理，默认所有的dialog全部在顶层窗口弹出
                            if(!options.dialogInIframe){
                                $dialogParent=angular.element(window.top.document.body);
                                _document=window.top.document;
                                _$window=$window.top;
                                _$body=angular.element(_document.body);
                            }else{
                                $dialogParent = angular.element(document.body);
                                _document=document;
                                _$window=$window;
                                _$body=$body;
                            }

                            //指定dialog添加到dom中的位置，可以指定元素的ID或者类名
                            //如果指定了dialogInIframe为false，会从iframe的父窗体进行查找
                            if (options.appendTo && angular.isString(options.appendTo)) {
                                $dialogParent = angular.element(_document.querySelector(options.appendTo));
                            }

							scope.closeThisDialog = function (value) {
								privateMethods.closeDialog($dialog, value);
							};

							$timeout(function () {
								$compile($dialog)(scope);

								var widthDiffs = _$window.innerWidth - $body.prop('clientWidth');
//								_$body.addClass('wi-dialog-open');//是否要隐藏滚动条？
								var scrollBarWidth = widthDiffs - (_$window.innerWidth - $body.prop('clientWidth'));
								if (scrollBarWidth > 0) {
									privateMethods.setBodyPadding(scrollBarWidth);
								}
								$dialogParent.append($dialog);

                                //处理dialog水平垂直居中
								//根据当前dialogmain的ID，将dialog设置为垂直水平居中(因为dialog不设初始高度，所以采用这种方法)
								var $dialogMain = angular.element(_document.querySelector('#wiDialogMain' + globalID));

                                var $dialogbody = angular.element(_document.querySelector('#widialog' + globalID));
								var cssValues = {
									'margin-left': -$dialogMain.prop('clientWidth') / 2 + 'px',
									'margin-top': -$dialogMain.prop('clientHeight') / 2 + 'px'
                                    ,'visibility':'hidden'//先隐藏，设置css的时候再显示，规避闪屏的问题
								};
//                                //dialog框宽度设定
								if (angular.isNumber(options.width)) {
									cssValues.width = options.width + 'px';
									cssValues['margin-left'] = -options.width / 2 + 'px';
									// 此处可能也同时引起了高度变化，margin-top也要跟着改
									// img 尺寸为定义的时候，会在加载图片时才获得尺寸，导致高度再次发生变化，可以在 css 中对对话框中的定义统一尺寸
								}
                                if (angular.isNumber(options.height)) {
                                    cssValues.height = options.height + 'px';//如果指定了height则将height设置为指定值
                                    cssValues['margin-top'] = -options.height / 2 + 'px';
                                }
								$dialogMain.css(cssValues);

                                //垂直居中修正
                                $timeout(function(){
                                    $dialogMain.css({'margin-top': -$dialogMain.prop('clientHeight') / 2 + 'px', 'visibility':'visible'});
                                    var diff = $dialogMain.prop('offsetTop');
                                    if(diff < 0){
                                        $dialogMain.css({'margin-top':'0','top':'0','height': $dialogMain.prop('clientHeight') + diff*2 +'px'});
                                    }
                                });
								$rootScope.$broadcast('wiDialog.opened', $dialog);
							});

							if (options.closeByEscape) {
								_$body.bind('keydown', privateMethods.onDocumentKeydown);
							}

							closeByDocumentHandler = function (event) {
								var isOverlay = options.closeByDocument ? $el(event.target).hasClass('wi-dialog-overlay') : false;
								var isCloseBtn = $el(event.target).hasClass('wi-dialog-close');
								if (isOverlay || isCloseBtn) {
									publicMethods.closeOne($dialog.attr('id'), isCloseBtn ? '$closeButton' : '$document');
								}
							};

							if (typeof window.Hammer !== 'undefined') {
								window.Hammer($dialog[0]).on('tap', closeByDocumentHandler);
							} else {
                                $dialog.bind('click', closeByDocumentHandler);
							}

							dialogsCount += 1;

							return publicMethods;
						});

						return {
							id: 'widialog' + globalID,
							closePromise: defer.promise,//只有关闭dialog的时候才会调用deffer.resolve方法，所以这里叫closePromise
							close: function (value) {
								privateMethods.closeDialog($dialog, value);
							}
						};

						//载入模板
						function loadTemplate(tmpl) {
							if (!tmpl) {
								return 'Empty template';
							}
							if (angular.isString(tmpl) && options.plain) {
								return tmpl;
							}
							//直接从$templateCache中取，取不到则发起http请求
							return $templateCache.get(tmpl) || $http.get(tmpl, { cache: true });
						}
					},

                    /**
                     * @ngdoc method
                     * @name ui.wisoft.dialog.wiDialog#openConfirm
                     * @methodOf ui.wisoft.dialog.wiDialog
                     * @description
                     *
                     * @param {Object} options 见open方法的options。
                     *
                     * @return {Object} promise,返回一个promise,如果使用 .confirm() 方法来关闭dialog，则该promise被resolved，否则被 rejected.
                     *
                     */
					openConfirm: function (opts) {
						var defer = $q.defer();

						var options = {
							closeByEscape: false,//默认情况下ESC不能通过ESC关闭dialog
							closeByDocument: false//默认 不能通过鼠标点击文档关闭dialog
						};
						angular.extend(options, opts);

						options.scope = angular.isObject(options.scope) ? options.scope.$new() : $rootScope.$new();
						//
						options.scope.confirm = function (value) {
							defer.resolve(value);
							openResult.close(value);
						};

						var openResult = publicMethods.open(options);
						//如果调用了closeDialog方法，则reject。
						// 这种情况说明调用openConfirm打开了dialog窗口，但是又通过点击页面 或者 关闭按钮  或者 ESC 将dialog关闭。
						openResult.closePromise.then(function (data) {
							//data有值说明调用了closeDialog，对于openConfirm来说应该调用reject
							if (data) {
								return defer.reject(data.value);
							}
							return defer.reject();
						});

						return defer.promise;
					},

                    /**
                     * @ngdoc method
                     * @name ui.wisoft.dialog.wiDialog#closeOne
                     * @methodOf ui.wisoft.dialog.wiDialog
                     * @description 关闭一个dialog。
                     *
                     * @param {String=} id 要关闭的dialog的ID，如果没有指定ID，则关闭所有的dialog。
                     * @param {Object=} value 关闭窗口时要返回的值，dialog可以通过promise可以获取该值。
                     *
                     */
					closeOne: function (id, value) {
						var $dialog = $el(_document.getElementById(id));

						//如果没有传递dialog的id，则关闭当前所有的dialog
						if ($dialog.length) {
							privateMethods.closeDialog($dialog, value);
						} else {
							publicMethods.closeAll(value);
						}
						return publicMethods;
					},
                    /**
                     * @ngdoc method
                     * @name ui.wisoft.dialog.wiDialog#closeAll
                     * @methodOf ui.wisoft.dialog.wiDialog
                     * @description 用来关闭通过wiDialog弹出的所有的dialog.
                     *
                     * @param {Object=} value 关闭窗口时要返回的值，每个dialog的都可以通过promise可以获取该值。
                     *
                     *
                     */
					closeAll: function (value) {
						var $all = _document.querySelectorAll('.wi-dialog');

						angular.forEach($all, function (dialog) {
							privateMethods.closeDialog($el(dialog), value);
						});
					}
				};

				return publicMethods;
			}];
	})
    //用来支持拖动（暂时这样写，将来在看是否有必要替换成通用的指令） - 值为 element 下监听拖动的子元素的 class
    .directive('dialogDraggable',['$document', function($document) {
        return function(scope, element, attrs) {
            var dragClass = attrs['dialogDraggable']
                ,dragElem;// 监听拖动的 jqlite 元素
            if(dragClass){
                angular.forEach(element.children(), function(child){
                    if(dragElem === undefined && (' ' + child.className +  ' ').indexOf(dragClass) >= 0){
                        dragElem = angular.element(child);
                    }
                });
            }
            if(!dragElem) dragElem = element;// 为定义监听拖动的元素，监听 element

            var startX = 0, startY = 0, x= 0, y=0;
            //dialogIniframe设为true时，弹出不支持拖动（默认都是在顶层窗口弹出的）
            var _doc=window.top.document;
//            var doc=document;

            dragElem.on('mousedown', function(event) {
                // 元素初始位置
                if (window.getComputedStyle) { // IE9 以下不支持
                    x = window.getComputedStyle(element[0])['left'];
                    y = window.getComputedStyle(element[0])['top'];
                }
                x = Number(x.replace('px','')) || 0;
                y = Number(y.replace('px','')) || 0;
                // 阻止所选对象的默认拖曳操作
                event.preventDefault();
                startX = event.screenX;// 鼠标按下的初始位置
                startY = event.screenY;
                element.css({ 'cursor':'move'});
                // 添加鼠标移动及抬起监听
                _doc.addEventListener('mousemove', mousemove);
                _doc.addEventListener('mouseup', mouseup);
//            doc.addEventListener('mousemove', mousemove);
//            doc.addEventListener('mouseup', mouseup);
            });

            function mousemove(event) {
                element.css({
                    top: y + event.screenY -startY + 'px',
                    left: x + event.screenX -startX + 'px'
                });
            }

            function mouseup() {
                element.css({'cursor':'default'});
                _doc.removeEventListener('mousemove', mousemove);
                _doc.removeEventListener('mouseup', mouseup);
//            doc.removeEventListener('mousemove', mousemove);
//            doc.removeEventListener('mouseup', mouseup);
            }
    }
}]);

/**
 * Created by QianQi on 2014/9/1.
 */
angular.module('ui.wisoft.dividedbox', ['ui.wisoft.transition']).
    constant('dividedboxConf', {
        boxMinSize: 100, // box 最小尺寸
        collapseSize: 28, // 折叠时的尺寸
        barSize: 4 // resizebar 的尺寸，与 css 中统一
    }).
    factory('dividedboxService', ['dividedboxConf','$compile', function (dividedboxConf, $compile) {
        return{
            dividedboxProductor: function (type) {
                var eventPosName, followbarStr;
                if(type == 'h'){
                    eventPosName = 'clientX';
                    followbarStr = '<span class="wi-dividedbox-followbar" ng-style="{left: \'calc(\' + resizeConf.preSizes + \' + \' + resizeConf.preResizes + \'px)\'}"></span>';
                }
                else{
                    eventPosName = 'clientY';
                    followbarStr = '<span class="wi-dividedbox-followbar" ng-style="{top : \'calc(\' + resizeConf.preSizes + \' + \' + resizeConf.preResizes + \'px)\'}"></span>';
                }
                return {
                    restrict: 'E',
                    templateUrl: function () {
                        return  'template/dividedbox/wi-dividedbox.html';
                    },
                    transclude: true,
                    replace: true,
                    scope: {},
                    controller: ['dividedboxConf', '$scope', '$transition', function (dividedboxConf, $scope, $transition) {
                        var ctrl = this;
                        $scope.type = type;
                        var to0 = type == 'h' ? 'left' : 'up', toN = type == 'h' ? 'right' : 'down';
                        //注册Box
                        var boxes = $scope.boxes = [];//子 box 的 scope 列表
                        var unDefBoxes = [],// 用户未定义的 box 的 index 的集合
                            unDefSize = '100%',// 未分配的尺寸
                            lastCollapseto = false;// 记录上个 box 是否修改折叠方向
                        // 将 box (子块的 scope) 添加到 boxes 数组中
                        ctrl.addBox = function (box) {
                            var index = $scope.boxes.length;
                            box.initBox(index);// 获取用户定义的 size，并设置 index 和 type
                            boxes.push(box);
                            /* 自适应 box 尺寸定义 */
                            box.dividedboxG.user === '' ?
                                unDefBoxes.push(index) :
                                (unDefSize += ' - ' + box.dividedboxG.user);//未指定 user，加入 unDefBoxes，否则从 unDefSize 减去
                            var avgUnDefSize = '(' + unDefSize + ') / ' + unDefBoxes.length.toString();// 未定义尺寸的子块的平均尺寸
                            angular.forEach(unDefBoxes, function (boxIndex) {//未定义尺寸的子块赋值
                                boxes[boxIndex].dividedboxG.user = boxes[boxIndex].dividedboxG.size = avgUnDefSize;
                            });
                            /* 规范折叠方向 */
                            if (index == 0) {// 第一项，未知是否有后项，禁止折叠
                                lastCollapseto = box.dividedboxG.collapseto ? true : false;
                                box.dividedboxG.collapseto = undefined;
                                box.dividedboxG.collapsed = false;
                            } else {
                                if (lastCollapseto) {// 若前一项 collapseto 曾被修改（原始值为“向前”，或第一项只能“向前”），改回“向前”折叠
                                    boxes[index - 1].dividedboxG.collapseto = to0;
                                    lastCollapseto = false;
                                }
                                if (box.dividedboxG.collapseto == to0) {// 未知是否有后项，不得“向前折叠”
                                    box.dividedboxG.collapseto = toN;
                                    lastCollapseto = true;
                                }
                                /* 初始化折叠状态 */
                                angular.forEach(boxes, function(box){
                                    box.dividedboxG.collapsed = false;// 展开所有子块
                                    box.dividedboxG.resize = 0;
                                    if(box.dividedboxG.user){
                                        box.dividedboxG.size = box.dividedboxG.user;
                                    }
                                });
                                angular.forEach(boxes, function(box, i){
                                    if(box.dividedboxG.collapseto && box.dividedboxG._collapsed){// 处理用户定义初始时折叠的子块
                                        initCollapse(i);
                                    }
                                });
                            }
                        };
                        ctrl.removeBox = function (index) {
                            if (index !== -1) {
                                boxes.splice(index, 1);
                                for (var i = index; i < boxes.length; i++) {
                                    boxes[i].index--;
                                }
                            }
                        };

                        // 处理用户定义初始时折叠的子块
                        function initCollapse(index) {
                            var box = boxes[index],
                                changeSign = (box.dividedboxG.collapseto == 'left' || box.dividedboxG.collapseto == 'up') ? 1 : -1,
                                nearbox = boxes[index + changeSign];
                            // 影响的 box 已折叠
                            if (nearbox.dividedboxG.collapsed == true) return;
                            var chargeBox = boxes[index - changeSign];// 反向相邻容器
                            // 无反向 chargeBox，或其未折叠，或其折叠方向与 box 相反时，可以折叠
                            if (chargeBox && chargeBox.dividedboxG.collapsed == true && chargeBox.dividedboxG.collapseto == box.dividedboxG.collapseto) return;
                            var str = ' + ' + box.dividedboxG.user,//折叠时附加的 size
                                currentSize = (index == $scope.boxes.length - 1) ?
                                    dividedboxConf.collapseSize - dividedboxConf.barSize :
                                    dividedboxConf.collapseSize;// 最后一行 box 无 resizebar
                            // begin to collapse
                            box.dividedboxG.size = '0px';
                            box.dividedboxG.resize = currentSize;
                            nearbox.dividedboxG.size  += str;
                            nearbox.dividedboxG.resize = 0 - currentSize;
                            box.dividedboxG.collapsed = !box.dividedboxG.collapsed;
                        }

                        //begin to resize
                        ctrl.startResize = function (index) {
                            if ($scope.resizeConf.resizable && $scope.resizeConf.resizing == false) {
                                if ($scope.boxes[index].dividedboxG.collapsed === true || $scope.boxes[index + 1].dividedboxG.collapsed === true) return;//当前 box 或影响 box 折叠时禁止 resize
                                $scope.resizeConf.resizing = true;
                                $scope.resizeConf.index = index;
                            }
                        };

                        //collapse
                        var transCollCount = 0;// 正在执行折叠动画的数量
                        ctrl.doCollapse = function (index) {
                            if (transCollCount != 0) return;// 正在进行 collapse 或 expand 操作
                            var box = boxes[index],
                                changeSign = (box.dividedboxG.collapseto == 'left' || box.dividedboxG.collapseto == 'up') ? 1 : -1,
                                nearbox = boxes[index + changeSign];
                            // 影响的 box 已折叠
                            if (nearbox.dividedboxG.collapsed == true) return;
                            var chargeBox = boxes[index - changeSign];// 反向相邻容器
                            // 无反向 chargeBox，或其未折叠，或其折叠方向与 box 相反时，可以折叠
                            if (chargeBox && chargeBox.dividedboxG.collapsed == true && chargeBox.dividedboxG.collapseto == box.dividedboxG.collapseto) return;
                            var str = ' + ' + box.dividedboxG.user,//折叠时附加的 size
                                currentSize = (index == $scope.boxes.length - 1) ?
                                    dividedboxConf.collapseSize - dividedboxConf.barSize :
                                    dividedboxConf.collapseSize;// 最后一行 box 无 resizebar
                            // begin to collapse
                            box.dividedboxG.preResize = box.dividedboxG.resize;
                            transCollCount += 2;
                            // TODO 两个动画之间的延时误差
                            collTransition(box.getElem(), function () {
                                box.dividedboxG.size = '0px';
                                box.dividedboxG.resize = currentSize;
                                box.dividedboxG.collapsed = !box.dividedboxG.collapsed;
                            });
                            collTransition(nearbox.getElem(), function () {
                                nearbox.dividedboxG.size = nearbox.dividedboxG.size + str;
                                nearbox.dividedboxG.resize = nearbox.dividedboxG.resize + box.dividedboxG.preResize - currentSize;
                            });
                        };
                        ctrl.doExpand = function (index) {
                            if (transCollCount != 0) return;// 正在进行 collapse 或 expand 操作
                            var box = boxes[index],
                                changeSign = (box.dividedboxG.collapseto == 'left' || box.dividedboxG.collapseto == 'up') ? 1 : -1,
                                str = ' + ' + box.dividedboxG.user,//折叠时附加的 size
                                nearbox = boxes[index + changeSign],
                                currentSize = (index == $scope.boxes.length - 1) ?
                                    dividedboxConf.collapseSize - dividedboxConf.barSize :
                                    dividedboxConf.collapseSize;// 最后一行 box 无 resizebar
                            // begin to expand
                            transCollCount += 2;
                            box.dividedboxG.collapsed = !box.dividedboxG.collapsed;
                            collTransition(box.getElem(), function () {
                                box.dividedboxG.size = box.dividedboxG.user;
                                box.dividedboxG.resize = box.dividedboxG.preResize;
                            });
                            collTransition(nearbox.getElem(), function () {
                                var i = nearbox.dividedboxG.size.indexOf(str);
                                nearbox.dividedboxG.size = nearbox.dividedboxG.size.slice(0, i).concat(nearbox.dividedboxG.size.slice(i + str.length));
                                nearbox.dividedboxG.resize = nearbox.dividedboxG.resize - box.dividedboxG.preResize + currentSize;
                            });
                        };
                        function collTransition(elem, change) {// 折叠动画：过渡到 change ( class 名、函数、style 集合)
                            function transitionDone() {// transition 完成后执行
                                transCollCount--;
                                elem.removeClass('wi-dividedbox-collapsing');
                            }
                            if (!!window.ActiveXObject || "ActiveXObject" in window) {// ie 不支持绑定数据触发动画
                                change();
                                transCollCount--;
                            } else {
                                elem.addClass('wi-dividedbox-collapsing');
                                var transition = $transition(elem, change);
                                transition.then(transitionDone, transitionDone);//transition （成功，失败）时执行回调函数，返回新的 promise 对象
                                return transition;
                            }
                        }
                    }],
                    link: function (scope, elem, attrs) {
                        var parentScope = scope.$parent;
                        // 尺寸类型的属性处理方法（其他组件中也存在类似方法，依赖于 scope），可接受的值：数字、数字开头、scope 对象（数字、数字开头）
                        var getSizeFromAttr = function(attr){
                            if(!attr) return;
                            var size;
                            if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                                size = attr;
                            }else{// 非数字开始，可能是 scope 对象
                                size = parentScope.$eval(attr);
                            }
                            Number(size) && (size += 'px');// 是数字则加上单位 px
                            return size;
                        };
                        var followbar = $compile(followbarStr)(scope);
                        elem.prepend(followbar);// 将 resize 时跟随的 bar 添加到 elem 中
                        elem.addClass('wi-'+ type +'dividedbox');// 添加对应方向的 class
                        elem.css({
                            'width': getSizeFromAttr(attrs['width']) || ''
                            ,'height': getSizeFromAttr(attrs['height']) || ''
                        });
                        scope.$on('$destroy', function(){
                            followbar && followbar.remove();
                        });
                        //resize
                        scope.resizeConf = {
                            resizable: (attrs['resizable'] != 'false'),// 用户定义是否可以 resizable
                            resizing: false,// 是否正在 resize
                            index: -1,// 触发 resize 的 box 的索引
                            preSizes: '0px', preResizes: -1 * dividedboxConf.barSize// resizingBar 的位置
                        };

                        /* resizing 事件处理 */
                        if(scope.resizeConf.resizable){
                            var startPos, lastPos, limit0, limit1;//初始鼠标位置，上次鼠标位置，resize 范围（limit0 ~ limit1）
                            elem.on('mousedown', function (e) {//鼠标按下 begin to resize
                                if (scope.resizeConf.resizing === true) {
                                    var index = scope.resizeConf.index;
                                    lastPos = startPos = e[eventPosName];
                                    limit0 = startPos - scope.boxes[index].chargeDiff(dividedboxConf.boxMinSize);
                                    limit1 = startPos + scope.boxes[index + 1].chargeDiff(dividedboxConf.boxMinSize);
                                    for (var i = 0; i <= scope.resizeConf.index; i++) {// 获取鼠标位置尺寸拼接串 - 即 followbar 的位置
                                        scope.resizeConf.preSizes += ' + ' + scope.boxes[i].dividedboxG.size;
                                        scope.resizeConf.preResizes += scope.boxes[i].dividedboxG.resize;
                                    }
                                    elem.on('mousemove', mousemove)
                                        .on('mouseup', stopResizing)
                                        .on('mouseleave', stopResizing);
                                }
                            });
                        }
                        function mousemove(e) {//鼠标移动 resizing
                            var current = e[eventPosName];
                            if (current >= limit0 && current <= limit1) {
                                scope.resizeConf.preResizes += current - lastPos;//坐标差值
                                lastPos = current;
                                scope.$digest();
                            }
                        }
                        function stopResizing() {//stop resizing
                            var changePos = lastPos - startPos;
                            var index = scope.resizeConf.index;
                            scope.boxes[index].dividedboxG.resize += changePos;
                            scope.boxes[index + 1].dividedboxG.resize -= changePos;
                            scope.resizeConf.resizing = false;
                            scope.resizeConf.preSizes = '0px';
                            scope.resizeConf.preResizes = -1 * dividedboxConf.barSize;
                            scope.$digest();
                            scope.boxes[index].$digest();
                            scope.boxes[index + 1].$digest();
                            elem.unbind('mousemove', mousemove)
                                .unbind('mouseup', stopResizing)
                                .unbind('mouseleave', stopResizing);
                        }
                    }
                }
            },
            dividedboxGroupProductor: function (type) {
                var require, sizeType, collapsetoRegex, domSizeName;
                if (type == 'h') {
                    require = '^wiHdividedbox';
                    sizeType = 'width';
                    collapsetoRegex = new RegExp('left|right');
                    domSizeName = 'clientWidth';
                }
                else {
                    require = '^wiVdividedbox';
                    sizeType = 'height';
                    collapsetoRegex = new RegExp('up|down');
                    domSizeName = 'clientHeight';
                }
                return {
                    restrict: 'E',
                    templateUrl: function () {
                        return  'template/dividedbox/wi-dividedbox-group.html';
                    },
                    transclude: true,
                    replace: true,
                    scope: {},
                    require: require,
                    link: function (scope, elem, attrs, divboxCtrl) {
                        var _size = (function(attr){
                            if(!attr) return;
                            if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                                var size = attr;
                                Number(size) && (size += 'px');// 是数字则加上单位 px
                                return size;
                            }
                        })(attrs[sizeType]) || '';// 用户通过 width/height 定义的值，未定义时为 ''

                        // 初始化，在 divboxCtrl.addBox(scope) 中调用，获取用户自定义属性，并使属性值合法
                        scope.initBox = function (index) {
                            scope.dividedboxG = {
                                index: index// 在 dividedbox 组中的索引
                                ,type: type// h 为横向，v 为纵向
                                ,user: _size// 用户通过 width/height 定义的值，未定义时为 ''
                                ,size: _size// string 的部分 - 模板中绑定
                                ,resize: 0// 要变化的值，单位 px - 模板中绑定
                                ,preResize: 0// collapse 前的 resize
                                ,title: attrs['wiTitle']// head 部分文字
                                ,icon: attrs['wiIcon'] || ''// head 部分图标的 url
                                ,collapseto: (attrs['collapseto'] && collapsetoRegex.test(attrs['collapseto'])) ?
                                    attrs['collapseto'].match(collapsetoRegex)[0] :
                                    undefined// 折叠方向
                                ,collapsed: (attrs['collapsed'] == 'true')// 折叠状态
                                ,_collapsed: (attrs['collapsed'] == 'true')// 初始化时，用户自定义的折叠状态
                            };
                            elem.addClass('wi-' + type + 'dividedbox-group' +
                                ((scope.dividedboxG.collapseto || scope.dividedboxG.title!== undefined) ?
                                    ' wi-dividedbox-showhead' : ''));// 未定义折叠方向及标题文字，不显示head
                        };
                        /* 注册 */
                        divboxCtrl.addBox(scope);//在 divbox 中注册
                        scope.$on('$destroy', function () {
                            divboxCtrl.removeBox(scope.dividedboxG.index);
                        });

                        /* resize：开始 resize，通知所在的 divbox 容器 */
                        scope.startResize = function () {
                            divboxCtrl.startResize(scope.dividedboxG.index);
                        };

                        /* collapse：切换当前折叠状态 */
                        scope.doCollapse = function () {
                            scope.dividedboxG.collapsed == true ?
                                divboxCtrl.doExpand(scope.dividedboxG.index) :
                                divboxCtrl.doCollapse(scope.dividedboxG.index);
                        };

                        // 返回 box 当前尺寸与指定值的差值（若差值为 负，返回 0）-在 resize 时计算可用空间时使用
                        scope.chargeDiff = function (size) {
                            return Math.max(elem[0][domSizeName] - size, 0);
                        };

                        // 获取当前 elem，折叠操作中 $transition 使用
                        scope.getElem = function () {
                            return elem;
                        }
                    }
                }
            }
        }
    }]).
/**
 * @ngdoc directive
 * @name ui.wisoft.dividedbox.directive:wiHdividedbox
 * @restrict E
 * @scope
 *
 * @description
 * wiHdividedbox 是横向分屏容器，内含若干个 wiHdividedboxGroup 子块。
 *
 * @param {boolean=} resizable 其中的 wiHdividedboxGroup 子块是否可以进行 resize，默认为 true。
 * @param {number|length=} width 宽度，从属性字符串直接读取，默认为 100%。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {number|length=} height 高度，从属性字符串直接读取，默认为 100%。<br />
 *   说明同 width。
 */
    directive('wiHdividedbox', ['dividedboxService', function (dividedboxService) {
        return dividedboxService.dividedboxProductor('h');
    }]).
/**
 * @ngdoc directive
 * @name ui.wisoft.dividedbox.directive:wiVdividedbox
 * @restrict E
 * @scope
 *
 * @description
 * wiVdividedbox 是纵向分屏容器，内含若干个 wiVdividedboxGroup 子块。
 *
 * @param {boolean=} resizable 其中的 wiVdividedboxGroup 子块是否可以进行 resize，默认为 true。
 * @param {number|length=} width 宽度，从属性字符串直接读取，默认为 100%。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {number|length=} height 高度，从属性字符串直接读取，默认为 100%。<br />
 *   说明同 width。
 */
    directive('wiVdividedbox', ['dividedboxService', function (dividedboxService) {
        return dividedboxService.dividedboxProductor('v');
    }]).
/**
 * @ngdoc directive
 * @name ui.wisoft.dividedbox.directive:wiHdividedboxGroup
 * @restrict E
 * @scope
 *
 * @description
 * wiHdividedboxGroup 是纵向分屏子块，其中为用户自定义内容。
 *
 * @param {string=} wiTitle 当前分屏子块的标题，可以为空字符串。
 * @param {string=} wiIcon 当前分屏字块的标题栏图标的 url，若未设置 wiTitle 属性，此属性无效。
 * @param {length=} width 当前分屏子块的宽度，从属性字符串直接读取，未定义宽度的子块将均分。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {string=} collapseto 当前分屏子块的折叠方向，未定义则默认不可折叠。<br />
 *   可选值为"left"/"right"。
 * @param {boolean=} collapsed 当前分屏子块若定义了 collapseto 属性，则此属性表示初始的折叠状态，未定义则默认未折叠。
 *
 */
    directive('wiHdividedboxGroup', ['dividedboxService', function (dividedboxService) {
        return dividedboxService.dividedboxGroupProductor('h');
    }]).
/**
 * @ngdoc directive
 * @name ui.wisoft.dividedbox.directive:wiVdividedboxGroup
 * @restrict E
 * @scope
 *
 * @description
 * wiVdividedboxGroup 是纵向分屏子容器，其中为用户自定义内容。
 *
 * @param {string=} wiTitle 当前分屏子块的标题，可以为空字符串。
 * @param {string=} wiIcon 当前分屏字块的标题栏图标的 url，若未设置 wiTitle 属性，此属性无效。
 * @param {length=} height 当前分屏子块的高度，从属性字符串直接读取，未定义高度的子块将均分。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {string=} collapseto 当前分屏子块的折叠方向，未定义则默认不可折叠。<br />
 *   可选值为"up"/"down"。
 * @param {boolean=} collapsed 当前分屏子块若定义了 collapseto 属性，则此属性表示初始的折叠状态，未定义则默认未折叠。
 *
 */
    directive('wiVdividedboxGroup', ['dividedboxService', function (dividedboxService) {
        return dividedboxService.dividedboxGroupProductor('v');
    }]);
'use strict';
angular.module('ui.wisoft.fileupload',['ui.wisoft.position','ui.wisoft.progress'])
    .constant('fileuploadConf', {
        STARTED: 1// 文件队列正在上传
        ,STOPED: 2// 文件队列上传未开始或已结束
        ,queued: 1// 某个文件正在排队
        ,uploading: 2// 某个文件正在上传
        ,completed: 3// 某个文件上传成功
        ,failed: 4// 某个文件上传出错
    })
    .service('fileuploadSev', function(){
        var key = 0;//辅助生成唯一 id
        return{
            /**
             * 格式化文件大小：将以 b 为单位的数字串格式化为合适的单位
             * @param e 数字
             */
            formatSize: function(e) {
                function t(e, t) {
                    return Math.round(e * Math.pow(10, t)) / Math.pow(10, t)
                }
                if (e === undefined || /\D/.test(e) ) return 'NaN';
                var r = Math.pow(1024, 4);
                return e > r ?
                    t(e / r, 1) + " tb" :
                        e > (r /= 1024) ?
                    t(e / r, 1) + " gb" :
                        e > (r /= 1024) ?
                    t(e / r, 1) + " mb" :
                        e > 1024 ?
                    Math.round(e / 1024) + " kb" :
                    e + " b";
            }
            /**
             * 分析文件大小：将有单位的文件大小转换为 b 为单位的数字
             * @param e 字符串
             */
            ,parseSize: function(e) {
                if ("string" != typeof e)return e;
                var t = {t: 1099511627776, g: 1073741824, m: 1048576, k: 1024}, n;
                return e = /^([0-9]+)([mgk]?)$/.exec(e.toLowerCase().replace(/[^0-9mkg]/g, "")), n = e[2], e = +e[1], t.hasOwnProperty(n) && (e *= t[n]), e
            }
            /**
             * 根据后缀名格式化 accept 字符串
             * @param mimesJson 类似 "mp3,mp4" 的后缀名字符串
             */
            ,formatMimetype: function(mimesJson){
                var acceptStr = ''
                    ,mimegroup
                    ,_mimeList= {
                        '3g2': "video/3gpp2",
                        '3gp': "video/3gpp",
                        '3gpp': "video/3gpp",
                        'aac': "audio/aac",
                        'ac3': "audio/ac3",
                        'ai': "application/postscript",
                        'aif': "audio/aiff",
                        'aiff': "audio/aiff",
                        'asc': "text/plain",
                        'avi': "video/avi",
                        'bmp': "image/bmp",
                        'css': "text/css",
                        'csv': "text/csv",
                        'diff': "text/plain",
                        'doc': "application/msword",
                        'docx': "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        'dot': "application/msword",
                        'dotx': "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
                        'eps': "application/postscript",
                        'exe': "application/octet-stream",
                        'flac': "audio/flac",
                        'flv': "video/x-flv",
                        'gif': "image/gif",
                        'htm': "text/html",
                        'html': "text/html",
                        'jpe': "image/jpeg",
                        'jpeg': "image/jpeg",
                        'jpg': "image/jpeg",
                        'js': "application/x-javascript",
                        'json': "application/json",
                        'log': "text/plain",
                        'm2v': "video/mpeg",
                        'm4a': "audio/x-m4a",
                        'm4v': "video/x-m4v",
                        'mkv': "video/x-matroska",
                        'mov': "video/quicktime",
                        'mp2': "audio/mpeg",
                        'mp3': "audio/mpeg",
                        'mp4': "video/mp4",
                        'mpe': "video/mpeg",
                        'mpeg': "video/mpeg",
                        'mpega': "audio/mpeg",
                        'mpg': "video/mpeg",
                        'mpga': "audio/mpeg",
                        'oga': "audio/ogg",
                        'ogg': "audio/ogg",
                        'ogv': "video/ogg",
                        'otf': "application/vnd.oasis.opendocument.formula-template",
                        'pdf': "application/pdf",
                        'pgp': "application/pgp-signature",
                        'png': "image/png",
                        'pot': "application/vnd.ms-powerpoint",
                        'potx': "application/vnd.openxmlformats-officedocument.presentationml.template",
                        'pps': "application/vnd.ms-powerpoint",
                        'ppsx': "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
                        'ppt': "application/vnd.ms-powerpoint",
                        'pptx': "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                        'ps': "application/postscript",
                        'psd': "image/photoshop",
                        'qt': "video/quicktime",
                        'rtf': "text/rtf",
                        'rv': "video/vnd.rn-realvideo",
                        'svg': "image/svg+xml",
                        'svgz': "image/svg+xml",
                        'swf': "application/x-shockwave-flash",
                        'swfl': "application/x-shockwave-flash",
                        'text': "text/plain",
                        'tif': "image/tiff",
                        'tiff': "image/tiff",
                        'txt': "text/plain",
                        'wav': "audio/x-wav",
                        'webm': "video/webm",
                        'wma': "audio/x-ms-wma",
                        'wmv': "video/x-ms-wmv",
                        'xhtml': "text/html",
                        'xlb': "application/vnd.ms-excel",
                        'xls': "application/vnd.ms-excel",
                        'xlsx': "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        'zip': "application/zip"
                    };
                mimesJson && angular.forEach(mimesJson, function(mime){
                    mimegroup = mime.extensions.replace(' ','').split(',');
                    angular.forEach(mimegroup, function(m){
                        acceptStr += _mimeList[m] + ',';
                    })
                });
                return acceptStr.length ? ' accept="' + acceptStr.slice(0,-1) + '"' : '';
            }
            /**
             * 生成并返回唯一 id
             * @param t 生成的唯一 id 的前缀
             */
            ,getUid: function (t) {
                var n = (new Date).getTime().toString(32), i;
                for (i = 0; 5 > i; i++)n += Math.floor(65535 * Math.random()).toString(32);
                return(t || "o_") + n + (key++).toString(32)
            }
            /**
             * 返回对应的文件类型用以选择显示图标
             * @param t accept 类型字符串
             */
            ,getType: function(t){
                if(t.indexOf('image')==0) {
                    return 'picture';
                } else if(t.indexOf('video')==0) {
                    return 'film';
                } else if(t.indexOf('audio')==0) {
                    return 'music';
                } else {
                    return 'file';
                }
            }
        }
    })

/**
 * @ngdoc directive
 * @name ui.wisoft.fileupload.directive:wiFileupload
 * @restrict E
 *
 * @description
 * wiFileupload 文件上传组件，用于显示文件上传的进度和状态（IE9 暂未实现）。
 *
 * @param {string} wiUrl 用于处理上传的 url（若此 url 与当前页面不在同一个域名范围且未在服务端设置 Access-Control-Allow-Origin，可能会被浏览器拦截）。
 * @param {string} wiTrigger 触发文件选择弹窗的元素 id。
 * @param {string|number=} wiMaxSize 允许上传的文件的最大 size，可以为形如“4mb，4k”的字符串，也可以为以“b”为单位的数字。
 * @param {string=}  wiMimeTypes 允许上传的文件的后缀名，不设置则不限制，格式为：[{ title: 'music', extensions: 'mp3,mp4' },{ title: 'text', extensions: 'txt' }]。
 * @param {boolean=}  wiMultisel 支持多选时需设置此属性，默认不支持。
 * @param {boolean=}  wiModal 设置此属性时上传进度及状态将模态显示，上传过程中不能进行其他操作。
 * @param {string=}  wiResponse 父 scope 中用于获取返回值的变量名。
 * @param {string=}  wiSwf 对不支持 html5 上传方式的浏览器使用 flash 上传的 swf 的路径（暂未实现）。
 * @param {string=} removeFun 取消上传某个文件后执行的方法名，此方法传入一个参数 f, f 为被取消的文件的信息对象。
 *
 */
    .directive('wiFileupload',['$position', 'fileuploadSev', 'fileuploadConf', '$timeout', '$parse', '$document', 'wiDialog', function ($position, fileuploadSev, fileuploadConf, $timeout, $parse, $document, wiDialog) {
        return {
            restrict:'E',
            templateUrl: 'pcc/template/fileupload/wi-fileupload.html',// 模态时调用 dialog 处需将模板以字符串形式传入
            scope: {},
            replace: true,
            link: function (scope,elem,attrs) {
                // 自定义配置
                var options = scope.fileULOptions = {
                    url: attrs['wiUrl'] || ''
                    ,multi_selection: attrs.hasOwnProperty('wiMultisel') && attrs['wiMultisel'] != 'false'// 是否允许多选，默认不支持
                    ,browse_button: document.getElementById(attrs['wiTrigger'])// 触发选择文件弹窗的按钮
                    ,modal: !!attrs.hasOwnProperty('wiModal')// 是否模态显示上传状态，默认非模态
                };
                scope.files = [];// 要上传的文件对应的信息 - 通过 id 与 要上传的 file 关联
//                options.url = "http://192.10.110.174:8804/NewFrame/CommonServlet?bean=FileManagerPO&path=D:\\wisoft\\&sid=408aee4e3bacd24f013bb0ec0e650030&isUploadMore=true&uploadMaxSize=8000000"; // 服务器测试
                if(!options.browse_button || !options.url) return;// 未定义触发按钮

                /* 上传文件的后缀名限制 */
                var extensions;
                // 若定义了 wi-mime-types，将其格式化为 json 对象
                attrs['wiMimeTypes'] && (options.mime_types = (new Function("return " + attrs['wiMimeTypes']))());
                // 分析获得的 json 对象，将所有 后缀名存入 extensions 数组
                options.mime_types && (extensions = []) && angular.forEach(options.mime_types, function(o){
                    extensions = extensions.concat(o.extensions.split(','));
                });

                // 每个上传文件的最大值
                attrs['wiMaxSize'] && (options.max_file_size = fileuploadSev.parseSize(attrs['wiMaxSize']));
                // ie9 下打开的 swf 路径
                attrs['wiSwf'] && (options.flash_swf_url = attrs['wiSwf']);

                // 移除上传文件时用户自定义的操作 - 在父 scope 中
                scope.removeFun = attrs['removefun'] && scope.$parent ? $parse(attrs['removefun'])(scope.$parent): angular.noop;

                var uploadFiles = []// 上传队列中的文件
                    ,modalDialogId// 关闭模态对话框的方法，打开 dialog 时获取
                    ,lengthWatch;// 显示模态对话框时，用于取消对上传 队列长度监听的方法

                // 根据用户定义的属性，拼接 input[type='file'] 元素
                var triggerPos = $position.position(angular.element(options.browse_button))
                    ,elemStr = {
                        pos: 'top:' + triggerPos.top + 'px; left:' + triggerPos.left + 'px; width:' + triggerPos.width + 'px; height:' + triggerPos.height + 'px;'
                        ,multiple: options.multi_selection ? ' multiple' : ''
                        ,accept: fileuploadSev.formatMimetype(options.mime_types)
                    }
                    ,triggerbtn = angular.element('<input type="file" class="wi-fileupload-btn"' + elemStr.multiple + elemStr.accept + ' />')
                    ,triggerDiv = angular.element('<div class="wi-fileupload-btndiv" style="' + elemStr.pos + '"></div>');
                // 获取选中的文件
                triggerbtn.on('change',function g(){
                    if(!xhr) return;
                    this.files && angular.forEach(this.files, function(file){
                        addFile(file);// 根据用户设置的限制筛选文件，将符合要求的文件添加到上传队列，并与 scope.files 中的对象关联
                    });
                    try{// 清空控件中的值 - 确保下次选择文件后肯定触发 change
                        this.files = [];
                        this.value = '';
                    }catch(e){// 兼容处理，部分浏览器不支持 对 this.files 及 this.value 赋值
                        var n = triggerbtn.clone(true);
                        n.on('change', g);
                        triggerbtn.replaceWith(n);
                        triggerbtn = n;
                    }
                    scope.$digest();
                    // 模态处理 - 调用 wi-dialog 在模态窗口中显示上传状态
                    if(options.modal && scope.files.length > 0){
                        modalDialogId = wiDialog.open({
                            template:
                                '<ul class="wi-fileupload" ng-if="files.length>0">\
                                    <li ng-repeat="file in files track by file.id">\
                                        <span class="wi-fileupload-info" ng-style="{cursor: file.stat==3 ? \'pointer\': \'\'}" ng-click="getResponse(file)">\
                                            <span class="wi-fileupload-icon icon-{{file.type}}"></span>\
                        {{file.name}}\
                                            <span class="wi-fileupload-tip">({{file.size}})</span>\
                                        </span>\
                                        <span class="wi-fileupload-completed" ng-style="{display: file.stat==3 ? \'\' : \'none\'}">完成</span>\
                                        <span class="wi-fileupload-queued" ng-style="{display: file.stat==1 ? \'\' : \'none\'}">等待上传</span>\
                                        <wi-progress ng-style="{display: file.stat==2 ? \'\' : \'none\'}" label="file.progressLabel" value="file.percent"></wi-progress>\
                                        <span class="wi-fileupload-error" ng-style="{display: file.stat==4 ? \'\' : \'none\'}">上传失败</span>\
                                        <span class="wi-fileupload-del" ng-click="removeFile(file)">删除</span>\
                                    </li>\
                                </ul>',
                            plain: true,
                            title: '上传进度',
                            scope: scope,
                            width: 380
                        }).id;
                        if(!lengthWatch){
                            lengthWatch = scope.$watch('files.length',function(val){
                                if(val <= 0 && modalDialogId){
                                    wiDialog.closeOne(modalDialogId);
                                    lengthWatch();// 取消监听
                                    modalDialogId = undefined;
                                    lengthWatch = undefined;
                                }
                            });
                        }
                    }
                    queueCtrl();// 上传队列处理
                });
                triggerDiv.append(triggerbtn);
                options.browse_button.parentNode.appendChild(triggerDiv[0]);

                scope.$on('$destroy', function() {
                    if(xhr){// 销毁
                        (xhr.readyState != XMLHttpRequest.UNSENT) && xhr.abort();
                        xhr = null;
                    }
                    triggerbtn.remove();// 移除
                    triggerDiv.remove();
                    triggerbtn = null;// 销毁
                    triggerDiv = null;
                });
                /* --------- 上传配置 --------- */
                var xhr,
                    scopef,// 正在传输的文件对应在 scope 中的对象
                    uploadStat = fileuploadConf.STOPPED,
                    formdata;
                window.XMLHttpRequest && (xhr = new XMLHttpRequest());
                if(xhr){
                    // 传输状态改变
//                    xhr.addEventListener('readystatechange',function(){
//                        console.log('==readystatechange');
//                    });
                    // 传输结束(status > 399 失败) 4
                    xhr.addEventListener('loadend',function(){
                        if(xhr.status > 399){// 出错
                            scopef.stat = fileuploadConf.failed;
                        }else if(scopef.stat == fileuploadConf.uploading){
                            scopef.stat = fileuploadConf.completed;
                            scopef.responseText = xhr.responseText;
                        }
                        scope.$digest();
                        scopef = null;
                        queueCtrl();
                    });
                    //传输开始 1
//                    xhr.addEventListener('loadstart',function(e){
//                        console.log('==loadstart' + '    ' + xhr.readyState);
//                    });
                    // 进度改变 1
                    xhr.upload && xhr.upload.addEventListener('progress',function(evt){
                        if(!evt.lengthComputable) return;
                        scopef.percent = parseInt( evt.loaded / evt.total * 100);
                        scopef.progressLabel = scopef.percent + '%';
                        scope.$digest();
                    }, false);
                    // 传输出错
                    xhr.addEventListener('error',function(){
                        scopef && (scopef.stat = fileuploadConf.failed) && (scope.$digest());
                    });
                    // 传输取消
//                    xhr.addEventListener("abort", function(){
//                        console.log('==abort' + '    ' + xhr.readyState);
//                    });
                }

                function queueCtrl(){// 调用前需先判断是否支持 xhr
                    for(var index=0; index<uploadFiles.length; index++ ){
                        scopef = scope.files[index];
                        if(scopef.stat == fileuploadConf.uploading){// 正在上传
                            break;
                        }else if(scopef.stat == fileuploadConf.queued){// 开始上传
                            (uploadStat == fileuploadConf.STOPPED) && (uploadStat = fileuploadConf.STARTED);
                            scopef.stat = fileuploadConf.uploading;
                            scope.$digest();
                            formdata = new FormData();
                            formdata.append('file', uploadFiles[index]);
                            xhr.wiId = scopef.id;
                            xhr.open('post', options.url);
//                                xhr.setRequestHeader("Content-Type","multipart/form-data;");// 设置此项上传失败？？-因为以 formdata 上传的原因？？
                            xhr.send(formdata);
                            break;
                        }
                    }
                    // 全部处理完毕，文件队列上传结束
                    (index == scope.files.length) && (uploadStat = fileuploadConf.STOPPED);
                }

                // 添加文件
                function addFile(file){
                    if(extensions && extensions.indexOf(file.name.slice(file.name.lastIndexOf('.') + 1, file.name.length)) < 0) return;// 后缀名判断
                    if(options.max_file_size && file.size > options.max_file_size) return;// size 判断
                    var f = {
                        id: fileuploadSev.getUid('wif_')
                        ,name: file.name
                        ,type: fileuploadSev.getType(file.type)
                        ,size: fileuploadSev.formatSize(file.size)
                        ,percent: 0
                        ,progressLabel: '0%'
                        ,stat: fileuploadConf.queued // 等待上传
                    };
                    file.wiId = f.id;
                    scope.files.push(f);
                    uploadFiles.push(file);// 将文件添加到上传队列
                }
                // 删除文件
                scope.removeFile = function(f){
                    var id = f.id;
                    if(xhr.wiId == id){// 要删除的文件正在传输，取消当前正在传输的项目
                        xhr.abort();
                    }
                    scope.files.splice(scope.files.indexOf(f), 1);
                    for(var i=0; i< uploadFiles.length; i++){
                        (uploadFiles[i].wiId == f.id) && uploadFiles.splice(i, 1);
                    }
                    scope.removeFun(f);// 用户自定义的事件
                };
                // 获取返回数据
                if(attrs.hasOwnProperty('wiResponse')){
                    var responseName = attrs['wiResponse'],
                        parent = scope.$parent;
                    if(parent.hasOwnProperty(responseName)){
                        scope.getResponse = function(f){
                            if(f.stat != fileuploadConf.completed)return;
                            parent[responseName] = f.responseText;
                        }
                    }
                }
            }
        };
    }]);
/**
 * @ngdoc overview
 * @name ui.wisoft.imageview
 *
 * @description
 * 图片查看组件
 *
 * 主要功能：<br>
 * （1）支持多图片查看<br>
 * （2）支持图片旋转、缩放、拖动等功能<br>
 * （3）支持两种数据源;普通图片url和图像数据对象ImageData
 */
'use strict';
angular.module('ui.wisoft.imageview', [])
/**
 * @ngdoc directive
 * @name ui.wisoft.imageview.directive:wiImageview
 * @restrict E
 *
 * @description
 *图片查看组件
 *
 * @param {pixels} width 组件宽度(不含单位：px)。
 * @param {pixels} height 组件高度(不含单位：px)。
 * @param {boolean=} adaptive 第一次打开图片时是否自适应大小，默认值false
 * @param {array} imageurls 支持的第一种数据源：图片地址数组，如果数组中只有一张图片，则没有上一张和下一张按钮
 * @param {object} imagedata 支持的第二种数据源：图片数据对象，类型为ImageData
 * @param {number=} openindex 初始打开图片序号(数据源为imageurls时)，未绑定此属性，则默认值为0
 * @param {function=} previous 点击上一张图片按钮时回调方法，可与imagedata数据源结合实现上一页功能；如果未设置该回调方法，则无上一页按钮
 * @param {function=} next 点击下一张图片按钮时回调方法，可与imagedata数据源结合实现下一页功能；如果未设置该回调方法，则无下一页按钮
 * @param {function=} close 关闭时的回调方法
 *
 */
    .directive('wiImageview', function () {
        return {
            restrict: 'E',
            templateUrl: function (element, attr) {
                return 'template/imageview/imageviewTemplate.html';
            },
            transclude: true,
            replace: true,
            scope: {
                width: '@',
                height: '@',
                adaptive: '@',
                imageurls: '=',
                imagedata: '=',
                openindex: '=',
                onPrevious: '&previous',
                onNext: '&next',
                onClose: '&close'
            },
            controller: ['$scope', function ($scope) {
            }],
            link: function (scope, element, attrs) {
                scope._width = scope.width;
                scope._height = scope.height;
                scope._imageurls = scope.imageurls == undefined ? [] : scope.imageurls;//图片数组
                scope._openindex = scope.openindex == undefined ? 0 : scope.openindex;//打开图片的序号
                scope._adaptive = scope.adaptive == undefined? false:scope.adaptive;
                scope.isopen = false;//是否显示
                scope.isfull = false;

                scope._show_save = true;//保存按钮是否显示标志
                scope._show_previous = true;//上一页按钮是否显示标志
                scope._show_next = true;//下一页按钮是否显示标志

                var _model_url = scope._imageurls.length==0?false:true;//数据源模式
                var _radian = 0;//旋转变换参数
                var _zoom = 1;//缩放比率
                var img_center_x = scope._width / 2;//中心的x坐标
                var img_center_y = scope._height / 2;//中心点y坐标
                //初始大小
                var init_width = scope._width;
                var init_height = scope._height;
                //初始定位
                var init_top = 0;
                var init_left = 0;

                //初始化画布和图像
                var _canvas = document.createElement('canvas');
                _canvas.width = scope._width;// 只能是像素值
                _canvas.height = scope._height;
                var _canvas_context = _canvas.getContext('2d');

                //图片数据源，url或ImageData
                var _image;

                if (_model_url) {
                    initImage();
                    if (scope._imageurls.length==1) {
                        scope._show_previous = false;
                        scope._show_next = false;
                    }
                } else {
                    scope._show_save = false;
                    if (scope.onPrevious == undefined) {
                        scope._show_previous = false;
                    }
                    if (scope.onNext == undefined) {
                        scope._show_next = false;
                    }
                }

                //监测打开图片的序号
                scope.$watch('openindex', function (newValue, oldValue) {
                    if (newValue != undefined && newValue != -1) {
                        scope._openindex = scope.openindex;
                        scope.open();
                    }
                }, false);

                //监测图片数组数据源
                scope.$watch('imageurls', function (newValue, oldValue) {
                    if (newValue != undefined) {
                        scope._imageurls = scope.imageurls;
                    }
                }, false);

                //监测图片数据源
                scope.$watch('imagedata', function (newValue, oldValue) {
                    if (newValue != undefined && newValue != null && newValue != oldValue) {
                        scope.isopen = true;
                        if (scope.imagedata == undefined || scope.imagedata == null) {
                            scope.img_exclass = 'wi-imageview-pic-error';
                        } else {
                            //ImageData对象直接绘制在Canvas上不支持自定义原点和旋转缩放
                            //所以先将数据对象绘制到临时画布上，在将临时画布绘制到真实画布上
                            _image = document.createElement('canvas');
                            _image.width = scope.imagedata.width;
                            _image.height = scope.imagedata.height;
                            var _image_context = _image.getContext('2d');
                            _image_context.putImageData(scope.imagedata,0,0);
                            scope.open();
                        }
                    }
                }, false);

                function initImage() {
                    _image = new Image();
                    _image.onload = img_onload;
                    _image.onerror = img_onerror;
                }

                //图像添加加载成功、失败监听
                function img_onload(e) {
                    scope.img_exclass = null;
                    scope.$apply('img_exclass');
                    initAdaptiveZoom();
                    redrawImage();
                }
                function img_onerror(e) {
                    //显示错误图片
                    scope.img_exclass = 'wi-imageview-pic-error';
                    scope.$apply('img_exclass');

                    //清除画布内容
                    clearcanvas();

                    //重新初始化图像，IE10、IE9 BUG，加载错误后必须重新初始化
                    _image = new Image();
                    _image.onload = img_onload;
                    _image.onerror = img_onerror;
                }

                //清除画布内容
                function clearcanvas() {
                    _canvas_context.save();
                    _canvas_context.clearRect(0, 0, scope._width, scope._height);//清空内容
                    _canvas_context.restore();
                }

                //初始化图片参数
                function initimg() {
                    _radian = 0;
                    _zoom = 1;
                    img_center_x = scope._width / 2;
                    img_center_y = scope._height / 2;
                }

                //重新加载图片
                function reloadimg() {
                    initimg();
                    scope.img_exclass = "wi-imageview-pic-loading";
                    if (_model_url) {
                        _image.src = scope._imageurls[scope._openindex];
                    } else {
                        clearcanvas();
                    }
                }

                //打开
                scope.open = function () {
                    document.documentElement.style.overflow = "hidden";
                    init_left = scope.left = (document.documentElement.clientWidth - scope._width) / 2 + "px";
                    init_top = scope.top = (document.documentElement.clientHeight - scope._height) / 2 + "px";
                    scope.isopen = true;
                    if (_model_url) {
                        initImage();
                        _image.src = scope._imageurls[scope._openindex];
                        scope.img_exclass = "wi-imageview-pic-loading";
                    } else {
                        initimg();
                        initAdaptiveZoom();
                        redrawImage();
                    }
                };

                //重绘画布
                function redrawImage() {
                    _canvas_context.save();
                    _canvas_context.clearRect(0, 0, scope._width, scope._height);//清空内容
                    _canvas_context.translate(img_center_x, img_center_y);//中心坐标
                    _canvas_context.rotate(_radian);//旋转
                    _canvas_context.scale(_zoom, _zoom);//缩放
                    _canvas_context.drawImage(_image, -_image.width / 2, -_image.height / 2);
                    _canvas_context.restore();
                }

                //图像大小自适应时计算缩放比率
                function initAdaptiveZoom() {
                    if (scope._adaptive && (_image.width>scope._width || _image.height>scope._height)) {
                        var ws = scope._width/_image.width;
                        var hs = scope._height/_image.height;
                        _zoom = Math.floor(Math.min(ws, hs)*10)/10;
                    }
                }

                //获取canvas父容器对象，并将canvas添入其中
                var dom_divs = element.find('div');
                var canvas_div;
                for (var i = 0; i < dom_divs.length; i++) {
                    if (dom_divs[i].className == 'wi-imageview-pic') {
                        canvas_div = dom_divs[i];
                        canvas_div.appendChild(_canvas);
                        break;
                    }
                }

                //关闭
                scope.close = function () {
                    if (_model_url) {
                        scope._openindex = scope.openindex = -1;
                    }
                    scope.isfull = false;
                    scope.isopen = false;
                    scope.img_exclass = null;
                    scope.top = init_top;
                    scope.left = init_left;
                    scope._width = init_width;
                    scope._height = init_height;
                    initimg();
                    clearcanvas();
                    document.documentElement.style.overflow = "auto";

                    if (scope.onClose) {
                        scope.onClose();//调用回调
                    }
                };

                //上一张
                scope.previous = function () {
                    if (_model_url) {
                        if (scope._openindex == 0) {
                            scope._openindex = scope._imageurls.length - 1;
                        } else {
                            scope._openindex -= 1;
                        }
                    }
                    reloadimg();

                    if (scope.onPrevious) {
                        scope.onPrevious();//调用回调
                    }
                };

                //下一张
                scope.next = function () {
                    if (_model_url) {
                        if (scope._openindex == scope._imageurls.length - 1) {
                            scope._openindex = 0;
                        } else {
                            scope._openindex += 1;
                        }
                    }
                    reloadimg();

                    if (scope.onNext) {
                        scope.onNext();//调用回调
                    }
                };

                //顺时针旋转
                scope.toleft = function () {
                    _radian += Math.PI / 2;
                    redrawImage();
                };

                //逆时针旋转
                scope.toright = function () {
                    _radian -= Math.PI / 2;
                    redrawImage();
                };

                //缩小
                scope.zoomin = function () {
                    if (_zoom > 0.2) {
                        _zoom -= .1;
                        redrawImage();
                    }
                };

                //放大
                scope.zoomout = function () {
                    _zoom += .1;
                    redrawImage();
                };

                //重置
                scope.reset = function () {
                    initimg();
                    redrawImage();
                };

                //全屏
                scope.full = function () {
                    scope.top = 0;
                    scope.left = 0;
                    scope._width = _canvas.width = document.documentElement.clientWidth;
                    scope._height = _canvas.height = document.documentElement.clientHeight;
                    img_center_x = scope._width / 2;
                    img_center_y = scope._height / 2;
                    redrawImage();
                    scope.isfull = true;
                };

                //退出全屏
                scope.origin = function() {
                    scope.top = init_top;
                    scope.left = init_left;
                    scope._width = init_width;
                    scope._height = init_height;
                    img_center_x = scope._width / 2;
                    img_center_y = scope._height / 2;

                    //chrome BUG,变为初始化大小时需要新建一个画布
                    canvas_div.removeChild(_canvas);
                    _canvas = document.createElement('canvas');
                    _canvas.width = scope._width;
                    _canvas.height = scope._height;
                    _canvas_context = _canvas.getContext('2d');
                    canvas_div.appendChild(_canvas);

                    scope.reset();
                    scope.isfull = false;
                }

                //滚轮放大缩小
                //由于angularjs没有鼠标滚轮事件，所以采用监听图片容器鼠标移入移出事件来实现
                scope.mouseenter = function () {
                    element.bind('mousewheel', function (e) {
                        if (e.wheelDelta > 0 || (e.originalEvent != undefined && e.originalEvent.wheelDelta > 0)) {
                            _zoom += .1;
                        } else if (_zoom > 0.2) {
                            _zoom -= .1;
                        } else {
                            return;
                        }
                        redrawImage();
                        e.preventDefault();
                    });
                };
                scope.mouseleave = function () {
                    element.unbind('mousewheel');
                };

                //图片拖动
                var start_x;
                var start_y;
                scope.mousedown = function (e) {
                    start_x = e.clientX;
                    start_y = e.clientY;
                    document.onmousemove = movemouse;
                    document.onmouseup = mouseup;
                };
                function mouseup(e) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    return false;
                }
                function movemouse(e) {
                    img_center_x += e.clientX - start_x;
                    img_center_y += e.clientY - start_y;
                    start_x = e.clientX;
                    start_y = e.clientY;
                    redrawImage();
                    return false;
                }
            }
        }
    });

/**
 Created by QianQi on 2014/9/5.
 */
angular.module('ui.wisoft.menu', ['ui.wisoft.position','ui.wisoft.popup'])
    .constant('menuConf', {
        divBorderSize: 1// wi-menu-item 边框
        ,emptyUlHeight: 6// 空 wi-menu-item > ul 高度
        ,toolbarHeight: 29// toolbar 高度
        ,liHeight: 25// 内容 li 高度
        ,liWidth: 160// li 宽度（不含 ul 分隔线 1px）
        ,subOffset: 5// 子菜单水平偏移
        ,scollbarSize: 17// 滚动条留白 --  与 position 服务中滚动条留白尺寸一致
    })

/**
 * @ngdoc directive
 * @name ui.wisoft.menu.directive:wiMenu
 * @restrict E
 *
 * @description
 * wiMenu 是菜单，其中可以包含一个 DOM 元素以触发弹出固定菜单。
 *
 * @param {boolean=} wiRightMenu 右键菜单标识。固定位置的菜单可省略此属性，或设置为"false"。
 * @param {string=} position 固定位置的菜单弹出方向，右键菜单此属性无效。<br />
 * 默认为 "bottom-left"。可选值：<br />
 * "bottom-left"/"bottom-right"/"top-left"/"top-right"/"left-top"/"left-bottom"/"right-top"/"right-bottom"
 * @param {boolean=} adaptable 第一级菜单是否根据 DOM 可视区域调整弹出方向，默认为 true。
 * @param {boolean=} filterable 第一级菜单是否可根据关键字筛选，默认为 false。
 * @param {JSON} dataprovider 菜单数据源，绑定项，只能根据当前 scope 中的变量控制。数据项：<br />
 * id: string  菜单项 id<br />
 * label: string  菜单项显示内容<br />
 * icon: string  可选，菜单项自定义图标<br />
 * filterable: boolean  可选，子菜单是否支持搜索<br />
 * children: []  可选，子菜单数据源<br />
 * enabled: boolean  可选，菜单项是否可用<br />
 * event: string  可选，可直接执行的表达式（复杂事件根据点击后的选中菜单项自定义）
 * @param {object=} selectitem 整个菜单中选中的数据项，绑定项，只能根据当前 scope 中的变量控制 - 将删除此方法。
 * @param {function=} onselect 选中菜单项后执行的自定义方法，参数为选中项。
 *
 */
    .directive('wiMenu', ['$compile','popupService','$document','$window','$timeout','menuConf','$filter','$position', function($compile,popupService,$document,$window,$timeout,menuConf,$filter,$position){
        return{
            restrict: 'E',
            templateUrl: 'pcc/template/menu/wi-menu.html',
            replace: true,
            transclude: true,
            scope: {
                dataprovider: '='// 数据源
                ,selectitem: '='// 选中项
                ,onselect: '&'// 选中项后执行的方法
            },
            require: 'wiMenu',
            controller: ['$scope', '$attrs', function($scope, $attrs){
                var ctrl = this;
                ctrl.select = ($attrs.hasOwnProperty('selectitem')) ?
                    function(item){
                        $scope.selectitem = item;
                    } :
                    angular.noop;
            }],
            compile: function(telem, tattrs, transclude){
                var compiledContents// 编译后的内容
                    ,contents = telem.contents().remove();
                return{
                    post: function(scope, elem, attrs, ctrl){
                        compiledContents || (compiledContents = $compile(contents));// 编译内容
                        compiledContents(scope, function(clone){// 重新添加内容
                            elem.append(clone);
                        });
                        var conf = scope.conf = {
                            adaptable: (attrs.adaptable != 'false')// 一级菜单是否根据文档可见区域调整弹出方向，默认为 true
                            ,filterable: (attrs.filterable == 'true')// 是否可过滤，默认为 false
                        };
                        scope.menutype = scope.$parent.menutype ?
                            'sub' :
                            (attrs.hasOwnProperty('wiRightMenu') && attrs['wiRightMenu'] != "false") ?
                                'right' : 'static';
                        scope.isOpen = false;
                        var data = scope.dataprovider || [];
                        scope.datagroups = data.length ? [data] : [];// 记录分栏信息
                        scope.groupsBackward = [];
                        scope.groupsForward = [];

                        var referElem// 定位参照元素-jqlite
                            ,rePosition = angular.noop// 定位函数
                            ,targetElWidth// 要弹出的菜单的实际宽度
                            ,targetElHeight;// 数据不分栏总高度（若可搜索，包含 toolbar 高度）
                        if(scope.menutype == 'sub'){
                            var className = '';
                            referElem = elem.parent();// 参照元素为父菜单项
                            // 监听 isOpen 属性，关闭时关闭所有子项
                            attrs.$observe( 'isOpen', function () {
                                scope.isOpen = (attrs.isOpen == 'true');
                            });

                            rePosition = function(){
                                elem.removeClass(className);// 移除定位 class
                                var viewElPos// 触发元素相对文档可见区域位置（含尺寸）
                                    ,pos0 = 'right', pos1 = 'top'// 子菜单默认弹出方向为 right-top
                                    ,viewW = $window.innerWidth - menuConf.scollbarSize
                                    ,viewH = $window.innerHeight - menuConf.scollbarSize;// 文档可见区域尺寸，为滚动条留白 menuConf.scollbarSize
                                targetElWidth = menuConf.liWidth + menuConf.divBorderSize * 2;// 初始化为不分栏的宽度
                                targetElHeight = (menuConf.emptyUlHeight + 2 * menuConf.divBorderSize) + data.length * menuConf.liHeight;// 初始化为数据不分栏总高度（若可搜索，包含 toolbar 高度）
                                (conf.filterable) && (targetElHeight += menuConf.toolbarHeight);// 是否显示过滤
                                viewElPos = referElem[0].getBoundingClientRect();

                                // 若允许自适应，则根据需要分栏，确定实际尺寸
                                (conf.adaptable != false) && manageSubs(Math.max(viewElPos.left, viewW - viewElPos.right) + menuConf.subOffset, viewH);
                                var positionObj = $position.adaptElements(referElem, targetElWidth, targetElHeight, pos0 + '-' + pos1, conf.adaptable, false);

                                className = 'wi-menu-' + positionObj[1];
                                elem.addClass(className)
                                    .css(angular.extend(positionObj[0],{
                                        'width': targetElWidth + 'px'
                                        ,'height': targetElHeight + 'px'
                                    }));
                            };
                            scope.ctrl = scope.$parent.ctrl;
                        }
                        else{
                            if(scope.menutype == 'static'){
                                conf.position = attrs.position ? attrs.position : 'bottom-left'; //一级菜单默认弹出方向
                                angular.forEach(transclude(scope), function(el){// 参照元素为切换显示/隐藏的 jqLite 元素
                                    (el.nodeType == 1) && (referElem = angular.element(el));
                                });
                                if(!referElem){
                                    referElem = angular.element('<input type="button" class="wi-btn" value="弹出菜单" />');
                                }
                                referElem.on('click', function(event){
                                    if(scope.isOpen == true){
                                        scope.isOpen = false;
                                        popupService.close(scope);
                                    }else{
                                        scope.isOpen = true;
                                        popupService.open(scope, true);
                                        elem.css('zIndex',$position.getZIndex());// 获取 z-index，使 menu 在最上层
                                    }
                                    scope.$digest();
                                    event.stopPropagation();
                                });
                                elem.parent().prepend(referElem);
                                attrs.$observe( 'position', function () {// 监听菜单位置
                                    conf.position = attrs.position;
                                });

                                rePosition = function(){
                                    var viewElPos// 触发元素相对文档可见区域位置（含尺寸）
                                        ,pos0
                                        ,elemStyle// 菜单样式
                                        ,viewW = $window.innerWidth - menuConf.scollbarSize
                                        ,viewH = $window.innerHeight - menuConf.scollbarSize;// 文档可见区域尺寸，为滚动条留白 menuConf.scollbarSize
                                    targetElWidth = menuConf.liWidth + menuConf.divBorderSize * 2;// 初始化为不分栏的宽度
                                    targetElHeight = (menuConf.emptyUlHeight + 2 * menuConf.divBorderSize) + data.length * menuConf.liHeight;// 初始化为数据不分栏总高度（若可搜索，包含 toolbar 高度）
                                    (conf.filterable) && (targetElHeight += menuConf.toolbarHeight);// 是否显示过滤
                                    viewElPos = referElem[0].getBoundingClientRect();

                                    var positionStrParts = angular.isString(conf.position) ? conf.position.split('-') : [];
                                    pos0 = positionStrParts[0] || 'bottom';
                                    // 若允许自适应，则根据需要进行分栏并调整弹出方向
                                    if(conf.adaptable != false) {
                                        // 根据一级方向分栏，确定实际尺寸
                                        if(['left', 'right'].indexOf(pos0) >= 0){
                                            manageSubs(Math.max(viewElPos.left, viewW - viewElPos.right), viewH);
                                        }else{
                                            manageSubs(viewW, Math.max(viewElPos.top, viewH - viewElPos.bottom));
                                        }
                                    }
                                    // 调用 $position 服务确定弹出方向和位置
                                    elemStyle = $position.adaptElements(referElem, targetElWidth, targetElHeight, conf.position, conf.adaptable, true)[0];
                                    elem.css(angular.extend(elemStyle,{
                                        'width': targetElWidth + 'px'
                                        ,'height': targetElHeight + 'px'
                                    }));
                                }
                            }
                            else if(scope.menutype == 'right'){
                                conf.position = {};// 弹出方向
                                referElem = elem.parent();// 参照元素为监听右键的父元素
                                referElem.on('contextmenu',function(e){
                                    popupService.closeAll(true);// 关闭一级菜单
                                    var elemPos = referElem[0].getBoundingClientRect(), x, y;
                                    x = e.clientX;
                                    y = e.clientY;
                                    if( x >= elemPos.left && x <= elemPos.right
                                        && y >= elemPos.top && y <= elemPos.bottom){
                                        e.preventDefault();// 禁用浏览器右键菜单
                                        // 相对于整个文档的位置
                                        conf.position.x = e.clientX;
                                        conf.position.y = e.clientY;

                                        (function(){// 此方法体针对 frame 及非 static 定位的 body 计算弹出菜单的位置
                                            var _topWindow = $window.top // 顶层 window
                                                ,_window = $window // 当前判断到的 window
                                                ,_top = 0, _left = 0
                                                ,_inFrame = false; // menu 是否从 frame 中弹出
                                            var _windowBCR;
                                            var _scrollY = 0, _scrollX = 0;
                                            while(_window != _topWindow){// 由 _window 向外查找 frame
                                                if(!_inFrame){ // element 在当前 frame 中
                                                    _scrollX -= (_window.pageXOffset || _window.document.documentElement.scrollLeft);// 考虑框架内滚动
                                                    _scrollY -= (_window.pageYOffset || _window.document.documentElement.scrollTop);
                                                    _inFrame = true;
                                                }
                                                if(_inFrame){ // element 已经确定在内层 frame 中
                                                    _windowBCR = _window.frameElement.getBoundingClientRect();
                                                    _top += _windowBCR.top;
                                                    _left += _windowBCR.left;
                                                }
                                                _window = _window.parent;
                                            }
                                            var _bodyBCR = _topWindow.document.body.getBoundingClientRect();
                                            if(_inFrame){// 在 frame 中
                                                // body 非 static，因弹出项加在 body，将根据 body 定位，产生偏移)
                                                if($position.getStyle(_topWindow.document.body,'position')!='static') {
                                                    _scrollX -= _bodyBCR.left;
                                                    _scrollY -= _bodyBCR.top;
                                                }else{
                                                    _scrollX += (_topWindow.pageXOffset || _topWindow.document.documentElement.scrollLeft);
                                                    _scrollY += (_topWindow.pageYOffset || _topWindow.document.documentElement.scrollTop);
                                                }
                                            }else if($position.getStyle(_topWindow.document.body,'position')!='static') {
                                                _scrollX -= (_topWindow.pageXOffset || _topWindow.document.documentElement.scrollLeft) + _bodyBCR.left;
                                                _scrollY -= (_topWindow.pageYOffset || _topWindow.document.documentElement.scrollTop) + _bodyBCR.top;
                                            }
                                            conf.position.x += _left + _scrollX;
                                            conf.position.y += _top + _scrollY;
                                        })();

                                        scope.$digest();
                                    }
                                });
                                scope.$watch( 'conf.position', function (val) {// 监听菜单位置
                                    if(val && val['x'] && !scope.isOpen){
                                        scope.isOpen = true;
                                        popupService.open(scope, false);
                                        elem.css('zIndex',$position.getZIndex());// 获取 z-index，使 menu 在最上层
                                    }
                                }, true);

                                rePosition = function(){
                                    var viewElPos// 触发元素相对文档可见区域位置（含尺寸）
                                        ,domElPos// 触发元素相对文档位置
                                        ,elemStyle = {}// 菜单样式
                                        ,viewW = $window.innerWidth - menuConf.scollbarSize
                                        ,viewH = $window.innerHeight - menuConf.scollbarSize;// 文档可见区域尺寸，为滚动条留白 menuConf.scollbarSize
                                    targetElWidth = menuConf.liWidth + menuConf.divBorderSize * 2;// 初始化为不分栏的宽度
                                    targetElHeight = (menuConf.emptyUlHeight + 2 * menuConf.divBorderSize) + data.length * menuConf.liHeight;// 初始化为数据不分栏总高度（若可搜索，包含 toolbar 高度）
                                    (conf.filterable) && (targetElHeight += menuConf.toolbarHeight);// 是否显示过滤
                                    viewElPos = referElem[0].getBoundingClientRect();
                                    domElPos = $position.offset(referElem);

                                    elemStyle.left = conf.position.x + domElPos.left - viewElPos.left + 'px';
                                    elemStyle.top = conf.position.y + domElPos.top - viewElPos.top + 'px';
                                    // 若允许自适应，则根据需要进行分栏并调整弹出位置
                                    if(conf.adaptable != false) {
                                        manageSubs(viewW, viewH);
                                        if(viewW - conf.position.x < targetElWidth)
                                            elemStyle.left = viewW - targetElWidth + domElPos.left - viewElPos.left + 'px';
                                        if(viewH - conf.position.y < targetElHeight)
                                            elemStyle.top = viewH - targetElHeight + domElPos.top - viewElPos.top + 'px';
                                    }

                                    elem.css({
                                        'top': elemStyle.top ? elemStyle.top : ''
                                        ,'bottom': elemStyle.bottom ? elemStyle.bottom : ''
                                        ,'left': elemStyle.left ? elemStyle.left : ''
                                        ,'right': elemStyle.right ? elemStyle.right : ''
                                        ,'width': targetElWidth + 'px'
                                        ,'height': targetElHeight + 'px'
                                    });
                                }
                            }

                            ctrl.onSelect = scope.onselect()||angular.noop;// 选中项后执行的方法
                            scope.ctrl = ctrl;
//                            $document.find( 'body' ).append(elem);// 加在文档末尾
                            angular.element($window.top.document.body).append(elem);// 将弹出的菜单附加到 <body> - 考虑 iframe 情况，弹出层附加在最外层 window 中

                            scope.$on('$destroy', function() {
                                elem.remove();// 移除菜单
                                elem = null;// 销毁
                            })
                        }

                        // 允许检索关键字，监听
                        if(conf.filterable){
                            scope.filterval = '';
                            $filter('showFilter')(scope.dataprovider, scope.filterval);
                            scope.$watch('filterval', function (newValue, oldValue) {
                                if(newValue === oldValue) return;
                                $filter('showFilter')(scope.dataprovider, newValue);
                            });
                        }
                        scope.$watch('isOpen', function(val){
                            if(val == true) rePosition();
                            else{// 关闭子项
                                angular.forEach(scope.dataprovider,function(currentdata){
                                    currentdata.childopen = false;
                                });
                            }
                        });
                        // 监听父作用域传来的 dataprovider
                        scope.$watch( 'dataprovider', function (val) {
                            data = val || [];
                            scope.datagroups = [data];
                            scope.groupsBackward = [];
                            scope.groupsForward = [];
                            scope.isOpen && rePosition();// 若已打开，需要重新定位
                        }, false);
                        // 执行菜单事件（阻止事件冒泡，只执行当前点击项）
                        scope.clickLi = function(event, item){
                            if(item.enabled != false){
                                if(item.event){// 执行语句
                                    eval(item.event);
                                    popupService.closeAll();
                                    scope.ctrl.onSelect(item);// 执行自定义操作
                                    return;
                                }else if(!item.children){
                                    scope.ctrl.select(item);
                                    popupService.closeAll();
                                    scope.ctrl.onSelect(item);// 执行自定义操作
                                    return;
                                }
                            }
                            event.stopPropagation();// 无操作执行，不触发 document 隐藏菜单事件
                        };
                        // 显示前一栏
                        scope.backwardClick = function(event){
                            if(scope.groupsBackward.length > 0){
                                scope.datagroups.unshift(scope.groupsBackward.pop());
                                scope.groupsForward.unshift(scope.datagroups.pop());
                            }
                            event.stopPropagation();
                        };
                        // 显示后一栏
                        scope.forwardClick = function(event){
                            if(scope.groupsForward.length > 0){
                                scope.datagroups.push(scope.groupsForward.shift());
                                scope.groupsBackward.push(scope.datagroups.shift());
                            }
                            event.stopPropagation();
                        };
                        var hoverItem;
                        //悬停菜单项，关闭其他已打开的菜单项
                        scope.mouseenter = function(item){
                            if(item.enabled == false) return;
                            hoverItem = item;
                            $timeout(function(){
                                if(hoverItem == item){
                                    if(!item.childopen){
                                        angular.forEach(scope.dataprovider, function(currentdata){
                                            currentdata.childopen = false;
                                        });
                                        item.childopen = !item.childopen;
                                    }
                                }
                            },500);// 延迟打开子菜单
                        };
                        scope.mouseleave = function(item){
                            if(hoverItem == item){
                                hoverItem = undefined;
//                                if(item.childopen){// 关闭当前项子菜单
//                                    item.childopen = false;
//                                }
                            }
                        };

                        // 分栏函数
                        function manageSubs(maxW, maxH){
                            var rows = data.length// 每一列的 li 数量
                                ,cols = 1// 列数
                                ,trueCols = Math.floor((maxW - menuConf.divBorderSize * 2 + 1) / (menuConf.liWidth + 1));// 最多显示几列
                            scope.datagroups.length = 0;
                            scope.groupsBackward.length = 0;
                            scope.groupsForward.length = 0;
                            trueCols <= 0 && (trueCols = 1);// 最少需显示一列
                            while(targetElHeight > maxH){
                                cols ++;
                                rows = Math.ceil(data.length / cols);
                                targetElHeight = (menuConf.emptyUlHeight + 2 * menuConf.divBorderSize) + rows * menuConf.liHeight;
                                if(!conf.filterable && cols <= trueCols) continue;// 不需过滤，且不需翻页
                                targetElHeight += menuConf.toolbarHeight;
                            }
                            // 分栏计算完成，开始处理 datagroups
                            targetElWidth = Math.min(cols, trueCols) * (menuConf.liWidth + 1) + menuConf.divBorderSize * 2 - 1;// 实际宽度
                            for(var i=0; i<cols; i++){
                                var begin = i * rows, end;
                                if(i == cols)
                                    end = data.length;
                                else
                                    end = begin + rows;
                                if(i < trueCols)
                                    scope.datagroups.push(data.slice(begin, end));
                                else
                                    scope.groupsForward.push(data.slice(begin, end));
                            }
                        }
                    }
                }
            }
        }
    }])
    .filter('showFilter', function(){// 过滤所有节点
        function search(subData, keyword){
            var resultNum = 0;// 显示的 item 总数
            if(keyword && keyword != ''){
                angular.forEach(subData, function(item){
                    if(item.enabled != false){// 不检查不可用的项
                        item.highlight = (item.label.indexOf(keyword) >= 0);
//                        if(item.children && search(item.children, keyword) > 0){// 查询 children
//                            item.highlight = true;
//                        }
                        item.highlight && (resultNum ++);
                    }
                });
            }else{// 未设置过滤条件
                angular.forEach(subData, function(item){
                    item.highlight = false;
                    resultNum ++;
                    item.children && search(item.children);
                })
            }
            return resultNum;
        }
        return function(data, keyword){
            search(data, keyword);
            return data;
        }
    });
'use strict';
angular.module('ui.wisoft.messagetip', [])
/**
 * @ngdoc service
 * @name ui.wisoft.messagetip.wiMessageTip
 *
 * @description
 * 消息提示窗口
 *
 * 主要功能：<br>
 * （1）支持自定义弹出位置<br>
 * （2）支持内容自定义HTML<br>
 */
    .service('wiMessageTip', ['$document','$timeout','$injector',function ($document,$timeout,$injector) {
        var tipParent=angular.element(window.parent.document.body);
        var tips = [];//窗口列表
        var tip = null;
        var tip_index = 1;//用于生成窗口id
        var _opts;

        /**
         * @ngdoc method
         * @name ui.wisoft.messagetip.wiMessageTip#open
         * @methodOf ui.wisoft.messagetip.wiMessageTip
         * @description 打开消息提示窗口
         *
         * @param {Object} options
         * {<br>
         *  width : Number类型，[可选]窗口宽度，默认自适应<br>
         *  height : Number类型，[可选]窗口高度，默认自适应<br>
         *  title : String类型，标题<br>
         *  position  : String类型，消息框位置，bottom或right<br>
         *  content  : String类型，消息内容，可以使普通字符串或HTML<br>
         *  isshake  : Boolean类型，[可选]弹出窗口后是否抖动，不支持IE9<br>
         *  delay  : Number类型，[可选]弹出窗口后是否延迟自动关闭，单位秒<br>
         *  click : Function类型，[可选]窗体点击回调，可以根据回调方法参数获取具体点击对象<br>
         *  }
         *
         * @return {String} id 弹出框的id
         *
         */
        this.open = function(opts) {
            //初始化参数
            var dest_opts = {
                width: 'auto',
                height: 'auto',
                title: '消息',
                position: 'bottom',
                isshake: false,
                delay: 0,
                click: null
            }
            angular.extend(dest_opts, opts);
            _opts = dest_opts;

            //创建并初始化消息框
            tip = angular.element(generateHTML());
            tip.bind('click', clickHandler);
            tip.data('$id', 'wiMessageTip_'+tip_index++);
            tipParent.append(tip);

            //滑入特效
            tip.css('bottom', '-500px');
            tip.css('right', '-500px');
            if (opts.position == 'bottom') {
                tip.css('right', '5px');
                tip.css('bottom', tip[0].clientHeight+'px');
                tip.css('transition', 'bottom 1s');
                tip.css('bottom', '5px');
            } else if (opts.position == 'right') {
                tip.css('bottom', '5px');
                tip.css('right', tip[0].clientWidth+'px');
                tip.css('transition', 'right 1s');
                tip.css('right', '5px');
            }

            //抖动特效
            if (_opts.isshake) {
                $timeout(function(){
                    tip.css('animation', 'shake-hard 1s');
                    tip.css('-webkit-animation', 'shake-hard 1s');
                }, 1000);
            }

            tips.push(tip);
            return tip.data('$id');
        }

        /**
         * @ngdoc method
         * @name ui.wisoft.messagetip.wiMessageTip#closeOne
         * @methodOf ui.wisoft.messagetip.wiMessageTip
         * @description 关闭消息提示窗口
         *
         * @param {String} id 窗口id
         *
         */
        this.closeOne = function(tipid) {
            closeTip(tipid);
        }

        function clickHandler(e) {
            var isCloseBtn = angular.element(e.target).hasClass('wi-messagetip-close');
            if (isCloseBtn) {
                closeTip(tip.data('$id'));
            } else if (_opts.click != null) {
                _opts.click.$inject = ['e'];
                $injector.invoke(_opts.click,{},{'e':e});
            }
        }

        function closeTip(tipid) {
            tip.unbind('click', clickHandler);
            if (_opts.position == 'bottom') {
                tip.css('bottom', -tip[0].clientHeight + 'px');
            } else if (_opts.position == 'right') {
                tip.css('right', -tip[0].clientWidth + 'px');
            }
            $timeout(function () {
                for (var i=0; i<tips.length; i++) {
                    if (tipid == tips[i].data('$id')) {
                        tips.splice(i, 1);
                        break;
                    }
                }
                tip.remove();
                tip = null;
                if (tips.length > 0) {
                    tip = tips[tips.length-1];
                }
            }, 1000);
        }

        function generateHTML() {
            var w = angular.isNumber(_opts.width)?_opts.width+'px':_opts.width;
            var h = angular.isNumber(_opts.height)?_opts.height+'px':_opts.height;
            var html = [
                '<div class="wi-messagetip-box" style="width:'+w+';height:'+h+';">',
                    '<div class="wi-messagetip-head">'+_opts.title+'<span class="wi-messagetip-close icon-remove"></span></div>',
                    '<div class="wi-messagetip-content">'+_opts.content+'</div>',
                '</div>'
            ];

            if (_opts.delay > 0) {
                $timeout(function(){
                    closeTip();
                }, _opts.delay*1000);
            }

            return html.join('');
        }
    }]
);

'use strict';
angular.module('ui.wisoft.my97datepicker',[])

    /**
     * @ngdoc directive
     * @name ui.wisoft.my97datepicker.directive:wiDatepicker
     * @restrict E
     *
     * @description
     * 日期选择
     *
     * @param {boolean=} isshowweek 周显示 false|true.
     * @param {boolean=} readonly 只读 false|true.
     * @param {boolean=} highlineweekday 高亮周末 true|false.
     * @param {boolean=} isshowclear 清空按钮 true|false.
     * @param {boolean=} isshowtoday 今天按钮 true|false.
     * @param {string=} firstdayofweek 星期的第一天 0-6(0:星期日 1:星期一).
     * @param {string=} startdate 默认的起始日期 '1980-05-01';动态参数(如:%y,%M分别表示当前年和月)'%y-%M-01'.
     * @param {boolean=} alwaysusestartdate 无论日期框为何值,始终使用 1980-05-01 做为起始日期.
     * @param {string=} datefmt 自定义格式 'yyyy年MM月dd日 HH时mm分ss秒'.
     * @param {string=} vel 指定一个控件或控件的ID,必须具有value属性(如input),用于存储真实值.2014年9月17日 真实值为2014-09-17.
     * @param {string=} skin 皮肤 'default'|''whyGreen'.
     * @param {string=} mindate 限制日期范围，最小日期 '2006-09-10'(配合dateFmt，可设置年月日时分秒).
     * @param {string=} maxdate 限制日期范围，最大日期 '2008-12-20'.
     * @param {array=} disableddays 禁用周日至周六所对应的日期 [0,6],0至6 分别代表 周日至周六.
     * @param {string=} onpicked 选中事件.
     * @param {string=} oncleared 清空事件.
     * @param {boolean=} qsenabled 是否启用快速选择功能, 注意:如果日期格式里不包含 d(天) 这个元素时,快速选择将一直显示,不受此属性控制.
     * @param {string=} quicksel 快速选择数据,可以传入5个快速选择日期,日期格式同min/maxDate.
     *
     */
    .directive('wiDatepicker', function() {
        return {
            restrict: 'E',
            require: 'ngModel',
            template: '<input class="wi-datepicker"/>',
            replace: true,
            scope: {
                isshowweek: '@'// 周显示 false|true
                ,readonly: '@'// 只读 false|true
                ,highlineweekday: '@'// 高亮周末 true|false
                ,isshowclear: '@'// 清空按钮 true|false
                ,isshowtoday: '@'// 今天按钮 true|false
                ,firstdayofweek: '@'// 星期的第一天 0-6(0:星期日 1:星期一)
                ,startdate: '@'// 默认的起始日期 '1980-05-01';动态参数(如:%y,%M分别表示当前年和月)'%y-%M-01'
                ,alwaysusestartdate: '@'// 无论日期框为何值,始终使用 1980-05-01 做为起始日期
                ,datefmt: '@'// 自定义格式 'yyyy年MM月dd日 HH时mm分ss秒'
                ,vel: '@'// vel 指定一个控件或控件的ID,必须具有value属性(如input),用于存储真实值
                         // 2014年9月17日 真实值为2014-09-17
                ,skin:'@'// 皮肤 'default'|''whyGreen'
                ,mindate: '@'// 限制日期范围，最小日期 '2006-09-10'(配合dateFmt，可设置年月日时分秒)
                ,maxdate: '@'// 限制日期范围，最大日期 '2008-12-20'
                             /* 只能选择今天以前的日期(包括今天)：
                                    maxDate:'%y-%M-%d'
                                只能选择今天以后的日期(不包括今天)：
                                    minDate:'%y-%M-{%d+1}'
                                只能选择本月：
                                    minDate:'%y-%M-01',maxDate:'%y-%M-%ld'
                                只能选择今天7:00:00至明天21:00:00：
                                    dateFmt:'yyyy-M-d H:mm:ss',minDate:'%y-%M-%d 7:00:00',maxDate:'%y-%M-{%d+1} 21:00:00'
                                只能选择 20小时前 至 30小时后：
                                    dateFmt:'yyyy-MM-dd HH:mm',minDate:'%y-%M-%d {%H-20}:%m:%s',maxDate:'%y-%M-%d {%H+30}:%m:%s'
                                前面的日期不能大于后面的日期且两个日期都不能大于 2020-10-01：
                                  <input id="d4311" class="wi-datepicker" type="text" onFocus="WdatePicker({maxDate:'#F{$dp.$D(\'d4312\')||\'2020-10-01\'}'})"/>
                                  <input id="d4312" class="wi-datepicker" type="text" onFocus="WdatePicker({minDate:'#F{$dp.$D(\'d4311\')}',maxDate:'2020-10-01'})"/>
                              */
                ,disableddays: '@'// 禁用周日至周六所对应的日期 [0,6],0至6 分别代表 周日至周六
                ,onpicked: '&'// 选中事件
                ,oncleared: '&'// 清空事件
                ,qsenabled: '@'// 是否启用快速选择功能, 注意:如果日期格式里不包含 d(天) 这个元素时,快速选择将一直显示,不受此属性控制
                ,quicksel: '@'// 快速选择数据,可以传入5个快速选择日期,日期格式同min/maxDate
            },
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return;

                // 配置
                var options = {};
                options.el                  = element[0];
                options.onpicked            = onPickedHandler;
                options.oncleared           = onClearedHandler;
                options.isShowWeek          = scope.isshowweek=='true' ? true : false;
                options.readOnly            = scope.readonly=='true' ? true : false;
                options.highLineWeekDay     = scope.highlineweekday=='true' ? true : false;
                options.isShowClear         = scope.isshowclear=='false' ? false : true;
                options.isShowToday         = scope.isshowtoday=='false' ? false : true;
                options.firstDayOfWeek      = scope.firstdayofweek ? scope.firstdayofweek : 0;
                options.startDate           = scope.startdate;
                options.alwaysUseStartDate  = scope.alwaysusestartdate=='true' ? true : false;
                options.dateFmt             = scope.datefmt;
                options.vel                 = scope.vel;
                options.skin                = scope.skin;
                options.minDate             = scope.mindate;
                options.maxDate             = scope.maxdate;
                options.disabledDays        = scope.disableddays;
                options.qsEnabled           = scope.qsenabled=='false' ? false : true;
                options.quickSel            = (scope.quicksel+'').split(",");

                // 事件
                element[0].onfocus = showPicker;
                element[0].onclick = showPicker;

                // 显示
                function showPicker() {
                    WdatePicker(options);
                }

                // 选中事件
                function onPickedHandler() {
                    setViewValue();
                    scope.onpicked() && scope.onpicked()(element[0].value);
                }

                // 清空事件
                function onClearedHandler() {
                    setViewValue();
                    scope.oncleared() && scope.oncleared()(element[0].value);
                }

                // 更新view
                function setViewValue() {
                    scope.$apply(ngModel.$setViewValue(element[0].value));
                }

            }
        };
    });
/**
 * Created by QianQi on 2014/11/10.
 */

angular.module('ui.wisoft.panel', ['ui.wisoft.collapse'])
    .constant('panelConf',{
        'headHeight': 30//定义了面板高度时，head 部分的指定高度
    })
/**
 * @ngdoc directive
 * @name ui.wisoft.panel.directive:wiPanel
 * @restrict E
 *
 * @description
 * wiPanel 是基本的布局组件，可以自定义标题和按钮，并内置了一些工具按钮。
 *
 * @param {object=} wiid 若定义了此属性，可供调用接口。<br />
 *   .options() 获取当前设置：{ heading，isOpen，isCollapse }，<br />
 *   .element() 获取当前 panel 对应的 jqlite 元素，<br />
 *   .toggle() 切换当前面板的折叠状态，并返回切换后的状态，true 为折叠。
 * @param {number|length=} width 面板宽度，默认为 100%。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {number|length=} height 面板高度，默认为自适应。若定义了此属性，head 部分高度将自动设置为 30px。
 *   说明同 width。
 * @param {string=} heading 头部显示文字, heading是单向绑定的，可以设置为一个确定的字符串，或者设置为scope中的一个变量。
 * @param {string=} headicon 头部左侧显示图标的 url。
 * @param {string|array=} headtools 头部右侧的工具，系统工具：'close'（关闭），collapse'（折叠）。<br />
 *   string：用“,”连接的系统工具字符串，定义时需加引号，如：headTools="'close,collapse'"或"'close'"。<br />
 *   array：数组的每一个元素代表一个工具，系统工具为 string，自定义工具为 Object。如：['collapse','close',{name:'save',cls:'icon-save',opt:saveFun}]。<br />
 *   其中自定义工具对象的属性说明：name-操作名称,cls-class名称,opt-click的操作（值为函数引用，参数：事件源 event）。
 * @param {boolean=} center true 时居中显示，默认为 false
 * @param {boolean=} isOpen true 时面板显示，双向绑定，应设置为scope中的一个变量。
 * @param {boolean=} collapsible true 时可以通过点击头部进行折叠展开操作，默认为 false。
 * @param {boolean=} collapsed true 时折叠，默认为 false。
 * @param {function=} onopened 打开面板后的回调方法，参数：无。
 * @param {function=} onclosed 关闭面板后的回调方法，参数：无。
 * @param {function=} oncollapse 折叠面板时的回调方法，参数：无。
 * @param {function=} onexpand 展开面板时的回调方法，参数：无。
 */
    .directive('wiPanel', ['panelConf',function (panelConf) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            templateUrl: 'pcc/template/panel/wi-panel.html',
            scope: {
                wiid: '='
                ,heading: '@'
                ,isOpen: '=?'
                ,onopened: '&'
                ,onclosed: '&'
                ,oncollapse: '&'
                ,onexpand: '&'
            },
            controller: function () {
                this.setHeading = function (element) {
                    this.headingEl = element;
                };
            },
            link: function (scope, element, attrs) {
                var onOpened = scope.onopened()
                    ,onClosed = scope.onclosed()
                    ,onCollapse = scope.oncollapse()
                    ,onExpand = scope.onexpand();
                var parentScope = scope.$parent;
                /* width、height */
                (function(){
                    // 尺寸类型的属性处理方法（其他组件中也存在类似方法，依赖于 scope），可接受的值：数字、数字开头、scope 对象（数字、数字开头）
                    var getSizeFromAttr = function(attr){
                        if(!attr) return;
                        var size;
                        if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                            size = attr;
                        }else{// 非数字开始，可能是 scope 对象
                            size = parentScope.$eval(attr);
                        }
                        Number(size) && (size += 'px');// 是数字则加上单位 px
                        return size;
                    };
                    scope.width = getSizeFromAttr(attrs['width']) || '';// panel 宽度
                    var height = getSizeFromAttr(attrs['height']);
                    if(height){
                        element.addClass('wi-panel-h').css('height', height);
                        if(height.indexOf('px')>0){
                            angular.element(element.children()[1]).css('height',(parseInt(height)-panelConf.headHeight)+'px');
                        }else{ // collapse 中只能获取 style 中定义的高度
                            angular.element(element.children()[1]).css('height','calc('+height+' - '+panelConf.headHeight+'px)');
                        }
                    }
                })();

                /* 标题栏 */
                (function(){
                    scope.headicon = attrs.headIcon;// 图标
                    if(attrs.hasOwnProperty('center') && attrs['center']!='false'){// 内容居中
                        angular.element(angular.element(element.children()[0]).children()[0]).css('text-align','center');
                    }
                    // 是否能通过点击头部折叠
                    scope.collbyHead = attrs.hasOwnProperty('collapsible') ? function(){
                        toggleColl();
                    } : angular.noop;
                    /* 工具栏 */
                    scope.headTools = {};
                    if(attrs.headTools){
                        try{
                            var tools=parentScope.$eval(attrs.headTools);
                            if(angular.isString(tools)){// 字符串，逗号分隔，转换为 array
                                tools = tools.replace(/\s*/g,'').split(',');
                            }
                            if(angular.isArray(tools)){
                                /* 系统工具 */
                                var findSysTool=function(name){
                                    var index=tools.indexOf(name);
                                    if(index>=0){
                                        tools.splice(index,1);
                                        scope.headTools[name]=true;
                                    }
                                };
                                findSysTool('collapse');// 折叠
                                findSysTool('close');// 关闭
                                /* 自定义工具 */
                                if(tools.length>0) scope.headTools.custom = tools;
                            }
                            if(Object.getOwnPropertyNames(scope.headTools).length>0){// 存在要显示的工具
                                scope.headTools.visible = true;
                            }
                        }catch(e){
                            console.warn('wi-panel 的 headTools 属性定义不合法!');
                        }
                    }
                    scope.collbyTool = function(e){
                        toggleColl();
                        e.stopPropagation();
                    };
                })();

                /* 折叠状态 */
                scope.collapsed = attrs.hasOwnProperty('collapsed') && attrs['collapsed']!='false';// 默认展开
                if(scope.collapsed){// onCollapse
                    onCollapse && onCollapse();
                }else{// onExpand
                    onExpand && onExpand();
                }
                var toggleColl = function () {
                    scope.collapsed = !scope.collapsed;
                    if(scope.collapsed){// onCollapse
                        onCollapse && onCollapse();
                    }else{// onExpand
                        onExpand && onExpand();
                    }
                };

                /* 打开状态 */
                scope.isOpen = (scope.isOpen != false);
                scope.closebyTool = function(e){
                    scope.isOpen = false;
                    e.stopPropagation();
                };
                // 若定义了打开、关闭回调函数，监听 is-open
                if(onOpened || onClosed){// 可能由外部修改 is-open
                    scope.$watch('isOpen',function(val){
                        if(val){// onOpened
                            onOpened && onOpened();
                        }else{// onClose
                            onClosed && onClosed();
                        }
                    })
                }

                /* 开放接口，需定义双向绑定的 wiid */
                if(attrs.wiid){
                    if(angular.isObject(scope.wiid)){
                        scope.wiid.options = function(){
                            return {
                                heading: scope.heading
                                ,isOpen: scope.isOpen
                                ,isCollapse: scope.collapsed
                            };
                        };
                        scope.wiid.element = function(){
                            return element;
                        };
                        scope.wiid.toggle = function(){
                            toggleColl();
                            return scope.collapsed;
                        };
                    }
                }
            }
        };
    }])

/**
 * @ngdoc directive
 * @name ui.wisoft.panel.directive:wiPanelHeading
 * @restrict E
 *
 * @description
 * wiPanelHeading 只能作为 wiwiPanel 的子指令来使用，它可以使用一个 html 片段来设定 panel 的头部显示。如果你希望头部显示的不仅仅是简单的文字，
 * 比如还有图片，按钮等更复杂的显示，就需要使用到这个子指令。
 *
 */
    .directive('wiPanelHeading', function () {
        return {
            restrict: 'E',
            transclude: true,
            template: '',
            replace: true,
            require: '^wiPanel',
            link: function (scope, element, attr, panelGroupCtrl, transclude) {
                panelGroupCtrl.setHeading(transclude(scope, function () {
                }));
            }
        };
    })

    .directive('wiPanelTransclude', function () {
        return {
            require: '^wiPanel',
            link: function (scope, element, attrs, controller) {
                scope.$watch(function () {
                    return controller[attrs.wiPanelTransclude];
                }, function (heading) {
                    if (heading) {
                        element.html('');
                        //设置 Panel 的 head 的时候，可以直接设置 html，当需要设置图片和文字样式的时候会比较有用
                        element.append(heading);
                    }
                });
            }
        };
    });

angular.module('ui.wisoft.popup', ['ui.wisoft.position'])
    .constant('popupConfig', {
        openClass: 'wi-popup-open'
    })
    .service('popupService', ['$document','$window', function ($document,$window) {
        var openScope // 记录当前打开的 scope
            ,_document = angular.element($window.top.document);
        // 打开，若未打开其它 scope，则绑定触发关闭的事件，否则直接关闭其他 scope
        this.open = function(scope, digest){
            if (!openScope) {// 没有其它已打开的 scope
//                $document.bind('click', closeMenu);
//                $document.bind('keydown', escapeKeyBind);
                _document.bind('click', closeMenu);
                _document.bind('keydown', escapeKeyBind);
            }
            if (openScope && openScope !== scope) {
                openScope.isOpen = false;
                digest && openScope.$digest();
            }
            openScope = scope;
        };
        // 关闭，解绑触发关闭的事件
        this.close = function(scope){
            if (openScope === scope) {
                openScope = null;
//                $document.unbind('click', closeMenu);
//                $document.unbind('keydown', escapeKeyBind);
                _document.unbind('click', closeMenu);
                _document.unbind('keydown', escapeKeyBind);
            }
        };
        this.closeAll = function(digest){
            closeMenu(digest);
        };
        // 关闭事件 - 仅当 digest 为 false 时脏检查（menu 中执行菜单项操作时关闭菜单）
        var closeMenu = function (digest) {
            if(openScope){
                digest ?
                    openScope.$apply(function(){
                        openScope.isOpen = false;
                    }) :
                    openScope.isOpen = false;
                openScope = null;
            }
        };
        var escapeKeyBind = function (evt) {
            if (evt.which === 27) {
                openScope.focusToggleElement && openScope.focusToggleElement();// 若定义了聚焦方法，关闭后聚焦当前项
                closeMenu();
            }
        };
    }])

    .controller('PopupController', ['$scope', '$attrs', '$parse', '$timeout','$position', 'popupService', 'popupConfig', function ($scope, $attrs, $parse, $timeout,$position, popupService, popupConfig) {
        var self = this,
            scope = $scope.$new(),// 创建子 scope，避免污染原始 scope
            openClass = popupConfig.openClass,
            getIsOpen,
            setIsOpen = angular.noop,
            toggleInvoker = $attrs['onToggle'] ? $parse($attrs['onToggle']) : angular.noop;
        self.popupOptions = {};

        this.init = function (element) {
            self.$element = element;

            if ($attrs.isOpen) {// 定义了 is-open 绑定的对象，添加监听
                getIsOpen = $parse($attrs.isOpen);
                setIsOpen = getIsOpen.assign;
                $scope.$watch(getIsOpen, function (value) {
                    scope.isOpen = !!value;
                });
            }
        };

        // 切换并返回 scope.isOpen，若传入 open 则切换为 open 指定的状态，否则根据当前状态切换
        this.toggle = function (open) {
            return scope.isOpen = arguments.length ? !!open : !scope.isOpen;
        };

        // 允许其他指令监听 isOpen
        this.isOpen = function () {
            return scope.isOpen;
        };

        scope.getToggleElement = function () {
            return self.$element;
        };

        scope.focusToggleElement = function () {
            self.$element[0].focus();
        };

        scope.$watch('isOpen', function (isOpen, wasOpen) {
            if(!self.popupOptions || !self.popupOptions.elem) return;// 无弹出项
            var pElem = self.$element,
                options = self.popupOptions,// 指令中定义的弹出项配置（elem: jqlite 元素 - 必须, height: 需用 style 定义的高度数值 - 可选, width: 同 height）
                popupElem = options.elem;
            if (isOpen) {
                scope.focusToggleElement();
                pElem.addClass(openClass);
                popupService.open(scope);
                popupElem.addClass('wi-popup-menu-open');
                popupElem.css({'top': 0, 'left': 0});// 避免导致 body 长度变化，引起滚动条变化

                $timeout(function(){// 延迟计算，1.3.6 版本中，此时无法获得弹出项尺寸
                    var targetPos = popupElem[0].getBoundingClientRect()// 弹出项 BCR
                        ,width = options.width || targetPos.width
                        ,height = options.height || targetPos.height
                        ,popupStyle = {
                            'visibility':'visible'// 避免改变位置时造成闪烁，此时才设置可见
                            ,'zIndex': $position.getZIndex()
                            ,'width': width + 'px'// 避免打开状态时内容变化造成 popup-menu 尺寸变化与 element 分离
                            ,'height': height + 'px'
                        };
                    popupStyle = angular.extend(
                        popupStyle,
                        $position.adaptElements(pElem, width, height, 'bottom-left', true, true)[0]// 计算得出的位置 style
                    );
                    popupElem.css(popupStyle);
                });
            } else {
                pElem.removeClass(openClass);
                popupElem.removeClass('wi-popup-menu-open').css({// 重置样式
                    'visibility': ''
                    ,'zIndex': ''
                    ,'width': ''
                    ,'height': ''
                });
                popupService.close(scope);
            }
            setIsOpen($scope, isOpen);
            if (angular.isDefined(isOpen) && isOpen !== wasOpen) {
                toggleInvoker($scope, { open: !!isOpen });// 切换完成执行自定义操作
            }
        });

        $scope.$on('$locationChangeSuccess', function () {
            scope.isOpen = false;
        });

        $scope.$on('$destroy', function () {
            scope.$destroy();
        });
    }])

    /**
     * @ngdoc directive
     * @name ui.wisoft.popup.directive:wiPopup
     * @restrict E
     *
     * @description
     * popup 弹出层
     *
     * @param {string=} isOpen 弹出层的弹出状态，双向绑定，需绑定 scope 中的对象
     *
     */
    .directive('wiPopup', ['$window',function ($window) {
        return {
            restrict: 'CA',
            controller: 'PopupController',
            link: function (scope, element, attrs, popupCtrl) {
                // 提取弹出项，附加到 body 中
                var popupElem;
                angular.forEach(element.children(), function(child){
                    if(popupElem === undefined && (' ' + child.className +  ' ').indexOf('wi-popup-menu') >= 0){
                        popupElem = angular.element(child);// 用 class = wi-popup-menu 标记元素为弹出项
                        $window.top.document.body.appendChild(child);// 将弹出的菜单附加到 <body> - 考虑 iframe 情况，弹出层附加在最外层 window 中
                        popupCtrl.popupOptions.elem = popupElem;
                    }
                });

                // 切换弹出层打开状态
                var togglePopup = function (event) {
                    if (event.type === 'keydown' && event.keyCode !== 13) {// 回车键
                        return;
                    }
                    event.preventDefault();// 禁止浏览器默认事件
                    event.stopPropagation();// qq:防止重复触发关闭事件
                    if (!element.hasClass('disabled') && !attrs.disabled) {// 未禁用
                        scope.$apply(function () {
                            popupCtrl.toggle();// 执行切换
                        });
                    }
                };
                element.bind('click', togglePopup);
                element.bind('keydown', togglePopup);
                scope.$on('$destroy', function () {
                    if(popupElem !== undefined){
                        popupElem.remove();// 移除
                        popupElem = null;// 销毁
                    }
                    element.unbind('click', togglePopup);
                    element.unbind('keydown', togglePopup);
                });

                // WAI-ARIA
                element.attr({ 'aria-haspopup': true, 'aria-expanded': false });
                scope.$watch(popupCtrl.isOpen, function (isOpen) {
                    element.attr('aria-expanded', !!isOpen);
                });

                popupCtrl.init(element);
            }
        };
    }]);
'use strict';
angular.module('ui.wisoft.popupbutton',['ui.wisoft.popup'])

    /**
     * @ngdoc directive
     * @name ui.wisoft.popupbutton.directive:wiPopupbutton
     * @restrict E
     *
     * @description
     * 弹出按钮
     *
     * @param {string=} label 按钮名称.
     * @param {boolean=} isopen 是否展开.
     * @param {number|length=} width popupbutton 的宽度.<br />
     *   number 将自动添加单位 px。<br />
     *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
     *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
     *   绝对单位：cm, mm, in, pt, pc, px
     */
    .directive('wiPopupbutton',[function () {
        return {
            restrict:'E',
            templateUrl: 'pcc/template/popupbutton/popupbuttonTemplate.html',
            replace:true,
            transclude:true,
            scope: {
                //Properties
                label:'@' // 按钮名称
                ,isopen:'=' // 是否展开
            },
            require: 'wiPopup',
            link: function (scope,element,attrs,popupCtrl) {
                var parentScope = scope.$parent;
                var _width = function(attr){
                    if(!attr) return;
                    var size;
                    if(/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)){// 数字开始
                        size = attr;
                    }else{// 非数字开始，可能是 scope 对象
                        size = parentScope.$eval(attr);
                    }
                    Number(size) && (size += 'px');// 是数字则加上单位 px
                    return size;
                }(attrs['width']);
                _width && element.css('width', _width);

                // 点击弹出项不自动关闭 - 因为 popup 指令后绑定先执行，所以 popupCtrl.popupOptions.elem 已存在
                popupCtrl.popupOptions.elem.on('click', function (event) {
                    event.stopPropagation();
                })
            }
        };
    }]);
angular.module('ui.wisoft.position', [])
/**
 * @ngdoc service
 * @name ui.wisoft.position.factory:$position
 *
 * @description
 * $position 提供一套获取元素位置，计算元素位置的方法。
 *
 */
    .factory('$position', ['$document', '$window', function ($document, $window) {
        var scollBarSize = 17;
        var zIndex = 5000;// 系统 z-index 从 5000 开始，最大为 2147483647
        /**
         * 获取计算后 el 元素的 cssprop 样式
         * @param el - DOM 元素
         * @param cssprop - 要获取的样式名
         */
        function getStyle(el, cssprop) {
            if (el.currentStyle) { //IE
                return el.currentStyle[cssprop];
            } else if ($window.getComputedStyle) {
                return $window.getComputedStyle(el)[cssprop];
            }
            // finally try and get inline style
            return el.style[cssprop];
        }

        /**
         * 检查 element 的 position 是否为 static
         * @param element - DOM 元素
         */
        function isStaticPositioned(element) {
            return (getStyle(element, 'position') || 'static' ) === 'static';
        }

        /**
         * 返回 element 最近的，非 static 布局的父元素(dom)，定位的参照元素
         * @param element - DOM 元素
         */
        var parentOffsetEl = function (element) {// 获取用于定位的父元素（已进行过 css 定位的元素 / <body>）
            var docDomEl = $document[0];
            var offsetParent = element.offsetParent || docDomEl;
            while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent)) {
                offsetParent = offsetParent.offsetParent;
            }
            return offsetParent || docDomEl;
        };

        /**
         * 返回是否需要反向
         * @param nowS - 当前空间尺寸
         * @param otherS - 备选空间尺寸
         * @param targetS - 需要的空间尺寸
         */
        var shouldChange = function(nowS, otherS, targetS){
            return nowS < targetS && otherS >= targetS;//当前空间不足，反向空间足够，返回 true，即需要反向
        };

        return {
            /**
             * @ngdoc method
             * @name ui.wisoft.position.$position#getZIndex
             * @methodOf ui.wisoft.position.factory:$position
             * @description 获取最大 z-index，使指定元素在顶层展现，从 5000 开始。
             * @return {number} z-index 数值。
             */
            getZIndex: function (){
                return zIndex++;
            },

            /**
             * @ngdoc method
             * @name ui.wisoft.position.$position#position
             * @methodOf ui.wisoft.position.factory:$position
             * @description 获取 element 相对于父元素（定位元素）的偏移，参考 jQuery 中的 element.position()。
             * @param {element} element 要计算的元素 - jqLite 元素。
             * @return {object} position {width:xx, height:xx, top:xx, left:xx, bottom:xx, right:xx} - 属性值是单位为 px 的数字。
             */
            position: function (element) {
                var pel = parentOffsetEl(element[0]),// element 最近的定位参照元素 parent
                    elBCR = element[0].getBoundingClientRect(),
                    w = elBCR.width || element.prop('offsetWidth'),
                    h = elBCR.height || element.prop('offsetHeight'),
                    top, left;
                if(pel != $document[0]){// 非根节点
                    var pelBCR = angular.element(pel)[0].getBoundingClientRect();
                    top = elBCR.top - pelBCR.top + pel.scrollTop - pel.clientTop;// 考虑父元素滚动与边框，box-sizing: boxder-box 时，clientTop = 0
                    left = elBCR.left - pelBCR.left + pel.scrollLeft - pel.clientLeft;
                }else{
                    top = elBCR.top + ($window.pageYOffset || $document[0].documentElement.scrollTop);
                    left = elBCR.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft);
                }
                return{
                    width: w,
                    height: h,
                    top: top,
                    left: left,
                    bottom: top + h,
                    right: left + w
                }
            },

            /**
             * @ngdoc method
             * @name ui.wisoft.position.$position#offset
             * @methodOf ui.wisoft.position.factory:$position
             * @description 获取 element 相对于文档的偏移，参考 jQuery 中的 element.offset()。
             * @param {element} element 要计算的元素 - jqLite 元素。
             * @return {object} {width:.., height:.., top:.., left:.., bottom:.., right:..} - 属性值是单位为 px 的数字。
             */
            offset: function (element) {
                var boundingClientRect = element[0].getBoundingClientRect()// element 相对于文档可见区域的 BCR
                    ,w = boundingClientRect.width || element.prop('offsetWidth')
                    ,h = boundingClientRect.height || element.prop('offsetHeight')
                    ,top = boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop)// 考虑 scroll
                    ,left = boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft);// 考虑 scroll
                return {
                    width: w,
                    height: h,
                    top: top,
                    left: left,
                    bottom: top + h,
                    right: left + w
                };
            },

            /**
             * @ngdoc method
             * @name ui.wisoft.position.$position#offsetTop
             * @methodOf ui.wisoft.position.factory:$position
             * @description 获取 element 相对于顶层 window 的偏移。
             * @param {element} element 要计算的元素 - jqLite 元素。
             * @return {object} [viewElPos(相对顶层 window 的偏移), domElPos(相对顶层 window 的 body 的偏移)] <br />
             * viewElPos、domElPos：{width:.., height:.., top:.., left:.., bottom:.., right:..} - 属性值是单位为 px 的数字。
             */
            offsetTop: function (element) {
                var _topWindow = $window.top // 顶层 window
                    ,_window = $window // 当前判断到的 window
                    ,_top = 0, _left = 0
                    ,_inFrame = false // element 是否在 frame 中
                    ,_viewElPos = element[0].getBoundingClientRect()
                    ,viewElPos // 触发元素相对顶层窗口的位置（含尺寸）
                    ,domElPos;// 触发元素相对顶层窗口 body 的位置（含尺寸）

                var _document = element[0].ownerDocument // element 所在的文档，用于寻找弹出窗口/frame
                    ,_windowBCR;

                while(_window != _topWindow){// 由 _window 向外查找 frame
                    if(!_inFrame && _document == _window.document){ // element 在当前 frame 中
                        _inFrame = true;
                    }
                    if(_inFrame){ // element 已经确定在内层 frame 中
                        _windowBCR = _window.frameElement.getBoundingClientRect();
                        _top += _windowBCR.top;
                        _left += _windowBCR.left;
                    }
                    _window = _window.parent;
                }
                viewElPos = {
                    top: _viewElPos.top + _top
                    ,bottom: _viewElPos.bottom + _top
                    ,left: _viewElPos.left + _left
                    ,right: _viewElPos.right + _left
                    ,width: _viewElPos.width
                    ,height: _viewElPos.height
                };
                var _scrollY = 0
                    ,_scrollX = 0;
                // body 非 static，因弹出项加在 body，将根据 body 定位，产生偏移
                if(getStyle(_topWindow.document.body,'position')!='static'){
                    var _bodyBCR = _topWindow.document.body.getBoundingClientRect();
                    _scrollX -= _bodyBCR.left;
                    _scrollY -= _bodyBCR.top;
                }else{
                    _scrollX += (_topWindow.pageXOffset || _topWindow.document.documentElement.scrollLeft);
                    _scrollY += (_topWindow.pageYOffset || _topWindow.document.documentElement.scrollTop);
                }
                domElPos = {
                    top: viewElPos.top + _scrollY
                    ,bottom: viewElPos.bottom + _scrollY
                    ,left: viewElPos.left + _scrollX
                    ,right: viewElPos.right + _scrollX
                    ,width: viewElPos.width
                    ,height: viewElPos.height
                };
                return [viewElPos, domElPos];
            },

            /**
             * 获取计算后 el 元素的 cssprop 样式
             * @param el - DOM 元素
             * @param cssprop - 要获取的样式名
             */
            getStyle: getStyle,

            /**
             * @ngdoc method
             * @name ui.wisoft.position.$position#positionElements
             * @methodOf ui.wisoft.position.factory:$position
             * @description 根据 referEl 计算 targetEl 相对于父定位元素的位置。
             * @param {element} refEl 触发元素 - jqLite 元素。
             * @param {number} targetElWidth 要定位的元素的宽(单位：像素)。
             * @param {number} targetElHeight 要定位的元素的高(单位：像素)。
             * @param {string} positionStr 定位方向: p-p，可能的值：top,left,right,bottom,center，但一级弹出方向不支持 center。
             * @return {position} {top:.., left:..} - 属性值是单位为 px 的数字。
             */
            positionTooltip: function (refEl, targetElWidth, targetElHeight, positionStr) {
                var positionStrParts = angular.isString(positionStr) ? positionStr.split('-') : [];
                var pos0 = positionStrParts[0] || 'bottom';
                var pos1 = positionStrParts[1] || 'left';

                var refElPos,
                    targetElPos;
                refElPos = this.position(refEl);

                var shiftWidth = {
                    center: function () {
                        return refElPos.left + refElPos.width / 2 - targetElWidth / 2;
                    },
                    left: function () {
                        return refElPos.left;
                    },
                    right: function () {
                        return refElPos.left + refElPos.width - targetElWidth;
                    }
                };

                var shiftHeight = {
                    center: function () {
                        return refElPos.top + refElPos.height / 2 - targetElHeight / 2;
                    },
                    top: function () {
                        return refElPos.top;
                    },
                    bottom: function () {
                        return refElPos.top + refElPos.height - targetElHeight;
                    }
                };

                switch (pos0) {
                    case 'right':
                        targetElPos = {
                            top: shiftHeight[pos1]() + 'px',
                            left: refElPos.right + 'px'
                        };
                        break;
                    case 'left':
                        targetElPos = {
                            top: shiftHeight[pos1]() + 'px',
                            left: refElPos.left - targetElWidth + 'px'
                        };
                        break;
                    case 'bottom':
                        targetElPos = {
                            top: refElPos.bottom + 'px',
                            left: shiftWidth[pos1]() + 'px'
                        };
                        break;
                    default:
                        targetElPos = {
                            top: refElPos.top - targetElHeight + 'px',
                            left: shiftWidth[pos1]() + 'px'
                        };
                        break;
                }

                return targetElPos;
            },

            /**
             * @ngdoc method
             * @name ui.wisoft.position.$position#positionElements
             * @methodOf ui.wisoft.position.factory:$position
             * @description 根据 referEl 的位置，弹出项的尺寸，弹出方向，计算 弹出项的位置。
             * @param {element} referEl 参照元素，根据其位置确定弹出项位置 - jqLite 元素。
             * @param {number} targetElWidth 要定位的元素的宽(单位：像素)。
             * @param {number} targetElHeight 要定位的元素的高(单位：像素)。
             * @param {string} positionStr 定位方向: p-p，可能的值：top,left,right,bottom,center。
             * @param {boolean} adaptable 是否自适应，根据浏览器可视部分空间调整弹出方向。
             * @param {boolean} appendToBody 弹出项是否是 <body> 的直接子元素，若为 true,位置相对于文档，若为 false，位置相对于定位父元素。
             * @return {array} [<br />
             *   {top:'..px', bottom:'..px', left: '..px', right:'..px'}, - 属性值是单位为 px 的数字 <br />
             *   positionStr - 'top-left'/'top-right'/'bottom-left'/'bottom-right'/'top-left'/'top-right'/'bottom-left'/'bottom-right'<br />
             *   ] - 属性值是单位为 px 的数字。
             */
            adaptElements: function(referEl, targetElWidth, targetElHeight, positionStr, adaptable, appendToBody){
                var viewElPos// 触发元素相对文档可见区域位置（含尺寸）
                    ,pos0, pos1
                    ,elemStyle = {}// 弹出项样式{top, bottom, left, right}
                    ,viewW, viewH;// 文档可见区域尺寸，为滚动条留白
                var positionStrParts = angular.isString(positionStr) ? positionStr.split('-') : [];
                pos0 = positionStrParts[0] || 'bottom';
                pos1 = positionStrParts[1] || 'left';
                /** 确定弹出区域，触发元素位置等 **/
                // 相对于顶层窗口文档
                if(appendToBody){
                    var _topWindow = $window.top // 顶层 window
                        ,offsetTopArr = this.offsetTop(referEl);
                    viewW = _topWindow.innerWidth - scollBarSize;
                    viewH = _topWindow.innerHeight - scollBarSize;
                    viewElPos = offsetTopArr[0];
                    var domElPos = offsetTopArr[1];
                }
                // 相对于触发元素
                else{
                    viewW = $window.innerWidth - scollBarSize;
                    viewH = $window.innerHeight - scollBarSize;
                    viewElPos = referEl[0].getBoundingClientRect();
                }

                // 允许自适应：根据弹出项实际尺寸，及可见范围调整弹出方向和位置
                if(adaptable){
                    // 确定 pos0，若当前空间不足且备选空间足够，或都不足但备选空间较大，则反向
                    switch(pos0){
                        case 'left':
                            shouldChange(viewElPos.left, viewW - viewElPos.right, targetElWidth) && (pos0 = 'right');
                            break;
                        case 'right':
                            shouldChange(viewW - viewElPos.right, viewElPos.left, targetElWidth) && (pos0 = 'left');
                            break;
                        case 'top':
                            shouldChange(viewElPos.top, viewH - viewElPos.bottom, targetElHeight) && (pos0 = 'bottom');
                            break;
                        default :
                            pos0 = 'bottom';
                            shouldChange(viewH - viewElPos.bottom, viewElPos.top, targetElHeight) && (pos0 = 'top');
                    }
                    // 确定 pos1
                    switch(pos1){
                        case 'center': break;
                        case 'top' :
                            shouldChange(viewH - viewElPos.top, viewElPos.bottom, targetElHeight) && (pos1 = 'bottom');
                            break;
                        case 'bottom':
                            shouldChange(viewElPos.bottom, viewH - viewElPos.top, targetElHeight) && (pos1 = 'top');
                            break;
                        case 'right':
                            shouldChange(viewElPos.right, viewW - viewElPos.left, targetElWidth) && (pos1 = 'left');
                            break;
                        default :
                            pos1 = 'left';
                            shouldChange(viewW - viewElPos.left, viewElPos.right, targetElWidth) && (pos1 = 'right');
                    }
                }

                /** 精确弹出位置 **/
                // 相对于顶层窗口文档绝对定位
                if(appendToBody){
                    // 根据参照元素的文档位置，计算弹出项的文档位置
                    switch(pos0){
                        case 'left':
                            elemStyle.left = domElPos.left - targetElWidth + 'px';
                            break;
                        case 'right':
                            elemStyle.left = domElPos.right + 'px';
                            break;
                        case 'top':
                            elemStyle.top = domElPos.top - targetElHeight + 'px';
                            break;
                        default :
                            pos0 = 'bottom';
                            elemStyle.top = domElPos.bottom + 'px';
                    }
                    // 二级方向位置确定，单向空间不足时，向右/下贴边
                    switch(pos1){
                        case 'center':
                            if(['left', 'right'].indexOf(pos0) >= 0){
                                elemStyle.top = domElPos.top + Math.floor((viewElPos.height - targetElHeight)/2) + 'px';
                            }
                            else{
                                elemStyle.left = domElPos.left + Math.floor((viewElPos.width - targetElWidth)/2) + 'px';
                            }
                            break;
                        case 'top':
                            if(adaptable != false && viewH - viewElPos.top < targetElHeight)
                                elemStyle.top = domElPos.top - viewElPos.top + viewH - targetElHeight + 'px';// 贴边
                            else
                                elemStyle.top = domElPos.top + 'px';
                            break;
                        case 'bottom':
                            if(adaptable != false && viewElPos.bottom < targetElHeight)
                                elemStyle.top = domElPos.top - viewElPos.top + viewH - targetElHeight + 'px';// 贴边
                            else
                                elemStyle.top = domElPos.bottom - targetElHeight + 'px';
                            break;
                        case 'right':
                            if(adaptable != false && viewElPos.right < targetElWidth)
                                elemStyle.left = domElPos.left - viewElPos.left + viewW - targetElWidth + 'px';
                            else
                                elemStyle.left = domElPos.right - targetElWidth + 'px';
                            break;
                        default :
                            pos1 = 'left';
                            if(adaptable != false && viewW - viewElPos.left < targetElWidth)
                                elemStyle.left = domElPos.left - viewElPos.left + viewW - targetElWidth + 'px';
                            else
                                elemStyle.left = domElPos.left + 'px';
                    }
                }
                // 相对于触发元素绝对定位
                else{
                    // 一级位置已确定，通过返回方向由 class 名控制，不需计算
                    // 二级方向位置确定，单向空间不足时，向右/下贴边
                    switch(pos1){
                        case 'center':
                            if(['left', 'right'].indexOf(pos0) >= 0){
                                elemStyle.top = Math.floor((viewElPos.height - targetElHeight)/2) + 'px';
                            }
                            else{
                                elemStyle.left = Math.floor((viewElPos.width - targetElWidth)/2) + 'px';
                            }
                            break;
                        case 'top' :
                            if(adaptable != false && viewH - viewElPos.top < targetElHeight)
                                elemStyle.top = viewH - viewElPos.top - targetElHeight + 'px';
                            break;
                        case 'bottom':
                            if(adaptable != false && viewElPos.bottom < targetElHeight)
                                elemStyle.bottom = viewElPos.bottom - viewH + 'px';
                            break;
                        case 'right':
                            if(adaptable != false && viewElPos.right < targetElWidth)
                                elemStyle.right = viewElPos.right - viewW + 'px';
                            break;
                        default:
                            pos1 = 'left';
                            if(adaptable != false && viewW - viewElPos.left < targetElWidth)
                                elemStyle.left = viewW - viewElPos.left - targetElWidth + 'px';
                    }
                }

                return [{
                    'top': elemStyle.top ? elemStyle.top : ''
                    ,'bottom': elemStyle.bottom ? elemStyle.bottom : ''
                    ,'left': elemStyle.left ? elemStyle.left : ''
                    ,'right': elemStyle.right ? elemStyle.right : ''
                }, pos0 + '-' + pos1];
            }
        };
    }]);

'use strict';
angular.module('ui.wisoft.progress',['ui.wisoft.bindHtml'])
    .constant('progressConf', {
        initH: 9 // 进度条默认高度
    })
/**
 * @ngdoc directive
 * @name ui.wisoft.progress.directive:wiProgress
 * @restrict E
 *
 * @description
 * wiProgress 进度条组件。
 *
 * @param {string=} 进度条样式（'wave','stage'），默认为 'nomal'，其中 'wave' IE9 不支持。
 * @param {string=} label 提示文本，若定义了 labelelem，此属性失效。
 * @param {string|object=} labelelem 提示内嵌 jqlite 元素，定义后不支持修改。
 * @param {string=} labelplacement 提示的显示位置（'left'、'right'、'top'、'bottom'），默认为 'right'，定义后不支持修改。
 * @param {number=} value 进度数值，默认为 0。
 * @param {number=} maxvalue 进度最大数值，默认为 100，定义后不支持修改。
 * @param {pixels=} width 进度条宽度(不含单位：px)，默认为 100。
 * @param {pixels=} height 进度条宽度(不含单位：px)，默认为 9。
 *
 */
    .directive('wiProgress', ['progressConf','$parse','$compile','$interval', function(progressConf,$parse, $compile,$interval){
        return {
            restrict: 'E'
            ,templateUrl: 'pcc/template/progress/wi-progress.html'
            ,replace: true
            ,scope: {}
            ,link: function(scope, elem, attrs){
                var parentScope = scope.$parent;
                var barElem = angular.element(elem.children()[0]);// bar 对应的 jqlite 元素

                /* 外观 */
                var barStyle = {};
                var width = parentScope.$eval(attrs['width']);// bar 宽度
                (angular.isNumber(width)) && (barStyle.width = width + 'px');
                var height = parentScope.$eval(attrs['height']);// bar 高度
                (angular.isNumber(height)) && (barStyle.height = height + 'px');
                barElem.css(barStyle);
                var type = parentScope.$eval(attrs['type']);
                if(type && type!='normal') barElem.addClass('wi-progress-bar-'+type);

                var stageTimer, stageStep = 0;
                if(type == 'stage'){// 阶段动画
                    var remainElem = angular.element(barElem.children()[1]);// remain 对应的 jqlite 元素，stage 型需改变其长度，css3 控制 background-size 仅谷歌支持较好
                    remainElem.css('display','block');
                    stageTimer = $interval(function(){
                        if(stageStep > 100 - scope.percent){
                            stageStep = 0;
                            remainElem.css('width',stageStep + '%');
                        }
                        else{
                            stageStep += 5;
                            remainElem.css('width',stageStep + '%');
                        }
                    },40);
                }

                scope.animation = (type=='normal');

                /* 提示部分内容 */
                var labelElem
                    ,labelPlacement = parentScope.$eval(attrs['labelplacement']);
                if(attrs['labelelem']){// 嵌入 html
                    scope.labelelem = parentScope.$eval(attrs['labelelem']);
                    labelElem = $compile('<div bind-html-unsafe="labelelem"></div>')(scope);
                }
                else if (attrs['label']) {// 有 label 属性，添加文字显示节点，并监听 label
                    var _setLabel
                        ,_getLabel = $parse(attrs.label);
                    _setLabel = _getLabel.assign;
                    scope.label = _getLabel(parentScope);
                    _setLabel && parentScope.$watch(_getLabel, function(val, wasVal) {
                        if(val !== wasVal) scope.label = val;
                    });
                    labelElem = $compile('<div ng-bind="label"></div>')(scope);
                }
                // 若要显示提示，判断位置
                if(labelElem){
                    if(labelPlacement == 'top' || labelPlacement == 'left'){
                        labelElem.addClass('wi-progress-'+labelPlacement);
                        elem.prepend(labelElem);
                    }else{
                        if(labelPlacement == 'center'){
                            labelElem.css('line-height',(barStyle.height || progressConf.initH + 'px'));
                        }else if(labelPlacement != 'bottom'){
                            labelPlacement = 'right';
                        }
                        labelElem.addClass('wi-progress-'+labelPlacement);
                        elem.append(labelElem);
                    }
                }

                /* 进度计算 */
                var ratio = 100 / (parentScope.$eval(attrs['maxvalue']) || 100);// 100 与 maxvalue 的比率，用于通过 value 计算进度
                if (attrs['value']) {// 有 value 属性，监听
                    var _setValue
                        ,_getValue = $parse(attrs.value);
                    _setValue = _getValue.assign;
                    scope.percent = _getValue(parentScope) * ratio;
                    _setValue && parentScope.$watch(_getValue, function(val, wasVal) {
                        if(val !== wasVal) {
                            scope.percent = val * ratio;
                        }
                    });
                }

                scope.$on('$destroy', function() {// 销毁
                    labelElem && labelElem.remove();
                    stageTimer && $interval.cancel(stageTimer);
                    stageTimer = undefined;
                });
            }
        }
    }]);
'use strict';
angular.module('ui.wisoft.resizelistener', [])

    /**
     * @ngdoc service
     * @name ui.wisoft.resizelistener.wiResizeListener
     *
     * @description
     * 监听窗口大小改变，供组件内部调用
     *
     */
    .factory('wiResizeListener',[function(){

        var returnService = {};

        var attachEvent = document.attachEvent;

        if (!attachEvent) {
            var requestFrame = (function(){
                var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame ||
                    function(fn){ return window.setTimeout(fn, 20); };
                return function(fn){ return raf(fn); };
            })();

            var cancelFrame = (function(){
                var cancel = window.cancelAnimationFrame || window.mozCancelAnimationFrame || window.webkitCancelAnimationFrame ||
                    window.clearTimeout;
                return function(id){ return cancel(id); };
            })();

            var resetTriggers = function (element){
                var triggers = element.__resizeTriggers__,
                    expand = triggers.firstElementChild,
                    contract = triggers.lastElementChild,// 容器缩小时引起 scroll
                    expandChild = expand.firstElementChild;
                contract.scrollLeft = contract.scrollWidth;
                contract.scrollTop = contract.scrollHeight;
                expandChild.style.width = expand.offsetWidth + 1 + 'px';
                expandChild.style.height = expand.offsetHeight + 1 + 'px';
                expand.scrollLeft = expand.scrollWidth;
                expand.scrollTop = expand.scrollHeight;
            };

            var checkTriggers = function (element){
                return element.offsetWidth != element.__resizeLast__.width ||
                    element.offsetHeight != element.__resizeLast__.height;
            };

            var scrollListener = function (e){
                var element = this;
                resetTriggers(this);
                if (this.__resizeRAF__) cancelFrame(this.__resizeRAF__);
                this.__resizeRAF__ = requestFrame(function(){
                    if (checkTriggers(element)) {
                        element.__resizeLast__.width = element.offsetWidth;
                        element.__resizeLast__.height = element.offsetHeight;
                        element.__resizeListeners__.forEach(function(fn){
                            fn.call(element, e);
                        });
                    }
                });
            };
        }

        /**
         * 对指定元素添加resize监听
         * 若其父元素可能被隐藏，请使用 ng-show="val" 指令标识，当其显示时使此值为 true，隐藏时为 false，
         * 否则可能在切换父元素显示状态时无法对适应其尺寸的子元素生效。
         * @param element 要监听的容器
         * @param fn 含 $apply 的函数引用
         */
        returnService.addResizeListener = function(element, fn){
            if(!element.beListened){
                element.beListened=true;
                if (attachEvent){
                    element.attachEvent('onresize', fn);// IE11 以下
                }
                else if(getComputedStyle(element)) {
                    if (!element.__resizeTriggers__) {
                        if (getComputedStyle(element).position == 'static') element.style.position = 'relative';
                        element.__resizeLast__ = {};
                        element.__resizeListeners__ = [];
                        (element.__resizeTriggers__ = document.createElement('div')).className = 'resize-triggers';
                        element.__resizeTriggers__.innerHTML = '<div class="expand-trigger"><div></div></div>' +
                            '<div class="contract-trigger"></div>';
                        element.appendChild(element.__resizeTriggers__);
                        resetTriggers(element);
                        element.addEventListener('scroll', scrollListener, true);
                        element.__resizeListeners__.push(fn);
                    }
                }
            }else{
                if (attachEvent){
                    fn();
                }
                else if(getComputedStyle(element)) {
                    resetTriggers(element);
                }
            }
        };

        /**
         * 对指定元素移除resize监听
         * @param element
         * @param fn
         */
        returnService.removeResizeListener = function(element, fn){
            if (attachEvent) element.detachEvent('onresize', fn);
            else {
                element.__resizeListeners__.splice(element.__resizeListeners__.indexOf(fn), 1);
                if (!element.__resizeListeners__.length) {
                    element.removeEventListener('scroll', scrollListener);
                    element.__resizeTriggers__ = !element.removeChild(element.__resizeTriggers__);
                }
            }
        };
        return returnService;
    }]);

/**
 Created by QianQi on 2014/11/10.
 */
angular.module('ui.wisoft.searchinput', [])
/**
 * @ngdoc directive
 * @name ui.wisoft.searchinput.directive:wiSearchinput
 * @restrict E
 *
 * @description
 * wiSearch 是搜索控件，主要进行了样式封装，搜索时返回搜索栏中输入的文本。
 *
 * @param {string=} wiTips 搜索栏中默认显示的文本。
 * @param {function=} onsearch 搜索时执行的自定义方法，参数为选中项。
 *
 */
    .directive('wiSearchinput', [function(){
        return{
            restrict: 'E',
            templateUrl: 'pcc/template/searchinput/wi-searchinput.html',
            replace: true,
            transclude: true,
            scope: {
                onsearch: '&'
            },
            link: function(scope, elem, attrs){
                var onSelect = scope.onsearch()||angular.noop;// 选中项后执行的方法
                scope.value = '';
                scope.tips = attrs['wiTips'] || '';
                scope.search = function(){
                    onSelect(scope.value);
                };
                elem.on('keydown',function(event){
                    if(event.keyCode === 13){// 回车
                        scope.$apply(function(){
                            onSelect(scope.value);
                        })
                    }
                });

            }
        }
    }]);
/**
 * @ngdoc overview
 * @name ui.wisoft.tabset
 *
 * @description
 * Tab标签组件
 */
'use strict';
angular.module('ui.wisoft.tabset', ['ui.wisoft.resizelistener','ui.wisoft.common','ui.wisoft.menu'])
    .constant('tabsetConf',{
        'liBefore': 2 // li: margin-right: 2px
    })
    .controller('TabsetController', ['$scope','$attrs','$timeout','tabsetConf', function($scope,$attrs,$timeout,tabsetConf) {
        var conf = $scope.conf = {
            vertical: $attrs.hasOwnProperty('vertical') && $attrs['vertical']!='false'// 是否是纵向 tabset - tab 添加需知道 tabset 的方向，故在 controller 中判断
            ,closeable: !$attrs.hasOwnProperty('closeable') || $attrs['closeable']!='false'// 是否允许关闭，对所有非固定 tab 生效
        };
        var ctrl = this
            ,attrNames = ctrl.attrNames = conf.vertical ? // 确定横向、纵向要操作的 DOM 属性
            { offset: 'offsetHeight', pos: 'top', size:'height'}:// offsetHeight 包括边框
            { offset: 'offsetWidth', pos: 'left', size:'width'}
            ,tabs = $scope.tabs = [] //tab 的 scope 集合
            ,tabSizes = ctrl.tabSizes = []; // tab 的 size 集合
        ctrl.sumSize = 0; // 记录应显示的 li 的总 size
        ctrl.rightClickTab = undefined;//右击时选中的tab对象

        // 取消选中其他 tab 页
        ctrl.deselectOthers = function(selectedTab) {
            angular.forEach(tabs, function(tab) {
                if (tab.active && tab !== selectedTab) {
                    tab.active = false;
                }
            });
        };

        // 新增标签页 - 当前 tab 的 scope 和 jqlite 元素
        ctrl.addTab = function(tab, elm) {
            var liBefore = (tabs.length > 0) ? tabsetConf.liBefore : 0;// 不是第一项，附加相邻 tab 间的 margin
            var index=tabs.length;
            if(ctrl.acLinked){// 需要判断 DOM 索引
                var children=elm[0].parentElement.children;
                while(index<children.length){
                    if(children[index++] == elm[0]) break;
                }
            }
            tabs.splice(index, 0, tab);
            // 允许关闭时，不可禁用，disable=false；禁止关闭时，disable=undef
            conf.closeable && (tab.disable = false);
            // tab 是选中项
            (tab.active && !tab.disable) && ctrl.deselectOthers(tab);

            // 延迟以确保 wi-tabset 指令中 $scope.scrollChange 已定义，判断防止获取不到新 tab 的尺寸
            $timeout(function(){
                $scope.$apply($scope.ulStyle[attrNames['size']]='auto');// 避免由于容器不足无法获取实际尺寸
                var size = elm[0].getBoundingClientRect()[attrNames.size]; // 获取精确 size - chrome 中精确显示
                tabSizes.splice(index, 0, size);
                ctrl.sumSize += liBefore + size;
                $scope.scrollChange && $scope.scrollChange();
            });
        };

        // 关闭 tab
        ctrl.removeTab = function(tab) {
            var index = tabs.indexOf(tab);
            // 当前项被选中，先修改选中项
            if(tab.active && tabs.length > 1) {
                tabs[index == tabs.length - 1 ? //当前项为最后一项
                    index - 1: index + 1].active = true;
            }
            // 移除 tab
            tab.active = false;
            tabs.splice(index, 1);
            tabs.length && (ctrl.sumSize -= tabsetConf.liBefore);
            ctrl.sumSize -= tabSizes[index];
            tabSizes.splice(index, 1);
            tab.$destroy();// 销毁 - 触发 tab 中定义的 $destroy 监听，移除 dom
            $scope.scrollable = false;// 删除后可能无需翻页，先置为 false 再计算显示空间
            $timeout(function() {
                // 延迟以等待 scrollable 生效，以获得最大的 stage 尺寸
                $scope.scrollChange && $scope.scrollChange();
            });
            return true;
        };

        // 关闭所有标签页 - closeable 的项
        ctrl.closeAllTab = function() {
            var i = 0;
            while(i<tabs.length){
                (tabs[i]._closeable) ?
                    ctrl.removeTab(tabs[i]) :
                    i++;
            }
        };
        // 关闭除 tab 外的所有标签页 - 非 regular 项
        ctrl.closeOtherTab = function(tab) {
            var i = 0;
            while(i<tabs.length){
                (tabs[i] != tab && tabs[i]._closeable) ? // 不是 tab 且可删除，移除，否则索引向后
                    ctrl.removeTab(tabs[i]) :
                    i++;
            }
        };

        ctrl.calcUlOffset = function(){
            $scope.calcUlOffset();
        };
    }])

/**
 * @ngdoc directive
 * @name ui.wisoft.tabset.directive:wiTabset
 * @restrict E
 *
 * @description
 * 标签页组件标签，内部可包含wiTab标签页定义
 *
 * @param {number|length=} width 组件宽度，默认为 100%。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {number|length=} height 组件高度，默认由内容撑开。<br />
 *   说明同 width。
 * @param {boolean=} vertical 标签页是否纵向排列，默认为 false。
 * @param {pixels=} tabheadsize 标签页头高度（纵向为宽度）(不含单位：px)，默认为 36。
 * @param {boolean=} closeable 所有标签（非固定）支持关闭，默认为 true，此时不支持禁用标签（wi-tab 中 disable 属性失效）。
 * @param {boolean=} enablerightmenu 是否启用标签页右键菜单，默认为 false。若 closeable=false，此属性失效。
 * @param {object=} wid 若定义了此属性，可供调用接口。调用方法参见：wid.
 * @param {function=} onbeforeclose 关闭标签页前的回调方法名，该方法若返回 false 将阻止关闭，参数为标签对应的 data：
 * - wiid: 初始化 wi-tab 指令时设置的 wiid 属性值
 * - src: 初始化 wi-tab 指令时设置的 src 属性值
 * - icon: 初始化 wi-tab 指令时设置的 src 属性值
 * - heading: 初始化 wi-tab 指令时设置的 heading 属性值，或 wi-tab-heading 中的html字符串
 * @param {function=} onclose 关闭标签页后的回调方法名，参数同 onbeforeclose.
 * @param {function=} onselect 标签选中后的回调方法名，返回 false 时将阻止关闭，参数同 onbeforeclose.
 */
    .directive('wiTabset', ['wiResizeListener','wiCommonSev', '$timeout', 'tabsetConf',function(wiResizeListener,wiCommonSev,$timeout, tabsetConf) {
        return {
            restrict: 'E',
            transclude: true,
            replace: true,
            scope: {
                wid:'='
                ,onselect: '&'
                ,onbeforeclose: '&'
                ,onclose: '&'
            },
            controller: 'TabsetController',
            templateUrl: 'pcc/template/tebset/tabsetTemplate.html',
            link: function(tabset, element, attrs, tabsetCtrl) {
                var parentScope = tabset.$parent
                    ,conf=tabset.conf
                    ,attrNames = tabsetCtrl.attrNames
                    ,tabSizes = tabsetCtrl.tabSizes;
                tabset.scrollable = false;// 初始默认不翻页
                var menudata = [
                        {id:1,label:'关闭当前页'},
                        {id:2,label:'关闭其他'},
                        {id:3,label:'关闭所有'}
                    ] // 非 regular 项弹出菜单
                    ,menudataRegular = [
                        {id:1,label:'关闭当前页', enabled: false},
                        {id:2,label:'关闭其他'},
                        {id:3,label:'关闭所有'}
                    ] // regular 项弹出菜单
                    ,menudataOut =[
                        {id:3,label:'关闭所有'}
                    ]; // 非 tab 项弹出菜单
                var stageNode // wi-tabstage 对应的 DOM 元素
                    ,_ulOffset = 0;// ul 默认偏移 - 范围：[stageSize-ceil(sumSize),0]
                tabsetCtrl.selectFun = tabset.onselect() || angular.noop; // 选中后的回调方法
                tabsetCtrl.beforeCloseFun = tabset.onbeforeclose() || angular.noop; // 关闭前的回调方法
                tabsetCtrl.closeFun = tabset.onclose() || angular.noop; // 关闭后的回调方法

                angular.extend(conf,{
                    width:wiCommonSev.getSizeFromAttr(attrs['width'],parentScope)
                    ,height:wiCommonSev.getSizeFromAttr(attrs['height'],parentScope)
                    ,tabheadsize:Number(attrs['tabheadsize']) || 36
                    ,enablerightmenu:conf.closeable ? // 是否支持右键菜单，若禁止关闭，则禁用右键菜单
                        attrs.hasOwnProperty('enablerightmenu') && attrs['enablerightmenu']!='false'
                        : false
                    ,onselect: tabsetCtrl.selectFun
                    ,onbeforeclose: tabsetCtrl.beforeCloseFun
                    ,onclose: tabsetCtrl.closeFun
                });
                tabset.ulStyle={};
                angular.forEach(angular.element(element.children()[0]).children(),function(child){
                    if((' ' + child.className +  ' ').indexOf('wi-tabstage') >= 0){
                        stageNode = child;
                        // 根据右击的 tab 修改菜单数据源 - 会在 menu 中绑定的右击事件前触发
                        angular.element(child).on('contextmenu', function(){
                            if(tabsetCtrl.isTab){// 右击的是 tab 页
                                var rightTab = tabsetCtrl.rightClickTab && tabsetCtrl.rightClickTab.scope;// 右击的 tab 的 tabset
                                tabset.menudata = rightTab._closeable ? menudata : menudataRegular;
                            }else{
                                tabset.menudata = menudataOut;
                            }
                            tabset.$digest();// 引起 menu 组件中数据源变化
                            tabsetCtrl.isTab = false;
                        });
                    }
                });

                // scrollChange 判断，纵向未指定高度时会自适应高度，无需处理
                if(!conf.vertical || conf.height){
                    tabset.ulStyle['transition']=attrNames['pos']+" .35s ease";// 滚动时支持动画
                    tabset.ulStyle['-webkit-transition']=attrNames['pos']+" .35s ease";
                    // 判断并修改 scrollable，置为 true 后还需根据 active 的项调整 ulOffset
                    tabset.scrollChange = function(){// 判断 scrollable
                        var stageSize = stageNode[attrNames.offset];
                        tabset.ulStyle[attrNames['size']]=Math.ceil(tabsetCtrl.sumSize)+'px';
                        if(stageSize && stageSize < tabsetCtrl.sumSize){// 空间不足
                            tabset.scrollable = true;
                            $timeout(function(){
                                tabset.calcUlOffset();
                            });
                        }else{
                            _ulOffset = 0;// 清空 ul 定位
                            tabset.ulStyle[attrNames['pos']]=_ulOffset+'px';
                            tabset.scrollable = false;
                        }
                    };
                }

                // 根据 active 的 tab 调整 ulOffset - 只有翻页状态下需要判断，切换选中项时只需调整 ulOffset，不需调整 scrollable
                tabset.calcUlOffset = function(){
                    if(!tabset.scrollable) return;
                    var preSize = 0 // active 项之前的 tab 的总 size（含 margin）
                        ,size = 0;// active 的 tab 的 size（不含 margin）
                    for(var i= 0;i<tabSizes.length;i++){
                        size = tabSizes[i];
                        if(tabset.tabs[i].active){// 选中项
                            break;
                        }
                        preSize += size + tabsetConf.liBefore;
                    }
                    // 根据 presize 及 size 调整 _ulOffset
                    var stageSize = stageNode[attrNames.offset]
                        ,min = Math.max(-Math.floor(preSize),stageSize-Math.ceil(tabsetCtrl.sumSize))
                        ,max = Math.min(stageSize-Math.ceil(preSize+size),0);
                    if(_ulOffset < min){
                        _ulOffset = min;
                    }else if(_ulOffset > max){
                        _ulOffset = max;
                    }
                    tabset.ulStyle[attrNames['pos']]=_ulOffset+'px';
                };

                // 右键菜单选中事件，选中项为 val
                tabset.rightmenuselect = function(val) {
                    var tab = tabsetCtrl.rightClickTab;
                    if(val){
                        if (val.id == 1) {// 关闭当前项
                            tab && tabsetCtrl.removeTab(tab.scope);
                        } else if (val.id == 2) {// 关闭其他项
                            tab && tabsetCtrl.closeOtherTab(tab.scope);
                        } else if (val.id == 3) {// 关闭所有
                            tabsetCtrl.closeAllTab();
                        }
                    }
                };

                // 向前显示一个 tab
                tabset.backward = function() {
                    var oldPos = _ulOffset;
                    if(oldPos >= 0) return; // 左/上无被隐藏项，直接返回
                    var preSize = 0 // 当前 tab 前的 tab 的总 size（含 margin）
                        ,size = 0 // 要显示的 tab 的 size（不含 margin）
                        ,_preSize = 0;
                    for(var i=0;i<tabSizes.length;i++){
                        if(-oldPos <= Math.floor(preSize)){// 第一个未被遮挡的项
                            _ulOffset = -Math.floor(_preSize);// 上一项为要显示的项
                            tabset.ulStyle[attrNames['pos']]=_ulOffset+'px';
                            break;
                        }
                        size = tabSizes[i];
                        _preSize = preSize;
                        preSize += (size + tabsetConf.liBefore);
                    }
                };
                // 向后显示一个 tab
                tabset.forward = function() {
                    var oldPos = _ulOffset
                        ,stageSize = stageNode[attrNames.offset];
                    if(oldPos <= stageSize - Math.ceil(tabsetCtrl.sumSize)) return; // 右/下未无被隐藏项，直接返回
                    var preSize = 0; // 当前 tab 及之前的 tab 的总 size（含 margin）
                    for(var i=0;i<tabSizes.length;i++){
                        preSize += tabSizes[i];
                        if(stageSize-oldPos < Math.ceil(preSize)){// 第一个超出 stage 的项
                            _ulOffset = stageSize - Math.ceil(preSize);
                            tabset.ulStyle[attrNames['pos']]=_ulOffset+'px';
                            break;
                        }
                        preSize += tabsetConf.liBefore;
                    }
                };

                var resetSize = tabsetCtrl.resetSize = function(){
                    var tabs = tabset.tabs;
                    $timeout(function(){
                        tabset.$apply(tabset.ulStyle[attrNames['size']]='auto');
                        for(var i=0;i<tabs.length;i++){
                            var size=tabs[i].getSize();
                            var oldSize = tabsetCtrl.tabSizes[i];
                            if(size == oldSize) continue;
                            tabsetCtrl.tabSizes[i]=size;
                            tabsetCtrl.sumSize += size;
                            oldSize && (tabsetCtrl.sumSize -= oldSize);
                        }
                        tabset.scrollChange && tabset.scrollChange();
                    });
                };

                var regResizeEventListener = function(){
                    wiResizeListener.addResizeListener(element[0].parentElement, function(){
                        tabset.$evalAsync(resetSize);
                    });
                };
                if((conf.vertical && conf.height && conf.height.indexOf('%')>0)
                    || (!conf.vertical && conf.width && conf.width.indexOf('%')>0)){
                    // tabset 父容器或者窗口尺寸变化时重新调整布局 -- 需在模板和文档都设置完成后运行，否则 IE 等浏览器显示异常
                    regResizeEventListener();
                }

                /* 开放接口，需定义双向绑定的 wid */
                /**
                 * @ngdoc object
                 * @name ui.wisoft.tabset.wid
                 * @module ui.wisoft.tabset
                 * @description wiTabset 对外开放的接口，双向绑定，使用前需在指令属性中指定 wid="xx"，并指定 tabset.xx={}
                 */
                if(attrs.wid && angular.isObject(tabset.wid)) {
                    angular.extend(tabset.wid, {
                        /**
                         * @ngdoc method
                         * @name ui.wisoft.tabset.wid#options
                         * @methodOf ui.wisoft.tabset.wid
                         * @description 获取当前tabset的配置
                         * @return {Object} 返回一个包含用户自定义设置的对象。<br />
                         * - width 组件宽度.<br />
                         * - height 组件高度.<br />
                         * - vertical 标签页是否纵向排列.<br />
                         * - tabheadsize 标签页头高度（纵向为宽度）(单位：px).<br />
                         * - closeable 所有标签（非固定）支持关闭.<br />
                         * - enablerightmenu 是否启用标签页右键菜单.<br />
                         * - onbeforeclose 关闭标签页前的回调方法.<br />
                         * - onclose 关闭标签页后的回调方法.<br />
                         * - onselect 标签选中后的回调方法.
                         */
                        options: function () {
                            return conf;
                        }
                        /**
                         * @ngdoc method
                         * @name ui.wisoft.tabset.wid#getTab
                         * @methodOf ui.wisoft.tabset.wid
                         * @description 获取符合条件的第一个 tab 的 scope
                         * @param {string} key 键，可选值：'wiid','src','icon','heading'
                         * @param {Object} val 值
                         * @return {Object} 第一个符合 tab[key]=val 的 scope，找不到时为 undefined.
                         */
                        ,getTab: function (key, val) {
                            var tabs = tabset.tabs;
                            for(var i=0;i<tabs.length;i++){
                                if(tabs[i].getData()[key]==val) return tabs[i];
                            }
                        }
                        /**
                         * @ngdoc method
                         * @name ui.wisoft.tabset.wid#getTabs
                         * @methodOf ui.wisoft.tabset.wid
                         * @description 获取符合条件的所有 tab 的 scope
                         * @param {string} key 键，可选值：'wiid','src','icon','heading'
                         * @param {Object} val 值
                         * @return {Array} 所有符合 tab[key]=val 的 scope 组成的数组，找不到时为 [].
                         */
                        ,getTabs: function (key, val) {
                            var tabs = tabset.tabs
                                ,res=[];
                            for(var i=0;i<tabs.length;i++){
                                if(tabs[i].getData()[key]==val) res.push(tabs[i]);
                            }
                            return res;
                        }
                        /**
                         * @ngdoc method
                         * @name ui.wisoft.tabset.wid#getActiveTab
                         * @methodOf ui.wisoft.tabset.wid
                         * @description 获取当前选中的 tab 的 scope
                         * @return {Object} 当前选中的 tab 的 scope，找不到时为 undefined.
                         */
                        ,getActiveTab: function () {
                            var tabs = tabset.tabs;
                            for(var i=0;i<tabs.length;i++){
                                if(tabs[i].active == true) return tabs[i];
                            }
                        }
                        /**
                         * @ngdoc method
                         * @name ui.wisoft.tabset.wid#select
                         * @methodOf ui.wisoft.tabset.wid
                         * @description 选中指定的 tab
                         * @param {Object} tab 要选中的 tab 的 scope
                         */
                        ,select: function (tab) {
                            if(tab) tab.active=true;
                        }
                        /**
                         * @ngdoc method
                         * @name ui.wisoft.tabset.wid#close
                         * @methodOf ui.wisoft.tabset.wid
                         * @description 关闭指定的 tab
                         * @param {Object} tab 要关闭的 tab 的 scope
                         */
                        ,close: function (tab) {
                            if(tab) tab.close();
                        }
                        /**
                         * @ngdoc method
                         * @name ui.wisoft.tabset.wid#reCompute
                         * @methodOf ui.wisoft.tabset.wid
                         * @description 重新根据容器尺寸调整布局，在容器resize或显示时需手动触发
                         */
                        ,reCompute: function () {
                            regResizeEventListener();
                        }
                    });
                }

                // 标识是否完成 link，此后 link 的 accordionGroup （ng-repeat 等造成）需判断在 DOM 中的位置
                tabsetCtrl.acLinked = true;
            }
        };
    }])

/**
 * @ngdoc directive
 * @name ui.wisoft.tabset.directive:wiTab
 * @restrict E
 *
 * @description
 * 单个标签页定义标签，只能在wiTabset标签内使用
 *
 * @param {string=} wiid 标签标识id
 * @param {string=} heading 标签头内容，可以是一个字符串或一段HTML
 * @param {boolean=} active 标签初始时是否被选中，默认为 false，若要通过其他方式改变 active 的值，需为 active 指定有意义的初始值
 * @param {boolean=} disable 标识标签是否禁用，默认为 false。<br />wi-tabset 若未定义 closeable=false，此属性失效。
 * @param {boolean=} regular 是否是固定标签，默认为false。添加此属性且不设置为 false，则为固定 tab，不可关闭。<br />wi-tabset 若定义 closeable=false，此属性失效。
 * @param {string=} icon 标签页图标的 url
 * @param {string=} src 标签页内容链接地址，若定义此属性，wi-tabset 中原有的
 * @param {number|length=} size 组件宽度（纵向 tabset 为高度），默认由内容撑开。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 */
    .directive('wiTab', ['$parse','wiCommonSev', function($parse,wiCommonSev) {
        return {
            require: '^wiTabset',
            restrict: 'E',
            replace: true,
            templateUrl: 'pcc/template/tebset/tabTemplate.html',
            transclude: true,
            scope: {
                heading: '@'
            },
            controller: function() {
            },
            compile: function(elm, attrs, transclude) {
                return function postLink(tab, elm, attrs, tabsetCtrl) {
                    tab.$transcludeFn = transclude;
                    var parentScope = tab.$parent;
                    tab.data={
                        wiid:attrs.wiid
                        ,src:attrs.src
                        ,icon:attrs.icon
                    };
                    elm.css(tabsetCtrl.attrNames.size, wiCommonSev.getSizeFromAttr(attrs['size']));

                    var _setActive;
                    if (attrs.active) {// 有 active 属性，监听
                        var _getActive = $parse(attrs.active);
                        _setActive = _getActive.assign;
                        tab.active = _getActive(parentScope);
                        _setActive && parentScope.$watch(_getActive, function(val, wasVal) {
                            if(val !== wasVal) tab.active = val;
                        });
                    }
                    else{
                        tab.active = false;
                    }
                    // 监听选中状态
                    tab.$watch('active', function(active, wasActive) {
                        if(active === wasActive) return;
                        if(_setActive){
                            _setActive(parentScope, active);// 同时修改数据源
                        }
                        if (active) {
                            tabsetCtrl.deselectOthers(tab);// 取消选中其他 tab
                            tabsetCtrl.calcUlOffset();
                            tabsetCtrl.selectFun(tab.getData());
                        }
                    });

                    /* ----- 向 tabset 中添加 ----- */
                    tabsetCtrl.addTab(tab, elm);
                    // addTab 之后执行
                    if(tab.disable === false){// tabset 中 closeable=true 时，此 tab 可以关闭，不可禁用
                        if (attrs.regular) {// 有 regular 属性，监听，非 regular 的标签可关闭
                            var _getRegular = $parse(attrs.regular);
                            tab._closeable = !_getRegular(parentScope);
                            _getRegular.assign && parentScope.$watch(_getRegular, function(val, wasVal) {
                                if(val !== wasVal){
                                    tab._closeable = !val;
                                    tabsetCtrl.resetSize();// 切换显示关闭按钮将改变当前 tab 的尺寸，需重新计算
                                }
                            });
                        }else{
                            tab._closeable = true;
                        }
                    }
                    else{// tabset 中 closeable=false 时，不可关闭，可以禁用
                        tab._closeable = false;
                        tab.disable = false;
                        if(attrs.disable){
                            var _getDisabled = $parse(attrs.disable);
                            _getDisabled.assign && parentScope.$watch(_getDisabled, function(value) {
                                tab.disable = !! value;
                            });
                        }
                    }

                    // 返回当前 tab 的数据
                    tab.getData = function(){
                        return angular.extend({
                            heading: tab.heading || tab.headingElem
                        },tab.data);
                    };

                    tab.getSize = function(){
                        return elm[0].getBoundingClientRect()[tabsetCtrl.attrNames.size];
                    };

                    tab.select = function() {
                        if ( !tab.disable ) {
                            tab.active = true;
                        }
                    };

                    tab.close = function(event) {
                        if(tabsetCtrl.beforeCloseFun(tab.getData())!==false){
                            tabsetCtrl.removeTab(tab, elm);
                        }
                        event && event.stopPropagation();// 防止触发 tab 的 click 事件
                    };

                    tab.$on('$destroy', function() {
                        elm && elm.remove();
                        tabsetCtrl.closeFun(tab.getData());// 删除后有回调函数的调用回调函数
                        tab = undefined;
                    });

                    // 捕捉右键菜单弹出的 tab
                    elm.on('contextmenu', function(){
                        tabsetCtrl.rightClickTab = {
                            scope: tab
                            ,elm: elm
                        };
                        tabsetCtrl.isTab = true;// 标识右击了 tab
                    });
                };
            }
        };
    }])

    .directive('wiTabHeadingTransclude', [function() {
        return {
            restrict: 'A',
            require: '^wiTab',
            link: function(scope, elm) {
                scope.$watch('headingElem', function updateHeadingElem(heading) {
                    if (heading) {
                        elm.html(heading);
                    }
                });
            }
        };
    }])

    .directive('wiTabContentTransclude', function() {
        return {
            restrict: 'A',
            require: '^wiTabset',
            link: function(scope, elm, attrs) {
                var tab = scope.$eval(attrs.wiTabContentTransclude);
                tab.$transcludeFn(tab.$parent, function(contents) {
                    angular.forEach(contents, function(node) {
                        if (isTabHeading(node)) {
                            tab.headingElem = angular.element(node).html();
                        } else if (tab.src == undefined) {
                            elm.append(node);
                        }
                    });
                });
            }
        };
        /**
         * @ngdoc directive
         * @name ui.wisoft.tabset.directive:wiTabHeading
         * @restrict E
         *
         * @description
         * 用于自定义标签页头，只能用于wiTab标签内<br>
         * 示例：<br>
         * &lt;wi-tab&gt;<br>
         *     &lt;wi-tab-heading&gt;&lt;b style="color:red;"&gt;自定义标签名称&lt;/b&gt;&lt;/wi-tab-heading&gt;<br>
         *      ......<br>
         * &lt;/wi-tab&gt;<br>
         */
        function isTabHeading(node) {
            return node.tagName && node.tagName.toLowerCase() === 'wi-tab-heading';
        }
    });
/**
 * @ngdoc overview
 * @name ui.wisoft.tilelist
 *
 * @description
 * Tilelist网格流布局组件
 *
 * 主要功能：<br>
 * （1）支持横向和纵向排列<br>
 * （2）支持单元格自定义<br>
 *
 */
'use strict';
angular.module('ui.wisoft.tilelist',[ 'ui.wisoft.resizelistener'])
    .constant('tilelistConf',{
        'rowHeight': 30 // 默认行高
        ,'colWidth': 100 // 默认列宽
        ,'scrollBarSize': 17 // 滚动条尺寸
    })
/**
 * @ngdoc directive
 * @name ui.wisoft.tilelist.directive:wiTilelist
 * @restrict E
 *
 * @description
 *Tilelist网格流布局组件标签
 *
 * @param {array} dataprovider 数据源
 * @param {string} itemrender 自定义单元格内容 text/ng-template 的 id，其中 data 为该单元格数据源
 * @param {string=} direction 排列方向，h为横向排列，v为纵向排列，默认为 h。
 * @param {number|length=} width 组件宽度，默认为 100%。<br />
 *   number 将自动添加单位 px。<br />
 *   length 为 number 接长度单位（相对单位和绝对单位）。<br />
 *   相对单位：em, ex, ch, rem, vw, vh, vm, %<br />
 *   绝对单位：cm, mm, in, pt, pc, px
 * @param {number|length=} height 组件高度，默认为 100%。<br />
 *   说明同 width。
 * @param {number=} colcount 列数，direction="h"时，此属性失效。
 * @param {number=} colwidth 列宽，direction="v"时，若同时定义了 colcount，且横向超出显示范围，此属性将由组件重新计算。
 * @param {number=} rowcount 行数，direction="v"时，此属性失效。
 * @param {number=} rowheight 行高，direction="h"时，若同时定义了 rowcount，且纵向超出显示范围，此属性将由组件重新计算。
 */
.directive('wiTilelist', ['tilelistConf','wiResizeListener','$timeout',function(tilelistConf,wiResizeListener,$timeout){
    return {
        restrict: 'E',
        templateUrl: 'pcc/template/tilelist/tilelistTemplate.html',
        transclude: true,
        replace: true,
        scope: {
            dataprovider: '=',
            direction: '@',
            itemrender: '@'
        },
        controller: ['$scope',function($scope) {
        }],
        controllerAs: 'tilelistCtrl',
        link: function (scope,element,attrs) {
            var parentScope = scope.$parent;
            var direction = angular.lowercase(scope.direction || 'v');// 排列方向
            var shouldListen = false;
            (function(){
                var getSizeFromAttr = function(attr){
                    if(!attr) return;
                    var size = (/^(?:[1-9]\d*|0)(?:.\d+)?/.test(attr)) ?
                        attr : // 数字开始
                        parentScope.$eval(attr);// 非数字开始，可能是 scope 对象
                    Number(size) && (size += 'px');// 是数字则加上单位 px
                    return size;
                };
                var w=getSizeFromAttr(attrs['width'])
                    ,h=getSizeFromAttr(attrs['height']);
                element.css({
                    'width': w // 组件宽度（未设置有效值时显示为 100%）
                    ,'height': h // 组件高度（未设置有效值时显示为 100%）
                });
                shouldListen = (direction=='v'?// 标记是否需要监听
                    (!w || w.indexOf('%')>=0):// 纵向时，若width为百分比
                    (!h || h.indexOf('%')>=0));// 横向时，若height为百分比
            })();

            var userConf = {// 用户定义的参数
                'rowCount': Number(parentScope.$eval(attrs['rowcount'])) // 行数 -默认3
                ,'colCount': Number(parentScope.$eval(attrs['colcount'])) // 列数 -默认3
                ,'rowHeight': Number(parentScope.$eval(attrs['rowheight'])) // 行高 -px
                ,'colWidth': Number(parentScope.$eval(attrs['colwidth'])) // 列宽 -px
            };

            var rowCount, colCount, rowH, colW; // computeParams 及 computeStyle 中使用的临时变量
            var computeParams = (direction == 'h') ?
                function(){
                    /**
                     * 逻辑概述：横向显示滚动条，高度确定
                     * 宽度部分： cw = cw || 100
                     * 高度部分：
                     * rc,rh:  rh=(rc*rh>h)?(h/rc):rh,    rc=rc
                     * rc:     rh=h/rc,  rc=rc
                     * rh:     rh=rh,    rc=h/rc
                     * -:      rh=30     rc=h/rh
                     */
                    var elemBCR = element[0].getBoundingClientRect()
                        ,width = elemBCR.width
                        ,height = elemBCR.height;// 获取 tilelist 实际尺寸
                    colW = userConf.colWidth || tilelistConf.colWidth;// 列宽未定义则为默认值
                    if(userConf.rowCount){
                        rowCount = userConf.rowCount;
                        colCount = Math.ceil(scope.dataprovider.length / rowCount);// 根据数据源计算列数
                        var _height = (colW * colCount > width) ? // 超出宽度，内容高度减去 scrollbar 高度
                            height - tilelistConf.scrollBarSize : height;
                        rowH = (userConf.rowHeight && userConf.rowHeight * rowCount <= _height) ?// 定义了 rowH，且未超过容器高度
                            userConf.rowHeight :
                            Math.floor(_height/rowCount);
                    }else{
                        rowH = userConf.rowHeight || tilelistConf.rowHeight;
                        rowCount = Math.floor(height/rowH) || 1;
                        colCount = Math.ceil(scope.dataprovider.length / rowCount);// 根据数据源计算列数
                        if(rowCount > 1 && colCount * colW > width){// 出现滚动条，重新计算行高
                            rowCount = Math.floor((height-tilelistConf.scrollBarSize)/rowH) || 1;
                            colCount = Math.ceil(scope.dataprovider.length / rowCount);
                        }
                    }
                } :
                function(){
                    var elemBCR = element[0].getBoundingClientRect()
                        ,width = elemBCR.width
                        ,height = elemBCR.height;// 获取 tilelist 实际尺寸
                    rowH = userConf.rowHeight || tilelistConf.rowHeight;// 行高未定义则为默认值
                    if(userConf.colCount){
                        colCount = userConf.colCount;
                        rowCount = Math.ceil(scope.dataprovider.length / colCount);// 根据数据源计算行数
                        var _width = (rowH * rowCount > height) ? // 超出高度，内容宽度减去 scrollbar 宽度
                            width - tilelistConf.scrollBarSize : width;
                        colW = (userConf.colWidth && userConf.colWidth * colCount <= _width) ?// 定义了 colW，且未超过容器宽度
                            userConf.colWidth :
                            Math.floor(_width/colCount);
                    }else{
                        colW = userConf.colWidth || tilelistConf.colWidth;
                        colCount = Math.floor(width/colW) || 1;
                        rowCount = Math.ceil(scope.dataprovider.length / colCount);// 根据数据源计算行数
                        if(colCount > 1 && rowCount * rowH > height){// 出现滚动条，重新计算
                            colCount = Math.floor((width-tilelistConf.scrollBarSize)/colW) || 1;
                            rowCount = Math.ceil(scope.dataprovider.length / colCount);
                        }
                    }
                };
            function computeStyle(){
                computeParams();
                scope.colW = colW + 'px';
                scope.rowH = rowH + 'px';
                scope.tableW = colW * colCount + 'px';
                scope.tableH = rowH * rowCount + 'px';
                /* 根据行列，重置数据 */
                scope.dataTable = [];
                for (var i=0; i<rowCount; i++) {
                    var arr = [];
                    for (var j=0; j<colCount; j++) {
                        arr.push(scope.dataprovider[i*colCount+j]);
                    }
                    scope.dataTable.push(arr);
                }
            }

            //监听数据源引用变化
            scope.$watchCollection('dataprovider', function(newValue){
                if (!newValue) {
                    scope.dataTable = [];
                }else{
                    computeStyle();
                }
            });

            $timeout(computeStyle,0);// 若祖先元素存在自定义指令，可能造成 link 时高度未同步至DOM，延迟计算

            // tilelist 父容器或者窗口大小变化时重新计算行列 -- 需在模板和文档都设置完成后运行，否则 IE 等浏览器显示异常
            var regResizeEventListener = function(){
                if(shouldListen){// 需要监听 resize
                    wiResizeListener.addResizeListener(element[0], function () {// 监听元素大小改变
                        scope.$evalAsync(computeStyle);
                    });
                }
            };
            regResizeEventListener();
        }
    }
}]);

/**
 * @ngdoc overview
 * @name ui.wisoft.tooltip
 *
 * @description
 * 提示标签
 *
 * 主要功能：<br>
 * （1）支持标签内容自定义<br>
 * （2）支持标签内容动态修改<br>
 */
'use strict';
angular.module('ui.wisoft.tooltip', [ 'ui.wisoft.position', 'ui.wisoft.bindHtml' ])

    .provider('$tooltip', function () {
        var defaultOptions = {
            placement: 'top',
            animation: true,
            popupDelay: 0
        };

        var triggerMap = {
            'mouseenter': 'mouseleave',
            'click': 'click',
            'focus': 'blur'
        };

        var globalOptions = {};

        /**
         * `options({})` 允许全局配置 app 中所有 tooltip 的默认参数。
         * var app = angular.module( 'App', ['ui.bootstrap.tooltip'], function( $tooltipProvider ) {
         *   // 默认弹出位置由 top 改为 left
         *   $tooltipProvider.options( { placement: 'left' } );
         * });
         */
        this.options = function(value) {
            angular.extend(globalOptions, value);
        };

        /**
         * `setTriggers({})` 允许扩展 trigger 集合。
         *   $tooltipProvider.setTriggers( 'openTrigger': 'closeTrigger' );
         */
        this.setTriggers = function(triggers) {
            angular.extend(triggerMap, triggers);
        };

        /**
         * 这个方法将驼峰式命名（js 中的指令名）转换为链式（DOM 中的指令字符串）。
         */
        function snake_case(name) {
            var regexp = /[A-Z]/g;
            var separator = '-';
            return name.replace(regexp, function (letter, pos) {
                return (pos ? separator : '') + letter.toLowerCase();
            });
        }

        /**
         * 返回 $tooltip 服务的实际接口
         */
        this.$get = [ '$window', '$compile', '$timeout', '$parse', '$document', '$position', function ($window, $compile, $timeout, $parse, $document, $position) {
            /**
             * @param {string} type 指令的驼峰字符串
             * @param {string} 属性前缀
             * @param {string} defaultTriggerShow 触发显示 ttPopup 的事件名
             */
            return function $tooltip(type, prefix, defaultTriggerShow) {

                var options = angular.extend({}, defaultOptions, globalOptions);

                /**
                 * 返回 ttPopup 的切换事件名：{show: '..', hide: '..'}
                 *
                 * 若提供了 trigger，将在此事件触发时显示 ttPopup，否则使用 `$tooltipProvider.options({})` 定义的 trigger，若也未定义，则使用创建指令定义时设置的默认值。
                 * hide 事件名根据 show 事件名获取，若 triggerMap 中有该事件对的定义，直接获取 hide，否则直接定义为 show。
                 */
                function getTriggers(trigger) {
                    var show = trigger || options.trigger || defaultTriggerShow;
                    var hide = triggerMap[show] || show;
                    return {
                        show: show,
                        hide: hide
                    };
                }

                var directiveName = snake_case(type);// 根据 type 获取指令在 DOM 中的字符串
                var template =
                    '<div ' + directiveName + '-popup ' +
                    'content="{{tt_content}}" ' +
                    'placement="{{tt_placement}}" ' +
                    'animation="tt_animation" ' +
                    'is-open="tt_isOpen"' +
                    '></div>';// 弹出部分的 DOM 字符串

                // tooltip 指令主体
                return {
                    restrict: 'EA',
                    scope: true,
                    compile: function () {
                        var tooltipLinker = $compile(template);
                        return function link(scope, element, attrs) {
                            var ttPopup; // 弹出项 DOM 元素
                            var showTimeout, hideTimeout; // 弹出项显示/隐藏计时器
                            var hasEnableExp = angular.isDefined(attrs[prefix + 'Enable']);// 是否定义了启用属性
                            var appendToBody = angular.isDefined(attrs[prefix +'AppendToBody']) ? // 是否将弹出项添加到 body 节点下
                                $parse(attrs[prefix +'AppendToBody'])(scope):
                                angular.isDefined(options['appendToBody']) ? // 服务中的配置
                                    options['appendToBody']:
                                    false;
                            var triggers = getTriggers(undefined);// {show: defaultTriggerShow, hide: 对应的隐藏方法名}
                            bindTriggers();
                            var animation = scope.$eval(attrs[prefix + 'Animation']);

                            scope.tt_placement = angular.isDefined(attrs[prefix + 'Placement']) ? attrs[prefix + 'Placement'] : options.placement;
                            scope.tt_animation = angular.isDefined(animation) ? !!animation : options.animation;
                            // 默认 ttPopup 关闭 - TODO 支持初始化时打开
                            scope.tt_isOpen = false;

                            // 用于绑定的切换事件
                            function toggleBind() {
                                if (!scope.tt_isOpen) {
                                    showBind();
                                } else {
                                    hideBind();
                                }
                            }

                            // 用于绑定的显示事件：指定的延迟时间后显示 ttPopup，若未指定则立即显示
                            function showBind() {
                                if (hasEnableExp && !scope.$eval(attrs[prefix + 'Enable'])) {// 未启用
                                    return;
                                }
                                if (scope.tt_popupDelay) {
                                    if (!showTimeout) {// 此前已指定延迟显示（多次触发切换），不进行操作
                                        showTimeout = $timeout(show, scope.tt_popupDelay, false);
                                    }
                                } else {
                                    show();
                                }
                            }

                            // 用于绑定的隐藏事件
                            function hideBind() {
                                scope.$apply(function () {
                                    hide();
                                });
                            }

                            // 显示 ttPopup 弹出项
                            function show() {
                                showTimeout = null;// 清除弹出定时器
                                if (hideTimeout) {// 若已经有一个删除的过渡等待执行，必须先删除它
                                    $timeout.cancel(hideTimeout);
                                    hideTimeout = null;
                                }
                                if (!scope.tt_content) {// 无内容
                                    return;
                                }
                                if (!ttPopup) {// 若此时未定义弹出项 DOM 元素 ttPopup，创建
                                    ttPopup = tooltipLinker(scope, function () {});// 获取 DOM 元素 ttPopup
                                    if (appendToBody) {// 将 ttPopup 添加到 DOM 中，以获取一些信息（宽、高等）
                                        angular.element($window.top.document.body).append(ttPopup);
                                    } else {
                                        element.after(ttPopup);
                                    }
                                }
                                scope.$digest();// 使需通过属性传递到 ttPopup 的参数生效

                                /* 计算弹出位置 */
                                var targetBCR = ttPopup[0].getBoundingClientRect()
                                    ,ttPosition
                                    ,ttStyle = {};
                                if(appendToBody){
                                    ttPosition = $position.adaptElements(element, targetBCR.width, targetBCR.height, scope.tt_placement+'-center', false, true);
                                    ttStyle = angular.extend(ttStyle, {'zIndex': $position.getZIndex()}, ttPosition[0]);
                                    //scope.tt_placement = ttPosition[1].split('-')[0]; // TODO 支持调节弹出方向 - 需获取实际弹出尺寸，可能因换行发生变化
                                }else{
                                    ttPosition = $position.positionTooltip(element, targetBCR.width, targetBCR.height, scope.tt_placement+'-center');
                                    ttStyle = angular.extend(ttStyle, ttPosition);
                                }
                                ttPopup.css(ttStyle);
                                scope.tt_isOpen = true;// 显示
                                scope.$digest();
                            }

                            // 隐藏 ttPopup 弹出项
                            function hide() {
                                scope.tt_isOpen = false;
                                // 若定义了延迟显示，取消定时
                                $timeout.cancel(showTimeout);
                                showTimeout = null;

                                // 从 DOM 中移除，若支持动画，延迟以确保动画结束后才移除
                                // FIXME: transition 库接口占位
                                if (scope.tt_animation) {// 支持切换的动画，延迟 .5s 等待动画完成（样式中 .wi-fade 暂为 .15s）
                                    if (!hideTimeout) {
                                        hideTimeout = $timeout(removeTooltip, 500);
                                    }
                                } else {
                                    removeTooltip();
                                }
                            }

                            function removeTooltip() {
                                hideTimeout = null;
                                if (ttPopup) {
                                    ttPopup.remove();
                                    ttPopup = null;
                                }
                            }

                            // Observe:弹出内容
                            attrs.$observe(type, function (val) {
                                scope.tt_content = val;
                                if (!val && scope.tt_isOpen) {// 弹出内容未定义，直接隐藏
                                    hide();
                                }
                            });

                            // Observe:延迟显示的时间
                            attrs.$observe(prefix + 'PopupDelay', function (val) {
                                var delay = parseInt(val, 10);
                                scope.tt_popupDelay = !isNaN(delay) ? delay : options.popupDelay;
                            });

                            function unbindTriggers() { // 解绑 trigger 事件
                                element.unbind(triggers.show, showBind);
                                element.unbind(triggers.hide, hideBind);
                            }
                            function bindTriggers(){ // 绑定 trigger 事件
                                if (triggers.show === triggers.hide) {
                                    element.bind(triggers.show, toggleBind);
                                } else {
                                    element.bind(triggers.show, showBind);
                                    element.bind(triggers.hide, hideBind);
                                }
                            }
                            attrs.$observe(prefix + 'Trigger', function (val) {
                                var newTriggers = getTriggers(val);// 获取最新的触发方式
                                if(newTriggers.show != triggers.show){// 发生变化时才需要重绑事件
                                    unbindTriggers();// 解绑原有的事件监听
                                    triggers = newTriggers;
                                    bindTriggers();
                                }
                            });

                            if (appendToBody) {
                                scope.$on('$locationChangeSuccess', function closeTooltipOnLocationChangeSuccess() {// 切换路由时隐藏 ttPopup
                                    if (scope.tt_isOpen) {
                                        hide();
                                    }
                                });
                            }

                            // 确保销毁并移除 ttPopup
                            scope.$on('$destroy', function onDestroyTooltip() {
                                $timeout.cancel(hideTimeout);
                                $timeout.cancel(showTimeout);
                                unbindTriggers();
                                removeTooltip();
                            });
                        };
                    }
                };
            };
        }];
    })

    .directive('tooltipPopup', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
            templateUrl: 'pcc/template/tooltip/tooltip-popup.html',
            link: function(scope, elem){
                elem.on('$destroy', function(){
                    scope.$destroy();
                });
            }
        };
    })

/**
 * @ngdoc directive
 * @name ui.wisoft.tooltip.directive:tooltip
 * @restrict A
 *
 * @description
 * 提示标签
 *
 * @param {string} tooltip 提示内容
 * @param {boolean=} tooltip-enable 是否启用 tooltip 功能，默认为 true
 * @param {string=} tooltip-placement 弹出方向，可选值：top,bottom,left,right，默认为 top。
 * @param {number=} tooltip-popup-delay 提示延迟显示时间（毫秒）
 * @param {string=} tooltip-trigger 提示触发方式，可选值：mouseenter,click,focus，默认为 mouseenter
 * @param {boolean=} tooltip-animation 显示/隐藏时是否执行动画，默认为 true。
 * @param {boolean=} tooltip-append-to-body 是否在 body 中弹出，默认为 false。
 */
    .directive('tooltip', [ '$tooltip', function ($tooltip) {
        return $tooltip('tooltip', 'tooltip', 'mouseenter');
    }])

    .directive('tooltipHtmlUnsafePopup', function () {
        return {
            restrict: 'EA',
            replace: true,
            scope: { content: '@', placement: '@', animation: '&', isOpen: '&' },
            templateUrl: 'pcc/template/tooltip/tooltip-html-unsafe-popup.html',
            link: function(scope, elem){
                elem.on('$destroy', function(){
                    scope.$destroy();
                });
            }
        };
    })

/**
 * @ngdoc directive
 * @name ui.wisoft.tooltip.directive:tooltipHtmlUnsafe
 * @restrict A
 *
 * @description
 * 提示标签 - 弹出项为自定义内容。
 *
 * @param {string} tooltipHtmlUnsafe 提示内容（html 字符串）。
 * @param {boolean=} tooltip-enable 是否启用 tooltip 功能，默认为 true
 * @param {string=} tooltip-placement 弹出方向，可选值：top,bottom,left,right，默认为 top。
 * @param {number=} tooltip-popup-delay 提示延迟显示时间（毫秒）
 * @param {string=} tooltip-trigger 提示触发方式，可选值：mouseenter,click,focus，默认为 mouseenter
 * @param {boolean=} tooltip-animation 显示/隐藏时是否执行动画，默认为 true。
 * @param {boolean=} tooltip-append-to-body 是否在 body 中弹出，默认为 false。
 */
    .directive('tooltipHtmlUnsafe', [ '$tooltip', function ($tooltip) {
        return $tooltip('tooltipHtmlUnsafe', 'tooltip', 'mouseenter');
    }]);

angular.module('ui.wisoft.transition', [])

/**
 * @ngdoc service
 * @name ui.wisoft.transition.factory:$transition
 *
 * @description
 * $transition 提供一个接口触发 CSS3 变换（过渡 transition / 动画 animation）并在完成变换时接收通知。
 *
 * @param  {DOMElement} element  要产生动画效果的 DOM 元素
 * @param  {string|object|function} trigger  引起变换的来源：<br />
 *   - string，要加到 element 上的 class。<br />
 *   - object, 要应用到 element 上的 style 哈希表。<br />
 *   - function, 将被调用以使变化发生的函数。
 * @param {object=} options options ={ animation: true } 表示要进行的是动画变换，默认为过渡变换。
 * @return {Promise}  返回变化完成后的期望。
 *
 */
	.factory('$transition', ['$q', '$timeout', '$rootScope', function ($q, $timeout, $rootScope) {

		var $transition = function (element, trigger, options) {
			options = options || {};
			var deferred = $q.defer();// defer 对象
			var endEventName = $transition[options.animation ? 'animationEndEventName' : 'transitionEndEventName'];
			// 变换结束时删除绑定的 endEvent，并 resolve
			var transitionEndHandler = function (event) {
				$rootScope.$apply(function () {
					element.unbind(endEventName, transitionEndHandler);
					deferred.resolve(element);
				});
			};
			// 绑定 endEvent
			if (endEventName) {
				element.bind(endEventName, transitionEndHandler);
			}

			// 绑定 timeout 在变换发生前使浏览器更新 DOM
			$timeout(function () {
				if (angular.isString(trigger)) {
					element.addClass(trigger);
				} else if (angular.isFunction(trigger)) {
					trigger(element);
				} else if (angular.isObject(trigger)) {
					element.css(trigger);
				}
				// 若浏览器不支持变换，立即 resolve
				if (!endEventName) {
					deferred.resolve(element);
				}
			});

			// 自定义 cancel 事件，在执行一个会打断当前变换的新变换时调用它，原变换的 endEvent 将不会执行
			deferred.promise.cancel = function () {
				if (endEventName) {
					element.unbind(endEventName, transitionEndHandler);
				}
				deferred.reject('Transition cancelled');
			};

			return deferred.promise;
		};

		// 获取当前浏览器支持的 css 变换/动画结束时触发的事件名
		// 但使用此方法，包含多个属性变化的动画/变换，handler 将执行多次
		// 方法一：设定变换时记住改变的属性，收到事件后判断所有属性都已结束时才执行 handler
		// 方法二：Timeout，变换结束的时间点自行模拟事件
		var transElement = document.createElement('trans');
		var transitionEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',//-webkit-transition 变换结束时，触发的事件
			'MozTransition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'transition': 'transitionend'
		};
		var animationEndEventNames = {
			'WebkitTransition': 'webkitAnimationEnd',//-webkit-animation 动画结束时，触发的事件
			'MozTransition': 'animationend',
			'OTransition': 'oAnimationEnd',
			'transition': 'animationend'//兼容部分无 anmation 的情况
		};

		function findEndEventName(endEventNames) {
			for (var name in endEventNames) {
				if (transElement.style[name] !== undefined) {
					return endEventNames[name];
				}
			}
		}

		$transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
		$transition.animationEndEventName = findEndEventName(animationEndEventNames);
		return $transition;
	}]);

'use strict';
angular.module('ui.wisoft.tree',[])
    .factory('treeService', function () {
        var treeService = {};
        /**
         * json格式转哈希、树状结构
         * @param {json} dataSrc json数据（hash结构）
         * @param {object} opts 配置
         * - idfield id字段的属性名
         * - pidfield 父id的字段的属性名
         * @return	{Array} 数组[哈希表结构,树结构]
         */
        treeService.transData = function (dataSrc, opts){
            var tree = [], hash = {}, i = 0, len = dataSrc.length,data;
            var id=opts['idfield']||'id', pid=opts['pidfield']||'pid';
            while(i < len){// 防止子节点向父节点扩展 children 时父节点尚未存入 hash
                data=dataSrc[i++];
                hash[data[id]] = data;// 哈希表结构 - 以 id 字段为 key
            }
            i=0;
            while(i < len){
                data = dataSrc[i++];
                var hashVP = hash[data[pid]];// 父节点
                // 树结构
                if(hashVP){// 向父节点中添加
                    !hashVP['children'] && (hashVP['children'] = []);
                    hashVP['children'].push(data);
                }else{
                    tree.push(data);
                }
            }
            return [hash,tree];
        };
        return treeService;
    })

    .factory('RecursionHelper', ['$compile', function($compile){
        return {
            /**
             * 手动编译element，解决递归循环的问题
             * @param element
             * @param [link] post link 或者 {pre-link, post-link}
             */
            compile: function(element, link){

                // 规范link参数
                if(angular.isFunction(link)){
                    link = { post: link };
                }

                // 通过移除内容来打破递归循环
                var contents = element.contents().remove();
                var compiledContents;// 编译后的内容
                return {
                    pre: (link && link.pre) ? link.pre : null,

                    post: function(scope, element){
                        // 编译内容
                        if(!compiledContents){
                            compiledContents = $compile(contents);
                        }
                        // 重新添加内容
                        compiledContents(scope, function(clone){
                            element.append(clone);
                        });

                        // 如果存在post link，调用之
                        if(link && link.post){
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }])

    .filter('treeNodeFilter', function () {
        return function (hashData, search, labelField, pidFiled, idField) {
            // 分支中只要有一个节点符合条件，则整条分支都返回；兄弟节点中不符合条件的未移除
            var hash = {},result = [];

            if(search) {
                // 根据关键字过滤出节点
                angular.forEach(hashData, function (item) {
                    if(item && -1 != item[labelField].indexOf(search)) {
                        // 找到祖先节点
                        while(item['__parent']) {
                            item = item['__parent']
                        }
                        if(!hash[item[idField]]) {
                            hash[item[idField]] = item;
                            result.push(item);
                        }
                    }
                })
            } else {
                angular.forEach(hashData, function (item) {
                    if(item && !item['__parent']) {
                        result.push(item);
                    }
                })
            }

            return result;
        }
    })

    /**
     * @ngdoc directive
     * @name ui.wisoft.tree.directive:wiTree
     * @restrict E
     *
     * @description
     * 树
     *
     * @param {array} dataprovider 数据源.<br />
     *   id: id字段，可通过 idfield 指定<br />
     *   pid: parentid 字段，可通过 pidfield 指定<br />
     *   text: 显示字段，可通过 labelfield 指定<br />
     *   isbranch: 是否为分支字段，若指定 isbranch=true，则其拥有子节点，需要延迟加载 - 多选且级联选中时不支持<br />
     *   selected: 初始时是否选中，默认为 false<br />
     *   closed: 是否折叠，默认为 false<br />
     *   cls: 节点图标的 class
     * @param {string=} idfield id字段，默认'id'.
     * @param {string=} pidfield parentid字段，默认'pid'.
     * @param {string=} labelfield 显示字段，默认'text'.
     * @param {boolean=} multiselect 多选，false|true，默认 false.
     * @param {string=} pcls 父节点图标 class
     * @param {string=} ccls 叶子节点图标 class
     * @param {boolean=} istree 数据源是否为树形，默认为 false.
     * @param {bool=} cascade 支持多选时，是否级联父子节点的选中状态，默认为 false.
     * @param {string=} itemrenderer 自定义节点渲染.
     * @param {string=} filterby 过滤.
     * @param {object=} wid 若定义了此属性，可供调用接口。调用方法参见：wid.
     * @param {function=} onitemclick 点击节点时的回调函数:onitemclick(node).
     * @param {function=} onloadbranch 加载延迟节点（isbranch=true 的节点）时的回调函数: onloadbranch(node,success,error).<br />
     * - success(children) 延迟加载成功后的回调函数，参数为要添加到 node 下的子节点;<br />
     * - error() 延迟加载失败后的回调函数.
     * @param {function=} onbeforeexpand 节点展开前的回调函数,返回 false 时阻止展开:onbeforeexpand(node).
     * @param {function=} onexpand 节点展开时的回调函数:onexpand(node).
     * @param {function=} onbeforecollapse 节点折叠前的回调函数,返回 false 时阻止折叠:onbeforecollapse(node).
     * @param {function=} oncollapse 节点折叠时的回调函数:oncollapse(node).
     * @param {function=} onbeforeselect 节点选中前的回调函数:onbeforeselect(node).
     * @param {function=} onselect 节点选中时的回调函数:onselect(node).
     * @param {function=} oncancelselect 取消节点选中时的回调函数:oncancelselect(node).
     *
     */
    .directive('wiTree',['RecursionHelper','treeService','$filter','$parse',function (RecursionHelper,treeService,$filter,$parse) {
        return {
            restrict:'E',
            transclude:true,
            templateUrl: 'pcc/template/tree/treeTemplate.html',
            replace:true,
            scope: {
                // Properties
                dataprovider:'='// 数据源
                ,filterby:'='// 过滤
//                ,orderby:'@'// 排序字段，默认'id' TODO
                ,wid:'='// 供外部操作tree
                ,labelfunction:'&'// TODO
                // Events
                ,onitemclick:'&'
                ,onloadbranch:'&'
                ,onbeforeexpand:'&'
                ,onexpand:'&'
                ,onbeforecollapse:'&'
                ,oncollapse:'&'
                ,onbeforeselect:'&'
                ,onselect:'&'
                ,oncancelselect:'&'
            },
            require: 'wiTree',
            controller: ['$scope','treeService', function ($scope,treeService) {
                var ctrl = this;
                $scope.isRoot = !$scope.$parent._treeCtrl;// 若父scope未定义 _treeCtrl 则为根节点
                if($scope.isRoot){
                    $scope._treeCtrl = ctrl;
                }else{// 统一为根节点的 controller
                    $scope._treeCtrl = $scope.$parent._treeCtrl;
                    return;
                }

                var conf = ctrl.conf = {}
                    ,curNode// 记录高亮行
                    ,selNode;// 记录选中行（单选条件下）
                ctrl.handler = {};
                ctrl._hashData = {};

                /**
                 * 根据父节点 pNode 配置其子节点 nodes 的附加属性
                 *   __parent 父节点
                 *   __closed 是否折叠
                 *   __selected 是否选中
                 *   __level 节点层级
                 * @param {Array} nodes json数据（树形结构）
                 * @param {Object=} pNode 父节点，未定义表示 nodes 均为一级节点
                 */
                ctrl.initData = function(nodes, pNode){
                    if(conf.multiselect) {// 多选
                        ctrl.setMultiInit(nodes, pNode);
                    }else{// 单选
                        ctrl.setRadioInit(nodes, pNode);
                    }
                };
                ctrl.setMultiInit = function(nodes, pNode){
                    var _level= pNode ? pNode['__level']+1 : 0
                        ,selCount=0;
                    angular.forEach(nodes, function (node) {
                        node['__level'] = _level;
                        pNode && (node['__parent'] = pNode);
                        node['__closed']=node['closed'];
                        node['__selected']=node['selected'];
//                        node['__loading']=false;
//                        node['__current']=false;
                        if(!conf.cascade && node['isbranch']){// 非级联时才允许延迟加载
                            node['__closed']=true;
                            node['children'] ? node['children'].length=0 : node['children']=[];
                        }else if(node['isbranch'] || (node['children'] && !node['children'].length)){// 级联时的延迟加载作为叶子处理
                            node['children'] = undefined;
                        }
                        if(node['children'] && node['children'].length){// 有子节点
                            ctrl.setMultiInit(node['children'],node);
                        }
                        node['__selected'] && selCount++;
                    });
                    if(pNode && conf.cascade){// 级联，根据子节点修改父节点 __selected
                        if(selCount == nodes.length){//全选
                            pNode['__selected']=true;
                            pNode['__semi']=false;
                        }else if(selCount == 0){// 未选
                            pNode['__selected']=false;
                            pNode['__semi']=false;
                        }else{// 半选
                            pNode['__selected']=false;
                            pNode['__semi']=true;
                        }
                    }
                };
                ctrl.setRadioInit = function(nodes, pNode){
                    var _level= pNode ? pNode['__level']+1 : 0;
                    angular.forEach(nodes, function (node) {
                        node['__level'] = _level;
                        pNode && (node['__parent'] = pNode);
                        node['__closed']=node['closed'];
//                        node['__semi']=false;
//                        node['__loading']=false;
//                        node['__current']=false;
                        if(node['selected'] && !selNode){// 用户定义其选中且未定义其他选中项，选中、高亮并展开其所有父节点，
                            node['__selected']=true;
                            node['__current']=true;
                            curNode=node;
                            selNode=node;
                            (function(p){
                                while(p){
                                    p['__closed']=false;
                                    p=p['__parent'];
                                }
                            })(pNode);// 打开所有父节点
                        }else{
                            node['__selected']=false;
                            node['__current']=false;
                        }
                        if(node['children']) {// 有子节点
                            ctrl.setRadioInit(node['children'], node);
                        }else{
                            if(node['isbranch']){
                                node['__closed']=true;
                                node['children']=[];
                            }
                        }
                    });
                };

                ctrl.changeCur = function(node){// 切换高亮行
                    if(curNode == node) return;
                    if(curNode) curNode['__current']=false;// 取消原高亮行
                    curNode = node;
                    curNode && (curNode['__current'] = true);// node 为 undefined，仅清空高亮行
                };
                ctrl.changeSel = function(node){// 单选情况下切换选中项
                    if(selNode == node) return;
                    if(selNode) selNode['__selected']=false;// 取消原高亮行
                    selNode = node;
                    selNode && (selNode['__selected'] = true);// node 为 undefined，仅取消选中
                };

                /**
                 * 向 hash 注册 nodes 及其子节点
                 * @param {Array=} nodes 树形结构的数据
                 */
                var registerHash = function(nodes){
                    angular.forEach(nodes,function(node){
                        ctrl._hashData[node[conf.idfield]] = node;
                        node['children'] && registerHash(node['children']);
                    });
                };
                /**
                 * 转换 nodes 为树形，并向 hash 中注册
                 * @param {Array} nodes
                 * @param {Object=} pNode 父节点，未定义表示 nodes 均为一级节点
                 */
                ctrl.transData = function(nodes, pNode){
                    // 如果是递归的数据，需要转换
                    if(!conf['isTree']){
                        // 转换数据并注册 hash
                        var _data = treeService.transData(nodes,{
                            'idfield':conf.idfield
                            ,'pidfield':conf.pidfield
                            ,'childrenfield':'children'
                        });
                        angular.extend(ctrl._hashData, _data[0]);// 扩展 hash
                        nodes = _data[1];
                    }else{
                        registerHash(nodes);// 树形需手动注册
                    }
                    ctrl.initData(nodes,pNode);
                    return nodes;
                };
                // 移除 node 及其子节点
                ctrl.removeNode = function(node){
                    // 移除节点前，先处理高亮及选中
                    if(node['__current']) curNode=undefined;
                    if(node['__selected']) selNode=undefined;
                    node['children'] && angular.forEach(node['children'], function(child){
                        ctrl.removeNode(child);
                    });
                    delete ctrl._hashData[node[conf.idfield]];// 从 hash 数据中移除键值对
                };
                ctrl.destroyData = function(){// 存在历史数据源时，清除组件附加属性
                    curNode = undefined;
                    selNode = undefined;
                    if(!!ctrl._hashData){
                        angular.forEach(ctrl._hashData,function(data){
                            // 数据源解除 __parent、children 绑定，防止循环引用
                            if(data['__parent']) data['__parent']=null;
                            if(data['children']) data['children']=null;
                        });
                    }
                };
            }],
            compile: function(element) {
                return RecursionHelper.compile(element,{
                    post: function(scope,element,attrs){
                        var isRoot = scope.isRoot
                            ,ctrl = scope._treeCtrl;
                        var vm = scope.vm = {}// 记录每个子树不同的属性（_data）
                            ,conf = scope.conf = ctrl.conf;// 用户配置
                        var handler = scope.handler = ctrl.handler;// 所有子树公用的方法
                        /*** 根节点 ***/
                        if(isRoot){
                            var parentScope = scope.$parent;
                            // 默认值
                            angular.extend(conf, {
                                idfield: attrs['idfield'] || 'id'
                                ,pidfield: attrs['pidfield'] || 'pid'
                                ,labelfield: attrs['labelfield'] || 'text'
                                ,pCls: attrs['pcls']
                                ,cCls: attrs['ccls'] || 'icon-file'
                                ,multiselect: false
                                ,itemrenderer: attrs['itemrenderer']
                                ,isTree: attrs['istree']=='true'
                                ,cascade: attrs['cascade']=='true'
                            });
//                            conf.orderby = scope.orderby || conf.idfield;
                            // 事件监听
                            conf.onitemclick = scope.onitemclick() || angular.noop;
                            conf.onloadbranch = scope.onloadbranch() || angular.noop;
                            conf.onbeforeexpand = scope.onbeforeexpand() || angular.noop;
                            conf.onexpand = scope.onexpand() || angular.noop;
                            conf.onbeforecollapse = scope.onbeforecollapse() || angular.noop;
                            conf.oncollapse = scope.oncollapse() || angular.noop;
                            conf.onbeforeselect = scope.onbeforeselect() || angular.noop;
                            conf.onselect = scope.onselect() || angular.noop;
                            conf.oncancelselect = scope.oncancelselect() || angular.noop;
                            /* 多选支持 */
                            (function(){
                                var _setMultisel;
                                if (attrs.multiselect) {// 有 multiselect 属性，监听
                                    var _getMultisel = $parse(attrs.multiselect);
                                    _setMultisel = _getMultisel.assign;
                                    conf.multiselect = _getMultisel(parentScope);
                                    _setMultisel && parentScope.$watch(_getMultisel, function(val, wasVal) {
                                        if(val !== wasVal){
                                            conf.multiselect = val;
                                            ctrl.changeCur();
                                            ctrl.initData(vm._data);
                                        }
                                    });
                                }
                                if(angular.isUndefined(_setMultisel)){// 不会变化，标记 ctrl.conf.multiselect
                                    ctrl.conf.multiselect = conf.multiselect;
                                }
                            })();
                            /* 数据源监听 */
                            scope.$watch('dataprovider', function (newValue) {
                                if(newValue) {
                                    ctrl.destroyData();// 销毁可能存在的原数据，避免其中children等对转换数据产生影响
                                    // 转换 nodes 为树形，并向 hash 中注册，配置树节点附加属性
                                    vm._data = ctrl.transData(scope.dataprovider);
                                }
                            },false);
                            /* 过滤监听 */
                            scope.$watch('filterby', function (newValue,oldValue) {
                                if(newValue != oldValue) {
                                    angular.forEach(ctrl._hashData, function (item) {
                                        if (item['__selected']) item['__selected']=false;
                                    });
                                    vm._data = $filter('treeNodeFilter')(ctrl._hashData,
                                        scope.filterby,
                                        conf.labelfield,
                                        conf.pidfield,
                                        conf.idfield);
                                }
                            },false);
                            /* 销毁 */
                            scope.$on('$destroy',function(){
                                ctrl.destroyData()
                            });

                            /*** 事件 ***/
                            /**
                             * 向 pNode 添加 nodes 及其子节点
                             * @param {Array} children
                             * @param {Object=} pNode
                             */
                            var registerNode = function (children, pNode) {
                                children = ctrl.transData(children, pNode);// 转换 children 为树形，配置树节点附加属性
                                if(pNode){
                                    pNode['children'] = pNode['children'] ?
                                        pNode['children'].concat(children) : children;
                                    pNode['__closed']=false;// 展开父节点
                                }else{// 根节点
                                    vm._data = vm._data.concat(children);
                                }
                            };
                            // 注销节点信息
                            var unregisterNode = function (node) {
                                var parent = node['__parent']
                                    ,children;
                                if(parent) {// 从 parent 的 children 中移除node
                                    children = parent['children'];
                                    children.splice(children.indexOf(node), 1);
                                    children.length==0 && (parent['children'] = undefined);
                                }else{// 根节点
                                    children = vm._data;
                                    children.splice(children.indexOf(node), 1);
                                }
                                ctrl.removeNode(node);
                            };

                            // 根据 node['__selected'] 设置其子节点选中状态
                            var setChildrenCheck=function(node) {
                                angular.forEach(node['children'], function (child) {
                                    child['__selected'] = node['__selected'];
                                    child['__semi'] = false;
                                    child['children'] && setChildrenCheck(child);// 级联孙子节点
                                });
                            };
                            // 根据子节点调整 node 选中状态
                            var setCheckByChildren=function(node) {
                                var count = 0;// 已选项总数
                                angular.forEach(node['children'], function (child) {
                                    child['__selected'] && count++;
                                });
                                if(count == 0){// 未选
                                    node['__selected'] = false;
                                    node['__semi'] = false;
                                }
                                else if(count == node['children'].length){// 全选
                                    node['__selected'] = true;
                                    node['__semi'] = false;
                                }
                                else{// 半选
                                    node['__selected'] = false;
                                    node['__semi'] = true;
                                }
                                node['__parent'] && setCheckByChildren(node['__parent']);// 可能影响父节点选中状态
                            };
                            // 展开 node
                            var expandNode=function(node){
                                if(!node['children'] || !node['__closed'] || conf.onbeforeexpand(node)===false) return;
                                node['__closed'] = false;// 展开
                                if(node['isbranch'] && !node['children'].length) {// 未展开的延迟加载节点
                                    node['__loading'] = true;
                                    conf.onloadbranch(node,function(children){
                                        // 延迟加载成功的回调函数
                                        node['__loading'] = false;
                                        if(angular.isArray(children)) {
                                            registerNode(children, node);
                                            scope.$apply();
                                        }
                                        conf.onexpand(node);
                                    },function(){
                                        // 延迟加载失败的回调函数
                                    });
                                }else{
                                    conf.onexpand(node);
                                }
                            };
                            // 折叠 node
                            var collapseNode=function(node){
                                if(!node['children'] || node['__closed'] || conf.onbeforecollapse(node)===false) return;
                                node['__closed'] = true;// 折叠
                                conf.oncollapse(node);
                            };
                            // 选中 node
                            var selectNode=function(node){
                                var oldStatus = node['__selected'];
                                if(oldStatus) return;// 已被选中，单选不作处理，多选时反转选中状态
                                if(conf.multiselect){
                                    if(conf.onbeforeselect(node)!==false){
                                        node['__selected'] = true;// 反选
                                        node['__semi'] = false;// 非半选
                                        if(conf.cascade){
                                            node['children'] && setChildrenCheck(node);// 级联子节点
                                            node['__parent'] && setCheckByChildren(node['__parent']);// 设置父节点状态
                                        }
                                        conf.onselect(node);
                                    }
                                    ctrl.changeCur(node);// 切换高亮
                                }else{
                                    if(conf.onbeforeselect(node)!==false){
                                        ctrl.changeSel(node);// 切换选中
                                        ctrl.changeCur(node);// 切换高亮
                                        conf.onselect(node);
                                    }
                                }
                            };

                            handler.clickRow = function(node){
                                conf.onitemclick(node);
                                var oldStatus = node['__selected'];
                                if(oldStatus){// 已被选中，单选不作处理，多选时反转选中状态
                                    if(conf.multiselect){
                                        node['__selected'] = false;// 反选
                                        node['__semi'] = false;// 非半选
                                        if(conf.cascade){
                                            node['children'] && setChildrenCheck(node);// 级联子节点
                                            node['__parent'] && setCheckByChildren(node['__parent']);// 设置父节点状态
                                        }
                                        conf.oncancelselect(node);
                                        ctrl.changeCur(node);// 切换高亮
                                    }
                                }else{// 未被选中
                                    selectNode(node);
                                }
                            };

                            // 节点展开/闭合
                            handler.toggleNode = function (e,node) {
                                if(node['__closed']){
                                    expandNode(node);
                                }else{
                                    collapseNode(node);
                                }
                                e.stopPropagation();
                            };
                            // 切换悬停标记（node['wi-treehover']）
                            handler.toggleHover =function(node){
                                node['wi-treehover']=!node['wi-treehover'];
                            };

                            /* 开放接口，需定义双向绑定的 wid */
                            /**
                             * @ngdoc object
                             * @name ui.wisoft.tree.wid
                             * @module ui.wisoft.tree
                             * @description wiTree 对外开放的接口，双向绑定，使用前需在指令属性中指定 wid="xx"，并指定 scope.xx={}
                             */
                            if(attrs.wid && angular.isObject(scope.wid)) {
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#options
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 获取当前树的配置
                                 * @return {Object} 返回一个包含用户自定义设置的对象。<br />
                                 * - idfield id字段.<br />
                                 * - pidfield parentid字段.<br />
                                 * - labelfield 显示字段.<br />
                                 * - cCls 叶子节点图标 class<br />
                                 * - pCls 父节点图标 class<br />
                                 * - cascade 是否级联父子节点的选中状态.<br />
                                 * - isTree 数据源是否为树形.<br />
                                 * - itemrenderer 自定义节点渲染.<br />
                                 * - multiselect 多选，false|true.<br />
                                 * - onbeforecollapse 节点折叠前的回调函数.<br />
                                 * - oncollapse 节点折叠时的回调函数.<br />
                                 * - onbeforeexpand 节点展开前的回调函数.<br />
                                 * - onexpand 节点展开时的回调函数.<br />
                                 * - onbeforeselect 节点选中前的回调函数.<br />
                                 * - oncancelselect 取消节点选中时的回调函数.<br />
                                 * - onitemclick 点击节点时的回调函数.<br />
                                 * - onloadbranch 加载延迟节点（isbranch=true 的节点）时的回调函数.<br />
                                 * - onselect 节点选中时的回调函数.
                                 */
                                scope.wid.options = function(){
                                    return conf;
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#loadData
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 重置数据源
                                 * @param {Array} data 新的数据源
                                 * @param {boolean=} isTree data 是否为树形，默认为 false
                                 */
                                scope.wid.loadData = function(data, isTree){
                                    conf.isTree=isTree||false;
                                    scope.dataprovider = data;
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#getNode
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 获取符合条件的第一个节点
                                 * @param {string} key 键
                                 * @param {Object} val 值
                                 * @return {Object} 第一个符合 data[key]=val 的节点 data，找不到时为 undefined.
                                 */
                                scope.wid.getNode = function(key, val){
                                    var _hashData = ctrl._hashData;
                                    for(var name in _hashData){
                                        if (_hashData.hasOwnProperty(name)){
                                            if (_hashData[name][key]==val) return _hashData[name];
                                        }
                                    }
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#getNodes
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 获取符合条件的所有节点
                                 * @param {string} key 键
                                 * @param {Object} val 值
                                 * @return {Array} 所有符合 data[key]=val 的节点 data 组成的数组，找不到时为 [].
                                 */
                                scope.wid.getNodes = function(key, val){
                                    var _hashData = ctrl._hashData
                                        ,nodes=[];
                                    for(var name in _hashData){
                                        if (_hashData.hasOwnProperty(name)){
                                            if (_hashData[name][key]==val) nodes.push(_hashData[name]);
                                        }
                                    }
                                    return nodes;
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#getSelected
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 获取选中的节点
                                 * @returns {Object | Array} 单选时为选中节点 data，无选中项时为 undefined；多选时为选中节点 data 组成的数组，无选中项时为 [].
                                 */
                                scope.wid.getSelected = function () {
                                    var _hashData = ctrl._hashData
                                        ,name;
                                    if (conf.multiselect) {
                                        var nodes=[];
                                        for(name in _hashData){
                                            if (_hashData.hasOwnProperty(name)){
                                                if (_hashData[name]['__selected']==true) nodes.push(_hashData[name]);
                                            }
                                        }
                                        return nodes;
                                    } else {
                                        for(name in _hashData){
                                            if (_hashData.hasOwnProperty(name)){
                                                if (_hashData[name]['__selected']==true) return _hashData[name];
                                            }
                                        }
                                    }
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#select
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 选中指定节点
                                 * @param {object} node 要选中的节点 data
                                 */
                                scope.wid.select = function(node){
                                    selectNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#expandNode
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 展开指定节点
                                 * @param {object} node 要展开的节点 data
                                 */
                                scope.wid.expandNode = function(node){
                                    expandNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#collapseNode
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 折叠指定节点
                                 * @param {object} node 要折叠的节点 data
                                 */
                                scope.wid.collapseNode = function(node){
                                    collapseNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#append
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 向 parent 添加子节点 data
                                 * @param {Array} nodes 要添加的节点 data 数组（需要与 dataprovider 结构相同）
                                 * @param {object=} parent 添加到的节点 data，默认为根节点
                                 */
                                scope.wid.append = function (nodes, parent) {
                                    if (angular.isArray(nodes)) {
                                        registerNode(nodes, parent);
                                        scope.$evalAsync();// 不使用apply，可能由外部ng-事件或$watch触发
                                    }
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#remove
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 删除节点 node，及其子节点
                                 * @param {object} node 添加到的节点 data
                                 */
                                scope.wid.remove = function (node) {
                                    unregisterNode(node);
                                };
                                /**
                                 * @ngdoc method
                                 * @name ui.wisoft.tree.wid#updateNode
                                 * @methodOf ui.wisoft.tree.wid
                                 * @description 重置指定节点设置
                                 * @param {object} node 要重置的节点 data
                                 * @param {object} options 节点设置
                                 */
                                scope.wid.updateNode = function(node, options){
                                    angular.extend(node, options);
                                };
                            }
                        }
                        /*** 子节点 ***/
                        else{
                            /* 数据源监听 */
                            scope.$watch('dataprovider', function (newValue) {
                                if(newValue) {
                                    vm._data = scope.dataprovider;
                                }
                            },false);
                        }
                    }
                });
            }
        };
    }]);
angular.module('template/accordion/wi-accordion-group.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/accordion/wi-accordion-group.html',
    '<div class="wi-accordion-group" ng-class="{\'open\': isOpen}">\n' +
    '  <div class="wi-accordion-head"  ng-click="toggleOpen()" ng-class="{\'wi-accordion-disabled\': isDisabled}"\n' +
    '       ng-style="{\'height\': style.headheight, \'line-height\': style.headheight}"\n' +
    '       wi-accordion-transclude="heading">{{heading}}</div>\n' +
    '  <div class="wi-accordion-panel" wi-collapse="!isOpen">\n' +
    '      <div class="wi-accordion-cont" ng-style="{\'height\':panelStyle.cheight}" ng-transclude></div>\n' +
    '  </div>\n' +
    '</div>');
}]);

angular.module('template/accordion/wi-accordion.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/accordion/wi-accordion.html',
    '<div class="wi-accordion" ng-transclude></div>');
}]);

angular.module('template/button/wi-button.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/button/wi-button.html',
    '<button class="wi-btn" ng-style="{width: btnOptions.width, height: btnOptions.height}">\n' +
    '    <img ng-if="btnOptions.iconl" class="wi-btn-icon" ng-src="{{btnOptions.iconl}}" />\n' +
    '    {{btnOptions.label}}\n' +
    '    <img ng-if="btnOptions.iconr" class="wi-btn-icon" ng-src="{{btnOptions.iconr}}" />\n' +
    '</button>');
}]);

angular.module('template/camerascanner/camerascannerTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/camerascanner/camerascannerTemplate.html',
    '<div>\n' +
    '    <div>\n' +
    '        <a href="javascript:void(0);" class="wi-btn icon-picture" ng-click="open()">\n' +
    '            <span ng-transclude></span>\n' +
    '        </a>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="wi-camerascanner wi-camerascanner-hide">\n' +
    '\n' +
    '        <div class="wi-camerascanner-main wi-clearf" style="width: 792px;height: 592px;">\n' +
    '            <div class="wi-dialog-head">\n' +
    '                拍照上传\n' +
    '                <span style="margin-left: 130px; visibility: hidden;" class="wi-camerascanner-head-select">\n' +
    '                    请选择视频设备:\n' +
    '                </span>\n' +
    '                <span class="wi-dialog-close icon-remove" ng-click="close()"></span>\n' +
    '            </div>\n' +
    '            <div class="wi-camerascanner-opt">\n' +
    '                <object id="XwebcamXobjectX"\n' +
    '                        type="application/x-shockwave-flash"\n' +
    '                        data="demo/camerascanner/docs/jscam.swf"\n' +
    '                        width="500"\n' +
    '                        height="500">\n' +
    '                    <param name="movie" value="demo/camerascanner/docs/jscam.swf" />\n' +
    '                    <param name="FlashVars" value="cw=1200&ch=1600&vw=375&vh=500" />\n' +
    '                    <param name="allowScriptAccess" value="always" />\n' +
    '                    <param name="bgcolor" value="#FFFFCC" />\n' +
    '                    <!--<param name="wmode" value="Opaque">-->\n' +
    '                </object>\n' +
    '                <div class="wi-camerascanner-toolbar">\n' +
    '                    <a ng-click="rotate(-90)" href="javascript:void(0);" class="wi-camerascanner-left" title="逆时针旋转"></a>\n' +
    '                    <a ng-click="rotate(90)" href="javascript:void(0);" class="wi-camerascanner-right" title="顺时针旋转"></a>\n' +
    '                    <a ng-click="resetCut()" href="javascript:void(0);" class="wi-camerascanner-reset" title="重新裁剪"></a>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="wi-camerascanner-list" style="width: 260px; height:465px;">\n' +
    '            </div>\n' +
    '\n' +
    '            <div class="wi-camerascanner-qulitity">\n' +
    '                图片质量:\n' +
    '                <select ng-model="camResolution" ng-change="resolution()">\n' +
    '                    <option value ="1200*1600">1200*1600(约1.92MB)</option>\n' +
    '                    <option value ="960*1280">960*1280(约1.23MB)</option>\n' +
    '                    <option value ="600*800">600*800(约480KB)</option>\n' +
    '                </select>\n' +
    '            </div>\n' +
    '            <div class="wi-camerascanner-btns">\n' +
    '                <a class="wi-camerascanner-btn" href="javascript:void(0);">拍照</a>\n' +
    '                <a class="wi-btn" href="javascript:void(0);" ng-click="upload()">上传</a>\n' +
    '            </div>\n' +
    '\n' +
    '        </div>\n' +
    '\n' +
    '        <wi-imageview width="800" height="600" adaptive="true" imagedata="imagedata" previous="previous()" next="next()" close="viewClose()"></wi-imageview>\n' +
    '\n' +
    '        <script type="text/ng-template" id="cameraScannerConfirm">\n' +
    '            <div>\n' +
    '                <div style="margin: 20px 30px;">\n' +
    '                    文件名：<input ng-model="filename"/><br>\n' +
    '                </div>\n' +
    '                <div class="wi-alert-toolbar">\n' +
    '                    <button class="wi-btn"  ng-click="closeThisDialog()">取消</button>\n' +
    '                    <button class="wi-btn"  ng-click="confirm(filename)">确认</button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </script>\n' +
    '\n' +
    '    </div>\n' +
    '\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/carousel/carousel.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/carousel/carousel.html',
    '<div ng-mouseenter="pause()" ng-mouseleave="play()" class="wi-carousel" ng-swipe-right="prev()" ng-swipe-left="next()">\n' +
    '    <ul class="wi-carousel-ul" ng-show="slides.length > 1">\n' +
    '        <li ng-repeat="slide in slides track by $index" ng-class="{\'wi-carousel-active\': isActive(slide)}" ng-click="select(slide)"></li>\n' +
    '    </ul>\n' +
    '    <div class="wi-carousel-inner" ng-transclude></div>\n' +
    '    <a class="wi-carousel-ctrl wi-carousel-ctrl-left" ng-click="prev()" ng-show="slides.length > 1"><span class="icon-chevron-left"></span></a>\n' +
    '    <a class="wi-carousel-ctrl wi-carousel-ctrl-right" ng-click="next()" ng-show="slides.length > 1"><span class="icon-chevron-right"></span></a>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/carousel/slide.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/carousel/slide.html',
    '<div ng-class="{\n' +
    '    \'wi-slide-active\': leaving || (active && !entering),\n' +
    '    \'wi-slide-prev\': (next || active) && direction==\'prev\',\n' +
    '    \'wi-slide-next\': (next || active) && direction==\'next\',\n' +
    '    \'wi-slide-right\': direction==\'prev\',\n' +
    '    \'wi-slide-left\': direction==\'next\'\n' +
    '  }" class="wi-slide" ng-transclude></div>\n' +
    '');
}]);

angular.module('template/combobox/comboboxTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/combobox/comboboxTemplate.html',
    '<div class="wi-popup wi-combobox"\n' +
    '     ng-keydown="vm.keydownHandler($event)"\n' +
    '     ng-click="vm.clickHandler($event)"\n' +
    '     is-open="vm.isopen" ng-disabled="vm.enable">\n' +
    '    <div class="wi-popup-menu wi-combobox-menu">\n' +
    '        <ul>\n' +
    '            <li ng-repeat="data in vm.dataprovider"\n' +
    '                ng-class="{\'wi-combobox-selected\':($index===vm.selectedindex&&!data[\'isGroup\']) || data[\'_checked\'],\'wi-combobox-option\':!data[\'isGroup\']}"\n' +
    '                ng-click="vm.itemClickHandler(data,$event)"\n' +
    '                ng-style="{\'padding-left\': (groupfield&&!data[\'isGroup\']?15 : 5)+\'px\',\'font-weight\':data[\'isGroup\']?\'bold\':\'normal\'}">\n' +
    '                <input ng-if="multiselect" class="wi-checkbox" type="checkbox" ng-click="checkAll()" ng-checked="data[\'_checked\']" />\n' +
    '                {{data[vm.labelfield]}}\n' +
    '            </li>\n' +
    '        </ul>\n' +
    '    </div>\n' +
    '    <input type="text" ng-model="vm._text" ng-change="vm.inputChange()" ng-disabled="vm.enable"/>\n' +
    '    <span class="icon-chevron-down"></span>\n' +
    '</div>');
}]);

angular.module('template/datagrid/datagridTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/datagrid/datagridTemplate.html',
    '<div class="wi-datagrid" ng-class="{\'wi-datagrid-wordWrap\':!_wordwrap}">\n' +
    '    <div class="wi-datagrid-ltop" >\n' +
    '        <table ng-if="lockcolumns">\n' +
    '            <colgroup>\n' +
    '                <col ng-if="showno">\n' +
    '                <col ng-if="multiselect">\n' +
    '                <col ng-repeat="columnItem in columnDefs track by $index" ng-if="$index<lockcolumns"\n' +
    '                     width="{{columnItem.width+\'px\'}}">\n' +
    '            </colgroup>\n' +
    '            <tbody>\n' +
    '            <tr ng-repeat="head in headarray track by $index">\n' +
    '                <td ng-if="$index==0 && showno" class="wi-datagrid-keycol" rowspan="{{::maxLevel}}"></td>\n' +
    '                <td ng-if="$index==0 && multiselect" class="wi-datagrid-keycol" rowspan="{{::maxLevel}}">\n' +
    '                    <input type="checkbox" class="wi-checkbox" ng-click="checkAll()" ng-checked="isCheckAll"  />\n' +
    '                </td>\n' +
    '                <td ng-repeat="child in head track by $index" ng-if="child.colindex<lockcolumns" colspan="{{::child.colspan}}" rowspan="{{::child.rowspan}}" ng-click="sort(child.colindex)" ng-mousemove="headMousemove($event)" ng-mouseleave="headMouseleave()" ng-mousedown="startColumnDrag($event,child,true)">\n' +
    '                    <div class="wi-datagrid-headdiv">\n' +
    '                        <div ng-if="child.headrenderer" ng-include src="child.headrenderer" class="wi-display-inlineb"></div>\n' +
    '                        <span ng-if="!child.headrenderer">{{child.text}}</span>\n' +
    '                        <span ng-if="sortcolumn.datafield==child.datafield" class="wi-datagrid-caret{{sortcolumn.direction}}"></span>\n' +
    '                    </div>\n' +
    '                </td>\n' +
    '                <td>&nbsp;</td><!-- 防止合并行高度自适应 -->\n' +
    '            </tr>\n' +
    '            </tbody>\n' +
    '        </table>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="wi-datagrid-rtop">\n' +
    '        <table ng-style="{width: (rightW + 17) + \'px\'}">\n' +
    '            <colgroup>\n' +
    '                <col ng-if="showno && !lockcolumns">\n' +
    '                <col ng-if="multiselect && !lockcolumns">\n' +
    '                <col ng-repeat="columnItem in columnDefs track by $index" ng-if="!lockcolumns||$index>=lockcolumns"\n' +
    '                     width="{{columnItem.width+\'px\'}}">\n' +
    '                <col width="17px">\n' +
    '            </colgroup>\n' +
    '            <tbody>\n' +
    '            <tr ng-repeat="head in headarray track by $index">\n' +
    '                <td ng-if="$index==0 && showno && !lockcolumns" class="wi-datagrid-keycol" rowspan="{{::maxLevel}}"></td>\n' +
    '                <td ng-if="$index==0 && multiselect && !lockcolumns" class="wi-datagrid-keycol" rowspan="{{::maxLevel}}">\n' +
    '                    <input type="checkbox" class="wi-checkbox" ng-click="checkAll()" ng-checked="isCheckAll" />\n' +
    '                </td>\n' +
    '                <td ng-repeat="child in head track by $index" ng-if="!lockcolumns||child.colindex>=lockcolumns" colspan="{{::child.colspan}}" rowspan="{{::child.rowspan}}" ng-click="sort(child.colindex)" ng-mousemove="headMousemove($event)" ng-mouseleave="headMouseleave()" ng-mousedown="startColumnDrag($event,child,false)">\n' +
    '                    <div class="wi-datagrid-headdiv">\n' +
    '                        <div ng-if="child.headrenderer" ng-include src="child.headrenderer" class="wi-display-inlineb"></div>\n' +
    '                        <span ng-if="!child.headrenderer">{{child.text}}</span>\n' +
    '                        <span ng-if="sortcolumn.datafield==child.datafield" class="wi-datagrid-caret{{sortcolumn.direction}}"></span>\n' +
    '                    </div>\n' +
    '                </td>\n' +
    '                <td style="border-color: transparent; cursor: default;">&nbsp;</td><!-- 防止合并行高度自适应 -->\n' +
    '            </tr>\n' +
    '            </tbody>\n' +
    '        </table>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="wi-datagrid-lbottom">\n' +
    '        <table id="lBottomTable">\n' +
    '            <col ng-if="showno">\n' +
    '            <col ng-if="multiselect">\n' +
    '            <col ng-repeat="columnItem in columnDefs track by $index" ng-if="$index<lockcolumns"\n' +
    '                 width="{{columnItem.width+\'px\'}}">\n' +
    '            <tr id="lBottomTR{{::$index}}" ng-style="{\'background-color\':pdata.__rowcolor,\'height\':_rowheight+\'px\'}" ng-class="{\'wi-datagrid-row-selected\':pdata.__ischecked}">\n' +
    '\n' +
    '            </tr>\n' +
    '            <tr class="wi-datagrid-cover"><td></td></tr>\n' +
    '        </table>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="wi-datagrid-rbottom">\n' +
    '        <table id="rBottomTable" ng-style="{width: rightW + \'px\'}">\n' +
    '            <col ng-if="showno && !lockcolumns">\n' +
    '            <col ng-if="multiselect && !lockcolumns">\n' +
    '            <col ng-repeat="columnItem in columnDefs track by $index" ng-if="!lockcolumns||$index>=lockcolumns"\n' +
    '                 width="{{columnItem.width+\'px\'}}" >\n' +
    '            <tr id="rBottomTR{{::$index}}" ng-style="{\'background-color\':pdata.__rowcolor,\'height\':_rowheight+\'px\'}" ng-class="{\'wi-datagrid-row-selected\':pdata.__ischecked}">\n' +
    '\n' +
    '            </tr>\n' +
    '        </table>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="wi-datagrid-pagebar">\n' +
    '        <div class="wi-datagrid-page-left" ng-if="pagemode!==\'none\'">\n' +
    '            <span>\n' +
    '                每页\n' +
    '                <select id="pageSizeSel" ng-model="$parent.selectedPageSize"  ng-options="op for op in pageselect||[20,30,40,50,60]">\n' +
    '                </select>\n' +
    '                条&nbsp;,&nbsp;共{{dataCount}}条\n' +
    '            </span>\n' +
    '            <span>\n' +
    '                <a href="#" ng-click="pageNum===1?null:doPage(1)" title="首页"><span class="icon-step-backward"></span></a>\n' +
    '                <a href="#" ng-click="pageNum===1?null:doPage(pageNum-1)" title="上一页"><span class="icon-backward"></span></a>\n' +
    '                &nbsp;&nbsp;{{pageNum}}/{{pageCount}}&nbsp;&nbsp;\n' +
    '                <a href="#" ng-click="pageNum===pageCount?null:doPage(pageNum+1)" title="下一页"><span class="icon-forward"></span></a>\n' +
    '                <a href="#" ng-click="pageNum===pageCount?null:doPage(pageCount)" title="尾页"><span class="icon-step-forward"></span></a>\n' +
    '                <input type="text" class="wi-datagrid-page-num" onclick="javascript:this.select()" ng-keydown="gotoPage($event)" />\n' +
    '            </span>\n' +
    '        </div>\n' +
    '        <div class="wi-datagrid-page-right">\n' +
    '            <span ng-if="pagebarrenderer" ng-include src="pagebarrenderer"/>\n' +
    '            <span ng-if="!(showrefresh==\'false\')">\n' +
    '                <a href="#" ng-click="dorefresh()"><span class="icon-refresh"></span> 刷新</a>\n' +
    '            </span>\n' +
    '            <span ng-if="showexcel">\n' +
    '                <a href="#" download="导出文件.xls" ng-click="export2excel($event)"><span class="icon-share-alt"></span> 导出excel</a>\n' +
    '            </span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '\n' +
    '    <div class="wi-datagrid-followbar" style=\'display: none; left: 0;\'></div>\n' +
    '\n' +
    '    <div class=\'wi-datagrid-maskdiv\' style=\'visibility: hidden\'></div>\n' +
    '    <div id="ngTranscludeDiv" ng-transclude></div>\n' +
    '</div>');
}]);

angular.module('template/dividedbox/wi-dividedbox-group.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/dividedbox/wi-dividedbox-group.html',
    '<div class="wi-dividedbox-group"\n' +
    '     ng-style="{ width:dividedboxG.type==\'h\'?\'calc(\'+ dividedboxG.size +\' + \'+ dividedboxG.resize +\'px)\':\'\',\n' +
    '        height:dividedboxG.type==\'v\'?\'calc(\'+dividedboxG.size+\' + \'+dividedboxG.resize+\'px)\':\'\'}">\n' +
    '    <div class="wi-dividedbox-head wi-clearf" ng-class="{\'wi-dividedbox-colled\':dividedboxG.collapsed}">\n' +
    '        <span class="wi-dividedbox-title">\n' +
    '            <img class="wi-dividedbox-icon" ng-if="dividedboxG.icon" ng-src="{{dividedboxG.icon}}" />\n' +
    '            {{dividedboxG.title}}\n' +
    '        </span>\n' +
    '        <div ng-class="\'wi-display-none wi-dividedbox-collctrl-\'+dividedboxG.collapseto" ng-click="doCollapse()"></div>\n' +
    '    </div>\n' +
    '    <div class="wi-dividedbox-cont" ng-transclude></div>\n' +
    '    <div class="wi-dividedbox-bar" ng-mousedown="startResize()"></div>\n' +
    '</div>');
}]);

angular.module('template/dividedbox/wi-dividedbox.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/dividedbox/wi-dividedbox.html',
    '<div class="wi-dividedbox wi-clearf"\n' +
    '     ng-class="{\'wi-unselectable\':resizeConf.resizing,\'wi-dividedbox-resizing\':resizeConf.resizing,\'wi-dividedbox-resizable\': resizeConf.resizable}" ng-transclude>\n' +
    '</div>');
}]);

angular.module('template/fileupload/wi-fileupload.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/fileupload/wi-fileupload.html',
    '<ul class="wi-fileupload" ng-style="{display: files.length>0 && !fileULOptions.modal ? \'\' : \'none\'}">\n' +
    '    <li ng-repeat="file in files track by file.id">\n' +
    '        <span class="wi-fileupload-info" ng-style="{cursor: file.stat==3 ? \'pointer\': \'\'}" ng-click="getResponse(file)">\n' +
    '            <span class="wi-fileupload-icon icon-{{file.type}}"></span>\n' +
    '            {{file.name}}\n' +
    '            <span class="wi-fileupload-tip">({{file.size}})</span>\n' +
    '        </span>\n' +
    '        <span class="wi-fileupload-completed" ng-style="{display: file.stat==3 ? \'\' : \'none\'}">完成</span>\n' +
    '        <span class="wi-fileupload-queued" ng-style="{display: file.stat==1 ? \'\' : \'none\'}">等待上传</span>\n' +
    '        <!--<span class="wi-fileupload-uploading" ng-style="{display: file.stat==2 ? \'\' : \'none\'}">\n' +
    '            <span class="wi-fileupload-bar">\n' +
    '                <div class="wi-fileupload-progress" ng-style="{\'width\': file.percent + \'%\'}"></div>\n' +
    '            </span>\n' +
    '            {{file.percent}}%\n' +
    '        </span>-->\n' +
    '        <wi-progress ng-style="{display: file.stat==2 ? \'\' : \'none\'}" label="file.progressLabel" value="file.percent"></wi-progress>\n' +
    '        <span class="wi-fileupload-error" ng-style="{display: file.stat==4 ? \'\' : \'none\'}">上传失败</span>\n' +
    '        <span class="wi-fileupload-del" ng-click="removeFile(file)">删除</span>\n' +
    '    </li>\n' +
    '</ul>');
}]);

angular.module('template/imageview/imageviewTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/imageview/imageviewTemplate.html',
    '<div class="wi-imageview" ng-style="{\'display\':isopen?\'block\':\'none\'}">\n' +
    '    <div class="wi-imageview-picbox" ng-style="{\'top\':top,\'left\':left}">\n' +
    '        <div class="wi-imageview-pic" ng-style="{\'width\':+_width+\'px\',\'height\':+_height+\'px\'}"  ng-class="img_exclass" ng-mouseenter="mouseenter()" ng-mouseleave="mouseleave()" ng-mousedown="mousedown($event)"></div>\n' +
    '        <div class="wi-imageview-ctrl wi-imageview-ctrl-prev" ng-click="previous()" title="上一张" ng-if="_show_previous"></div>\n' +
    '        <div class="wi-imageview-ctrl wi-imageview-ctrl-next" ng-click="next()" title="下一张" ng-if="_show_next"></div>\n' +
    '        <div class="wi-imageview-toolbar wi-unselectable">\n' +
    '            <a class="wi-imageview-zoomout" ng-click="zoomout()" title="放大"></a>\n' +
    '            <a class="wi-imageview-zoomin" ng-click="zoomin()" title="缩小"></a>\n' +
    '            <a class="wi-imageview-reset" ng-click="reset()" title="重置"></a>\n' +
    '            <a class="wi-imageview-toleft" ng-click="toright()" title="逆时针旋转"></a>\n' +
    '            <a class="wi-imageview-toright" ng-click="toleft()" title="顺时针旋转"></a>\n' +
    '            <a class="wi-imageview-save" style="text-decoration:none;" href="{{img_src}}" title="本地保存" ng-if="_show_save"></a>\n' +
    '            <a class="wi-imageview-full" ng-click="full()" title="全屏" ng-if="!isfull"></a>\n' +
    '            <a class="wi-imageview-origin" ng-click="origin()" title="退出全屏" ng-if="isfull"></a>\n' +
    '        </div>\n' +
    '        <div class="wi-imageview-close" ng-click="close()"></div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '\n' +
    '\n' +
    '');
}]);

angular.module('template/menu/wi-menu.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/menu/wi-menu.html',
    '<div class="wi-menu" ng-class="{\'wi-menu-open\': isOpen, \'wi-menu-root\': menutype != \'sub\'}">\n' +
    '    <div class="wi-menu-toolbar wi-clearf" ng-style="{display: conf.filterable || groupsBackward.length || groupsForward.length ? \'block\':\'none\'}">\n' +
    '        <span class="wi-menu-backward" ng-class="{\'wi-menu-page\': groupsBackward.length}" ng-click="backwardClick($event)">\n' +
    '            <span class="icon-arrow-left"></span></span>\n' +
    '        <input type="text" class="wi-menu-filter" ng-style="{display: conf.filterable ? \'inline-block\' : \'none\'}" ng-model="filterval" onclick="event.stopPropagation()" placeholder="检索关键字" />\n' +
    '        <span class="wi-menu-forward" ng-class="{\'wi-menu-page\': groupsForward.length}" ng-click="forwardClick($event)">\n' +
    '            <span class="icon-arrow-right"></span></span>\n' +
    '    </div>\n' +
    '    <ul ng-repeat="data in datagroups">\n' +
    '        <li ng-repeat="item in data"\n' +
    '            ng-class="{\'wi-menu-children\': item.children, \'wi-menu-disabled\': item.enabled == false, \'wi-menu-highlight\': item.highlight, \'wi-menu-item-open\': item.childopen}"\n' +
    '            ng-mouseenter="mouseenter(item)" ng-mouseleave="mouseleave(item)" ng-click="clickLi($event, item)">\n' +
    '            <img ng-if="item.icon" class="wi-menu-icon" ng-src="{{item.icon}}" />\n' +
    '            <span class="wi-menu-content">{{item.label}}</span>\n' +
    '            <wi-menu ng-if="item.children"\n' +
    '                     adaptable="true"\n' +
    '                     position="right-top"\n' +
    '                     filterable="{{item.filterable}}"\n' +
    '                     dataprovider="item.children"\n' +
    '                     is-open="{{item.childopen}}">\n' +
    '            </wi-menu>\n' +
    '        </li>\n' +
    '    </ul>\n' +
    '</div>');
}]);

angular.module('template/panel/wi-panel.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/panel/wi-panel.html',
    '<div class="wi-panel" ng-class="{\'wi-panel-close\': !isOpen}"\n' +
    '     ng-style="{\'width\': width}">\n' +
    '    <div class="wi-panel-head" ng-click="collbyHead()">\n' +
    '        <div wi-panel-transclude="headingEl">\n' +
    '            <img ng-if="headicon" class="wi-panel-icon" ng-src="{{headicon}}" />\n' +
    '            {{heading}}\n' +
    '        </div>\n' +
    '        <div ng-if="headTools.visible" class="wi-panel-tools"><!--span首尾相连，避免换行产生空格-->\n' +
    '            <span ng-repeat="tool in headTools.custom track by tool.name"\n' +
    '                  ng-click="tool.opt($event)" class="{{tool.cls}}"></span\n' +
    '            ><span ng-if="headTools[\'collapse\']"\n' +
    '                  ng-click="collbyTool($event)"\n' +
    '                  ng-class="{\'icon-chevron-down\':collapsed, \'icon-chevron-up\':!collapsed}"></span\n' +
    '            ><span ng-if="headTools[\'close\']" class="icon-remove"\n' +
    '                  ng-click="closebyTool($event)"></span>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="wi-panel-box" wi-collapse="collapsed" ng-transclude></div>\n' +
    '</div>');
}]);

angular.module('template/popupbutton/popupbuttonTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/popupbutton/popupbuttonTemplate.html',
    '<div class="wi-popup wi-popupbutton"\n' +
    '     is-open="isopen">\n' +
    '    <div class="wi-popup-menu wi-popupbutton-menu" ng-transclude></div>\n' +
    '    <input class="wi-btn wi-popupbutton-content" type="button" value="{{label}}"/>\n' +
    '    <button class="wi-btn wi-popupbutton-arrow"><span class="icon-chevron-down"></span></button>\n' +
    '</div>');
}]);

angular.module('template/progress/wi-progress.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/progress/wi-progress.html',
    '<div class="wi-progress">\n' +
    '    <span class="wi-progress-bar" ng-style="{\'width\': width}">\n' +
    '        <div class="wi-progress-value" ng-style="{\'width\': percent + \'%\'}"></div>\n' +
    '        <div class="wi-progress-remain"></div>\n' +
    '    </span>\n' +
    '</div>');
}]);

angular.module('template/searchinput/wi-searchinput.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/searchinput/wi-searchinput.html',
    '<span class="wi-searchinput">\n' +
    '    <input type="text" ng-model="value" placeholder="{{tips}}" />\n' +
    '    <span class="icon-search" ng-click="search()"></span>\n' +
    '</span>\n' +
    '');
}]);

angular.module('template/tebset/tabsetTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/tebset/tabsetTemplate.html',
    '<div ng-style="{\'width\': conf.width,\'height\': conf.height}" class="wi-tabset"\n' +
    '     ng-class="{\'h\':\'wi-tabset-h\',\'v\':\'wi-tabset-v wi-clearf\',\'vh\':\'wi-tabset-vh wi-clearf\'}[conf.vertical?conf.height?\'vh\':\'v\':\'h\']">\n' +
    '    <div class="wi-tabhead"\n' +
    '         ng-style="{\'height\':!conf.vertical?conf.tabheadsize+\'px\':\'\',\'line-height\': !conf.vertical?conf.tabheadsize+\'px\':\'\',\n' +
    '            \'width\': conf.vertical?conf.tabheadsize+\'px\':\'\'}">\n' +
    '        <span ng-if="scrollable" ng-click="backward()" class="wi-unselectable wi-tabctrl-ver icon-chevron-up"></span><!-- 横向超出才显示 -->\n' +
    '        <span ng-if="scrollable" ng-click="forward()" class="wi-unselectable wi-tabctrl-ver icon-chevron-down"></span>\n' +
    '        <span ng-if="scrollable" ng-click="backward()" class="wi-unselectable wi-tabctrl-hor icon-chevron-left"></span><!-- 纵向超出才显示 -->\n' +
    '        <span ng-if="scrollable" ng-click="forward()" class="wi-unselectable wi-tabctrl-hor icon-chevron-right"></span>\n' +
    '        <div class="wi-tabstage">\n' +
    '            <ul ng-class="{true:\'wi-tabul-ver\',false:\'wi-tabul-hor wi-clearf\'}[conf.vertical]"\n' +
    '                ng-style="ulStyle" style="overflow: visible;"\n' +
    '                ng-transclude></ul>\n' +
    '            <wi-menu ng-show="conf.enablerightmenu" wi-right-menu dataprovider="menudata" onselect="rightmenuselect"></wi-menu>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div class="wi-tabcont"\n' +
    '         ng-style="{\'height\':(conf.height&&!conf.vertical)?\'calc(100% - \'+conf.tabheadsize+\'px )\':\'\',\'margin-left\':conf.vertical?conf.tabheadsize+\'px\':\'\'}">\n' +
    '        <div ng-repeat="tab in tabs"\n' +
    '             class="wi-tabpane"\n' +
    '             ng-show="tab.active"\n' +
    '             ng-style = "{\'height\':(conf.height||conf.vertical)?\'100%\':\'\'}"\n' +
    '             wi-tab-content-transclude="tab">\n' +
    '            <div ng-if="tab.data.src"  ng-include="tab.data.src"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/tebset/tabTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/tebset/tabTemplate.html',
    '<li class="wi-tab"\n' +
    '    ng-class="{\'wi-tab-active\': active, \'wi-tab-disabled\': disable, \'wi-tab-hasclose\': _closeable}"\n' +
    '    ng-click="select()">\n' +
    '    <span class="icon-remove" ng-click="close($event)"></span>\n' +
    '    <div class="wi-tabhead-cont" wi-tab-heading-transclude>\n' +
    '        <img class="wi-tab-icon" ng-src="{{data.icon}}" ng-if="data.icon"/>{{heading}}\n' +
    '    </div>\n' +
    '</li>');
}]);

angular.module('template/tilelist/tilelistTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/tilelist/tilelistTemplate.html',
    '<div class="wi-titlelist">\n' +
    '    <table class="wi-titlelist-table" cellspacing="0" cellpadding="0" ng-style="{\'width\': tableW,\'height\': tableH}">\n' +
    '        <tr ng-repeat="rowItem in dataTable">\n' +
    '            <td class="wi-titlelist-td" ng-repeat="data in rowItem track by $index" ng-style="{\'width\': colW,\'height\': rowH}">\n' +
    '                <div class="wi-titlelist-cont" ng-if="itemrender" ng-include src="itemrender"></div>\n' +
    '            </td>\n' +
    '        </tr>\n' +
    '    </table>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/tooltip/tooltip-html-unsafe-popup.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/tooltip/tooltip-html-unsafe-popup.html',
    '<div class="wi-tooltip {{\'wi-tooltip-\' + placement}}" ng-class="{ \'wi-tooltip-in\': isOpen() }">\n' +
    '  <div class="tooltip-inner" bind-html-unsafe="content"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/tooltip/tooltip-popup.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/tooltip/tooltip-popup.html',
    '<div class="wi-tooltip {{\'wi-tooltip-\' + placement}}" ng-class="{ \'wi-tooltip-in\': isOpen(),\'wi-fade\': animation() }">\n' +
    '  <div class="tooltip-inner" ng-bind="content"></div>\n' +
    '</div>\n' +
    '');
}]);

angular.module('template/tree/treeTemplate.html', []).run(['$templateCache', function($templateCache) {
  $templateCache.put('template/tree/treeTemplate.html',
    '<ul class="wi-tree">\n' +
    '    <li ng-repeat="data in vm._data | orderBy : conf.orderby">\n' +
    '        <div class="wi-tree-item" ng-class="{\'wi-tree-current\':data[\'__current\']}"\n' +
    '             ng-style="{\'padding-left\': 16*(data[\'__level\']+(data[\'children\']?0:1))+\'px\'}"\n' +
    '             ng-click="handler.clickRow(data)"\n' +
    '             ng-mouseenter="handler.toggleHover(data)" ng-mouseleave="handler.toggleHover(data)">\n' +
    '            <span class="icon-{{data[\'__closed\']?\'plus\':\'minus\'}}"\n' +
    '                  ng-if="!!data[\'children\']"\n' +
    '                  ng-click="handler.toggleNode($event,data)"></span>\n' +
    '            <!-- 选中或半选 -->\n' +
    '            <input type="checkbox" class="wi-checkbox"\n' +
    '                   ng-class="{\'wi-tree-transparent-50\':data[\'__semi\']}"\n' +
    '                   ng-if="conf.multiselect"\n' +
    '                   ng-checked="data[\'__selected\']||data[\'__semi\']" />\n' +
    '            <span class="wi-tree-loading" ng-if="data[\'__loading\']"></span>\n' +
    '            <!-- 优先级：数据项中 cls，根节点定义的 pCls 或 cCls，默认图标 -->\n' +
    '            <span class="wi-tree-icon {{data[\'cls\']||(data[\'children\']?\n' +
    '                conf.pCls||\'icon-folder-\'+(data[\'__closed\']?\'close\':\'open\'):\n' +
    '                conf.cCls)}}" ng-if="!data[\'__loading\']"></span>\n' +
    '            <span>{{data[conf.labelfield]}}</span>\n' +
    '            <span ng-if="conf.itemrenderer"\n' +
    '                  ng-include src="conf.itemrenderer"></span>\n' +
    '        </div>\n' +
    '        <wi-tree ng-if="data[\'children\'] && !data[\'__closed\']"\n' +
    '                 dataProvider="data[\'children\']">\n' +
    '        </wi-tree>\n' +
    '    </li>\n' +
    '</ul>');
}]);
