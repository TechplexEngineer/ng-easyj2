
package {{package}};

import edu.wpi.first.wpilibj.IterativeRobot;
import edu.wpi.first.wpilibj.Preferences;
import edu.wpi.first.wpilibj.command.Command;
import edu.wpi.first.wpilibj.command.Scheduler;
import edu.wpi.first.wpilibj.livewindow.LiveWindow;
import edu.wpi.first.wpilibj.smartdashboard.SendableChooser;
import edu.wpi.first.wpilibj.smartdashboard.SmartDashboard;

import {{package}}.commands.*;
import {{package}}.commands.auto.*;
import {{package}}.subsystems.*;



/**
 * The VM is configured to automatically run this class, and to call the
 * functions corresponding to each mode, as described in the IterativeRobot
 * documentation. If you change the name of this class or the package after
 * creating this project, you must also update the manifest file in the resource
 * directory.
 */
public class Robot extends IterativeRobot {

	public static final ExampleSubsystem exampleSubsystem = new ExampleSubsystem();
	public static OI oi;
	public static Preferences prefs;
	
	private SendableChooser autoChooser;
	
	//create static instances of subsystems here
    {{#each subsystems}}
    public static {{capFirst this}} s_{{this}};
    {{else}}
    // It looks like you haven't defined any subsystems. @todo
    // Create static variables here so you can access them in your commands. Example:
    // public static Drivetrain drive;
    {{/each}}

    Command autonomousCommand;

    /**
     * This function is run when the robot is first started up and should be
     * used for any initialization code.
     */
    public void robotInit() {
    	System.out.println("Starting robot code");
		oi = new OI();
		prefs = Preferences.getInstance();
		
		// call the constructors of any subsystems which require parameters.
        {{#each subsystems}}
        s_{{this}} = new {{capFirst this}}();
        {{else}}
        // Since you haven't defined any sybsystems, we'll leave an example of calling the constructor:
        // drive = new Drivetrain();
        {{/each}}
        
        // OI must be constructed after subsystems. If the OI creates Commands 
        // (which it very likely will), subsystems are not guaranteed to be 
        // constructed yet. Thus, their requires() statements may grab null 
        // pointers. Bad news. Don't move it.
        oi = new OI();
        
        // Create autonomous options. If the smart dashboard is not running 
        // or disconnected the default auto is selected.
        autoChooser = new SendableChooser();

        {{#each autos}}
        autoChooser.add{{type}}("{{name}}", new {{command}}());
        {{else}}
        // It looks like you haven't defined any autonomous modes. @todo
        // Here are some examples:
        // autoChooser.addDefault("Default Command", new DefaultAuto()); //The default auto mode
        // autoChooser.addObject("Regular Command", new RegularAuto());  //Another auto mode
        {{/each}}

        SmartDashboard.putData("Auto Chooser", autoChooser);
    }
	
	
    /**
     * This method runs once at the beginning of autonomous mode.
     * Generally used to start the autonomous program.
     */
    public void autonomousInit() {
    	autonomousCommand = (Command) autoChooser.getSelected(); //= new auto_3totes();
        // schedule the autonomous command
        if (autonomousCommand != null)
        	autonomousCommand.start();
    }

    /**
     * This function is called periodically during autonomous
     */
    public void autonomousPeriodic() {
        Scheduler.getInstance().run();
        alwaysPerodic();
    }

    public void teleopInit() {
		// This makes sure that the autonomous stops running when
        // teleop starts running. If you want the autonomous to 
        // continue until interrupted by another command, remove
        // this line or comment it out.
        if (autonomousCommand != null) autonomousCommand.cancel();
    }

    /**
     * This function is called periodically during operator control
     */
    public void teleopPeriodic() {
        Scheduler.getInstance().run();
        alwaysPerodic();
    }
    
    /**
     * This function is called no matter what mode the robot is operating in.
     * Great for printing values to the smart dashboard.
     */
    public void alwaysPerodic() {
    	//SmartDashboard.putNumber("Gyro", Robot.drive.getGyroAngle());
    }
    
    /**
     * This function is called when the disabled button is hit.
     * You can use it to reset subsystems before shutting down.
     * Generally you'll want to "reset" spring return solenoids 
     * otherwise they will move to their prior position when the robot is re-enabled.
     */
    public void disabledInit(){

    }

    public void disabledPeriodic() {
		Scheduler.getInstance().run();
		alwaysPerodic();
	}
    
    /**
     * This function is called periodically during test mode
     */
    public void testPeriodic() {
        LiveWindow.run();
        alwaysPerodic();
    }
}
