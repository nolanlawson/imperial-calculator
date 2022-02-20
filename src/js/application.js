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

    angular.module('imperial', ['ngRoute'])
    .config(['$locationProvider', function($locationProvider) {
        // angular <1.6.0 compat https://stackoverflow.com/a/41213016
        $locationProvider.hashPrefix('');
    }])
    .config(['$routeProvider', function($routeProvider) {

        var isMobile = getWindowWidth() <= 767; // same rules as bootstrap
        var homePage = isMobile ? 'home_mobile.html' : 'home.html';

        function partial (name) {
            return document.head.querySelector('[data-name="' + name +'"]').getAttribute('href');
        }

        $routeProvider.
        when('/home', {
            controller: 'GameController',
            templateUrl: partial(homePage)
        }).
        when('/saved-games', {
            controller: 'SavedGamesController',
            templateUrl: partial('saved_games.html')
        }).
        when('/about', {
            templateUrl: partial('about.html')
        }).
        when('/contact', {
            templateUrl: partial('contact.html')
        }).
        when('/load/:startTime', {
            controller: 'GameController',
            templateUrl: partial(homePage)
        }).
        when('/share/:serializedGame', {
            controller: 'GameController',
            templateUrl: partial(homePage)
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);

})();
