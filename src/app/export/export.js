'use strict';

var app = angular.module('easyj.export', []);

app.factory('Exporter', function(Robot){
	var data = Robot.data;

	var info = {
		team_number: data.number,
		pkgarr: ['org'],
	}
	var templatedir = "/assets/tpl/java";
	info.pkgarr.push('t'+info.team_number)
	info['package'] = info.pkgarr.join('.')

	// cam this is a change
	// templates to iterate through
	// this has the limitation that you can't have the same named classes in your project
	var files = [
		{
			template: 'Robot.java',
			parse: true,
			out:"src/"+info.pkgarr.join('/')+"/Robot.java",
			data: {
				'package': info['package'],
				'autos': [
					{
						type:"Default",
						name:"Default Command",
						command:"DefaultAuto"
					},{
						type:"Object",
						name:"Regular Command",
						command:"RegularAuto"
					}
				],
				subsystems: _.pluck(data.subsystems, "name")
			}
		},{
			template: 'JoystickAxisButton.java',
			parse: false,
			out:"src/edu/wpi/first/wpilibj/buttons/JoystickAxisButton.java",
		},{
			template: 'Xbox.java',
			parse: false,
			out:"src/edu/wpi/first/wpilibj/Xbox.java",
		},{
			template: 	'OI.java',
			parse: true,
			out: "src/"+info.pkgarr.join('/')+"/OI.java",
			data: {
				'package': info['package'],
				hids: data.hids,
				old: [
					{
						"name": "d1",
						"port": "0",
						"type": "joystick"
					},
					{
						"name": "d2",
						"port": "1",
						"type": "xbox"
					},
					{
						"name": "d3",
						"port": "2",
						"type": "ps"
					}
				],
				buttons: []
			}
		},{
			template: 'Constants.java',
			parse:true,
			out: "src/"+info.pkgarr.join('/')+"/Constants.java",
			data: {
				'package': info['package'],
			}
		},{
			template: 'build.properties',
			parse: true,
			out: 'build.properties',
			data: {
				'package': info['package'],
			}
		},{
			template: 'classpath.txt',
			parse: false,
			out:".classpath",
		},{
			template: 'project.txt',
			parse: false,
			out:".project",
		},
		// {
		// 	template: 'build.xml',
		// 	parse: false,
		// 	out:"build.xml",
		// }
	];

	if (data.hasDrivetrain == "yes") {
		var dt = data.drivetrain
		var subsys = _.where(data.subsystems, {"name": "Drivetrain"})
		if (subsys.length != 1) {
			console.err("Multiply defined subystem:",dt.subsystem)
		}
		var actions = subsys[0].actions
		//console.log(actions)
		var sen = _.where(data.sensors.analog, {"subsystem": dt.subsystem})
		sen = sen.concat(_.where(data.sensors.digital, {"subsystem": dt.subsystem}))

		files.push({
			template: 'Subsystem.java',
			parse: true,
			out: "src/"+info.pkgarr.join('/')+"/subsystems/"+dt.subsystem+".java",
			data: {
				'package': info['package'],
				name: dt.subsystem,
				sensors: sen,
				controllers: dt.controllers,
				methods: actions,
				solenoids: _.where(data.solenoids, {"subsystem": dt.subsystem})
			}
		});
	}

	//Other subsystems:
	for (var i =0; i < data.subsystems.length; i++){
		var sub = data.subsystems[i]
		if (sub.name != "Drivetrain"){
			sen = _.where(data.sensors.analog, {"subsystem": sub.name})
			sen = sen.concat(_.where(data.sensors.digital, {"subsystem": sub.name}))
			files.push({
				template: 'Subsystem.java',
				parse: true,
				out: "src/"+info.pkgarr.join('/')+"/subsystems/"+sub.name+".java",
				data: {
					'package': info['package'],
					name: sub.name,
					sensors: sen,
					controllers: _.where(data.controllers, {"subsystem": sub.name}),
					solenoids: _.where(data.solenoids, {"subsystem": sub.name}),
					methods: sub.actions,
				}
			})
		}
	}

	for (var i=0; i<data.commands.length; i++){
		var cmd = data.commands[i];
		//console.log(cmd)

		if (cmd.type == 'cmd'){
			files.push({
				template: 'Command.java',
				parse: true,
				out: "src/"+info.pkgarr.join('/')+"/commands/"+cmd.name+".java",
				data: {
					package: info.package,
					name: cmd.name,
					req: cmd.requires
				}
			})
		}
	}

	Handlebars.registerHelper('capFirst', function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	});
	var path = {
		dirname: function(path) {
			var p= path.replace(/\\/g, '/').replace(/\/[^\/]*\/?$/, '');
			if (p == path) {
				return "";
			}
			return p;
		},
		basename: function(path) {
			return path.replace(/^.*(\\|\/|\:)/, '');
		},
		join: function(){
			var args = Array.prototype.slice.call(arguments);
			return args.join('/');
		}
	};

	var Exporter = {
		toEclipse: function(robotJson) {

			var zip = new JSZip();
			var deferreds = [];

			function render(item) {
				var deferred = $.Deferred();

				var urlPath = path.join(templatedir, item.template);

				$.get(urlPath, function( template ) {
					// console.log("GET", urlPath, template);

					var out = template;
					if (item.parse) {
						out = Handlebars.compile(template)(item.data);
					}

					var p = path.dirname(item.out);
					p = p.split('/');

					var f = null;
					for (var i = 0; i < p.length; i++) {
						if (!f) {
							f = zip.folder(p[i])
						} else {
							f = f.folder(p[i])
						}
					}
					f.file(path.basename(item.out), out);

					deferred.resolve();
				});
				return deferred;
			}

			for (var i=0; i<files.length; i++) {
				var item = files[i];
				deferreds.push(render(item));
			}

			$.when.apply($, deferreds).done(function () {
				var blob = zip.generate({type:"blob"});
				saveAs(blob, data.number+"_code.zip");
			});
		}
	};



	return Exporter;

});
