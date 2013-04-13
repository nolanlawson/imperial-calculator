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

// fix the vertical text so that it takes up the full height instead of overlapping
imperialModule.directive('fixVerticalText', function() {
    return {
      link: function(scope, elem, attrs) {
        scope.$watch(attrs.fixVerticalText, function whenMyListChanges(newValue, oldValue) {
            var $elem = $(elem);
            var $tr = $elem.closest('tr');
            if ($tr.height() < $elem.width()) {
                // use largest height
                $tr.height($elem.width());
            } 
        });
      }
    };
});
