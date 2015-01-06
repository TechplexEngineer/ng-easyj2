'use strict';

var app = angular.module('easyj.wiz', ['ngResource', 'ngRoute'])

app.config(function ($routeProvider) {
  $routeProvider
    .when('/wizard', {
      templateUrl: 'app/wiz/wiz.html',
      controller: 'WizCtrl'
    })
    .when('/wizard/:step', {
      templateUrl: function ($routeParams) {
        return 'app/wiz/steps/wiz_steps.html';
      },
      controller: 'WizCtrl',
      controllerAs: 'wiz'
    });
});

app.factory('RobotLimits', function() {
  console.log("Robot Limits factory");
  var limits = {
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
  return limits;
});

app.factory('RobotData', function(){
  console.log("Robot Data factory");
  return {name:"test"};
});



app.controller('WizCtrl', function ($scope, $routeParams) {
  this.step = $routeParams.step; //this is used to determine what template to load
});

app.controller('Wiz1Ctrl', function (RobotData) {
  console.log("Wiz1Ctrl loaded", RobotData);

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
