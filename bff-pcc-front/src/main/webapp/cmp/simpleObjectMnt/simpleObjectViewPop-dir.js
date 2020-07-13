var app = angular.module('AceApp');
app.directive("simpleObjectViewPop", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            param: '='
            , preparedata: '='
            , newdata: '='
            , cancel: "&"
        }
        , templateUrl: 'cmp/simpleObjectMnt/simpleObjectViewPop-tpl.html'
        , controller: function ($scope) {
            console.log(">>>simpleObjectViewPop enter:scope=", $scope, $scope.newdata);
            console.log("<<<simpleObjectViewPop return");
        }
    }
});