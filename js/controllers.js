function ImperialController($scope, $location) {
	
	$scope.tabs = [{id : 'home', title : 'Home'},{id : 'about', title : 'About'}, {id : 'contact', title: 'Contact'}]
	$scope.selectedTabId = $location.path() === '/contact' ? 'contact' : $location.path() === '/about' ? 'about' : 'home';
}

ImperialController.$inject = ['$scope', '$location'];
