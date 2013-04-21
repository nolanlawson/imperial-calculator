/*
 * Main Angular definitions for the Imperial Score Calculator
 */
/*global angular navigator*/
/*export ImperialModule*/
var ImperialModule;
(function() {

    "use strict";

    ImperialModule = angular.module('imperial', []).
    config(['$routeProvider', function($routeProvider) {

        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
        var homePage = isMobile ? 'partials/home_mobile.html' : 'partials/home.html';

        $routeProvider.
        when('/home', {
            controller: 'ImperialController',
            templateUrl: homePage
        }).
        when('/about', {
            templateUrl: 'partials/about.html'
        }).
        when('/contact', {
            templateUrl: 'partials/contact.html'
        }).
        when('/share/:serializedGame', {
            controller: 'ImperialController',
            templateUrl: homePage
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

})();
