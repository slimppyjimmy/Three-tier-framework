/**
 * Created by Wanggb on 2016/9/25.
 */


(function(global,angular) {
    'use strict';
    var myAppDev = angular.module('myMockE2E',[]);

    myAppDev.run(['$httpBackend','$log',function($httpBackend,$log) {
        var phones = [{name: 'phone1'}, {name: 'phone2'}];

        $log.log("log test")
        $httpBackend.whenGET('template/debug/userConfig/user-config-tpl.html').passThrough();

        // returns the current list of phones
        $httpBackend.whenGET('/phones').respond(phones);

            // adds a new phone to the phones array
            $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
                var phone = angular.fromJson(data);
                console.log("it works!");
                phones.push(phone);
                return [200, phone, {}];
        });

        // Passthrough everything
        $httpBackend.whenGET(/[\s\S]*/).passThrough();
        // Passthrough everything
        $httpBackend.whenPOST(/[\s\S]*/).passThrough();
    }]);
})(this,window.angular);
