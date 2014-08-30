package com.app.client.widgets;

import com.smartgwt.client.widgets.events.ClickHandler;



public class ToolStripButton extends com.smartgwt.client.widgets.toolbar.ToolStripButton {

	public ToolStripButton(String title, String icon) {
		super(title, icon);
		setCanFocus(false);
	}

	public ToolStripButton(String title) {
		super(title);
		setCanFocus(false);
	}
	
	public ToolStripButton(String title, String icon, ClickHandler clickHandler) {
		this(title, icon);
		addClickHandler(clickHandler);
	}
	
	public ToolStripButton(String title, ClickHandler clickHandler) {
		this(title);
		addClickHandler(clickHandler);
	}

}
