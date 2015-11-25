'use strict';

angular.module('easyj', [
  'ngRoute',
  'ngStorage',
  'easyj.about',
  'easyj.wiz',
  'easyj.progress',
  'ngTagsInput',
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
