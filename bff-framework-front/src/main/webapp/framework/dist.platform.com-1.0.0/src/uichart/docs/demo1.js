var HistogramController = ['$scope',function($scope) {
    $scope.series = ['收件','退件','已办'];
    $scope.labels = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
    $scope.options={
        legend: { display: true},
    }
    $scope.data = [
        [500, 600, 700, 800, 400, 580, 4000],
        [100, 20, 50, 150, 50, 80, 2100],
        [400, 480, 650, 650, 350, 500, 1900]
    ];
}];
angular.module('dist.ui').controller('HistogramController',HistogramController);