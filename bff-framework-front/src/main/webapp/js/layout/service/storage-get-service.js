/**
 * Created by Wanggb on 2016/7/7.
 */

//just load localStorage stored values, such as ace.settings, or ace.sidebar
angular.module("AceApp").service('StorageGet',StorageGet)

StorageGet.$inject=["$localStorage"];

function StorageGet($localStorage) {
    this.load = function($scope, name) {
        $localStorage[name] = $localStorage[name] || {};

        var $ref = $scope;
        var parts = name.split('.');//for example when name is "ace.settings" or "ace.sidebar"
        for(var i = 0; i < parts.length; i++) $ref = $ref[parts[i]];
        //now $ref refers to $scope.ace.settings

        for(var prop in $localStorage[name]) if($localStorage[name].hasOwnProperty(prop)) {
            $ref[prop] = $localStorage[name][prop];
        }
    };

};