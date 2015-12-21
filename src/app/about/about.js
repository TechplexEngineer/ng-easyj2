'use strict';

angular.module('easyj.about', ['ngRoute'])
	.config(function ($routeProvider) {
		$routeProvider
			.when('/about', {
				templateUrl: 'app/about/about.html',
				controller: 'AboutCtrl'
			});
	})
;

angular.module('easyj.about')
	.controller('AboutCtrl', function ($scope) {
		$scope.awesomeThings = [
			{
				'title': 'AngularJS',
				'url': 'https://angularjs.org/',
				'description': 'HTML enhanced for web apps!',
				'logo': 'angular.png'
			},
			{
				'title': 'BrowserSync',
				'url': 'http://browsersync.io/',
				'description': 'Time-saving synchronised browser testing. During development file changes trigger browser reload.',
				'logo': 'browsersync.png'
			},
			{
				'title': 'GulpJS',
				'url': 'http://gulpjs.com/',
				'description': 'The streaming build system. Used to compress and minify the code for production.',
				'logo': 'gulp.png'
			},
			// {
			//   'title': 'Jasmine',
			//   'url': 'http://jasmine.github.io/',
			//   'description': 'Behavior-Driven JavaScript.',
			//   'logo': 'jasmine.png'
			// },
			// {
			//   'title': 'Karma',
			//   'url': 'http://karma-runner.github.io/',
			//   'description': 'Spectacular Test Runner for JavaScript.',
			//   'logo': 'karma.png'
			// },
			// {
			//   'title': 'Protractor',
			//   'url': 'https://github.com/angular/protractor',
			//   'description': 'End to end test framework for AngularJS applications built on top of WebDriverJS.',
			//   'logo': 'protractor.png'
			// },
			{
				'title': 'jQuery',
				'url': 'http://jquery.com/',
				'description': 'jQuery is a fast, small, and feature-rich JavaScript library.',
				'logo': 'jquery.jpg'
			},
			{
				'title': 'Bootstrap',
				'url': 'http://getbootstrap.com/',
				'description': 'Bootstrap is the most popular HTML, CSS, and JS framework for developing responsive, mobile first projects on the web.',
				'logo': 'bootstrap.png'
			},
			{
				'title': 'Yeoman',
				'url': 'http://yeoman.io/',
				'description': 'Yeoman helps you to kickstart new projects, prescribing best practices and tools to help you stay productive.',
				'logo': 'yeoman.png'
			},{
				'title': 'Blockly',
				'url': 'https://developers.google.com/blockly/',
				'description': 'Blockly is a library for building visual programming editors. Used for the block coding steps.',
				'logo': 'blockly.png'
			},{
				'title': 'Lo-Dash',
				'url': 'https://lodash.com/',
				'description': 'A utility library delivering consistency, customization, performance, & extras',
				'logo': 'lodash.png'
			},{
				'title': 'Bower',
				'url': 'http://bower.io/',
				'description': 'A package manager for the web. Used to manage the frontend dependencies and libraries.',
				'logo': 'bower.png'
			},{
				'title': 'NPM',
				'url': 'https://www.npmjs.com/',
				'description': 'Node Package manager. Used for gulp modules and dependencies.',
				'logo': 'npm.png'
			},{
				'title': 'generator-gulp-angular',
				'url': 'https://github.com/Swiip/generator-gulp-angular',
				'description': 'A fantastic generator for Yeoman which helps setup the whole project structure.',
				'logo': 'generator-gulp-angular-logo.png'
			},{
				'title': 'Handlebars.js',
				'url': 'http://handlebarsjs.com/',
				'description': 'Minimal {{templating}} used for code generation.',
				'logo': 'handlebars.png'
			}
			// ,{
			// 	'title': 'Moment.js',
			// 	'url': 'http://momentjs.com/',
			// 	'description': 'Parse, validate, manipulate, and display dates in JavaScript.',
			// 	'logo': 'moment.jpg'
			// }


		];
		angular.forEach($scope.awesomeThings, function(awesomeThing) {
			awesomeThing.rank = Math.random();
		});
	});
