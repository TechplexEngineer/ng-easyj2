
var app = angular.module('easyj.progress', [
	'ngStorage'
]);

app.directive('bbProgress', function() {
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

			prog.getClass = function(s, cur) {
				var out = 'disabled';
				if (cur > s){
					out = 'complete';
				} else if (cur === s) {
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

			//remember ngModel is the highest acheived step
			$scope.$watch('ngModel()', function() {

				for (var i = 0; i < prog.steps.length; i++) {
					prog.steps[i].class = prog.getClass(i+1);
				}

			});
		}
	}
});

