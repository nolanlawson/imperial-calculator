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
	
	$scope.countries = [
        {id: 'at', name: 'Austria-Hungary'},
        {id: 'it', name: 'Italy'},
        {id: 'fr', name: 'France'},
        {id: 'gb', name: 'Great Britain'},
        {id: 'de', name: 'Germany'},
        {id: 'ru', name: 'Russia'}
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
    
    $scope.players = [];
    
    $scope.addPlayer = function(){
        $scope.players.push({
            id     : $scope.players.length,
            name   : '',
            shares : [],
            cash   : ''
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
    
    $scope.calculateScore = function(player) {
        var sum = player.cash || 0;
        for (var i = 0; i < player.shares.length; i++) {
            var share = player.shares[i];
            
            sum += share.value * share.country.multiplier;
        }
        return sum;
    };
}

ImperialController.$inject = ['$scope', '$location'];
