'use strict';

var app = angular.module('easyj.progress', []);

app.controller('ProgressCtrl', function ($scope, $routeParams) {
  var prog = this;

  prog.cur = $routeParams.step;

  // it would be nice if we could extract this data from the steps directory
  prog.steps = [
    {
      name: 'Step 1',
      desc: 'Drivetrain',
      link: '#/wizard/1',
      num: 1,
    },{
      name: 'Step 2',
      desc: 'Outputs (Actuators)',
      link: '#/wizard/2',
      num: 2,
    },{
      name: 'Step 3',
      desc: 'Inputs (Sensors + Operator Interface)',
      link: '#/wizard/3',
      num: 3,
    },{
      name: 'Step 4',
      desc: 'Subsystems',
      link: '#/wizard/4',
      num: 4,
    },{
      name: 'Step 5',
      desc: 'Commands',
      link: '#/wizard/5',
      num: 5,
    },{
      name: 'Step 6',
      desc: 'Code',
      link: '#/wizard/6',
      num: 6,
    },
  ];
  prog.steps.length

  prog.getClass = function(s) {
    var out = 'disabled';
    if (prog.cur > s){
      out = 'complete';
    } else if (prog.cur == s) {
      out = 'active';
    } else {
      out = 'disabled';
    }
    return out;
  };

});
