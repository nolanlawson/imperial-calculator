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
