var app = angular.module('AceApp');
app.directive("simpleObjectModifyPage", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
            , preparedata: '='
            , newdata: '='
            , todo: '&'
            , refresh: '&'
        }
        , templateUrl: 'cmp/simpleObjectMnt/simpleObjectModifyPage-tpl.html'
        , controller: function ($scope) {
            console.log(">>>simpleObjectModifyPage scope=", $scope);
            var vm = $scope;
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
            console.log("<<<simpleObjectModifyPage return");
        }
    }
});