/*
 * AngularJS services.
 */
/*global localStorage ImperialModule*/
(function(){
"use strict";
    
ImperialModule.service('storageService', function() {
    
    var SUMMARIES_KEY = 'summaries';
    
    function get(key) {
        return JSON.parse(localStorage.getItem(key));
    }
    
    function set(key, obj) {
        localStorage.setItem(key, JSON.stringify(obj));
    }
    
    return {
        saveGame : function(game) {
            
            var summaries = get(SUMMARIES_KEY) || [];
            
            summaries.push(game.startTime);
            
            // uniq
            var summarySet = {};
            for (var i = 0; i < summaries.length ; i++) {
                summarySet[summaries[i]] = true;
            }
            summaries = [];
            for (var key in summarySet) {
                summaries.push(parseInt(key, 10));
            }
            
            // sort by timestamp descending
            summaries.sort(function(left, right){return right - left;});
            
            set(SUMMARIES_KEY, summaries);
            set(game.startTime + '-numPlayers', game.players.length);
            set(game.startTime, game);
        },
        
        getGame : function(startTime, onResult) {
            onResult(get(startTime));
        },
        
        getGameSummaries : function(onResult) {
            onResult(get(SUMMARIES_KEY));
        },
        
        getNumPlayers : function(startTime) {
            return get(startTime + '-numPlayers');
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