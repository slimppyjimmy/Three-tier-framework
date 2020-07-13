var PanelDemoCtrl = ['$scope', function($scope) {
    $scope.isopen = true;
    $scope.isopen1 = true;
    $scope.toggle = function(){
        $scope.isopen = !$scope.isopen;
    };
}];
angular.module('dist.ui').controller('PanelDemoCtrl',PanelDemoCtrl);