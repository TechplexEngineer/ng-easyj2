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

});
