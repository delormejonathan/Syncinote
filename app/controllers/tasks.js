SynciNote.controller('tasksCtrl', function ($rootScope , $scope, $http, dropboxService) {
	$scope.name = null;
	$scope.tasks = [];
	$scope.taskTable = null;
	$scope.sync = 0;

	// Dropbox API
	if (dropboxService.isAuth())
	{
		dropboxService.getDatastore(function (datastore) {
			$scope.taskTable = datastore.getTable('tasks');
			$scope.updateList();
			datastore.recordsChanged.addListener($scope.updateList);
		});
	}

	$scope.updateList = function () {
		$scope.tasks = [];
		var records = $scope.taskTable.query();

		records.sort(function (taskA, taskB) {
			if (taskB.get('done')) return -1;
			if (taskA.get('updated') < taskB.get('updated')) return 1;
			if (taskA.get('updated') > taskB.get('updated')) return -1;
			return 0;
		});

		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			$scope.tasks.push({
					'id' : record.getId(),
					'name' : record.get('name'),
					'done' : record.get('done'), 
					'created' : moment(record.get('created'))
				});

		}

		$scope.clear();

		$scope.sync++;

		if ($scope.sync < 2)
			$scope.$apply();

	}

	$scope.clear = function(force) {
		var now = moment();
		var records = $scope.taskTable.query();
		for (var i = 0; i < records.length; i++) {
			var record = records[i];
			if (record.get('done')) {
				if (force || now.diff(moment(record.get('created')) , 'days') > 7) {
					record.deleteRecord();
				}
				
			}
		}
	}

	$scope.update = function(task) {
		var record = $scope.taskTable.get(task.id);
		record.set('done' , ! task.done);
		record.set('updated' , new Date());
	}

	$scope.save = function() {
		if ($scope.taskForm.$valid) {
			var query = $scope.taskTable.insert({
				name: $scope.name,
				done: false,
				created: new Date(),
				updated: new Date()
			});
			$scope.name = null;
		}
	}

});