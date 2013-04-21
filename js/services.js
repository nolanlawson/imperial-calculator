/*
 * AngularJS services.
 */
/*global localStorage ImperialModule*/
(function(){
"use strict";
    
ImperialModule.service('storageService', function() {
    
    var TIMESTAMPS_KEY = 'summaries';
    
    function get(key) {
        return JSON.parse(localStorage.getItem(key));
    }
    
    function set(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    }
    
    return {
        saveGame : function(game) {
            
            var savedGameTimestamps = get(TIMESTAMPS_KEY) || [];
            
            var playerSummaries = [];
            for (var i = 0; i < game.players.length; i++) {
                var player = game.players[i];
                playerSummaries.push(player.name);
            }
            
            savedGameTimestamps.push({startTime : game.startTime, players : playerSummaries});
            savedGameTimestamps.sort(function(left, right){return left.startTime - right.startTime;});
            set(TIMESTAMPS_KEY, savedGameTimestamps);
            set(game.startTime, game);
        },
        
        getGame : function(startTime, onResult) {
            onResult(get(startTime));
        },
        
        getGameSummaries : function(onResult) {
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