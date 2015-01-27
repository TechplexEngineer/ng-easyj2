'use strict';

var app = angular.module('easyj.wiz', [
  'ngResource',
  'ngRoute',
  'ngStorage',
  ])

app.config(function ($routeProvider) {
  $routeProvider
    .when('/wizard', {
      templateUrl: 'app/wiz/wiz.html'
    })
    .when('/wizard/:step', {
      templateUrl: function ($routeParams) {
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

    hids: [{name:'JS1',port:'',type:''}],
    sensors:{
      analog: [_.clone(EMPTY_AIO)],
      digital: [_.clone(EMPTY_DIO)],
    },
    // This really should be conditional based on the users earlier selected pref
    subsystems:[{name:'Drivetrain',actions:['drive','turn','drive with hid'], disabled:false}],

    commands:[{name: "ArcadeDrive",requires: ["Drivetrain"],type: "cmd"}],
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
      prettyName: "Talon",
    },{
      name:'jaguar',
      prettyName: "Jaguar (Not Recommended)",
    },{
      name:'talonsrx',
      prettyName: "Talon SRX (CAN)",
    },{
      name:'victorsp',
      prettyName: "Victor SP",
    }
  ];
  Robot.controller.toPretty = function(name) {
    var out =_.find(Robot.controller.choices, function (el) {
      return el.name == name;
    });
    return out && out.prettyName;
  };

  Robot.resetStorage = function() {
    $localStorage.$reset();
  };

  Robot.getSubsystems = function() {
  	return _.filter(Robot.data.subsystems, function(el){
  		if (! el['disabled']) {
  			return el;
  		}
  	});
  };
  Robot.getSubsystem = function(name) {
  	return _.find(Robot.data.subsystems, {"name":name});
  }
  //when displaying the subsystems form, make sure to show an empty slot.
  Robot.getInitialSubsystems = function() {
  	var subsys = Robot.getSubsystems();
  	if (subsys.length == 0) {
  		Robot.data.subsystems.push(_.clone(EMPTY_SUB));
  	}
  	return Robot.getSubsystems();
  };

  // Drivetrain ----------------------------------------------------------------

  Robot.drivetrainChange = function() {
    Robot.data.subsystems = _.map(Robot.data.subsystems, function(el) {
      if (el.name == "Drivetrain") {
        el.disabled = !(Robot.data.hasDrivetrain == 'yes');
      }
      return el;
    });
  };

  Robot.getNumPWM = function() {
    return _.map(_.range(0, Robot.limits.PWM), function(el){
      return el.toString()
    });
  };

  Robot.isPWMUsed = function(n) {
    var out = false;
    n=n.toString();
    //check drivetrain
    for (var i = 0; i < Robot.data.drivetrain.controllers.length; i++) {
      if (Robot.data.drivetrain.controllers[i].port === n) {
        out = true;
        break;
      }
    }
    //check other controllers
    for (var i = 0; i < Robot.data.controllers.length; i++) {
      if (Robot.data.controllers[i].port === n) {
        out = true;
        break;
      }
    }
    return out;
  };

  Robot.numMotorsChange = function () {
    Robot.data.drivetrain.controllers = [];
    var controllers = [];
    if (Robot.data.drivetrain.numMotors == 2) {
      controllers = ['left','right'];
    } else if (Robot.data.drivetrain.numMotors == 4) {
      controllers = ['frontLeft','rearLeft','frontRight','rearRight'];
    } else {
      throw new Error("Invalid number of motors");
    }

    for (var i = 0; i < controllers.length; i++) {
      var con = _.clone(EMPTY_CON);
      con.name = controllers[i];
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
      return el.toString()
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
      return el.toString()
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
      return el.toString()
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
      return el.toString()
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
    Robot.data.subsystems.push(_.clone(EMPTY_SUB));

  };
  Robot.removeSubsystem = function(item) {
    Robot.data.subsystems = Robot.data.subsystems.filter(function(el){
      return el !== item;
    });
  };

  return Robot;
});

//zero pad a number
function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}


app.controller('WizCtrl', function (Robot, $scope, $routeParams, $localStorage) {
  this.step = pad($routeParams.step,2); //this is used to determine what template to load

  this.stepComplete = function (num) {
    console.log(num);
    if (typeof $localStorage.curStep === 'undefined') {
      $localStorage.curStep = num+1;
    } else {
      if (num >= $localStorage.curStep) {
        $localStorage.curStep = num+1;
      }
    }
    console.log($localStorage.curStep);
  };
  // this.getCurStep = function () {
  //   return $localStorage.curStep || 1;
  // }

  //make robot available to all views
  $scope.Robot = Robot;

  $scope.$localStorage = $localStorage;
});

app.controller('Wiz1Ctrl', function (Robot, $scope, $localStorage) {
  this.num = 1;
});
app.controller('Wiz2Ctrl', function ($scope) {
  this.num = 2;
});
app.controller('Wiz3Ctrl', function ($scope) {
  this.num = 3;
});
app.controller('Wiz4Ctrl', function ($scope) {
  this.num = 4;
});
app.controller('Wiz5Ctrl', function ($scope) {
  this.num = 5;
});
app.controller('Wiz6Ctrl', function ($scope) {
  this.num = 6;
});
app.controller('Wiz7Ctrl', function ($scope) {
  this.num = 7;
});
app.controller('Wiz8Ctrl', function ($scope) {
  this.num = 8;
});
app.controller('Wiz9Ctrl', function (Robot, $scope) {
  this.num = 9;
  this.currentSubsystem = Robot.getSubsystems()[0].name;
  Blockly.inject(document.getElementById('blocklyDiv'),
        {toolbox: document.getElementById('toolbox')});
});
app.controller('Wiz10Ctrl', function ($scope) {
  this.num = 10;
});
app.controller('Wiz11Ctrl', function ($scope) {
  this.num = 11;
});
app.controller('Wiz12Ctrl', function ($scope) {
  this.num = 12;
});
