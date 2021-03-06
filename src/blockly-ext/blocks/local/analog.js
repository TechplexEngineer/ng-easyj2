
 /**
 * @fileoverview Analog blocks for EasyJ.
 * @author techplex.engineer@gmail.com (Blake Bourque)
 */
'use strict';

goog.provide('EasyJ.Blocks.analog');

goog.require('Blockly.Blocks');

Blockly.Blocks['declare_analog_input'] = {
  init: function() {
    this.setHelpUrl('');
    this.setTooltip('Create an analog input which allows sampling an input waveform.');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Declare Analog Input")
        .appendField(new Blockly.TypedFieldVariable("Ain1", "AnalogInput", true), "NAME");
    this.appendDummyInput()
        .appendField("on port")
        .appendField(new Blockly.FieldTextInput("1", EasyJ.Checker.ANALOG_PORT), "PORT");
    // this.appendValueInput("PORT")
    //     .setCheck("Number")
    //     .appendField("on Port");
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'declare');
    this.setNextStatement(true, 'declare');
  },
  onchange: EasyJ.Checker.EnsureNotTop_Init,
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('NAME'))) {
      this.setFieldValue(newName, 'NAME');
    }
  }
};
Blockly.Java['declare_analog_input'] = function(block) {
  var variable_name = Blockly.Java.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_port = block.getFieldValue('PORT');

  if (value_port=="") {
    block.setWarningText("Analog Input port not set. Defaulted to port 1.");
    value_port = 1;
  }
  else {
    block.setWarningText(null);
  }
  Blockly.Java.addImport("import edu.wpi.first.wpilibj.AnalogInput;");
  var code = 'AnalogInput '+variable_name+' = new AnalogInput('+value_port+');';
  return code;
};

Blockly.Blocks['get_analog_input_value'] = {
  init: function() {
    this.setHelpUrl('');
    this.setTooltip('Get the value of an analog waveform.');
    this.setColour(65);
    this.appendDummyInput()
        .appendField("Get ")
        .appendField(new Blockly.FieldDropdown([["Average Voltage", "getAverageVoltage"], ["Voltage", "getVoltage"], [" Average Value", "getAverageValue"]]), "WHAT")
        .appendField(new Blockly.TypedFieldVariable("Ain1", "AnalogInput"), "NAME");
    this.setInputsInline(true);
    this.setOutput(true, "Number");
	this.setDependsOn("AnalogInput");
  },
  onchange: function(evt) {
   if (!this.workspace || this.isInFlyout) {
      // Block has been deleted, or is in flyout
      return;
    }
    var block = this;
    this.setWarningText(EasyJ.Checker.PickWarning(block, [EasyJ.Checker.EnsureVariablesExist, EasyJ.Checker.EnsureNotOrphaned]));

  },
  renameVar: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getFieldValue('NAME'))) {
      this.setFieldValue(newName, 'NAME');
    }
  }
};
Blockly.Java['get_analog_input_value'] = function(block) {
  var dropdown_what = block.getFieldValue('WHAT');
  var variable_name = Blockly.Java.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);

  //@todo make sure wariable_name has been declared
  var code = variable_name+'.'+dropdown_what+'()';
  return [code, Blockly.Java.ORDER_ATOMIC];
};
