/**
 * Created by arthur on 2017/6/20.
 */
var app = angular.module('AceApp');
app.directive('resize', function ($window, $document) {
    return function (scope, element) {
        var w = angular.element($window);
        scope.getWindowDimensions = function () {
            return { 'h': w[0].document.body.clientHeight, 'w': w[0].document.body.clientWidth };
        };
        scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
            // scope.windowHeight = newValue.h;
            // scope.windowWidth = newValue.w;

            scope.style = function () {
                return {
                    'height': (newValue.h - 45) + 'px'
                    // , 'width': (newValue.w - 100) + 'px'
                };
            };

        }, true);

        w.bind('resize', function () {
            scope.$apply();
        });
    }
});