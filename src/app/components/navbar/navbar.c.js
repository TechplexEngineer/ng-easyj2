'use strict';

angular.module('easyj')
	.controller('NavbarCtrl', function ($scope, $location) {

		var nav = this;

		nav.isActive = function (viewLocation) {
			return viewLocation === $location.path();
		};
	});
