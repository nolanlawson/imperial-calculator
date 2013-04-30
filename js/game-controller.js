/*
 * GameController for the Imperial Score Calculator app.
 */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*global angular*/

(function(){

"use strict";

angular.module('imperial').controller('GameController', 
        ['$scope', '$location', '$routeParams', 'storageService', 
        function($scope, $location, $routeParams, storageService) {

    
    $scope.$parent.selectedTabId = 'home';
    
    var gameSummaries = storageService.getGameSummaries();
    $scope.lastGameSummary = gameSummaries && gameSummaries.length > 0 && gameSummaries[0];
    
    //
    // "Share" feature
    //
    
    if ($routeParams.serializedGame) {
        $scope.$parent.loadGame($scope.$parent.deparamGame($routeParams.serializedGame));
    }
    
    //
    // "Load" feature
    //
    
    if ($routeParams.startTime) {
        storageService.getGame($routeParams.startTime, function(game){
            $scope.$parent.loadGame(game);
        });
    }
    

    
    //
    // click/change functions
    //
    
    $scope.isShareOwned = function(share, player) {
        return (share.player && share.player.id === player.id) ? true : false;
    };
    
    $scope.isShareOwnedByOther = function(share, player) {
        return (share.player && share.player.id !== player.id) ? true : false;
    };
    
    $scope.showSavedGamesAlert = function() {
        
        // last game is less than two hours old
        return !$scope.$parent.isGameModified() && 
                $scope.lastGameSummary > (new Date().getTime() - 7200000);
    };
    
    $scope.promptShare = function() {
        
        var gameObj = $scope.$parent.serializeGame();
        
        var serializedGame = $scope.$parent.paramGame(gameObj);
        
        var isCordova = document.location.protocol === "file:";
        
        var link = isCordova ?
                ('http://apps.nolanlawson.com/imperial-calculator/#/share/' + serializedGame) :
                ($location.$$absUrl.replace($location.$$url,'/share/' + serializedGame));
        
        if (window.plugins && window.plugins.share) {
            // share plugin for Android
            
            window.plugins.share.show({
                subject: "Imperial game scores",
                text: link
            });
        } else {
            window.prompt("Copy to clipboard: Ctrl+C, Enter", link);
        }
    };
    
    $scope.addPlayer = function(){
        $scope.$parent.players.push({
            id     : $scope.players.length,
            name   : '',
            shares : [],
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
    
    $scope.loadGame = function(startTime) {
        storageService.getGame(startTime, function(game){
            $scope.$parent.loadGame(game);
        });
    };
    

}]);

})();
