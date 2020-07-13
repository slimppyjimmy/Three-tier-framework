var SearchinputDemoCtrl = ['$scope',function($scope) {
    var ctrl = this;
    ctrl.value = '';
    $scope.searchFun = function(selectItem){
        ctrl.value = selectItem;
    }
}];
angular.module('dist.ui').controller('SearchinputDemoCtrl',SearchinputDemoCtrl);