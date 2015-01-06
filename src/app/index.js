'use strict';

angular.module('easyj', [
  'ngResource',
  'ngRoute',
  'easyj.about',
  'easyj.wiz',
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/main/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
;
