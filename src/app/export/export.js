'use strict';

var app = angular.module('easyj.export', []);

app.factory('Exporter', function(Robot){
	var data = Robot.data;

	var info = {
		team_number: 5122,
		pkgarr: ['org'],
	}
	info.pkgarr.push('t'+info.team_number)
	info['package'] = info.pkgarr.join('.')

	// cam this is a change
	// templates to iterate through
	// this has the limitation that you can't have the same named classes in your project
	var files = [
		{
			template: 'Robot.java',
			parse: true,
			out:"out/src/"+info.pkgarr.join('/')+"/Robot.java",
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
			out:"out/src/edu/wpi/first/wpilibj/buttons/JoystickAxisButton.java",
		},{
			template: 'Xbox.java',
			parse: false,
			out:"out/src/edu/wpi/first/wpilibj/Xbox.java",
		},{
			template: 	'OI.java',
			parse: true,
			out: "out/src/"+info.pkgarr.join('/')+"/OI.java",
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
			out: "out/src/"+info.pkgarr.join('/')+"/Constants.java",
			data: {
				'package': info['package'],
			}
		},{
			template: 'build.properties',
			parse: true,
			out: 'out/build.properties',
			data: {
				'package': info['package'],
			}
		},{
			template: '.classpath',
			parse: false,
			out:"out/.classpath",
		},{
			template: '.project',
			parse: false,
			out:"out/.project",
		},{
			template: 'build.xml',
			parse: false,
			out:"out/build.xml",
		}
	];

	if (data.hasDrivetrain == "yes") {
		dt = data.drivetrain
		subsys = _.where(data.subsystems, {"name": "Drivetrain"})
		if (subsys.length != 1) {
			console.err("Multiply defined subystem:",dt.subsystem)
		}
		actions = subsys[0].actions
		//console.log(actions)
		sen = _.where(data.sensors.analog, {"subsystem": dt.subsystem})
		sen = sen.concat(_.where(data.sensors.digital, {"subsystem": dt.subsystem}))

		files.push({
			template: 'Subsystem.java',
			parse: true,
			out: "out/src/"+info.pkgarr.join('/')+"/subsystems/"+dt.subsystem+".java",
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
				out: "out/src/"+info.pkgarr.join('/')+"/subsystems/"+sub.name+".java",
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
				out: "out/src/"+info.pkgarr.join('/')+"/commands/"+cmd.name+".java",
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

	function render(parse, infile, data, outfile) {
		template = fs.readFileSync(infile).toString();
		if (parse) {
			out = Handlebars.compile(template)(data);
		}
		dir = path.dirname(outfile);
		mkdirp(dir);
		fs.writeFileSync(outfile, out);
	}

	console.log("Processing Files")

	for (var i=0; i<files.length; i++) {
		var item = files[i];
		console.log(item.out)
		render(item.parse, path.join(templatedir, item.template), item.data, item.out)

	}

	console.log("Done")


	var zip = new JSZip();
	zip.file("Hello.txt", "Hello World\n");
	var img = zip.folder("images");
	img.file("smile.gif", imgData, {base64: true});
	var content = zip.generate({type:"blob"});
	// see FileSaver.js
	saveAs(content, "example.zip");

	var Exporter = {
		toEclipse: function(robotJson) {

		}
	};



	return Exporter;

});
