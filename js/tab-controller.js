/*
 * TabController to handle the tab navigation
 */
/*jshint bitwise:true, curly:true, eqeqeq:true, forin:true, noarg:true, noempty:true, nonew:true, undef:true, strict:true, browser:true */
/*global angular*/

(function(){

"use strict";

angular.module('imperial').controller('TabController', [ '$scope', '$location', function($scope, $location){
    $scope.tabs = [
            {id : 'home', title : 'Home'},
            {id : 'saved-games', title: 'Saved games'},
            {id : 'about', title : 'About'}, 
            {id : 'contact', title: 'Contact'}
            ];
    $scope.selectedTabId = $location.path() === '/contact' ? 'contact' : 
            $location.path() === '/about' ? 'about' : 
            $location.path() === '/saved-games' ? 'saved-games' :
            'home';
}]);

})();