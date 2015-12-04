'use strict';

angular.module('easyj', [
	'ngRoute',
	'ngStorage',
	'ngTagsInput',
	'easyj.about',
	'easyj.wiz',
	'easyj.progress',
	'easyj.progress',
	'easyj.help'
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
