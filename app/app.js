var SynciNote = angular.module('SynciNote' , [  
												'ngRoute',
												'directives'
											 ]);

SynciNote.run(function($rootScope) {
	$rootScope.client = new Dropbox.Client({key: "fjt0qeyv21dhzri"});

	// Try to finish OAuth authorization.
	$rootScope.client.authenticate({interactive: false}, function (error) {
		if (error) {
			console.log('Authentication error: ' + error);
		}
	});

	if ($rootScope.client.isAuthenticated()) {
	    $rootScope.noteCount = 0;
	}
	else
	{
		$('.app').addClass('login-opened');
		$('.login').addClass('active');
	}
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