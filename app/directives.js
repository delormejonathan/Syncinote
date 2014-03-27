angular.module('directives', []).

directive('taskToggle', function($http) {
	return {
		link: function(scope, element, attrs) {
			$(element , "a").click(function()
			{
				var taskToggle = $(element);

				// Deactivate tasks list
				if (taskToggle.hasClass('active'))
				{
					$(".app .tasks").animate (
						{
							opacity: 0.25,
							left: "-=290",
							height: "toggle"
						}, 
						{
							duration: 400, 
							queue: false,
							done : function () {
								taskToggle.removeClass('active');
							}
						}
					);
					$(".app .notes").animate (
						{
							// left: "-=290",
						}, 
						{
							duration: 400, 
							queue: false 
						}
					);
				}
				// Activate tasks list
				else
				{
					$(".app .tasks").animate (
						{
							opacity: 1,
							left: "+=290",
							height: "toggle"
						}, 
						{
							duration: 400, 
							queue: false,
							done : function () {
								taskToggle.addClass('active');
							}
						}
					);
					$(".app .notes").animate (
						{
							// left: "+=290",
						}, 
						{
							duration: 400, 
							queue: false 
						}
					);
				}
				
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
				focusOnLoad: true,
				clientSideStorage: false,
				autogrow: {
					minHeight: $(element).parent().resize(function() {
									return $(this).height();
								}),
					maxHeight: false
				}
			}).load(function() {
				scope.load(this);
			});
		}
	};
});