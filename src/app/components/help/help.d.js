
var app = angular.module('easyj.help', []);

app.directive('bbHelp', function() {
	return {
		restrict: 'A',
		replace: true,
		templateUrl: 'app/components/help/help.html',
		controllerAs: 'prog',
		controller: function($scope) {

		},
		transclude: true,
		link: function(scope, element, attrs, ctrl, transclude) {

			$(element).popover({
				trigger: "manual",
				animation: false,
				html : true,
				content:$(element).find('[ng-transclude]').html()
			}).on("mouseenter", function () {
					var _this = this;
					$(this).popover("show");
					$(".popover").on("mouseleave", function () {
							$(_this).popover('hide');
					});
			}).on("mouseleave", function () {
					var _this = this;
					setTimeout(function () {
							if (!$(".popover:hover").length) {
									$(_this).popover("hide");
							}
					}, 300);
			});//http://stackoverflow.com/a/19684440/429544

		}
	}
});

