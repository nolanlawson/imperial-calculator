/*
 * Main Angular definitions for the Imperial Score Calculator
 */
/*global angular navigator localStorage*/
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
    }]).
    service('storageService', function() {
        
        var TIMESTAMPS_KEY = 'timestamps';
        
        function get(key) {
            return JSON.parse(localStorage.getItem(key));
        }
        
        function set(key, obj) {
            localStorage.setItem(key, JSON.stringify(obj));
        }
        
        return {
            saveGame : function(game) {
                
                var savedGameTimestamps = get(TIMESTAMPS_KEY) || [];
                
                savedGameTimestamps.push(game.startTime);
                savedGameTimestamps.sort();
                set(TIMESTAMPS_KEY, savedGameTimestamps);
                set(game.startTime, game);
            },
            
            getGame : function(startTime, onResult) {
                onResult(get(startTime));
            },
            
            getSavedGameTimestamps : function(onResult) {
                onResult(get(TIMESTAMPS_KEY));
            },
            
            checkedIsAvailable : null,
            
            isAvailable : function() {
                
                if (this.checkedIsAvailable === null) {
                
                    try {
                        localStorage.setItem('test', 'test');
                        localStorage.removeItem('test');
                        this.checkedIsAvailable = true;
                    } catch (e) {
                        this.checkedIsAvailable = false;
                    }
                }
                return this.checkedIsAvailable;
                
            }
        };
    });

})();
