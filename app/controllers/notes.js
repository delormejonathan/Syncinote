SynciNote.controller('notesEditCtrl', function ($rootScope, $scope, $location, $routeParams, moduleService, dropboxService) {

	$scope.action 		= 'Ajouter';
	$scope.note 		= { id : null , title : '' , content : ''};
	$scope.editor 		= null;
	$scope.noteTable 	= null;

	// Activate editor view in mobile app
	moduleService.activateEditor();

	if (dropboxService.isAuth()) {
		dropboxService.getDatastore(function (datastore) {
			$scope.noteTable = datastore.getTable('notes');

			if ($routeParams.id != undefined) {
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
				moduleService.noteId = $routeParams.id;
			}
			else {
				moduleService.noteId = null;
			}
		});
		$('.notes-editor .title').focus();
	}

	$scope.save = function() {
		if ($scope.note.id == null) {
			var query = $scope.noteTable.insert({
				title: $scope.note.title,
				content: $scope.editor.exportFile(),
				created: new Date(),
				updated: new Date()
			});

			moduleService.noteId = query.getId();
			$location.path('/notes/edit/' + query.getId());
		}
		else {
			var record = $scope.noteTable.get($scope.note.id);
			record.set('title' , $scope.note.title);
			record.set('content' , $scope.editor.exportFile());
			record.set('updated' , new Date());
		}
		$rootScope.$broadcast('UPDATE_NOTES_LIST');
	}

	$scope.delete = function() {
		var record = $scope.noteTable.get($scope.note.id);
		record.deleteRecord();

		$scope.$broadcast('UPDATE_NOTES_LIST');

		$location.path('/');
	}

	$scope.load = function(editor) {
		editor.importFile($scope.note.id , $scope.note.content);
	}
});

SynciNote.controller('notesListCtrl', function ($rootScope, $scope, $location, loadingService, moduleService, dropboxService) {
	$scope.notes 		= [];
	$scope.noteTable 	= null;
	$scope.sync 		= 0;
	$scope.search 		= null;

	if (dropboxService.isAuth()) {
		dropboxService.getDatastore(function (datastore) {
			$scope.noteTable = datastore.getTable('notes');
			$scope.updateList();
			datastore.recordsChanged.addListener($scope.updateList);
		});
	}
	
	$rootScope.$on('UPDATE_NOTES_LIST', function() {
		$scope.updateList(true);
	});

	$scope.getNoteId 	= function () {
		return moduleService.noteId;
	}

	$scope.updateList = function (force) {
		$scope.notes = [];
		if (force) $scope.id = null;
		var records = $scope.noteTable.query();
		loadingService.nextStep();

		records.sort(function (noteA, noteB) {
			if (noteA.get('updated') < noteB.get('updated')) return 1;
			if (noteA.get('updated') > noteB.get('updated')) return -1;
			return 0;
		});

		for (var i = 0; i < records.length; i++) {
			var record = records[i];

			$scope.notes.push({
				'id' : record.getId(),
				'title' : record.get('title'),
				'content' : record.get('content'), 
				'created' : moment(record.get('created')),
				'updated' : moment(record.get('updated'))
			});
		}

		$scope.sync++;

		if(!$scope.$$phase) {
			$scope.$apply();
		}
	}

	$scope.open = function(noteId) {
		moduleService.noteId = noteId;
		$location.path('/notes/edit/' + noteId);
	}
});