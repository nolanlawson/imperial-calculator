/*
 * Main Angular definitions for the Imperial Score Calculator
 */
/*global angular window document*/
(function() {

    "use strict";

    function getWindowWidth() {
        var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth;
            
        return x;
    }

    angular.module('imperial', []).
    config(['$routeProvider', function($routeProvider) {

        var isMobile = getWindowWidth() <= 767; // same rules as bootstrap
        var homePage = isMobile ? 'partials/home_mobile.html' : 'partials/home.html';

        $routeProvider.
        when('/home', {
            controller: 'GameController',
            templateUrl: homePage
        }).
        when('/saved-games', {
            controller: 'SavedGamesController',
            templateUrl: 'partials/saved_games.html'
        }).
        when('/about', {
            templateUrl: 'partials/about.html'
        }).
        when('/contact', {
            templateUrl: 'partials/contact.html'
        }).
        when('/load/:startTime', {
            controller: 'GameController',
            templateUrl: homePage
        }).
        when('/share/:serializedGame', {
            controller: 'GameController',
            templateUrl: homePage
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

})();
