 /**
 * @fileoverview Variables Boolean blocks for EasyJ.
 * @author techplex.engineer@gmail.com (Blake Bourque)
 */
'use strict';

goog.provide('EasyJ.Blocks.varBoolean');

goog.require('Blockly.Blocks');

Blockly.Blocks['variables_declare_boolean'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setTooltip('');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("Declare")
        .appendField(new Blockly.TypedFieldVariable("boolean1", 'boolean', true), "NAME")
        .appendField("of type 'boolean' value")
        // .appendField(new Blockly.FieldDropdown([["integer", "int"], ["boolean", "boolean"]]), "TYPE")
        // .appendField("value")
        // .appendField(new Blockly.FieldTextInput("0", EasyJ.Checker.IS_NUM), "VALUE");
        .appendField(new Blockly.FieldDropdown([["true", "true"], ["false", "false"]]), "VALUE");
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

Blockly.Java['variables_declare_boolean'] = function(block) {
  var variable_name = Blockly.Java.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  // var dropdown_type = block.getFieldValue('TYPE');
  var text_value = block.getFieldValue('VALUE');
  // TODO: Assemble Java into code variable.
  var code = 'boolean '+variable_name+' = '+text_value+';';
  return code;
};

//------------------------------------------------------------------------------

Blockly.Blocks['variables_set_boolean'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setTooltip('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField("set")
        .appendField(new Blockly.TypedFieldVariable("item", 'boolean'), "NAME");
    this.appendValueInput("VALUE")
        .setCheck("boolean")
        .appendField("to");
    this.setInputsInline(true);
    this.setPreviousStatement(true, 'statement');
    this.setNextStatement(true, 'statement');
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

Blockly.Java['variables_set_boolean'] = function(block) {
  var variable_name = Blockly.Java.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var value_value = Blockly.Java.valueToCode(block, 'VALUE', Blockly.Java.ORDER_ASSIGNMENT) || '0';
  // TODO: Assemble Java into code variable.
  var code = variable_name+' = '+value_value+';';
  return code;
};


//------------------------------------------------------------------------------


Blockly.Blocks['variables_get_boolean'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setTooltip('');
    this.setColour(260);
    this.appendDummyInput()
        .appendField("get")
        .appendField(new Blockly.TypedFieldVariable("item", 'boolean'), "NAME");
    this.setInputsInline(true);
    this.setOutput(true, 'boolean');
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

Blockly.Java['variables_get_boolean'] = function(block) {
  var variable_name = Blockly.Java.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);

  var code = variable_name;

  return [code, Blockly.Java.ORDER_ATOMIC];
};
