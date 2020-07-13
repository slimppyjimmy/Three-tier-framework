/**
 * @arthur 李其云
 * @version 1.0
 * @created 2017.6.23
 * 注意：使用autoPadding指令的div的parent div上，不能有指定宽度和高度的class或style，因为autoPadding会写入域高度、宽度相关的style，
 * 从而使得原来的style失效。如果碰到这种情况（如parent div上设定了class col-md-3），那么应当在当前div外再包装一层div。
 */
var app = angular.module('AceApp');
app.directive('autoPadding', ['$timeout', function ($timeout) {
    return function (scope, element) {
        //监控高度是否有变化
        scope.$watch(function () {
            return element.css('height');
        }, function (newValue, oldValue) {
            //使用timeout以保证在dom刷新后进行
            setTimeout(function () {
                //增加将元素变为绝对定位的样式
                element.addClass('fix-top');
                //增加将parent div样式
                element.parent().addClass('auto-padding-top');
                //将parent div的padding-top设置为当前元素的高度，从而使得下一个div的滚动条能够自动适应parent的高度
                element.parent().css('padding-top', element.css('height'));
            }, 0)
        });
    }
}]);
