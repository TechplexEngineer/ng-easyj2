
var app = angular.module('easyj.sparkline', [
	'ngStorage'
]);

app.directive('ngSparkline', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		scope: {
			ngModel: '&'
		},
		// template: '"Directive":{{ngModel()}}',
		templateUrl: 'app/components/progress/progress.html',
		controllerAs: 'prog',
		controller: function($scope, $routeParams, $timeout) {
			var prog = this;

			prog.cur = $scope.ngModel();
			prog.baseLink = '#/wizard/';

			prog.getClass = function(s) {
				var out = 'disabled';
				if (prog.cur > s){
					out = 'complete';
				} else if (prog.cur === s) {
					out = 'active';
				} else {
					out = 'disabled';
				}
				if (s.toString() === $routeParams.step) {
					out += ' selected';
				}
				return out;
			};

			// it would be nice if we could extract this data from the steps directory
			prog.steps = [
				{
					desc: 'Drivetrain'
				},{
					desc: 'Motors'
				},{
					desc: 'Pneumatics'
				},{
					desc: 'Driver Station Inputs'
				},{
					desc: 'Digital Inputs'
				},{
					desc: 'Analog Inputs'
				},{
					desc: 'Subsystems'
				},{
					desc: 'Acutator & Sensor Assiginment'
				},{
					desc: 'Action Code'
				},{
					desc: 'Commands'
				},{
					desc: 'Command Code'
				},{
					desc: 'Operator Interface (OI)'
				},{
					desc: 'Autonomous'
				}
			];
			for (var i = 0; i < prog.steps.length; i++) {
				prog.steps[i].class = prog.getClass(i+1);
			}
			console.log("ctrl");
			$scope.$watch('ngModel()', function() {

				console.log("changed!");

				//@note welp I feel like this should work...
				$timeout(function() {
					// anything you want can go here and will safely be run on the next digest.
					$scope.$apply(function(){
						for (var i = 0; i < prog.steps.length; i++) {
							prog.steps[i].class = prog.getClass(i+1);
						}
					});
				});

			});
		}
	}
});

