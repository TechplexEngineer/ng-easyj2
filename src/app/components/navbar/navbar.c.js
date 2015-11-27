'use strict';

angular.module('easyj')
	.controller('NavbarCtrl', function ($scope, $location) {
		$scope.date = new Date();
		var nav = this;

		nav.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};
	});
