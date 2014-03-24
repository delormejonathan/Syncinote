var SynciNote = angular.module('SynciNote' , ['directives']);

SynciNote.run(function($rootScope) {
	$rootScope.client = new Dropbox.Client({key: "fjt0qeyv21dhzri"});

	// Try to finish OAuth authorization.
	$rootScope.client.authenticate({interactive: false}, function (error) {
		if (error) {
			console.log('Authentication error: ' + error);
		}
	});

	if ($rootScope.client.isAuthenticated()) {
	    // Client is authenticated. Display UI.
	}
	else
	{
		$('.app').addClass('login-opened');
		$('.login').addClass('active');
	}
});