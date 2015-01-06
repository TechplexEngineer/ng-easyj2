'use strict';

angular.module('easyj.wiz', ['ngResource', 'ngRoute'])
  .config(function ($routeProvider) {
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
  })
;

var app = angular.module('easyj.wiz');

app.controller('WizCtrl', function ($scope, $routeParams) {
  this.step = $routeParams.step;
});

app.controller('Wiz1Ctrl', function ($scope, $routeParams) {
  console.log("Wiz1Ctrl loaded");
  $scope.test = $routeParams;
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
