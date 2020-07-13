angular.module('dist.ui.navbar', ['ace.directives','ui.bootstrap'])
.directive('wiNavbar', ['$rootScope', '$state', function($rootScope, $state) {
	return {
		restrict: 'EA',
		replace: false,
		scope: {
			 navData:"=?",
			 configData:"=?",
		},
		templateUrl: function(ele,attr){
			return 'framework/dist.platform.com-1.0.0/src/navbar/template/navbar/wi-navbar.html';
		},
		//template:'<div>{{vm.tempValue}}</div>',
		link: function ($scope, element, attributes) {
			
			
		}	
}
}])