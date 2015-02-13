'use strict';

var app = angular.module('easyj.wiz', [
  'ngResource',
  'ngRoute',
  'ngStorage',
  'angular-tour',
  'mgcrea.ngStrap'
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

app.factory('Robot', function($localStorage){

  //empty templates
  var EMPTY_SOL = {name:'',port:'',type:''};
  var EMPTY_CON = _.clone(EMPTY_SOL); //motor controller
  var EMPTY_HID = _.clone(EMPTY_SOL);
  var EMPTY_AIO = _.clone(EMPTY_SOL);
  var EMPTY_DIO = _.clone(EMPTY_SOL);
  var EMPTY_SUB = {name:'', actions:[], disabled:false};
  var EMPTY_CMD = {name:'', requires:[]};
  //@note: when cloning EMPTY_* make sure to use cloneDeep when an array is involved

  var Robot ={};

  var def = {
    //step 1
    hasDrivetrain: undefined,
    numMotors: undefined,
    drivetrain: {
      mcType: undefined,
      controllers: [],
      numMotors: undefined,
      type: undefined,
    },

    driveType: undefined,
    controllers: [_.clone(EMPTY_CON)],
    //step 2
    solenoids: [_.clone(EMPTY_SOL)],
    hasPneumatics: undefined,

    hids: [{name:'driver1',port:'0',type:''}],
    sensors:{
      analog: [_.clone(EMPTY_AIO)],
      digital: [_.clone(EMPTY_DIO)],
    },
    // This really should be conditional based on the users earlier selected pref
    subsystems:[{name:'Drivetrain',actions:['drive','drive with joystick'], disabled:false}],

    commands:[{name: 'ArcadeDrive',requires: ['Drivetrain'],type: 'cmd'}],
  };

  // //the data about the user's robot stored here
  Robot.data = $localStorage.$default(_.clone(def));

  Robot.limits = {
    PWM: 10,
    Sol: 8,
    ds: {
      USB: 4
    },
    sensors: {
      analog: 4,
      digital: 10
    },
    relay: 4
  };

  Robot.controller = {};
  Robot.controller.choices = [
    {
      name:'victor',
      prettyName:'Victor',
    },{
      name:'talon',
      prettyName: 'Talon',
    },{
      name:'jaguar',
      prettyName: 'Jaguar (Not Recommended)',
    },{
      name:'talonsrx',
      prettyName: 'Talon SRX (CAN)',
    },{
      name:'victorsp',
      prettyName: 'Victor SP',
    }
  ];
  Robot.controller.toPretty = function(name) {
    var out =_.find(Robot.controller.choices, function (el) {
      return el.name === name;
    });
    return out && out.prettyName;
  };

  Robot.resetStorage = function() {
    $localStorage.$reset();
    $localStorage.$default(_.clone(def));
    $localStorage.curStep = 1;
  };

  Robot.resetBlocks = function() {
  	for (var i = 0; i < Robot.data.subsystems.length; i++) {
  		var act = Robot.data.subsystems[i].actions;
  		delete Robot.data.subsystems[i].stateVars;
  		for (var j = 0; j < act.length; j++) {
  			delete act[j].code;
  			delete act[j].xmlcode;
  			delete act[j].isDone;
  		}
  	}
  	Blockly.mainWorkspace.reset();
  };

  Robot.getSubsystems = function() {
  	return _.filter(Robot.data.subsystems, function(el){
  		if (! el.disabled) {
  			return el;
  		}
  	});
  };
  Robot.getSubsystem = function(name) {
  	return _.find(Robot.data.subsystems, {'name':name});
  };
  //when displaying the subsystems form, make sure to show an empty slot.
  Robot.getInitialSubsystems = function() {
  	var subsys = Robot.getSubsystems();
  	if (subsys.length === 0) {
  		Robot.data.subsystems.push(_.cloneDeep(EMPTY_SUB));
  	}
  	return Robot.getSubsystems();
  };

  Robot.getActions = function(subsys) {
  	return Robot.getSubsystem(subsys) && Robot.getSubsystem(subsys).actions;
  };

  // Drivetrain ----------------------------------------------------------------

  Robot.drivetrainChange = function() {
    Robot.data.subsystems = _.map(Robot.data.subsystems, function(el) {
      if (el.name === 'Drivetrain') {
        el.disabled = (Robot.data.hasDrivetrain !== 'yes');
      }
      return el;
    });
  };

  Robot.getNumPWM = function() {
    return _.map(_.range(0, Robot.limits.PWM), function(el){
      return el.toString();
    });
  };

  Robot.isPWMUsed = function(n) {
    var out = false;
    n=n.toString();
    //check drivetrain
    for (var i = 0; i < Robot.data.drivetrain.controllers.length; i++) {
      if (Robot.data.drivetrain.controllers[i].port.toString() === n.toString()) {
        out = true;
        break;
      }
    }
    //check other controllers
    for (i = 0; i < Robot.data.controllers.length; i++) {
      if (Robot.data.controllers[i].port.toString() === n.toString()) {
        out = true;
        break;
      }
    }
    return out;
  };

  Robot.numMotorsChange = function () {
    Robot.data.drivetrain.controllers = [];
    var controllers = [];
    if (Robot.data.drivetrain.numMotors === '2') {
      controllers = ['left','right'];
    } else if (Robot.data.drivetrain.numMotors === '4') {
      controllers = ['frontLeft','rearLeft','frontRight','rearRight'];
    } else {
      throw new Error('Invalid number of motors');
    }

    for (var i = 0; i < controllers.length; i++) {
      var con = _.clone(EMPTY_CON);
      con.name = controllers[i];
      con.port = (! Robot.isPWMUsed(i)) ? i : "" ;
      con.type = Robot.data.drivetrain.mcType;
      Robot.data.drivetrain.controllers.push(con);
    }
  };

  Robot.mcTypeChange = function () {
    Robot.data.drivetrain.controllers = _.map(Robot.data.drivetrain.controllers, function(el){
      el.type = Robot.data.drivetrain.mcType;
      return el;
    });
  };

  // Motors --------------------------------------------------------------------
  Robot.addController = function() {
    if ( (Robot.data.controllers.length - Robot.data.drivetrain.controllers.length) < Robot.limits.PWM) {
      Robot.data.controllers.push(_.clone(EMPTY_CON));
    }

  };
  Robot.removeController = function(item) {
    Robot.data.controllers = Robot.data.controllers.filter(function(el){
      return el !== item;
    });
  };


  // Pneumatics ----------------------------------------------------------------

  Robot.isSolPortUsed = function(n) {
    var out = false;
    n=n.toString();
    for (var i = 0; i < Robot.data.solenoids.length; i++) {
      if (Robot.data.solenoids[i].port === n) {
        out = true;
        break;
      }
    }
    return out;
  };
  Robot.getNumSolPorts = function() {
    return _.map(_.range(0, Robot.limits.Sol), function(el){
      return el.toString();
    });
  };

  Robot.addSolenoid = function() {
    if (Robot.data.solenoids.length < Robot.limits.Sol) {
      Robot.data.solenoids.push(_.clone(EMPTY_SOL));
    }

  };
  Robot.removeSolenoid = function(item) {
    Robot.data.solenoids = Robot.data.solenoids.filter(function(el){
      return el !== item;
    });
  };

  // DS Inputs -----------------------------------------------------------------
  Robot.getNumUSBPorts = function() {
    return _.map(_.range(0, Robot.limits.ds.USB), function(el){
      return el.toString();
    });
  };
  Robot.isUSBPortUsed = function(n) {
    var out = false;
    n=n.toString();
    for (var i = 0; i < Robot.data.hids.length; i++) {
      if (Robot.data.hids[i].port === n) {
        out = true;
        break;
      }
    }
    return out;
  };
  Robot.addHID = function() {
    if (Robot.data.hids.length < Robot.limits.ds.USB) {
      Robot.data.hids.push(_.clone(EMPTY_HID));
    }
  };
  Robot.removeHID = function(item) {
    Robot.data.hids = Robot.data.hids.filter(function(el){
      return el !== item;
    });
  };
  // Digital Inputs ------------------------------------------------------------
  Robot.getNumDigitalPorts = function() {
    return _.map(_.range(0, Robot.limits.sensors.digital), function(el){
      return el.toString();
    });
  };
  Robot.isDigitalPortUsed = function(n) {
    var out = false;
    n=n.toString();
    for (var i = 0; i < Robot.data.sensors.digital.length; i++) {
      if (Robot.data.sensors.digital[i].port === n) {
        out = true;
        break;
      }
    }
    return out;
  };
  Robot.addDigitalSensor = function() {
    if (Robot.data.sensors.digital.length < Robot.limits.sensors.digital) {
      Robot.data.sensors.digital.push(_.clone(EMPTY_AIO));
    }
  };
  Robot.removeDigitalSensor = function(item) {
    Robot.data.sensors.digital = Robot.data.sensors.digital.filter(function(el){
      return el !== item;
    });
  };
  // Analog Inputs -------------------------------------------------------------
  Robot.getNumAnalogPorts = function() {
    return _.map(_.range(0, Robot.limits.sensors.analog), function(el){
      return el.toString();
    });
  };
  Robot.isAnalogPortUsed = function(n) {
    var out = false;
    n=n.toString();
    for (var i = 0; i < Robot.data.sensors.analog.length; i++) {
      if (Robot.data.sensors.analog[i].port === n) {
        out = true;
        break;
      }
    }
    return out;
  };
  Robot.addAnalogSensor = function() {
    if (Robot.data.sensors.analog.length < Robot.limits.sensors.analog) {
      Robot.data.sensors.analog.push(_.clone(EMPTY_AIO));
    }
  };
  Robot.removeAnalogSensor = function(item) {
    Robot.data.sensors.analog = Robot.data.sensors.analog.filter(function(el){
      return el !== item;
    });
  };
   // Subsystems ---------------------------------------------------------------
  Robot.addSubsystem = function() {
    Robot.data.subsystems.push(_.cloneDeep(EMPTY_SUB));

  };
  Robot.removeSubsystem = function(item) {
    Robot.data.subsystems = Robot.data.subsystems.filter(function(el){
      return el !== item;
    });
  };
  // Commands ------------------------------------------------------------------

	Robot.addCommand = function() {
		if (!_.isArray(Robot.data.commands)) {
			Robot.data.commands = [];
		}
		Robot.data.commands.push(_.clone(EMPTY_CMD));
	};
	Robot.removeCommand = function(item) {
		Robot.data.commands = Robot.data.commands.filter(function(el){
			return el !== item;
		});
	};
	Robot.addRequires = function(cmd) {
		if (cmd.requires.length < Robot.data.subsystems.length &&
			_.indexOf(cmd.requires, '') === -1 ) {//not in list
			cmd.requires.push('ted');
			console.log('here');
		} else {
			console.error('Can\'t add requires.');
		}

	};

  return Robot;
});

//zero pad a number
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


app.controller('WizCtrl', function (Robot, $scope, $routeParams, $localStorage, $window) {

	this.stepComplete = function (num) {
    if (typeof $localStorage.curStep === 'undefined') {
      $localStorage.curStep = num+1;
    } else {
      if (num >= $localStorage.curStep) {
        $localStorage.curStep = num+1;
      }
    }
  };
  this.getCurStep = function () {
    return $localStorage.curStep || 1;
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

app.controller('Wiz1Ctrl', function () {
  this.num = 1;
});
app.controller('Wiz2Ctrl', function () {
  this.num = 2;
});
app.controller('Wiz3Ctrl', function () {
  this.num = 3;
});
app.controller('Wiz4Ctrl', function () {
  this.num = 4;
});
app.controller('Wiz5Ctrl', function () {
  this.num = 5;
});
app.controller('Wiz6Ctrl', function () {
  this.num = 6;
});
app.controller('Wiz7Ctrl', function () {
  this.num = 7;
});
app.controller('Wiz8Ctrl', function () {
  this.num = 8;
});
app.controller('Wiz9Ctrl', function (Robot, $scope, $timeout, $window) {
	var step = this;
  step.num = 9;
  step.currentSubsystem = Robot.getSubsystems()[0].name;
  step.currentAction = Robot.getSubsystems()[0].actions[0].text;
  if (_.isNull(document.getElementById('blocklyDiv'))) {
  	console.error('It seems the blocklyDiv is missing.');
  	return;
  }
  Blockly.inject(document.getElementById('blocklyDiv'),
        {
        	path:'/blockly/',
        	toolbox: document.getElementById('toolbox'),
        	media:'/blockly/media/'
        });

  Blockly.mainWorkspace.reset = function() {
  	$timeout(function() { //this wits for the {{step.currentAction}} to be injected before reloading blocks
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

	/**
	 * When the workspace changes:
	 */
	function onchange() {
		step.persistCode();
	}

	// After the page is finished rendering, loadup blockly blocks
	$timeout(function() {
		step.setActiveAction(Robot.getActions(step.currentSubsystem)[0].text);
		Blockly.addChangeListener(onchange);
	}, 0);


});
app.controller('Wiz10Ctrl', function () {
  this.num = 10;
});
app.controller('Wiz11Ctrl', function () {
  this.num = 11;
});
app.controller('Wiz12Ctrl', function () {
  this.num = 12;
});
app.controller('Wiz12Ctrl', function () {
  this.num = 13;
});
