SynciNote.service('dropboxService', function($rootScope) {
	this.datastoreManager = null;
	this.datastore = null;

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
			callback($rootScope.datastore)
		}
	}

    this.getClient = function () {
        return $rootScope.client;
    }

    this.getTable = function (table_name) {
    	return this.getDatastore().getTable(table_name);
    }
});