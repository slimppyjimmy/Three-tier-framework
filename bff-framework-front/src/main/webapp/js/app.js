/**
 * @name AceApp
 * @description
 * # AceApp
 *
 * Main module of the application.
 */

var app = angular
    .module('AceApp', [
        'ui.bootstrap',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ngStorage',
        "ui.grid.pagination",
        'ng-fusioncharts',
        'ace.directives',
        'dist.data.service',
        'dist.ui',
        'dist.ui.grid.lib'
        // , 'myMockE2E'
        // , 'ngMockE2E'
    ]);
angular.module('dist.ui.grid.lib', ['ui.grid.resizeColumns', 'ui.grid.moveColumns', 'ui.grid.selection', 'ui.grid.autoResize']);