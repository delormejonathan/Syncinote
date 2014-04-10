SynciNote

/*
	* This service manages connections with Dropbox API.
*/
.service('dropboxService', function($rootScope) {
	this.datastoreManager 	= null;
	this.datastore 			= null;

    this.getClient = function () {
        return $rootScope.client;
    }

	this.isAuth = function () {
		return this.getClient().isAuthenticated();
	}

	this.getDatastoreManager = function () {
		if (this.datastoreManager == null)
			this.datastoreManager = this.getClient().getDatastoreManager();

		return this.datastoreManager;
	}

	this.getDatastore = function (callback) {
		if ($rootScope.datastore == null)
		{
			this.getDatastoreManager().openDefaultDatastore(function (error, datastore) {
				if (error) {
					console.log('Error opening default datastore: ' + error);
				}
				else {
					$rootScope.datastore = datastore;
					callback($rootScope.datastore);
				}

			});
		}
		else
		{
			callback($rootScope.datastore);
		}
	}
})

/* 
	* This service manages modules in mobile view.
	* It also gives the current notes opened for the controllers.
*/
.service('moduleService' , function() {
	this.noteId			= null;

	this.isTaskActive 	= function() {
		return $('.app .tasks').is(":visible");
	}
	this.isListActive 	= function() {
		return $('.app .notes-list').is(":visible");
	}
	this.isEditorActive 	= function() {
		return $('.app .notes-editor').is(":visible");
	}
	this.getNoteId = function () {
		return this.noteId;
	}

	this.activateTask = function () {
		$('.mobile .module').hide();
		$('.mobile .tasks').show();
	}

	this.activateList = function () {
		$('.mobile .module').hide();
		$('.mobile .notes-list').show();
	}

	this.activateEditor = function () {
		$('.mobile .module').hide();
		$('.mobile .notes-editor').show();
	}
})

/* 
	* This service manages loading spinner at boot.
*/
.service('loadingService' , function() {
	this.steps 		= 2;
	this.loadState 	= 0;

	this.nextStep = function() {
		this.loadState++;

		if (this.loadState == this.steps)
			this.done();
	}

	this.done = function() {
		setTimeout(function() {
			$('.loading').slideUp(700, function() {
				$('.loading').remove();
			});
		},800);
		
	}
});