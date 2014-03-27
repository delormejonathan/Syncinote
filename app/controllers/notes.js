SynciNote.controller('notesEditCtrl', function ($rootScope , $scope, $http, $location, $routeParams, dropboxService) {
	$scope.note = { id : null , title : '' , content : ''};
	$scope.editor = null;
	$scope.action = 'Ajouter';
	$scope.noteTable = null;

	/*
		* Start Dropbox Sync
		* First, we get datastore & table
		* If we have an id, it's an edit
		* Due to nonblocking javascript way, sometimes EpicEditor loads faster than Dropbox & vice-versa, so i load twice content to be sure
	*/
	if (dropboxService.isAuth())
	{
		dropboxService.getDatastore(function (datastore) {
			$scope.noteTable = datastore.getTable('notes');

			if ($routeParams.id != undefined)
			{
				var record = $scope.noteTable.get($routeParams.id);
				$scope.note = {
					'id' : record.getId(),
					'title' : record.get('title'),
					'content' : record.get('content'), 
					'created' : moment(record.get('created')),
					'updated' : moment(record.get('updated'))
				};

				if ($scope.editor != null)
					$scope.editor.importFile($scope.note.id , $scope.note.content);

				$scope.action = 'Éditer';
			}
		});
	}

	/*
		* Save a note to Dropbox
	*/
	$scope.save = function() {

		// Add a note
		if ($scope.note.id == null)
		{
			var query = $scope.noteTable.insert({
				title: $scope.note.title,
				content: $scope.editor.exportFile(),
				created: new Date(),
				updated: new Date()
			});
		}
		// Edit a note
		else
		{
			var record = $scope.noteTable.get($scope.note.id);
			record.set('title' , $scope.note.title);
			record.set('content' , $scope.editor.exportFile());
			record.set('updated' , new Date());
		}

		$rootScope.noteCount++;
	}

	/*
		* Delete a note
	*/
	$scope.delete = function() {
		var record = $scope.noteTable.get($scope.note.id);
		record.deleteRecord();
		$rootScope.noteCount++;
	}

	/*
		* Started by EpicEditor directive, it loads content when the plugin is ready
	*/
	$scope.load = function(editor) {
		editor.importFile($scope.note.id , $scope.note.content);
	}

});

SynciNote.controller('notesListCtrl', function ($rootScope , $scope, $http, $location, dropboxService) {
	$scope.notes = [];
	$scope.noteTable = null;
	$scope.sync = 0;
	$scope.search = null;

	/*
		* Start Dropbox Sync
		* Add a listener to update notes list
	*/
	if (dropboxService.isAuth())
	{
		dropboxService.getDatastore(function (datastore) {
			$scope.noteTable = datastore.getTable('notes');
			$scope.updateList();
			datastore.recordsChanged.addListener($scope.updateList);
		});
	}

	$rootScope.$watch('noteCount', function( newVal, oldVal ) {
		if (newVal > oldVal)
			$scope.updateList(true);
	});


	/*
		* Update notes list
		* Sorted by date
		* We open first note automatically
	*/
	$scope.updateList = function (force) {
		$scope.notes = [];
		if (force) $scope.id = null;
		var records = $scope.noteTable.query();

		records.sort(function (noteA, noteB) {
			if (noteA.get('updated') < noteB.get('updated')) return 1;
			if (noteA.get('updated') > noteB.get('updated')) return -1;
			return 0;
		});

		for (var i = 0; i < records.length; i++) {
			var record = records[i];

			if ($scope.id == null)
			{
				$scope.id = record.getId();
				$scope.open(record.getId());
			}

			$scope.notes.push({
					'id' : record.getId(),
					'title' : record.get('title'),
					'content' : record.get('content'), 
					'created' : moment(record.get('created')),
					'updated' : moment(record.get('updated'))
				});

		}

		$scope.sync++;

		if ($scope.sync < 2)
			$scope.$apply();

	}

	$scope.open = function(note_id) {
		$scope.id = note_id;
		$location.path('/notes/edit/' + note_id);
	}
});