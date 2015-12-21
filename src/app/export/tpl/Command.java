
package {{package}}.commands;

import edu.wpi.first.wpilibj.command.Command;

import {{package}}.Robot;

/**
 *
 */
public class {{name}} extends Command {

    public {{name}}() {
        // Use requires() here to declare subsystem dependencies
        {{#each req}}
        requires(Robot.{{subsys}});
        {{/each}}
    }

    // Called just before this Command runs the first time
    protected void initialize() {
    }

    // Called repeatedly when this Command is running
    protected void execute() {
    }

    // Make this return true when this Command no longer needs to run execute()
    protected boolean isFinished() {
        return false;
    }

    // Called once after isFinished returns true
    protected void end() {
    }

    // Called when another command which requires one or more of the same
    // subsystems is scheduled to run. 
    protected void interrupted() {
        end();
    }
}
