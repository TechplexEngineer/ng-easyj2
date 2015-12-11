'use strict';

var app = angular.module('easyj.wiz', [
	'ngRoute',
	'ngStorage'
]);

app.config(function ($routeProvider) {
	$routeProvider
		.when('/wizard', {
			templateUrl: 'app/wiz/wiz.html'
		})
		.when('/wizard/:step', {
			templateUrl: function () {
				return 'app/wiz/steps/wiz_steps.html';
			},
			controller: 'WizCtrl',
			controllerAs: 'wiz'
		});
});



//zero pad a number
function pad(n, width, z) {
	z = z || '0';
	n = n + '';
	return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


app.controller('WizCtrl', function (Robot, $scope, $routeParams, $localStorage, $window) {
	var wiz = this;
	wiz.stepComplete = function (num) {
		if (typeof $localStorage.curStep === 'undefined') {
			$localStorage.curStep = num+1;
		} else {
			if (num >= $localStorage.curStep) {
				$localStorage.curStep = num+1;
			}
		}
		$window.location.href = '/#/wizard/'+(parseInt($routeParams.step)+1);
	};
	wiz.getCurStep = function () {
		return $localStorage.curStep || 1;
	};

	$scope.invalidateFutureSteps = wiz.invalidateFutureSteps = function() {
		if ($routeParams.step < wiz.getCurStep()) {
			$localStorage.curStep = parseInt($routeParams.step);
		}
	};
	wiz.test = function() {
		console.log("Test");
	};

	//@Make sure that you can't get to a step that isn't complete.
	if ($routeParams.step > this.getCurStep()) {
		$window.location.href = '/#/wizard/'+this.getCurStep();
		return;
	}

	this.step = pad($routeParams.step,2); //this is used to determine what template to load



	//make robot available to all views
	$scope.Robot = Robot;

	$scope.$localStorage = $localStorage;
});

app.controller('Wiz1Ctrl', function (Robot, $scope) {
	this.num = 1;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return (isValid && Robot.data.hasDrivetrain == 'yes') || Robot.data.hasDrivetrain == 'no';
	};
});
app.controller('Wiz2Ctrl', function (Robot, $scope) {
	this.num = 2;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return (isValid && Robot.data.hasOtherMotors == 'yes') || Robot.data.hasOtherMotors == 'no';
	};

});
app.controller('Wiz3Ctrl', function (Robot, $scope) {
	this.num = 3;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return (isValid && Robot.data.hasPneumatics == 'yes') || Robot.data.hasPneumatics == 'no';
	};
});
app.controller('Wiz4Ctrl', function (Robot, $scope) {
	this.num = 4;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return isValid;
	};
});
app.controller('Wiz5Ctrl', function (Robot, $scope) {
	this.num = 5;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return (isValid && Robot.data.hasDIN == 'yes') || Robot.data.hasDIN == 'no';
	};

});
app.controller('Wiz6Ctrl', function (Robot, $scope) {
	this.num = 6;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return (isValid && Robot.data.hasAIN == 'yes') || Robot.data.hasAIN == 'no';
	};
});
app.controller('Wiz7Ctrl', function (Robot, $scope) {
	this.num = 7;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return isValid;
	};
});
app.controller('Wiz8Ctrl', function (Robot, $scope) {
	this.num = 8;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return isValid;
	};
});
app.controller('Wiz9Ctrl', function (Robot, $scope, $timeout, $window) {
	var step = this;
	step.num = 9;
	step.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	step.currentSubsystem = Robot.getSubsystems()[0].name;
	step.currentAction = Robot.getSubsystems()[0].actions[0].text;
	if (_.isNull(document.getElementById('blocklyDiv'))) {
		console.error('It seems the blocklyDiv is missing.');
		return;
	}
	Blockly.inject(document.getElementById('blocklyDiv'),
	{
		path:'/blockly-src/', //@todo this will need to change in prod
		toolbox: document.getElementById('toolbox'),
		media:'/blockly-src/media/'
	});
	console.log("Ready!");
	$(document).trigger("blocklyLoaded");

	Blockly.mainWorkspace.reset = function() {
		$timeout(function() { //this waits for the {{step.currentAction}} to be injected before reloading blocks
			// Remove all blocks
			Blockly.mainWorkspace.clear();
			//Load the starting blocks
			var startingBlocks = document.getElementById('startingblocks');

			if (startingBlocks.innerHTML !== '') //if there are blocks
			{
				var xml = startingBlocks; //Blockly.Xml.textToDom(startingBlocks);
				Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
			} else {
				console.error('No starting blocks to load');
			}
		}, 0);
	};
	// $timeout(function() {
	// 	Blockly.mainWorkspace.reset();
	// }, 0);


	//Changes the active Action
	step.setActiveAction = function(newAction) {

		if(!_.contains(_.pluck(Robot.getActions(step.currentSubsystem), 'text'), newAction)) {
			alert('Action \"' + newAction + '\" does not exist.');
			return;
		}
		console.log("Setting active action to:",newAction);
		step.currentAction = newAction;
		var act = _.find(Robot.getActions(step.currentSubsystem), {'text':step.currentAction});

		if(Blockly.mainWorkspace && Blockly.mainWorkspace.getMetrics()) {
			var saved = {
				proc: act.xmlcode,
				vars: Robot.getSubsystem(step.currentSubsystem).stateVars
			};

			var dom = $('#startingblocks').clone();
			//Set the procedure name properly even if the html hasn't finished rendering
			$('block[type="procedures_defreturn"] mutation', dom).attr('procname', step.currentAction);


			if (saved.vars) {
				$('block[type="state_vars"]',dom).html($('block[type="state_vars"]',saved.vars).html());
			}
			if (saved.proc) {
				$('block[type="procedures_defreturn"]',dom).html($('block[type="procedures_defreturn"]',saved.proc).html());
			}

			dom = dom.get(0); //get the raw dom element from the jquery element
			Blockly.mainWorkspace.clear();
			Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, dom);


		// 	//Reload the Blockly toolbox to account for changes in blocks
		// 	$timeout(function() {
		// 		if(Blockly.Toolbox.HtmlDiv) {
		// 			Blockly.Toolbox.HtmlDiv.innerHTML = '';
		// 			Blockly.languageTree = document.getElementById('blockly-toolbox');
		// 			Blockly.Toolbox.init();
		// 		}
		// 	}, 0);
		}
	};
	step.nextAction = function() {
		var index = _.indexOf(_.pluck(Robot.getActions(step.currentSubsystem), 'text'), step.currentAction);
		if (index+1 >= Robot.getActions(step.currentSubsystem).length ) {
			console.error('Unable to go to next action, because there are no more actions!');
		} else {
			step.setActiveAction(Robot.getActions(step.currentSubsystem)[index+1].text);
		}
	};
	step.isActionComplete = function(action, subsys) {
		if (_.isUndefined(action)) {
			action = step.currentAction;
		}
		if (_.isUndefined(subsys)) {
			subsys = step.currentSubsystem;
		}
		var act = _.find(Robot.getActions(subsys), {'text':action});
		return (!_.isUndefined(act.isDone) && act.isDone);
	};

	//true when every action in the current susbsystem is true.
	step.isSubsystemComplete = function(subsys) {
		if (_.isUndefined(subsys)) {
			subsys = step.currentSubsystem;
		}
		if (_.isObject(subsys)) {
			subsys = subsys.name;
		}
		var a = _.map(Robot.getActions(subsys), function(el) {
			return step.isActionComplete(el.text, subsys);
		});
		return _.every(a);
	};
	step.nextSubsystem = function() {

		var index = _.indexOf(_.pluck(Robot.getSubsystems(), 'name'), step.currentSubsystem);
		if (index+1 >= Robot.getSubsystems().length ) {
			console.error('Unable to go to next subsystem, because there are no more subsystems!');
		} else {
			step.currentSubsystem = Robot.getSubsystems()[index+1].name;
			var action = Robot.getSubsystems()[index+1].actions[0].text;
			step.setActiveAction(action);
		}
	};
	step.isStepComplete = function() {
		//
		var done = _.map(Robot.getSubsystems(), function(subsys) {
			return step.isSubsystemComplete(subsys);
		});
		return _.every(done);
	};

	//used for the current subsystem dropdown
	step.currentSubsysChange = function() {
		step.setActiveAction(Robot.getActions(step.currentSubsystem)[0].text);
	};

	//save the users code and blocks
	step.persistCode = function() {

		var act = _.find(Robot.getActions(step.currentSubsystem), {'text':step.currentAction});


		var stateVars = Blockly.extensions.blockTypeToDom('state_vars');
		stateVars = Blockly.Xml.domToPrettyText(stateVars);
		Robot.getSubsystem(step.currentSubsystem).stateVars = stateVars;

		var proc = Blockly.extensions.blockTypeToDom('procedures_defreturn');
		proc = Blockly.Xml.domToPrettyText(proc);
		act.xmlcode = proc;

		if ( !act.isDone && Blockly.mainWorkspace.getAllBlocks().length > 2 ) {
			$scope.$apply(function () {
				act.isDone = true; //@todo need a better way to determine if their code is "done"
			});
		}
	};
	//Save the user's code if they refresh the page.
	// Sometimes mutator changes were not being saved
	//$window.onunload =
	$window.onbeforeunload = function() {
		// console.log("Here", Blockly.Xml.domToPrettyText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace)));
		//@todo For some reason mutations are not saved if executed just before a refresh
	};
	$scope.$on('$routeChangeStart', function(next, current) {
		console.log("Route Change Start");
		step.persistCode();
		Blockly.mainWorkspace.dispose();
	});

	/**
	 * When the workspace changes:
	 */
	function onchange() {
		step.persistCode();
		//whenever the workspace changes invalidate future steps
		step.invalidateFutureSteps();
	}

	// After the page is finished rendering, loadup blockly blocks
	$timeout(function() {
		step.setActiveAction(Robot.getActions(step.currentSubsystem)[0].text);
		Blockly.mainWorkspace.addChangeListener(onchange);
	}, 0);


});
app.controller('Wiz10Ctrl', function ($scope) {
	this.num = 10;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return isValid;
	};
});
app.controller('Wiz11Ctrl', function ($scope) {
	this.num = 11;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
	this.complete = function (isValid) {
		return isValid;
	};
});
app.controller('Wiz12Ctrl', function ($scope) {
	this.num = 12;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
});
app.controller('Wiz13Ctrl', function ($scope) {
	this.num = 13;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
});
app.controller('Wiz14Ctrl', function ($scope) {
	this.num = 14;
	this.invalidateFutureSteps = $scope.$parent.invalidateFutureSteps
});

function invalidateFutureSteps(self) {
	var el = angular.element(self);
	el.controller().invalidateFutureSteps();
}
