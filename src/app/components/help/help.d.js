
var app = angular.module('easyj.help', []);

app.directive('bbHelp', function() {
	return {
		restrict: 'A',
		replace: true,
		// require: 'ngModel',
		scope: {
			// ngModel: '&'
		},
		// template: '"Directive":{{ngModel()}}',
		templateUrl: 'app/components/help/help.html',
		controllerAs: 'prog',
		controller: function($scope) {
			// console.log("Controller");
			//data-toggle="popover"
		},
		transclude: true,
		link: function(scope, element, attrs, ctrl, transclude) {
			// console.log("Link", element);
			transclude(function(clone) {
				console.log("transclude",clone.html());
				$(element).popover({content:clone.html()});
			});
		}
	}
});

