'use strict';

var app = angular.module('easyj.progress', [
  'ngStorage'
]);

app.controller('ProgressCtrl', function ($scope, $routeParams, $localStorage) {
  var prog = this;

  prog.cur = $localStorage.curStep || 1;
  prog.baseLink = '#/wizard/';

  // it would be nice if we could extract this data from the steps directory
  prog.steps = [
    {
      name: '',
      desc: 'Drivetrain',
    },{
      name: '',
      desc: 'Motors',
    },{
      name: '',
      desc: 'Pneumatics',
    },{
      name: '',
      desc: 'Driver Station Inputs',
    },{
      name: '',
      desc: 'Digital Inputs',
    },{
      name: '',
      desc: 'Analog Inputs',
    },{
      name: '',
      desc: 'Subsystems',
    },{
      name: '',
      desc: 'Acutator & Sensor Assiginment',
    },{
      name: '',
      desc: 'Action Code',
    },{
      name: '',
      desc: 'Commands',
    },{
      name: '',
      desc: 'Command Code',
    },{
      name: '',
      desc: 'Operator Interface (OI)',
    },{
      name: '',
      desc: 'Autonomous',
    },
  ];

  prog.getClass = function(s) {
    var out = 'disabled';
    if (prog.cur > s){
      out = 'complete';
    } else if (prog.cur == s) {
      out = 'active';
    } else {
      out = 'disabled';
    }
    if (s == $routeParams.step) {
      out += " selected";
    }
    return out;
  };

});
