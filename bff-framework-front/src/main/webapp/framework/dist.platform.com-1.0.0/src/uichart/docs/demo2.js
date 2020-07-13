var PieChartController = ['$scope',function($scope) {
	 $scope.options={
        legend: { display: true},
    }
    $scope.labels2 = ["收件", "退件", "已办"];
    $scope.data2 = [10000, 3000, 7000];
}];
angular.module('dist.ui').controller('PieChartController',PieChartController);