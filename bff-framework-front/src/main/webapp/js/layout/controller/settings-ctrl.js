/**
 * Created by wanggb on 2016/7/7.
 */
app.controller('SettingsCtrl',SettingsCtrl)

SettingsCtrl.$inject=["$scope","$timeout","SAVE_SETTING","$localStorage","StorageGet"];


function SettingsCtrl($scope, $timeout, SAVE_SETTING, $localStorage, StorageGet) {
    $scope.ace = $scope.$parent.ace;
    $scope.ace.settings = $scope.ace.settings || {};

    if(SAVE_SETTING) $localStorage['ace.settings'] = $localStorage['ace.settings'] || {};

    $scope.ace.settings = {
        'is_open': false,
        'open': function() {
            $scope.ace.settings.is_open = !$scope.ace.settings.is_open;
        },

        'navbar': false,
        'sidebar': false,
        'breadcrumbs': false,
        'hover': false,
        'compact': false,
        'highlight': false,

        //'rtl': false,

        'skinColor': '#438EB9',
        'skinIndex': 0
    };


    if(SAVE_SETTING) StorageGet.load($scope, 'ace.settings');//load previously saved setting values


    //watch some of the changes to trigger related events required by sidebar, etc
    $scope.$watch('ace.settings.navbar', function(newValue) {
        if(newValue == false) {
            //if navbar is unfixed, so should be sidebar and breadcrumbs
            $scope.ace.settings.sidebar = $scope.ace.settings.breadcrumbs = false;
        }
        $timeout(function() {
            if(jQuery) jQuery(document).trigger('settings.ace', ['navbar_fixed' , newValue]);
        });

        if(SAVE_SETTING) $localStorage['ace.settings']['navbar'] = newValue;
    });
    $scope.$watch('ace.settings.sidebar', function(newValue) {
        if(newValue === true) {
            //if sidebar is fixed, so should be navbar
            $scope.ace.settings.navbar = true;
        }
        else if(newValue === false) {
            //if sidebar is unfixed, so should be breadcrumbs
            $scope.ace.settings.breadcrumbs = false;
        }
        $timeout(function() {
            if(jQuery) jQuery(document).trigger('settings.ace', ['sidebar_fixed' , newValue]);
        });

        if(SAVE_SETTING) $localStorage['ace.settings']['sidebar'] = newValue;
    });
    $scope.$watch('ace.settings.breadcrumbs', function(newValue) {
        if(newValue === true) {
            //if breadcrumbs is fixed, so should be sidebar
            $scope.ace.settings.sidebar = true;
        }
        $timeout(function() {
            if(jQuery) jQuery(document).trigger('settings.ace', ['breadcrumbs_fixed' , newValue]);
        });

        if(SAVE_SETTING) $localStorage['ace.settings']['breadcrumbs'] = newValue;
    });
    $scope.$watch('ace.settings.container', function(newValue) {
        $timeout(function() {
            if(jQuery) jQuery(document).trigger('settings.ace', ['main_container_fixed' , newValue]);
        });

        if(SAVE_SETTING) $localStorage['ace.settings']['container'] = newValue;
    });

    //////
    $scope.$watch('ace.settings.compact', function(newValue) {
        if(newValue === true) {
            //if sidebar is compact, it should be in 'hover' mode as well
            $scope.ace.settings.hover = true;
        }
        $timeout(function() {
            //reset sidebar scrollbars and submenu hover
            $scope.$parent.ace.sidebar.reset = true;
        } , 500);

        if(SAVE_SETTING) $localStorage['ace.settings']['compact'] = newValue;
    });
    $scope.$watch('ace.settings.hover', function(newValue) {
        if(newValue === false) {
            //if sidebar is not 'hover' , it should not be compact
            $scope.ace.settings.compact = false;
        }
        $timeout(function() {
            //reset sidebar scrollbars and submenu hover
            $scope.$parent.ace.sidebar.reset = true;
        } , 500);

        if(SAVE_SETTING) $localStorage['ace.settings']['hover'] = newValue;
    });
    $scope.$watch('ace.settings.highlight', function(newValue) {
        if(SAVE_SETTING) $localStorage['ace.settings']['highlight'] = newValue;
    });

    ////

    $scope.$watch('ace.settings.skinIndex', function(newValue) {
        //save skinIndex for later
        if(SAVE_SETTING) $localStorage['ace.settings']['skinIndex'] = newValue;
    });

};
