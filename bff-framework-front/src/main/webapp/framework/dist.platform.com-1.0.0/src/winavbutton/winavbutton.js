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
    return angular.module('dist.ui.navbutton', [])
         .directive('wiNavButton',[WiNavButtonDirective]);
    function WiNavButtonDirective(){
        return {
            restrict:'EA',
            replace:'true',
            scope:{

            },
            templateUrl:'framework/dist.platform.com-1.0.0/src/winavbutton/template/winavbutton/wi-nav-button.html',
            link:function(scope,ele,attr){

            }
        }
    }
}));
