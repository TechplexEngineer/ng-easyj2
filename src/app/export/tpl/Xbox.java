package {{package}};

import edu.wpi.first.wpilibj.Joystick;
/**
 * Class wraps the wpilib Joystick class to provide a clean interface to Xbox controllers.
 */
public class Xbox {

	//the joystick object upon which to call the methods
	private Joystick _joystick;

	/**
	 * Construct an instance of an Xbox with the sub-joystick.
     * The joystick index is the usb port on the drivers station.
     * 
	 * @param  port The port on the driver station that the joystick is plugged into.
	 */
	public Xbox(int port) {
		_joystick = new Joystick(port);
	}

	/**
	 * Construct an instance of an Xbox with the given joystick object.
	 * 
	 * @param  js The joystick object to wrap.
	 */
	public Xbox(Joystick js) {
		_joystick = js;
	}

	/**
	 * Get the value of the A button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isA() {
		return getRawButton(1);
	}
	
	/**
	 * Get the value of the B button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isB() {
		return getRawButton(2);
	}
	
	/**
	 * Get the value of the X button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isX() {
		return getRawButton(3);
	}
	
	/**
	 * Get the value of the Y button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isY() {
		return getRawButton(4);
	}
	
	/**
	 * Get the value of the LB button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isLB() {
		return getRawButton(5);
	}
	
	/**
	 * Get the value of the RB button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isRB() {
		return getRawButton(6);
	}
	
	/**
	 * Get the value of the back button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isBack() {
		return getRawButton(7);
	}
	
	/**
	 * Get the value of the start button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isStart() {
		return getRawButton(8);
	}
	
	/**
	 * Get the value of the left stick button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isLeftStick() {
		return getRawButton(9);
	}
	
	/**
	 * Get the value of the right stick button
	 * @return true if pressed, false otherwise.
	 */
	public boolean isRightStick() {
		return getRawButton(10);
	}
	
	/**
	 * Get the value of the x axis of the left stick
	 * @return the position of the axis on the range [-1, 1]
	 */
	public double getLeftStickX() {
		return getRawAxis(0);
	}
	
	/**
	 * Get the value of the y axis of the left stick
	 * @return the position of the axis on the range [-1, 1]
	 */
	public double getLeftStickY() {
		return getRawAxis(1);
	}
	
	/**
	 * Get the value of the left trigger
	 * @return the position of the axis on the range [0, 1]
	 */
	public double getLeftTrigger() {
		return getRawAxis(2);
	}
	
	/**
	 * Get the value of the right trigger
	 * @return the position of the axis on the range [0, 1]
	 */
	public double getRightTrigger() {
		return getRawAxis(3);
	}
 	
 	/**
	 * Get the value of the x axis of the right stick
	 * @return the position of the axis on the range [-1, 1]
	 */
	public double getRightStickX() {
		return getRawAxis(4);
	}
	
	/**
	 * Get the value of the y axis of the left stick
	 * @return the position of the axis on the range [-1, 1]
	 */
	public double getRightStickY() {
		return getRawAxis(5);
	}
 
 	
 	/**
     * Get the button value (starting at button 1)
     *
     * The appropriate button is returned as a boolean value.
     *
     * @param button The button number to be read (starting at 1).
     * @return The state of the button.
     */
	public boolean getRawButton(int button) {
		return _joystick.getRawButton(button);
	}
	
	/**
     * Get the value of the axis.
     *
     * @param axis The axis to read, starting at 0.
     * @return The value of the axis.
     */
	public double getRawAxis(int axis) {
		return _joystick.getRawAxis(axis);
	}
 
}
