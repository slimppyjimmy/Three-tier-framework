(function (factory) {
    'use strict';
    if (typeof exports === 'object') {
        // Node/CommonJS
        module.exports = factory(
            typeof angular !== 'undefined' ? angular : require('../angular/angular-1.5.7/angular.min'));
    }  else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['angular'], factory);
    } else {
        // Browser globals
        if (typeof angular === 'undefined')
            throw new Error('error');
        factory(angular);
    }
}(function (angular) {
    'use strict';
    return angular.module('dist.ui.messagelist', ['ngSanitize','ngStorage'])
         .directive('wiMessageList',[wiMessageListDirective]);
    function wiMessageListDirective(){
        return {
            restrict:'EA',
            replace:'true',
            scope:{
				activityData:'=',
				activityScroll:'=',
				isActivityReloading:'=',
				activityReload:'&',
				activityConfig:'=',

            },
            templateUrl:'framework/dist.platform.com-1.0.0/src/wimessagelist/template/wimessagelist/wi-message-list.html',
            link:function(scope,ele,attr){

            }
        }
    }
}));
