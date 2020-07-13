var WiAce4ButtonController=['$scope',function ($scope) {
	//the loading button
	$scope.loading = false;
	$scope.toggleLoading = function() {
		if($scope.loading) return;
		
		$scope.loading = true;
		$timeout(function() {
			$scope.loading = false;
		}, 2000);
	};

	
	//pagination variables
	$scope.totalItems = 45;
	$scope.currentPage = 1;
}];
angular.module('dist.ui').controller('WiAce4ButtonController',WiAce4ButtonController);