var SynciNote = angular.module('SynciNote' , [ 'ngRoute' , 'directives' ]);

SynciNote.run(function($rootScope, $location) {
	$rootScope.client = new Dropbox.Client({key: "fjt0qeyv21dhzri"});

	$rootScope.client.authenticate({interactive: false}, function (error) {
		if (error) {
			console.log('Authentication error: ' + error);
		}
	});

	if ($rootScope.client.isAuthenticated()) {
		$('body').removeClass('login-opened');
		$('.login').removeClass('active');
	}

	if (jQuery.browser.mobile)
		$rootScope.mobile = true;
	else
		$rootScope.mobile = false;

	$location.path('/');
});


SynciNote.config(['$routeProvider',
	function($routeProvider) {
		$routeProvider.
			when('/notes/add', {
				templateUrl: 'app/views/notes/edit.html',
				controller: 'notesEditCtrl'
			}).
			when('/notes/edit/:id', {
				templateUrl: 'app/views/notes/edit.html',
				controller: 'notesEditCtrl'
			});
	}
]);