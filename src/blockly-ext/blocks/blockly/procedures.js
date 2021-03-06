/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Procedure blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.procedures');

goog.require('Blockly.Blocks');

//@temporary
Blockly.zr_cpp = {};

Blockly.zr_cpp.C_VARIABLE_TYPES =
	[
	 ['double', 'double'],
	 ['int', 'int'],
	 ['boolean', 'boolean'],
	 ['String', 'String'],
	 ['Joystick', 'Joystick']
	];


Blockly.Blocks.procedures.HUE = 290;

Blockly.Blocks['procedures_defnoreturn'] = {
	/**
	 * Block for defining a procedure with no return value.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
		this.setColour(Blockly.Blocks.procedures.HUE);
		var name = Blockly.Procedures.findLegalName(Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE, this);
		this.appendDummyInput()
				// .appendField('to')
				// .appendField(new Blockly.FieldTextInput(name,Blockly.Procedures.rename), 'NAME')
				.appendField('myFunction', 'NAME')
				.appendField('', 'PARAMS');
		this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
		this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
		this.arguments_ = [];
		this.setStatements_(true);
		this.statementConnection_ = null;
		//The function block on a page cannot be deleted
		this.setDeletable(false);
	},

	/**
	 * Add or remove the statement block from this function definition.
	 * @param {boolean} hasStatements True if a statement block is needed.
	 * @this Blockly.Block
	 */
	setStatements_: function(hasStatements) {
		if (this.hasStatements_ === hasStatements) {
			return;
		}
		if (hasStatements) {
			this.appendStatementInput('STACK')
					.appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_DO);
			if (this.getInput('RETURN')) {
				this.moveInputBefore('STACK', 'RETURN');
			}
		} else {
			this.removeInput('STACK', true);
		}
		this.hasStatements_ = hasStatements;
	},

	/**
	 * Update the display of parameters for this procedure definition block.
	 * Display a warning if there are duplicately named parameters.
	 * @private
	 * @this Blockly.Block
	 */
	updateParams_: function() {
		// Check for duplicated arguments.
		var badArg = false;
		var hash = {};
		for (var i = 0; i < this.arguments_.length; i++) {
			if (hash['arg_' + this.arguments_[i].name.toLowerCase()]) {
				badArg = true;
				break;
			}
			hash['arg_' + this.arguments_[i].name.toLowerCase()] = true;
		}
		if (badArg) {
			this.setWarningText(Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING);
		} else {
			this.setWarningText(null);
		}
		// Merge the arguments into a human-readable list.
		// var paramString = '';
		// if (this.arguments_.length) {
		// 	paramString = Blockly.Msg.PROCEDURES_BEFORE_PARAMS +
		// 			' ' + this.arguments_.join(', ');
		// }
		this.setFieldValue(this.getArgString(false), 'PARAMS');
	},

	/**
	 * Create XML to represent the argument inputs.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function() {
		var container = document.createElement('mutation');
		for (var i = 0; i < this.arguments_.length; i++) {
			var parameter = document.createElement('arg');
			parameter.setAttribute('type', this.arguments_[i].vartype);
			parameter.setAttribute('name', this.arguments_[i].name);
			container.appendChild(parameter);
		}
		container.setAttribute('procname', this.getFieldValue('NAME'));

		// Save whether the statement input is visible.
		if (!this.hasStatements_) {
			container.setAttribute('statements', 'false');
		}
		return container;
	},

	/**
	 * Parse XML to restore the argument inputs.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function(xmlElement) {
		this.arguments_ = [];
		for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
			if (childNode.nodeName.toLowerCase() == 'arg') {
				this.arguments_.push({
					vartype: childNode.getAttribute('type'),
					name: childNode.getAttribute('name')
					//length: Infinity //the ZR folks had this, is it needed?
				});
			}
		}
		this.setFieldValue(xmlElement.getAttribute('procname'), 'NAME');
		this.updateParams_();

		// Show or hide the statement input.
		this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
	},

	/**
	 * Populate the mutator's dialog with this block's components.
	 * @param {!Blockly.Workspace} workspace Mutator's workspace.
	 * @return {!Blockly.Block} Root block in mutator.
	 * @this Blockly.Block
	 */
	decompose: function(workspace) {
		var containerBlock = Blockly.Block.obtain(workspace, 'procedures_mutatorcontainer');
		containerBlock.initSvg();

		// Check/uncheck the allow statement box.
		if (this.getInput('RETURN')) {
			containerBlock.setFieldValue(this.hasStatements_ ? 'TRUE' : 'FALSE',
																	 'STATEMENTS');
		} else {
			containerBlock.getInput('STATEMENT_INPUT').setVisible(false);
		}

		// Parameter list.
		var connection = containerBlock.getInput('STACK').connection;
		for (var i = 0; i < this.arguments_.length; i++) {
			var paramBlock = Blockly.Block.obtain(workspace, 'procedures_mutatorarg');
			paramBlock.initSvg();
			paramBlock.setFieldValue(this.arguments_[i].vartype, 'TYPE');
			paramBlock.setFieldValue(this.arguments_[i].name, 'NAME');
			// Store the old location.
			paramBlock.oldLocation = i;
			connection.connect(paramBlock.previousConnection);
			connection = paramBlock.nextConnection;
		}
		// Initialize procedure's callers with blank IDs.
		Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'), this.workspace, this.getArgList(), null);
		return containerBlock;
	},

	/**
	 * Reconfigure this block based on the mutator dialog's components.
	 * @param {!Blockly.Block} containerBlock Root block in mutator.
	 * @this Blockly.Block
	 */
	compose: function(containerBlock) {
		// Parameter list.
		this.arguments_ = [];
		this.paramIds_ = [];
		var paramBlock = containerBlock.getInputTargetBlock('STACK');
		while (paramBlock) {
			this.arguments_.push({
				vartype: paramBlock.getFieldValue('TYPE'),
				name: paramBlock.getFieldValue('NAME')
			});
			this.paramIds_.push(paramBlock.id);
			paramBlock = paramBlock.nextConnection &&
					paramBlock.nextConnection.targetBlock();
		}
		this.updateParams_();
		Blockly.Procedures.mutateCallers(this.getFieldValue('NAME'),
				this.workspace, this.getArgList(), this.paramIds_);

		this.onchange(); //the ZR people had this. not sure if its needed

		// Show/hide the statement input.
		var hasStatements = containerBlock.getFieldValue('STATEMENTS');
		if (hasStatements !== null) {
			hasStatements = hasStatements == 'TRUE';
			if (this.hasStatements_ != hasStatements) {
				if (hasStatements) {
					this.setStatements_(true);
					// Restore the stack, if one was saved.
					var stackConnection = this.getInput('STACK').connection;
					if (stackConnection.targetConnection ||
							!this.statementConnection_ ||
							this.statementConnection_.targetConnection ||
							this.statementConnection_.sourceBlock_.workspace !=
							this.workspace) {
						// Block no longer exists or has been attached elsewhere.
						this.statementConnection_ = null;
					} else {
						stackConnection.connect(this.statementConnection_);
					}
				} else {
					// Save the stack, then disconnect it.
					var stackConnection = this.getInput('STACK').connection;
					this.statementConnection_ = stackConnection.targetConnection;
					if (this.statementConnection_) {
						var stackBlock = stackConnection.targetBlock();
						stackBlock.setParent(null);
						stackBlock.bumpNeighbours_();
					}
					this.setStatements_(false);
				}
			}
		}
	},

	/**
	 * Dispose of any callers.
	 * @this Blockly.Block
	 */
	dispose: function() {
		var name = this.getFieldValue('NAME');
		Blockly.Procedures.disposeCallers(name, this.workspace);
		// Call parent's destructor.
		this.constructor.prototype.dispose.apply(this, arguments);
	},

	/**
	 * Return the signature of this procedure definition.
	 * @return {!Array} Tuple containing three elements:
	 *     - the name of the defined procedure,
	 *     - a list of all its arguments,
	 *     - that it DOES NOT have a return value.
	 * @this Blockly.Block
	 */
	getProcedureDef: function() {
		return [this.getFieldValue('NAME'), this.getArgList(), false];
	},

	/**
	 * Return all variables referenced by this block.
	 * @return {!Array.<string>} List of variable names.
	 * @this Blockly.Block
	 */
	getVars: function() {
		return this.arguments_;
	},
	/**
	 * Notification that a variable is renaming.
	 * If the name matches one of this block's variables, rename it.
	 * @param {string} oldName Previous name of variable.
	 * @param {string} newName Renamed variable.
	 * @this Blockly.Block
	 */
	renameVar: function(oldName, newName) {
		var change = false;
		for (var i = 0; i < this.arguments_.length; i++) {
			if (Blockly.Names.equals(oldName, this.arguments_[i].name)) {
				this.arguments_[i].name = newName;
				change = true;
			}
		}
		if (change) {
			this.updateParams_();
			// Update the mutator's variables if the mutator is open.
			if (this.mutator.isVisible_()) {
				var blocks = this.mutator.workspace_.getAllBlocks();
				for (var i = 0, block; block = blocks[i]; i++) {
					if (block.type == 'procedures_mutatorarg' &&
							Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
						block.setFieldValue(newName, 'NAME');
					}
				}
			}
		}
	},

	/**
	 * Add custom menu options to this block's context menu.
	 * @param {!Array} options List of menu options to add to.
	 * @this Blockly.Block
	 */
	customContextMenu: function(options) {
		// Add option to create caller.
		var option = {enabled: true};
		var name = this.getFieldValue('NAME');
		option.text = Blockly.Msg.PROCEDURES_CREATE_DO.replace('%1', name);

		var xmlMutation = goog.dom.createDom('mutation');
		xmlMutation.setAttribute('name', name);
		for (var i = 0; i < this.arguments_.length; i++) {
			var xmlArg = goog.dom.createDom('arg');
			xmlArg.setAttribute('type', this.arguments_[i].vartype);
			xmlArg.setAttribute('name', this.arguments_[i].name);
			xmlMutation.appendChild(xmlArg);
		}
		var xmlBlock = goog.dom.createDom('block', null, xmlMutation);
		xmlBlock.setAttribute('type', this.callType_);
		option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
		options.push(option);

		// Add options to create getters for each parameter.
		if (!this.isCollapsed()) {
		for (var i = 0; i < this.arguments_.length; i++) {
			var option = {enabled: true};
			var name = this.arguments_[i].name;
			option.text = Blockly.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
			var xmlField = goog.dom.createDom('field', null, name);
			xmlField.setAttribute('name', 'VAR');
			var xmlBlock = goog.dom.createDom('block', null, xmlField);
			xmlBlock.setAttribute('type', 'variables_get');
			option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
			options.push(option);
		}//@todo reindent this
		}
	},

	//verbaitm from ZR
	getArgString: function(renameVars) {
		// Merge the arguments into a string for the function signature.
		var paramString = '(';
		var len = this.arguments_.length;
		if (len) {
			for (var i = 0; i < len; i++) {
				paramString = paramString + (i == 0 ? '' : ', ') + this.arguments_[i].vartype + (this.arguments_[i].isArray === "TRUE" ? '* ' : ' ')
					+ (renameVars ? Blockly.zr_cpp.variableDB_.getName(this.arguments_[i].name, Blockly.Variables.NAME_TYPE) : this.arguments_[i].name);
			}
		}
		paramString = paramString + ')';
		return paramString;
	},
	getArgList: function() {
		// Merge the arguments into a string for the function signature.
		var argList = [];
		var len = this.arguments_.length;
		if (len) {
			for (var i = 0; i < len; i++) {
				argList.push(this.arguments_[i].name);
			}
		}
		return argList;
	},
	onchange: function() {
		if (!this.workspace) {
			// Block has been deleted.
			return;
		}
		if(Blockly.Realtime.enabled_ && !Blockly.Realtime.initializing && !this.isInFlyout) {
				Blockly.zr_cpp.procedures.set(String(this.id), this.getProcedureDef());
		}
	},
	beforedispose: function() {
		if(!Blockly.Realtime.enabled_ || this.isInFlyout) {
			return;
		}
		Blockly.zr_cpp.procedures['delete'](String(this.id));
	},
	//end verbaitm from ZR

	callType_: 'procedures_callnoreturn'
};

Blockly.Blocks['procedures_defreturn'] = {
	/**
	 * Block for defining a procedure with a return value.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL);
		this.setColour(Blockly.Blocks.procedures.HUE);
		var name = Blockly.Procedures.findLegalName(
				Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE, this);
		this.appendDummyInput()
				.appendField('myFunction', 'NAME')
				.appendField('', 'PARAMS');
		this.appendValueInput('RETURN')
				.setAlign(Blockly.ALIGN_RIGHT)
				.appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
		this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
		this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
		this.arguments_ = [];
		this.setStatements_(true);
		this.statementConnection_ = null;
		this.setDeletable(false);
	},
	setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
	updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
	mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
	domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
	decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
	compose: Blockly.Blocks['procedures_defnoreturn'].compose,
	dispose: Blockly.Blocks['procedures_defnoreturn'].dispose,
	/**
	 * Return the signature of this procedure definition.
	 * @return {!Array} Tuple containing three elements:
	 *     - the name of the defined procedure,
	 *     - a list of all its arguments,
	 *     - that it DOES have a return value.
	 * @this Blockly.Block
	 */
	getProcedureDef: function() {
		return [this.getFieldValue('NAME'), this.arguments_, true];
	},
	getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
	renameVar: Blockly.Blocks['procedures_defnoreturn'].renameVar,
	customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
	getArgString: Blockly.Blocks['procedures_defnoreturn'].getArgString,
	getArgList: Blockly.Blocks['procedures_defnoreturn'].getArgList,
	onchange: Blockly.Blocks['procedures_defnoreturn'].onchange,
	beforedispose: Blockly.Blocks['procedures_defnoreturn'].beforedispose,
	callType_: 'procedures_callreturn'
};

Blockly.Blocks['procedures_mutatorcontainer'] = {
	/**
	 * Mutator block for procedure container.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour(Blockly.Blocks.procedures.HUE);
		this.appendDummyInput()
				.appendField('inputs to method:');
		this.appendStatementInput('STACK');
		this.appendDummyInput('STATEMENT_INPUT') //I think I'd like to hide this.
				.appendField(Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS)
				.appendField(new Blockly.FieldCheckbox('TRUE'), 'STATEMENTS');
		// this.appendDummyInput('RETURN_INPUT')
		// 		.appendField('has return value')
		// 		.appendField(new Blockly.FieldCheckbox('TRUE'), 'RETURN');
		this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP);
		this.contextMenu = false;
	}
};

Blockly.Blocks['procedures_mutatorarg'] = {
	/**
	 * Mutator block for procedure argument.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setColour(Blockly.Blocks.procedures.HUE);
		this.appendDummyInput()
				.appendField('input')
				.appendField('type:')
				.appendField(new Blockly.FieldDropdown(Blockly.zr_cpp.C_VARIABLE_TYPES), 'TYPE')
				.appendField('name:')
				.appendField(new Blockly.FieldTextInput('x', this.validator_), 'NAME');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP);
		this.contextMenu = false;
	},
	/**
	 * Obtain a valid name for the procedure.
	 * Merge runs of whitespace.  Strip leading and trailing whitespace.
	 * Beyond this, all names are legal.
	 * @param {string} newVar User-supplied name.
	 * @return {?string} Valid name, or null if a name was not specified.
	 * @private
	 * @this Blockly.Block
	 */
	validator_: function(newVar) {
		newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
		return newVar || null;
	}
};

Blockly.Blocks['procedures_callnoreturn'] = {
	/**
	 * Block for calling a procedure with no return value.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL);
		this.setColour(Blockly.Blocks.procedures.HUE);
		this.appendDummyInput()
				.appendField(Blockly.Msg.PROCEDURES_CALLNORETURN_CALL)
				.appendField('', 'NAME')
				.appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		// Tooltip is set in domToMutation.
		this.arguments_ = [];
		this.quarkConnections_ = null;
		this.quarkArguments_ = null;
	},
	/**
	 * Returns the name of the procedure this block calls.
	 * @return {string} Procedure name.
	 * @this Blockly.Block
	 */
	getProcedureCall: function() {
		// The NAME field is guaranteed to exist, null will never be returned.
		return /** @type {string} */ (this.getFieldValue('NAME'));
	},
	/**
	 * Notification that a procedure is renaming.
	 * If the name matches this block's procedure, rename it.
	 * @param {string} oldName Previous name of procedure.
	 * @param {string} newName Renamed procedure.
	 * @this Blockly.Block
	 */
	renameProcedure: function(oldName, newName) {
		if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
			this.setFieldValue(newName, 'NAME');
			this.setTooltip(
					(this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
					 Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
					.replace('%1', newName));
		}
	},
	/**
	 * Notification that the procedure's parameters have changed.
	 * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
	 * @param {!Array.<string>} paramIds IDs of params (consistent for each
	 *     parameter through the life of a mutator, regardless of param renaming),
	 *     e.g. ['piua', 'f8b_', 'oi.o'].
	 * @this Blockly.Block
	 */
	setProcedureParameters: function(paramNames, paramIds) {
		// Data structures:
		// this.arguments = ['x', 'y']
		//     Existing param names.
		// this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
		//     Look-up of paramIds to connections plugged into the call block.
		// this.quarkArguments_ = ['piua', 'f8b_']
		//     Existing param IDs.
		// Note that quarkConnections_ may include IDs that no longer exist, but
		// which might reappear if a param is reattached in the mutator.
		if (!paramIds) {
			// Reset the quarks (a mutator is about to open).
			this.quarkConnections_ = {};
			this.quarkArguments_ = null;
			return;
		}
		if (paramIds.length != paramNames.length) {
			throw 'Error: paramNames and paramIds must be the same length.';
		}
		if (!this.quarkArguments_) {
			// Initialize tracking for this block.
			this.quarkConnections_ = {};
			if (paramNames.join('\n') == this.arguments_.join('\n')) {
				// No change to the parameters, allow quarkConnections_ to be
				// populated with the existing connections.
				this.quarkArguments_ = paramIds;
			} else {
				this.quarkArguments_ = [];
			}
		}
		// Switch off rendering while the block is rebuilt.
		var savedRendered = this.rendered;
		this.rendered = false;
		// Update the quarkConnections_ with existing connections.
		for (var i = this.arguments_.length - 1; i >= 0; i--) {
			var input = this.getInput('ARG' + i);
			if (input) {
				var connection = input.connection.targetConnection;
				this.quarkConnections_[this.quarkArguments_[i]] = connection;
				// Disconnect all argument blocks and remove all inputs.
				this.removeInput('ARG' + i);
			}
		}
		// Rebuild the block's arguments.
		this.arguments_ = [].concat(paramNames);
		this.quarkArguments_ = paramIds;
		for (var i = 0; i < this.arguments_.length; i++) {
			var input = this.appendValueInput('ARG' + i)
					.setAlign(Blockly.ALIGN_RIGHT)
					.appendField(this.arguments_[i]);
			if (this.quarkArguments_) {
				// Reconnect any child blocks.
				var quarkName = this.quarkArguments_[i];
				if (quarkName in this.quarkConnections_) {
					var connection = this.quarkConnections_[quarkName];
					if (!connection || connection.targetConnection ||
							connection.sourceBlock_.workspace != this.workspace) {
						// Block no longer exists or has been attached elsewhere.
						delete this.quarkConnections_[quarkName];
					} else {
						input.connection.connect(connection);
					}
				}
			}
		}
		// Add 'with:' if there are parameters.
		var withField = this.getField_('WITH');
		if (withField) {
			withField.setVisible(!!this.arguments_.length);
		}
		// Restore rendering and show the changes.
		this.rendered = savedRendered;
		if (this.rendered) {
			this.render();
		}
	},
	/**
	 * Create XML to represent the (non-editable) name and arguments.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function() {
		var container = document.createElement('mutation');
		container.setAttribute('name', this.getProcedureCall());
		for (var i = 0; i < this.arguments_.length; i++) {
			var parameter = document.createElement('arg');
			parameter.setAttribute('name', this.arguments_[i]);
			container.appendChild(parameter);
		}
		return container;
	},
	/**
	 * Parse XML to restore the (non-editable) name and parameters.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function(xmlElement) {
		var name = xmlElement.getAttribute('name');
		this.setFieldValue(name, 'NAME');
		this.setTooltip(
				(this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
				 Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP).replace('%1', name));
		var def = Blockly.Procedures.getDefinition(name, this.workspace);
		if (def && def.mutator.isVisible()) {
			// Initialize caller with the mutator's IDs.
			this.setProcedureParameters(def.arguments_, def.paramIds_);
		} else {
			this.arguments_ = [];
			for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
				if (childNode.nodeName.toLowerCase() == 'arg') {
					this.arguments_.push(childNode.getAttribute('name'));
				}
			}
			// For the second argument (paramIds) use the arguments list as a dummy
			// list.
			this.setProcedureParameters(this.arguments_, this.arguments_);
		}
	},
	/**
	 * Notification that a variable is renaming.
	 * If the name matches one of this block's variables, rename it.
	 * @param {string} oldName Previous name of variable.
	 * @param {string} newName Renamed variable.
	 * @this Blockly.Block
	 */
	renameVar: function(oldName, newName) {
		for (var i = 0; i < this.arguments_.length; i++) {
			if (Blockly.Names.equals(oldName, this.arguments_[i])) {
				this.arguments_[i] = newName;
				this.getInput('ARG' + i).fieldRow[0].setText(newName);
			}
		}
	},
	/**
	 * Add menu option to find the definition block for this call.
	 * @param {!Array} options List of menu options to add to.
	 * @this Blockly.Block
	 */
	customContextMenu: function(options) {
		var option = {enabled: true};
		option.text = Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF;
		var name = this.getProcedureCall();//zr different
		var workspace = this.workspace;
		option.callback = function() {
			var def = Blockly.Procedures.getDefinition(name, workspace);
			def && def.select();
		};
		options.push(option);
	},
	onchange: Blockly.Blocks.requireInFunction
};

Blockly.Blocks['procedures_callreturn'] = {
	/**
	 * Block for calling a procedure with a return value.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL);
		this.setColour(Blockly.Blocks.procedures.HUE);
		this.appendDummyInput()
				.appendField(Blockly.Msg.PROCEDURES_CALLRETURN_CALL)
				.appendField('', 'NAME')
				.appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
		this.setOutput(true);
		// Tooltip is set in domToMutation.
		this.arguments_ = [];
		this.quarkConnections_ = null;
		this.quarkArguments_ = null;
	},
	getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
	renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
	setProcedureParameters:
			Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters,
	mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
	domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
	renameVar: Blockly.Blocks['procedures_callnoreturn'].renameVar,
	customContextMenu: Blockly.Blocks['procedures_callnoreturn'].customContextMenu
};

Blockly.Blocks['procedures_ifreturn'] = {
	/**
	 * Block for conditionally returning a value from a procedure.
	 * @this Blockly.Block
	 */
	init: function() {
		this.setHelpUrl('http://c2.com/cgi/wiki?GuardClause');
		this.setColour(Blockly.Blocks.procedures.HUE);
		this.appendValueInput('CONDITION')
				.setCheck('Boolean')
				.appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
		this.appendValueInput('VALUE')
				.appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
		this.setInputsInline(true);
		this.setPreviousStatement(true);
		this.setNextStatement(true);
		this.setTooltip(Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP);
		this.hasReturnValue_ = true;
	},
	/**
	 * Create XML to represent whether this block has a return value.
	 * @return {Element} XML storage element.
	 * @this Blockly.Block
	 */
	mutationToDom: function() {
		var container = document.createElement('mutation');
		container.setAttribute('value', Number(this.hasReturnValue_));
		return container;
	},
	/**
	 * Parse XML to restore whether this block has a return value.
	 * @param {!Element} xmlElement XML storage element.
	 * @this Blockly.Block
	 */
	domToMutation: function(xmlElement) {
		var value = xmlElement.getAttribute('value');
		this.hasReturnValue_ = (value == 1);
		if (!this.hasReturnValue_) {
			this.removeInput('VALUE');
			this.appendDummyInput('VALUE')
				.appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
		}
	},
	/**
	 * Called whenever anything on the workspace changes.
	 * Add warning if this flow block is not nested inside a loop.
	 * @this Blockly.Block
	 */
	onchange: function() {
		if (!this.workspace) {
			// Block has been deleted.
			return;
		}
		var legal = false;
		// Is the block nested in a procedure?
		var block = this;
		do {
			if (block.type == 'procedures_defnoreturn' ||
					block.type == 'procedures_defreturn') {
				legal = true;
				break;
			}
			block = block.getSurroundParent();
		} while (block);
		if (legal) {
			// If needed, toggle whether this block has a return value.
			if (block.type == 'procedures_defnoreturn' && this.hasReturnValue_) {
				this.removeInput('VALUE');
				this.appendDummyInput('VALUE')
					.appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
				this.hasReturnValue_ = false;
			} else if (block.type == 'procedures_defreturn' &&
								 !this.hasReturnValue_) {
				this.removeInput('VALUE');
				this.appendValueInput('VALUE')
					.appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
				this.hasReturnValue_ = true;
			}
			this.setWarningText(null);
		} else {
			this.setWarningText(Blockly.Msg.PROCEDURES_IFRETURN_WARNING);
		}
	}
};
