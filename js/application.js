/*
 * Main Angular definitions for the Imperial Score Calculator
 */
/*global angular navigator Lawnchair*/
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
    service('storageService', function(){
        
        var TIMESTAMPS_KEY = 'saved-game-timestamps';
        var LAWNCHAIR_NAME = 'imperial';
        var lawnchair = Lawnchair(LAWNCHAIR_NAME, function(){console.log('set up lawnchair!');});
        
        return {
            saveGame : function(game) {
                
                lawnchair.get(TIMESTAMPS_KEY, function(result){
                    
                    var savedGameTimestamps = (result && result.data) ? result.data : [];
                    
                    savedGameTimestamps.push(game.startTime);
                    savedGameTimestamps.sort();
                    lawnchair.save({key : TIMESTAMPS_KEY, data : savedGameTimestamps});
                    lawnchair.save({key : game.startTime, data: game});
                });
            },
            
            getGame : function(startTime, onResult) {
                lawnchair.get({key : startTime},function(result){
                    onResult(result.data);
                });
            },
            
            getSavedGameTimestamps : function(onResult) {
                lawnchair.get(TIMESTAMPS_KEY, function(result){
                    onResult((result && result.data) || []);
                });
            }
            
        };
    });

})();
