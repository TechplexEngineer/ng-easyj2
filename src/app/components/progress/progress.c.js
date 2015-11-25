'use strict';

var app = angular.module('easyj.progress', [
  'ngStorage'
]);

app.controller('ProgressCtrl', function ($scope, $routeParams, $localStorage) {
  var prog = this;

  // prog.cur = $scope.ngModel; //$localStorage.curStep || 1;
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


// Restrict:
// 'A' - <span ng-sparkline></span>
// 'E' - <ng-sparkline></ng-sparkline>
// 'C' - <span class="ng-sparkline"></span>
// 'M' - <!-- directive: ng-sparkline -->
// var app = angular.module('easyj.progress');

app.directive('bbProgress', function() {
  return {
    restrict: 'A',
    require: '^ngModel',
    scope: {
      ngModel: '&ngModel'
    },
    templateUrl: '/app/components/progress/progress.html',
    controller: 'ProgressCtrl',
    controllerAs: 'prog',
    link: function(scope, iElement, iAttrs, ctrl) {
      ctrl.cur = scope.ngModel();
      console.log("Here", scope.ngModel());
    }
  }
});

app.directive('bbProg', function() {
  return {
    restrict: 'A',
    // template: '<div class="sparkline"></div>'
    require: '^ngModel',
    scope: {
      ngModel: '&ngModel'
    },
    template: '<div>{{$scope.ngModel()}}</div>',
    // templateUrl: '/app/components/progress/progress.html',
    // controller: 'ProgressCtrl',
    // controllerAs: 'prog',
    link: function(scope, iElement, iAttrs, ctrl) {
      console.log("Here", scope.ngModel());
      ctrl.cur = iAttrs.ngModel;
    }
  }
});
