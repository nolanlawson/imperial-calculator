/*
 * Main AngularJS Saved Games Controller (for the "saved games" screen).
 */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*global angular*/

(function(){

"use strict";

angular.module('imperial').controller('SavedGamesController', 
        ['$scope', 'storageService', 
        function($scope, storageService) {
    
    $scope.gameSummaries = storageService.getGameSummaries();
    
}]);

})();