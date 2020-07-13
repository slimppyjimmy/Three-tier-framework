var app = angular.module('AceApp');
app.directive("fileDownloader", function () {
    return {
        restrict: 'AE'
        , replace: true
        , scope: {
              buttonName: '@'
            , executeUrl: '@'
            , fileName: '@'
        }
        , templateUrl: 'cmp/fileDownloader/fileDownloader-tpl.html'
        , controller: function ($scope) {
            console.log(">>>fileDownloader scope=", $scope);
            console.log("<<<fileDownloader exit");
        }
    }
})
;