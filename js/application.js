/*
 * Main Angular definitions for the Imperial Score Calculator
 */
/*global angular navigator*/
(function() {

    "use strict";

    angular.module('imperial', []).
    config(['$routeProvider', function($routeProvider) {

        var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

        $routeProvider.
        when('/home', {
            templateUrl: isMobile ? 'partials/home_mobile.html' : 'partials/home.html'
        }).
        when('/about', {
            templateUrl: 'partials/about.html'
        }).
        when('/contact', {
            templateUrl: 'partials/contact.html'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

})();
