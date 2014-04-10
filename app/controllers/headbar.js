SynciNote.controller('headbarCtrl', function ($scope, moduleService, loadingService) {
	$scope.isTaskActive = function () {
		return moduleService.isTaskActive();
	}

	$scope.isEditorActive = function () {
		return moduleService.isEditorActive();
	}

	$scope.activateTask = function () {
		if (moduleService.isTaskActive())
			moduleService.activateList();
		else
			moduleService.activateTask();
		
		moduleService.noteId = null;
	}
	
	$scope.activateList = function () {
		moduleService.activateList();
		moduleService.noteId = null;
	}
});