angular.module('directives', []).

directive('taskToggle', function($http) {
	return {
		link: function(scope, element, attrs) {
			var taskToggle = $(element);
			var taskContainer = $(".app .tasks");
			var editorContainer = $(".app .notes-editor");
			var editorActiveWidth = $(window).width() * 0.67 + (taskContainer.width() / 3) * 1 + "px";
			var editorDisableWidth = $(window).width() * 0.67 - (taskContainer.width() / 3) * 2 + "px";

			var enableTask = function() {
				$.cookie('taskActive' , "true");

				editorContainer.animate(
				{
					width: editorDisableWidth,
				}, 
				{
					duration: 400, 
					queue: false,
					done : function () {
						scope.$broadcast('TASK_TOGGLE');
						editorContainer.css('width' , 'calc(67% - ' + taskContainer.width() / 3 * 2 + 'px)');
					}
				});
				taskContainer.animate(
				{
					opacity: 1,
					marginLeft: "+=" + taskContainer.width() + "px",
				}, 
				{
					duration: 400, 
					queue: false,
					done : function () {
						taskToggle.addClass('active');
					}
				});
			}

			var disableTask = function() {
				$.cookie('taskActive' , "false");

				taskContainer.animate(
				{
					opacity: 0.25,
					marginLeft: "-=" + taskContainer.width() + "px",
				}, 
				{
					duration: 400, 
					queue: true,
					done : function () {
						taskToggle.removeClass('active');
					}
				});
				editorContainer.delay(60).animate(
				{
					width: editorActiveWidth,
				},
				{
					duration: 400, 
					queue: true,
					done : function () {
						scope.$broadcast('TASK_TOGGLE');
						editorContainer.css('width' , 'calc(67% + ' + taskContainer.width() / 3 * 1 + 'px)');
					}
				});
			}

			if ($.cookie('taskActive') == "false") {
				disableTask();
			}

			$(element , "a").click(function() {
				if (taskToggle.hasClass('active'))
					disableTask();
				else
					enableTask();
			});
		}
	};
}).

directive('tooltip', function() {
	return {
		link: function(scope, element, attrs) {
			$(element).tooltip({
				html: true
			});
		}
	};
}).

directive('epiceditor', function() {
	return {
		link: function(scope, element, attrs) {
			scope.editor = new EpicEditor({
				container: $(element).attr('id'),
				theme: {
					base: '../../css/vendor/epiceditor/epiceditor.css',
					preview: '../../css/vendor/epiceditor/preview/github.css',
					editor: '../../css/vendor/epiceditor/editor/epic-dark.css'
				},
				focusOnLoad: false,
				clientSideStorage: false,
				autogrow: {
					minHeight: $(element).parent().resize(function() {
									return $(this).height();
								}),
					maxHeight: false
				}
			}).load(function() {
				scope.load(this);

				scope.$on('TASK_TOGGLE', function() {
					scope.editor.reflow('width');
				});
			});
		}
	};
});