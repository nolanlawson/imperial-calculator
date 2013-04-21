/*
 * GameController for the Imperial Score Calculator app.
 */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*global */
/*export GameController */

var GameController;

(function(){

"use strict";

GameController = function($scope, $location, $routeParams, storageService) {

    
    //
    // "Share" feature
    //
    
    if ($routeParams.serializedGame) {
        $scope.$parent.loadGame($scope.$parent.deparamGame($routeParams.serializedGame));
    }
    

    
    //
    // click/change functions
    //
    
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
                subject: 'Share',
                text: 'link'
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
    
    $scope.loadGame = function(startTime) {
        storageService.getGame(startTime, function(game){
            $scope.$parent.loadGame(game);
        });
    };
    

};

GameController.$inject = ['$scope', '$location', '$routeParams', 'storageService'];

})();
