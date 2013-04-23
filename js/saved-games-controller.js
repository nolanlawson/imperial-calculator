/*
 * Main AngularJS Saved Games Controller (for the "saved games" screen).
 */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*export SavedGamesController */

var SavedGamesController;

(function(){

"use strict";

SavedGamesController = function($scope, storageService) {
    
    $scope.gameSummaries = storageService.getGameSummaries();
    
};

SavedGamesController.$inject = ['$scope', 'storageService'];

})();