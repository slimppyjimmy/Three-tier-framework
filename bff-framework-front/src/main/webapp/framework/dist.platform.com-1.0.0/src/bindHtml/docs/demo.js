var bindHtmlCtrl = ['$scope',function($scope){
    $scope.elemStr = '<input type="button" class="wi-btn" ng-click="do1()" value="我是 html 代码段生成的按钮">';
}];
angular.module('dist.ui').controller('bindHtmlCtrl',bindHtmlCtrl);