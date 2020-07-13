var app = angular.module('AceApp');
app.directive("simpleObjectViewMnt", function ($q, $uibModal, $stateParams, HttpService, BroadcastService) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
        }
        , templateUrl: 'cmp/simpleObjectMnt/simpleObjectViewMnt-tpl.html'
        , controller: 'simpleObjectMntController'
    }
})
;