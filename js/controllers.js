/*
 * AngularJS Controllers for the Imperial Score Calculator app.
 */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */

function ImperialController($scope, $location) {
    "use strict";
    
    var i;
	
	$scope.appVersion = '1.0';
	
	$scope.tabs = [{id : 'home', title : 'Home'},{id : 'about', title : 'About'}, {id : 'contact', title: 'Contact'}];
	$scope.selectedTabId = $location.path() === '/contact' ? 'contact' : $location.path() === '/about' ? 'about' : 'home';
	
	$scope.possibleMultipliers = [0,1,2,3,4,5];
	
	$scope.players = [];
	$scope.unranked = true;
	
	$scope.countries = [
        {id: 'at', name: 'Austria-Hungary', abbrevName : 'Austria'},
        {id: 'it', name: 'Italy', abbrevName : "Italy"},
        {id: 'fr', name: 'France', abbrevName: "France"},
        {id: 'gb', name: 'Great Britain', abbrevName: "Britain"},
        {id: 'de', name: 'Germany', abbrevName : "Germany"},
        {id: 'ru', name: 'Russia', abbrevName : "Russia"}
    ];
    
    for (i = 0; i < $scope.countries.length; i++) {
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
    
    var watchExpression = 'players[0].cash + players[1].cash + players[2].cash + players[3].cash + players[4].cash + players[5].cash + ' +
            'countries[0].multiplier + countries[1].multiplier + countries[2].multiplier + countries[3].multiplier + countries[4].multiplier + countries[5].multiplier + ' +
            'players[0].shares.length + players[1].shares.length + players[2].shares.length + players[3].shares.length + players[4].shares.length + players[5].shares.length';
    
    $scope.$watch(watchExpression, function() {
        for (var i = 0; i < $scope.players.length; i++) {
            var player = $scope.players[i];
            
            player.score = calculateScore(player);
        }
        updateRanking();
    });
    
    //
    // click/change functions
    //
    
    $scope.addPlayer = function(){
        $scope.players.push({
            id     : $scope.players.length,
            name   : '',
            shares : [],
            cash   : '',
            rank   : {}
        });
    };
    
    $scope.sumSharesInCountry = function(player, country) {
         var sum = 0;
         for (var i = 0; i < player.shares.length; i++) {
             var share = player.shares[i];
             if (share.country === country) {
                 sum += player.shares[i].value;
             }
         }
         return sum;    
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
    
    $scope.getFinalRankingText = function() {
        
        if ($scope.unranked) {
            return null;
        }
        
        var firsts = [];
        
        for (var i = 0; i < $scope.players.length; i++) {
            var player = $scope.players[i];
            if (player.rank.first) {
                firsts.push(player.name || ("Player " + (player.id + 1)));
            }
        }
        
        if (firsts.length === 1) {
            return firsts[0] + " wins!";
        }
        
        return firsts.join(' and ') + " tie for first.";
    };
    
    
    //
    // Internally used functions
    //
    
    function calculateScore(player) {
        var sum = player.cash || 0;
        for (var i = 0; i < player.shares.length; i++) {
            var share = player.shares[i];
            
            sum += share.value * share.country.multiplier;
        }
        return sum;
    }
    
    // returns an object containing "first" or "last", depending on the number of players
    // TODO: optimize this
    function updateRanking() {
        
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
        var rankedPlayers = [];
        for (i = 0; i < $scope.players.length; i++) {
            rankedPlayers.push($scope.players[i]);
        }

        // rank
        rankedPlayers.sort(function(left, right){ 
            return right.score - left.score;
        });
        
        // update the "rank" object
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
}

ImperialController.$inject = ['$scope', '$location'];
