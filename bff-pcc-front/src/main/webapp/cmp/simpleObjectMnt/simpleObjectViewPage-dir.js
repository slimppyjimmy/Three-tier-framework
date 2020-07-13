var app = angular.module('AceApp');
app.directive("simpleObjectViewPage", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
            , preparedata: '='
            , newdata: '=data'
            , todo: '&'
            , refresh: '&'
        }
        , templateUrl: 'cmp/simpleObjectMnt/simpleObjectViewPage-tpl.html'
        , controller: function ($scope) {
            console.log(">>>simpleObjectViewPage scope=", $scope);
            console.log("<<<simpleObjectViewPage return");
        }
    }
});