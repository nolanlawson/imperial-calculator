function ImperialController($scope, $location) {
    "use strict";
	
	$scope.appVersion = '1.0';
	
	$scope.tabs = [{id : 'home', title : 'Home'},{id : 'about', title : 'About'}, {id : 'contact', title: 'Contact'}];
	$scope.selectedTabId = $location.path() === '/contact' ? 'contact' : $location.path() === '/about' ? 'about' : 'home';
	
	$scope.possibleMultipliers = [0,1,2,3,4,5];
	
	$scope.possibleShares = [1,2,3,4,5,6,7,8,9];
	
	$scope.countries = [
        {id: 'at', multiplier : 0, name: 'Austria-Hungary'},
        {id: 'it', multiplier : 0, name: 'Italy'},
        {id: 'fr', multiplier : 0, name: 'France'},
        {id: 'gb', multiplier : 0, name: 'Great Britain'},
        {id: 'de', multiplier : 0, name: 'Germany'},
        {id: 'ru', multiplier : 0, name: 'Russia'}
    ];
    
    $scope.countriesHash = {};
    for (var i = 0; i < $scope.countries.length; i++) {
        var country = $scope.countries[i];
        $scope.countriesHash[country.id] = country;
    }
    
    $scope.players = [];
    
    $scope.addPlayer = function(){
        $scope.players.push({
            id     : $scope.players.length,
            name   : '',
            shares : {},
            cash   : ''
        });
    };
    
    $scope.sumSharesInCountry = function(player,countryId) {
         var sum = 0;
         if (player.shares[countryId]) {
             for (var amount in player.shares[countryId]) {
                 sum += parseInt(amount, 10);
             }
         
         }
         return sum;    
    };
    
    $scope.toggleShareInPlayer = function(player, countryId, amount) {
        
        if ($scope.checkOwnedByAnotherPlayer(player, countryId, amount)) {
            return; // do nothing; someone else owns it
        }
        
        if (!player.shares[countryId]) {
            // new
            player.shares[countryId] = {};
        }
        
        if (player.shares[countryId][amount]) {
            // delete
            delete player.shares[countryId][amount];
        } else {
            // add
            player.shares[countryId][amount] = true;
        }
    };
    
    $scope.calculateScore = function(player) {
        var sum = player.cash || 0;
        for (var countryId in player.shares) {
            
            // todo: hash lookup
            var country = $scope.countriesHash[countryId];
            
            for (var countryShare in player.shares[countryId]) {
                sum += countryShare * country.multiplier;
            }
        }
        return sum;
    };
    
    $scope.checkOwnedByAnotherPlayer = function(player, countryId, amount) {
        
        for (var i = 0; i < $scope.players.length; i++) {
            var otherPlayer = $scope.players[i];
            if (otherPlayer.id === player.id) {
                continue;
            } else if (otherPlayer.shares[countryId] && otherPlayer.shares[countryId][amount]) {
                return true;
            }
        }
        return false;
    };
}

ImperialController.$inject = ['$scope', '$location'];
