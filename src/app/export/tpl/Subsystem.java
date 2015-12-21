
package {{package}}.subsystems;

import edu.wpi.first.wpilibj.command.Subsystem;

/**
 * [Add documentation here]
 * @author  [who are you]
 * @author  EasyJ 4 FRC v2
 */
public class {{name}} extends Subsystem {

	// Sensors
	{{!-- sensors really should not be public but we will deal for now --}}
	{{#each sensors}}
	public {{capFirst type}} {{name}} = new {{capFirst type}}({{port}});
	{{/each}}

	//Controllers
	{{#each controllers}}
	private {{capFirst type}} {{name}} = new {{capFirst type}}({{port}});
	{{/each}}

	//Solenoids
	{{#each solenoids}}
	private {{capFirst type}} {{name}} = new {{capFirst type}}({{port}});
	{{/each}}
    
    /**
     * Constructor
     */
    public {{name}}() {

    }

    /**
     * Set the default command for a subsystem here.
     */
    public void initDefaultCommand() {
        //setDefaultCommand(new MySpecialCommand());
    }

    // Put methods for controlling this subsystem
    // here. Call these from Commands.
    {{#each methods}}
	public void {{text}}() {
		//@todo Your code here.
	}
	{{/each}}
}

