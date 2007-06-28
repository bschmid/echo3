// FIXME render enabled/disabled effects
// FIXME TriCellTable orientations
// FIXME alignment

/**
 * Component rendering peer: Button
 */
EchoRender.ComponentSync.Button = function() {
};

EchoRender.ComponentSync.Button.prototype = new EchoRender.ComponentSync;

EchoRender.ComponentSync.Button._createPrototypeButton = function() {
    var divElement = document.createElement("div");
    divElement.tabIndex = "0";
    divElement.style.outlineStyle = "none";
    divElement.style.cursor = "pointer";
    return divElement;
};

EchoRender.ComponentSync.Button._prototypeButton = EchoRender.ComponentSync.Button._createPrototypeButton(); 

EchoRender.ComponentSync.Button._defaultIconTextMargin = new EchoApp.Property.Extent(5);

EchoRender.ComponentSync.Button.prototype.focus = function(e) {
    this._divElement.focus();
    this._setFocusState(true);
    this.component.application.setFocusedComponent(this.component);
};

EchoRender.ComponentSync.Button.prototype._doAction = function() {
    this.component.doAction();
};

EchoRender.ComponentSync.Button.prototype.getElement = function() {
    return this._divElement;
};

EchoRender.ComponentSync.Button.prototype._processBlur = function(e) {
    if (!this.component.isActive()) {
        return;
    }
    this._setFocusState(false);
};

EchoRender.ComponentSync.Button.prototype._processClick = function(e) {
    if (!this.component.isActive()) {
        return;
    }
    this._doAction();
};

EchoRender.ComponentSync.Button.prototype._processFocus = function(e) {
    if (!this.component.isActive()) {
        return;
    }
    this.component.application.setFocusedComponent(this.component);
    this._setFocusState(true);
};

EchoRender.ComponentSync.Button.prototype._processKeyPress = function(e) {
    if (!this.component.isActive()) {
        return;
    }
    if (e.keyCode == 13) {
        this._doAction();
        return false;
    } else {
        return true;
    }
};

EchoRender.ComponentSync.Button.prototype._processPress = function(e) {
    if (!this.component.isActive()) {
        return;
    }
    EchoWebCore.DOM.preventEventDefault(e);
    this._setPressedState(true);
};

EchoRender.ComponentSync.Button.prototype._processRelease = function(e) {
    if (!this.component.isActive()) {
        return;
    }
    this._setPressedState(false);
};

EchoRender.ComponentSync.Button.prototype._processRolloverEnter = function(e) {
    if (!this.component.isActive() || EchoWebCore.dragInProgress) {
        return;
    }
    this._setRolloverState(true);
};

EchoRender.ComponentSync.Button.prototype._processRolloverExit = function(e) {
    if (!this.component.isActive()) {
        return;
    }
    this._setRolloverState(false);
};

EchoRender.ComponentSync.Button.prototype.renderAdd = function(update, parentElement) {
    this._divElement = EchoRender.ComponentSync.Button._prototypeButton.cloneNode(false); 
    this._divElement.id = this.component.renderId;

    EchoRender.Property.Color.renderFB(this.component, this._divElement);
    EchoRender.Property.Font.renderDefault(this.component, this._divElement);
    EchoRender.Property.Border.render(this.component.getRenderProperty("border"), this._divElement);
    EchoRender.Property.Insets.renderComponentProperty(this.component, "insets", "", this._divElement, "padding");
    EchoRender.Property.FillImage.renderComponentProperty(this.component, "backgroundImage", null, this._divElement);
    EchoRender.Property.Alignment.renderComponentProperty(this.component, "alignment", null, this._divElement, true);
    
    var toolTipText = this.component.getRenderProperty("toolTipText");
    if (toolTipText) {
        this._divElement.title = toolTipText;
    }
    var width = this.component.getRenderProperty("width");
    if (width) {
        this._divElement.style.width = width.toString();
    }
    var height = this.component.getRenderProperty("height");
    if (height) {
        this._divElement.style.height = height.toString();
	    this._divElement.style.overflow = "hidden";
    }
    
    this._renderContent();
    
    this._addEventListeners(this._divElement);
    parentElement.appendChild(this._divElement);
};

EchoRender.ComponentSync.Button.prototype._renderContent = function() {
    var text = this.component.getRenderProperty("text");
    var icon = this.component.getRenderProperty("icon");

    if (text) {
        if (icon) {
            // Text and icon.
            var iconTextMargin = this.component.getRenderProperty("iconTextMargin", 
                    EchoRender.ComponentSync.Button._defaultIconTextMargin);
            var tct = new EchoRender.TriCellTable(EchoRender.TriCellTable.TRAILING_LEADING, 
                    EchoRender.Property.Extent.toPixels(iconTextMargin));
            this._renderButtonText(tct.tdElements[0], text);
            this._iconElement = this._renderButtonIcon(tct.tdElements[1], icon);
            this._divElement.appendChild(tct.tableElement);
        } else {
            // Text only.
            this._renderButtonText(this._divElement, text);
        }
    } else if (icon) {
        // Icon only.
        this._iconElement = this._renderButtonIcon(this._divElement, icon);
    }
};

EchoRender.ComponentSync.Button.prototype._renderButtonText = function(element, text) {
	element.appendChild(document.createTextNode(text));
	if (!this.component.getRenderProperty("lineWrap", true)) {
		element.style.whiteSpace = "nowrap";
	}
};

EchoRender.ComponentSync.Button.prototype._renderButtonIcon = function(element, icon) {
    var imgElement = document.createElement("img");
    imgElement.src = icon.url ? icon.url : icon;
    imgElement.alt = "";
    if (icon.width) {
	    imgElement.style.width = icon.width.toString();
    }
    if (icon.height) {
	    imgElement.style.height = icon.height.toString();
    }
	element.appendChild(imgElement);
	return imgElement;
};

EchoRender.ComponentSync.Button.prototype._addEventListeners = function() {
    EchoWebCore.EventProcessor.add(this._divElement, "click", new EchoCore.MethodRef(this, this._processClick), false);
    EchoWebCore.EventProcessor.add(this._divElement, "keypress", new EchoCore.MethodRef(this, this._processKeyPress), false);
	if (this.component.getRenderProperty("rolloverEnabled")) {
        var mouseEnterLeaveSupport = EchoWebCore.Environment.PROPRIETARY_EVENT_MOUSE_ENTER_LEAVE_SUPPORTED;
        var enterEvent = mouseEnterLeaveSupport ? "mouseenter" : "mouseover";
        var exitEvent = mouseEnterLeaveSupport ? "mouseleave" : "mouseout";
	    EchoWebCore.EventProcessor.add(this._divElement, enterEvent, new EchoCore.MethodRef(this, this._processRolloverEnter), false);
    	EchoWebCore.EventProcessor.add(this._divElement, exitEvent, new EchoCore.MethodRef(this, this._processRolloverExit), false);
	}
    if (this.component.getRenderProperty("pressedEnabled")) {
	    EchoWebCore.EventProcessor.add(this._divElement, "mousedown", new EchoCore.MethodRef(this, this._processPress), false);
    	EchoWebCore.EventProcessor.add(this._divElement, "mouseup", new EchoCore.MethodRef(this, this._processRelease), false);
    }
    EchoWebCore.EventProcessor.add(this._divElement, "focus", new EchoCore.MethodRef(this, this._processFocus), false);
    EchoWebCore.EventProcessor.add(this._divElement, "blur", new EchoCore.MethodRef(this, this._processBlur), false);
    
    EchoWebCore.EventProcessor.addSelectionDenialListener(this._divElement);
};

EchoRender.ComponentSync.Button.prototype._getCombinedAlignment = function() {
	var primary = this.component.getRenderProperty("alignment");
	var secondary = this.component.getRenderProperty("textAlignment");
    
    if (primary == null) {
        return secondary;
    } else if (secondary == null) {
        return primary;
    }
    
    var horizontal = primary.horizontal;
    if (horizontal == EchoApp.Property.Alignment.DEFAULT) {
    	horizontal = secondary.horizontal;
    }
    var vertical = primary.vertical;
    if (vertical == EchoApp.Property.Alignment.DEFAULT) {
    	vertical = secondary.vertical;
    }
    return new EchoApp.Property.Alignment(horizontal, vertical);
};

EchoRender.ComponentSync.Button.prototype.renderDispose = function(update) {
    EchoWebCore.EventProcessor.removeAll(this._divElement);
    this._divElement = null;
    this._iconElement = null;
};

EchoRender.ComponentSync.Button.prototype.renderUpdate = function(update) {
    var element = this._divElement;
    var containerElement = element.parentNode;
    this.renderDispose(update);
    containerElement.removeChild(element);
    this.renderAdd(update, containerElement);
    return false; // Child elements not supported: safe to return false.
};

EchoRender.ComponentSync.Button.prototype._setPressedState = function(pressedState) {
    var foreground = EchoRender.Property.getEffectProperty(this.component, "foreground", "pressedForeground", pressedState);
    var background = EchoRender.Property.getEffectProperty(this.component, "background", "pressedBackground", pressedState);
    var backgroundImage = EchoRender.Property.getEffectProperty(this.component, "backgroundImage", "pressedBackgroundImage", pressedState);
    var font = EchoRender.Property.getEffectProperty(this.component, "font", "pressedFont", pressedState);
    var border = EchoRender.Property.getEffectProperty(this.component, "border", "pressedBorder", pressedState);
    
    EchoRender.Property.Color.renderClear(foreground, this._divElement, "color");
    EchoRender.Property.Color.renderClear(background, this._divElement, "backgroundColor");
    EchoRender.Property.FillImage.renderClear(backgroundImage, this._divElement, "backgroundColor");
    EchoRender.Property.Font.renderClear(font, this._divElement);
	EchoRender.Property.Border.renderClear(border, this._divElement);
	
    if (this._iconElement) {
    	var icon = EchoRender.Property.getEffectProperty(this.component, "icon", "pressedIcon", pressedState);
    	if (icon) {
		    this._iconElement.src = icon.url;
    	}
    }
};

EchoRender.ComponentSync.Button.prototype._setFocusState = function(focusState) {
    if (!this.component.getRenderProperty("focusedEnabled")) {
    	return;
    }

    var foreground = EchoRender.Property.getEffectProperty(this.component, "foreground", "focusedForeground", focusState);
    var background = EchoRender.Property.getEffectProperty(this.component, "background", "focusedBackground", focusState);
    var backgroundImage = EchoRender.Property.getEffectProperty(this.component, "backgroundImage", "focusedBackgroundImage", focusState);
    var font = EchoRender.Property.getEffectProperty(this.component, "font", "focusedFont", focusState);
    var border = EchoRender.Property.getEffectProperty(this.component, "border", "focusedBorder", focusState);
    
    EchoRender.Property.Color.renderClear(foreground, this._divElement, "color");
    EchoRender.Property.Color.renderClear(background, this._divElement, "backgroundColor");
    EchoRender.Property.FillImage.renderClear(backgroundImage, this._divElement, "backgroundColor");
    EchoRender.Property.Font.renderClear(font, this._divElement);
	EchoRender.Property.Border.renderClear(border, this._divElement);

    if (this._iconElement) {
    	var icon = EchoRender.Property.getEffectProperty(this.component, "icon", "focusedIcon", focusState);
    	if (icon) {
		    this._iconElement.src = icon.url;
    	}
    }
};

EchoRender.ComponentSync.Button.prototype._setRolloverState = function(rolloverState) {
    var foreground = EchoRender.Property.getEffectProperty(this.component, "foreground", "rolloverForeground", rolloverState);
    var background = EchoRender.Property.getEffectProperty(this.component, "background", "rolloverBackground", rolloverState);
    var backgroundImage = EchoRender.Property.getEffectProperty(this.component, "backgroundImage", "rolloverBackgroundImage", rolloverState);
    var font = EchoRender.Property.getEffectProperty(this.component, "font", "rolloverFont", rolloverState);
    var border = EchoRender.Property.getEffectProperty(this.component, "border", "rolloverBorder", rolloverState);
    
    EchoRender.Property.Color.renderClear(foreground, this._divElement, "color");
    EchoRender.Property.Color.renderClear(background, this._divElement, "backgroundColor");
    EchoRender.Property.FillImage.renderClear(backgroundImage, this._divElement, "backgroundColor");
    EchoRender.Property.Font.renderClear(font, this._divElement);
	EchoRender.Property.Border.renderClear(border, this._divElement);

    if (this._iconElement) {
    	var icon = EchoRender.Property.getEffectProperty(this.component, "icon", "rolloverIcon", rolloverState);
    	if (icon) {
		    this._iconElement.src = icon.url;
    	}
    }
};

EchoRender.registerPeer("Button", EchoRender.ComponentSync.Button);

/**
 * Component rendering peer: ToggleButton
 */
EchoRender.ComponentSync.ToggleButton = function() {
	this._selected = false;
	this._stateIconElement = null;
};

EchoRender.ComponentSync.ToggleButton.prototype = new EchoRender.ComponentSync.Button;

/**
 * Gets an URI for default toggle button images.
 * 
 * @param {String} identifier the image identifier
 * @return the image URI
 * @type {String}
 */
EchoRender.ComponentSync.ToggleButton._getImageUri = function(identifier) {
	// FIXME abstract this somehow so it works with FreeClient too
	return "?sid=Echo.ToggleButton.Image&imageuid=" + identifier;
};

EchoRender.ComponentSync.ToggleButton.prototype.renderAdd = function(update, parentElement) {
	this._selected = this.component.getRenderProperty("selected");
	
	EchoRender.ComponentSync.Button.prototype.renderAdd.call(this, update, parentElement);
};

EchoRender.ComponentSync.ToggleButton.prototype._getStateIcon = function() {
	return EchoRender.Property.getEffectProperty(this.component, "stateIcon", "selectedStateIcon", this._selected);
};

EchoRender.ComponentSync.ToggleButton.prototype._renderContent = function() {
    var text = this.component.getRenderProperty("text");
    var icon = this.component.getRenderProperty("icon");
	var stateIcon = this._getStateIcon();
    
    var entityCount = (text ? 1 : 0) + (icon ? 1 : 0) + (stateIcon ? 1 : 0);
    if (entityCount == 1) {
    	if (text) {
            this._renderButtonText(this._divElement, text);
    	} else if (icon) {
	        this._iconElement = this._renderButtonIcon(this._divElement, icon);
    	} else {
	        this._stateIconElement = this._renderButtonIcon(this._divElement, stateIcon);
    	}
    } else if (entityCount == 2) {
        var orientation;
        var margin;
        if (stateIcon) {
	        orientation = EchoRender.TriCellTable.TRAILING_LEADING;
	        margin = this.component.getRenderProperty("stateMargin", EchoRender.ComponentSync.Button._defaultIconTextMargin);
        } else {
	        orientation = EchoRender.TriCellTable.LEADING_TRAILING;
	        margin = this.component.getRenderProperty("iconTextMargin", EchoRender.ComponentSync.Button._defaultIconTextMargin);
        }
        var tct = new EchoRender.TriCellTable(orientation, EchoRender.Property.Extent.toPixels(margin));
        if (text) {
	        this._renderButtonText(tct.tdElements[0], text);
	        if (icon) {
		        this._iconElement = this._renderButtonIcon(tct.tdElements[1], icon);
	        } else {
		        this._stateIconElement = this._renderButtonIcon(tct.tdElements[1], stateIcon);
	        }
        } else {
	        this._iconElement = this._renderButtonIcon(tct.tdElements[0], icon);
	        this._stateIconElement = this._renderButtonIcon(tct.tdElements[1], stateIcon);
        }
        this._divElement.appendChild(tct.tableElement);
    } else if (entityCount == 3) {
        var orientation = EchoRender.TriCellTable.LEADING_TRAILING;
        var margin = this.component.getRenderProperty("iconTextMargin", EchoRender.ComponentSync.Button._defaultIconTextMargin);
        var stateOrientation = EchoRender.TriCellTable.TRAILING_LEADING;
        var stateMargin = this.component.getRenderProperty("stateMargin", EchoRender.ComponentSync.Button._defaultIconTextMargin);
        var tct = new EchoRender.TriCellTable(orientation, 
        	EchoRender.Property.Extent.toPixels(margin), stateOrientation, EchoRender.Property.Extent.toPixels(stateMargin));
        this._renderButtonText(tct.tdElements[0], text);
        this._iconElement = this._renderButtonIcon(tct.tdElements[1], icon);
        this._stateIconElement = this._renderButtonIcon(tct.tdElements[2], stateIcon);
        this._divElement.appendChild(tct.tableElement);
    }
};

EchoRender.ComponentSync.ToggleButton.prototype.renderDispose = function(update) {
	EchoRender.ComponentSync.Button.prototype.renderDispose.call(this, update);
	this._stateIconElement = null;
};

EchoRender.ComponentSync.ToggleButton.prototype._doAction = function() {
	this.setSelected(!this._selected);
	EchoRender.ComponentSync.Button.prototype._doAction.call(this);
};

/**
 * Selects or deselects this button.
 * 
 * @param newState {Boolean} the new selection state
 */
EchoRender.ComponentSync.ToggleButton.prototype.setSelected = function(newState) {
	if (this._selected == newState) {
		return;
	}
	this._selected = newState;
	this.component.setProperty("selected", newState);
	
	if (this._stateIconElement) {
		var stateIcon = this._getStateIcon();
		this._stateIconElement.src = stateIcon.url ? stateIcon.url : stateIcon;
	}
};

EchoRender.registerPeer("ToggleButton", EchoRender.ComponentSync.ToggleButton);

/**
 * Component rendering peer: RadioButton
 */
EchoRender.ComponentSync.RadioButton = function() {
	this._buttonGroup = null;
};

EchoRender.ComponentSync.RadioButton.prototype = new EchoRender.ComponentSync.ToggleButton;

/**
 * Contains mappings from RadioButton render ids to EchoApp.ButtonGroup objects.
 * 
 * @type {EchoCore.Collections.Map}
 */
EchoRender.ComponentSync.RadioButton._groups = new EchoCore.Collections.Map();

EchoRender.ComponentSync.RadioButton.prototype.renderAdd = function(update, parentElement) {
	var groupId = this.component.getRenderProperty("group");
	if (groupId) {
		var group = EchoRender.ComponentSync.RadioButton._groups.get(groupId);
		if (!group) {
			group = new EchoApp.ButtonGroup(groupId);
			EchoRender.ComponentSync.RadioButton._groups.put(groupId, group)
		}
		group.add(this);
		this._buttonGroup = group;
	}
	EchoRender.ComponentSync.ToggleButton.prototype.renderAdd.call(this, update, parentElement);
};

EchoRender.ComponentSync.RadioButton.prototype._getStateIcon = function() {
	var stateIcon = EchoRender.ComponentSync.ToggleButton.prototype._getStateIcon.call(this);
	if (stateIcon) {
		return stateIcon;
	} else {
		var imageId = this._selected ? "radioButtonOn" : "radioButtonOff";
		return EchoRender.ComponentSync.ToggleButton._getImageUri(imageId);
	}
};

EchoRender.ComponentSync.RadioButton.prototype.renderDispose = function(update) {
	EchoRender.ComponentSync.ToggleButton.prototype.renderDispose.call(this, update);
	if (this._buttonGroup) {
		this._buttonGroup.remove(this);
		if (this._buttonGroup.size() == 0) {
			EchoRender.ComponentSync.RadioButton._groups.remove(this._buttonGroup.getId());
		}
		this._buttonGroup = null;
	}
};

EchoRender.ComponentSync.RadioButton.prototype._doAction = function() {
	if (this._buttonGroup) {
		this._buttonGroup.deselect();
	}
	EchoRender.ComponentSync.ToggleButton.prototype._doAction.call(this);
};

EchoRender.registerPeer("RadioButton", EchoRender.ComponentSync.RadioButton);

/**
 * Component rendering peer: CheckBox
 */
EchoRender.ComponentSync.CheckBox = function() {
};

EchoRender.ComponentSync.CheckBox.prototype = new EchoRender.ComponentSync.ToggleButton;

EchoRender.ComponentSync.CheckBox.prototype._getStateIcon = function() {
	var stateIcon = EchoRender.ComponentSync.ToggleButton.prototype._getStateIcon.call(this);
	if (stateIcon) {
		return stateIcon;
	} else {
		var imageId = this._selected ? "checkBoxOn" : "checkBoxOff";
		return EchoRender.ComponentSync.ToggleButton._getImageUri(imageId);
	}
};

EchoRender.registerPeer("CheckBox", EchoRender.ComponentSync.CheckBox);
