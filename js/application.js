angular.module('imperial', []).
  config(['$routeProvider', function($routeProvider) {
	    $routeProvider.
	          when('/home', {templateUrl : 'partials/home.html'}).
	          when('/about', {templateUrl : 'partials/about.html'}).
	          when('/contact', {templateUrl : 'partials/contact.html'}).
		      otherwise({redirectTo: '/home'});
  }]);
