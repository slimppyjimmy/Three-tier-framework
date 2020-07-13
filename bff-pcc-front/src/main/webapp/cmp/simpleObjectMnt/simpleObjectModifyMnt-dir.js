var app = angular.module('AceApp');
app.directive("simpleObjectModifyMnt", function ($q, $uibModal, $stateParams, HttpService, BroadcastService) {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
            config: '='
            , param: '='
        }
        , templateUrl: 'cmp/simpleObjectMnt/simpleObjectModifyMnt-tpl.html'
        , controller: 'simpleObjectMntController'
    }
})
;