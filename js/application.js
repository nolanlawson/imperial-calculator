var imperialModule = angular.module('imperial', []).
  config(['$routeProvider', function($routeProvider) {
	    $routeProvider.
	          when('/home', {templateUrl : /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ?
	               'partials/home_mobile.html' :
	               'partials/home.html'}).
	          when('/about', {templateUrl : 'partials/about.html'}).
	          when('/contact', {templateUrl : 'partials/contact.html'}).
		      otherwise({redirectTo: '/home'});
}]);
