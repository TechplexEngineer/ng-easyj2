Blockly.Blocks['state_vars'] = {
  init: function() {
    this.setHelpUrl('');
    this.setTooltip('Put Subsystem state variables here.');
    this.setColour(120);
    this.appendDummyInput()
        .appendField("State Variables");
    this.appendStatementInput("STATE")
    		.setCheck("declare");
    this.setDeletable(false);
  }
};

Blockly.Java['state_vars'] = function(block) {
  var statements_state = Blockly.Java.statementToCode(block, 'STATE');
  // @todo: Assemble Java into code variable.
  var code = statements_state;
  return code;
};
