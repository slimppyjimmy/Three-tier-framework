var AccordionDemoIsOpenCtrl=['$scope',function ($scope) {
    $scope.status = {
        isFirstOpen: true,
        isFirstDisabled: false
    };
}];
angular.module('dist.ui').controller('AccordionDemoIsOpenCtrl',AccordionDemoIsOpenCtrl);