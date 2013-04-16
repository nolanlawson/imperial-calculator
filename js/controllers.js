/*
 * AngularJS Controllers for the Imperial Score Calculator app.
 */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*export ImperialController */

var ImperialController;

(function(){

"use strict";

ImperialController = function($scope, $location, storageService) {
    
    //
    // CONSTANTS
    //
    
    $scope.APP_VERSION = '1.0';
    $scope.MAX_NUM_PLAYERS = 6; 
    
    //
    // PERSISTENCE SETUP (variables)
    //
    $scope.startTime = new Date().getTime();
    storageService.getSavedGameTimestamps(function(savedGameTimestamps) {
        $scope.savedGameTimestamps = savedGameTimestamps;
        $scope.lastGameTimestamp = savedGameTimestamps && savedGameTimestamps.length > 0 && 
                new Date(savedGameTimestamps[savedGameTimestamps.length - 1]).toString();
    });
    
    //
    // MODEL SETUP (variables)
    //
    
    $scope.tabs = [{id : 'home', title : 'Home'},{id : 'about', title : 'About'}, {id : 'contact', title: 'Contact'}];
    $scope.selectedTabId = $location.path() === '/contact' ? 'contact' : $location.path() === '/about' ? 'about' : 'home';
    
    $scope.possibleMultipliers = [0,1,2,3,4,5];
    
    $scope.players = [];
    $scope.unranked = true;
    
    $scope.countries = [
        {id: 'at', name: 'Austria-Hungary'},
        {id: 'it', name: 'Italy'},
        {id: 'fr', name: 'France'},
        {id: 'gb', name: 'Great Britain'},
        {id: 'de', name: 'Germany'},
        {id: 'ru', name: 'Russia'}
    ];
    
    for (var i = 0; i < $scope.countries.length; i++) {
        var thisCountry = $scope.countries[i];
        thisCountry.multiplier = 0;
        thisCountry.shares = [];
        
        for (var j = 1; j <= 9; j++) {
            // possible share values
            thisCountry.shares.push({ value : j, country : thisCountry});
        }
    }
    
    //
    // Watches
    //
    
    // watch player holdings changes
    
    function createPlayerWatcher(playerId) { // avoids jshint warning about functions in loops
        return function() {
            if (playerId < $scope.players.length) {
                updatePlayerStats($scope.players[playerId]);
                updateRanking();
                updatePlayersInFirst();
            }
        };
    }
    
    for (i = 0; i < $scope.MAX_NUM_PLAYERS; i++) {
        $scope.$watch('players[' + i + '].cash + players[' + i + '].shares.length', createPlayerWatcher(i));
    }
    
    // watch player name changes - just need to update the "so and so wins" flavor text
    
    $scope.$watch('players[0].name + players[1].name + players[2].name + players[3].name + players[4].name + players[5].name', updatePlayersInFirst);
    
    // watch country changes
    
    function createCountryWatcher(countryIdx) { // avoids jshint warning about functions in loops
        return function() {
            var country = $scope.countries[countryIdx];
            
            // update player scores only for players who own shares in this country
            var updatedPlayers = {};
            for (var i = 0; i < country.shares.length; i ++) {
                var share = country.shares[i];
                
                if (share.player && !updatedPlayers[share.player.id]) {
                    updatePlayerStats(share.player);
                    updatedPlayers[share.player.id] = true;
                }
            }
            
            // update the global ranking only if >=1 player was modified
            for (var key in updatedPlayers) {
                if (updatedPlayers.hasOwnProperty(key)) {
                    updateRanking();
                    updatePlayersInFirst();
                    break;
                }
            }
        };
    }
    
    for (i = 0; i < $scope.countries.length; i++) {
        $scope.$watch('countries[' + i + '].multiplier', createCountryWatcher(i));
    }
    
    //
    // click/change functions
    //
    
    $scope.addPlayer = function(){
        $scope.players.push({
            id     : $scope.players.length,
            name   : '',
            shares : [],
            cash   : 0,
            rank   : {},
            sumSharesPerCountry : {}
        });
    };
    
    $scope.toggleShareInPlayer = function(player, share) {
        
        if (!share.player) {
            // nobody owns it yet, so add it
            share.player = player;
            player.shares.push(share);
        } else if (share.player === player) {
            // already own it, so delete it
            share.player = null;
            
            // stupid javascript array.remove(obj) implementation
            for (var i = 0; i < player.shares.length; i++) {
                if (player.shares[i] === share) {
                    player.shares = player.shares.slice(0, i).concat(player.shares.slice(i + 1, player.shares.length));
                    break;
                }
            }
        }
        // else do nothing; someone else owns it
    };
    
    //
    // JavaScript browser and Cordova hooks
    //
    var isCordova = document.location.protocol === "file:";

    var saveBeforeExit = function() {
        storageService.saveGame(serializeGame());
    };

    if (isCordova) {
        // on app pause
        document.addEventListener("pause", saveBeforeExit, false);
    } else {
        // on browser exit
        window.onbeforeunload = saveBeforeExit;
    }
    
    //
    // Internally used functions
    //
    
    function serializeGame() {
        
        var players = [];
        
        for (var i = 0; i < $scope.players.length; i++) {
            var player = $scope.players[i];
            players.push({
                id     : player.id,
                name   : player.name,
                cash   : player.cash
            });
        }
        
        var countries = [];
        
        for (i = 0; i < $scope.countries.length; i++) {
            var country = $scope.countries[i];
            
            var shares = [];
            
            for (var j = 0; j < country.shares.length ;j++) {
                var share = country.shares[i];
                
                shares.push(share.player && share.player.id);
            }
            
            countries.push({
                multiplier : country.multiplier,
                shares     : shares
            });
        }
        
        return {
            startTime : $scope.startTime,
            countries : countries,
            players   : players
        };
    }
    
    deserializeGame = function(game) {
        
        $scope.startTime = game.startTime;
        
        var players = [];
        
        for (var i = 0; i < game.players.length; i++) {
            var player = game.players[i];
            
            players.push({
                id     : i,
                name   : player.name,
                shares : [],
                cash   : player.cash,
                rank   : {},
                sumSharesPerCountry : {}
            });
        }
        
        $scope.players = players;
        
        for (i = 0; i < $scope.countries.length; i++) {
            var country = $scope.countries[i];
            
            var savedCountry = game.countries[i];
            
            for (var j = 0; j < country.shares.length; j++) {
                var share = country.shares[j];
                
                var savedSharePlayerId = savedCountry.shares[j];
                
                if (savedSharePlayerId) {
                    share.player = $scope.players[savedSharePlayerId];
                    share.player.shares.push(share);
                } else {
                    share.player = null;
                }
            }
        }
    };
    
    /**
     * Calculates the score and the sum of the shares per country of all players
     */
    function updatePlayerStats(player) {
        //console.log('updatePlayerStats('+player.id+')');
        
        var sumSharesPerCountry = {};
        var score = player.cash || 0;
        
        for (var i = 0; i < player.shares.length; i++) {
            var share = player.shares[i];
             
            sumSharesPerCountry[share.country.id] = (sumSharesPerCountry[share.country.id] || 0) + share.value;
            score += share.value * share.country.multiplier;
        }
        
        player.sumSharesPerCountry = sumSharesPerCountry;
        player.score = score;
    }
    
    // returns an object containing "first" or "last", depending on the number of players
    function updateRanking() {
        //console.log('updateRanking()');
        
        var i;
        
        // clear present values
        $scope.unranked = true;
        
        if ($scope.players.length < 2) {
            // no interest in calculating this yet
            return;
        }
        
        // count unique scores
        var uniqueScores = {};
        for (i = 0; i < $scope.players.length; i++) {
            uniqueScores[$scope.players[i].score] = true;
        }
        
        var uniqueScoreCount = 0;
        for (var uniqueScore in uniqueScores) {
            if (uniqueScores.hasOwnProperty(uniqueScore)) {
                uniqueScoreCount++;
            }
        }
        
        if (uniqueScoreCount === 1) {
            // everyone has the same score - not interesting!
            return;
        }
        
        // figure out top and bottom scores to deal with ties
        var topScore = -1;
        var bottomScore = Number.MAX_VALUE;
        for (i = 0; i < $scope.players.length; i++) {
            var score = $scope.players[i].score;
            if (score > topScore) {
                topScore = score;
            }
            if (score < bottomScore) {
                bottomScore = score;
            }
        }
        
        // copy
        var rankedPlayers = $scope.players.slice();

        // rank
        rankedPlayers.sort(function(left, right){ 
            return right.score - left.score;
        });
        
        // update the "rank" object of each player
        var lastRankedIndex = -1;
        for (i = 0; i < rankedPlayers.length; i++) {
            var player = rankedPlayers[i];
            
            // determine rank order while maintaining ties
            if (player.score === topScore) {
                // first
                player.rank = {first : true, order : 0};
            } else if (player.score === bottomScore) {
                // last
                if (lastRankedIndex === -1) {
                    lastRankedIndex = i;
                }
                player.rank = {last : true, order : lastRankedIndex};
            } else {
                // middle
                player.rank = {middle : true, order : i};
            }
        }
        $scope.unranked = false;
    }
    
    /**
     * Update the "players in first" object, which is used to show some nice "so and so wins!" text
     */
    function updatePlayersInFirst() {
        //console.log('updatePlayersInFirst()');
        
        var players = [];
        
        for (var i = 0; i < $scope.players.length; i++) {
            var player = $scope.players[i];
            
            if (player.rank.first) {
                players.push(player.name || 'Player ' + (i + 1));
            }
        }
        
        $scope.playersInFirst = {
            players: players, 
            tieGame : (players.length > 1)
        };
    }
};

ImperialController.$inject = ['$scope', '$location', 'storageService'];

})();
