package com.app.client.widgets;

import com.smartgwt.client.widgets.menu.Menu;


public class ToolStripMenuButton extends com.smartgwt.client.widgets.toolbar.ToolStripMenuButton {

	public ToolStripMenuButton(String title, Menu menu) {
		super(title, menu);
		setCanFocus(false);
	}

	public ToolStripMenuButton(String title) {
		super(title);
		setCanFocus(false);
	}
	
	

}
