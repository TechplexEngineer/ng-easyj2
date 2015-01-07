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
  var EMPTY_CON = _.clone(EMPTY_SOL);
  var EMPTY_HID = _.clone(EMPTY_SOL);
  var EMPTY_AIO = _.clone(EMPTY_SOL);
  var EMPTY_DIO = _.clone(EMPTY_SOL);
  var EMPTY_SUB = {name:'', actions:[]};
  var EMPTY_CMD = {name:'', requires:[]};

  var Robot ={};

  var def = {
    //step 1
    hasDrivetrain: undefined,
    numMotors: undefined,

    speedController: undefined,
    driveType: undefined,
    controllers: [],
    //step 2
    solenoids: [_.clone(EMPTY_SOL)],
    hasPneumatics: undefined,

    hids: [{name:'JS1',port:'',type:''}],
    sensors:{
      analog: [],
      digital: [],
    },
    // This really should be conditional based on the users earlier selected pref
    subsystems:[{name:'Drivetrain',actions:['drive','turn','drive with hid']}],

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

  Robot.resetStorage = function() {
    $localStorage.$reset();
  }

  Robot.getNumPWM = function() {
    return _.map(_.range(0, Robot.limits.PWM), function(el){
      return el.toString()
    });
  };

  Robot.isPWMUsed = function(n) {
    var out = false;
    n=n.toString();
    for (var i = 0; i < Robot.data.controllers.length; i++) {
      if (Robot.data.controllers[i].port === n) {
        out = true;
        break;
      }
    }
    return out;
  };

  Robot.numMotorsChange = function () {
    Robot.data.controllers = [];
    var controllers = [];
    if (Robot.data.numMotors == 2) {
      controllers = ['left','right'];
    } else if (Robot.data.numMotors == 4) {
      controllers = ['frontLeft','rearLeft','frontRight','rearRight'];
    }
    for (var i = 0; i < controllers.length; i++) {
      var con = _.clone(EMPTY_CON);
      con.name = controllers[i];
      con.type = Robot.data.speedController;
      Robot.data.controllers.push(con);
    }
  };

  Robot.speedControllerChange = function () {
    Robot.data.controllers = _.map(Robot.data.controllers, function(el){
      el.type = Robot.data.speedController;
      return el;
    });
  };

  return Robot;
});



app.controller('WizCtrl', function (Robot, $scope, $routeParams) {
  this.step = $routeParams.step; //this is used to determine what template to load

  //make robot available to all views
  $scope.Robot = Robot;
});

app.controller('Wiz1Ctrl', function (Robot, $scope, $localStorage) {
  var wiz = this;

  $scope.$localStorage = $localStorage;

  $scope.gettypeof = function(item){
    return (typeof item);
  };

});

app.controller('Wiz2Ctrl', function ($scope) {

});
app.controller('Wiz3Ctrl', function ($scope) {

});
app.controller('Wiz4Ctrl', function ($scope) {

});
app.controller('Wiz5Ctrl', function ($scope) {

});
app.controller('Wiz6Ctrl', function ($scope) {

});
