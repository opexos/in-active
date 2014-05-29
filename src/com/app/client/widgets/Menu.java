package com.app.client.widgets;

import com.smartgwt.client.widgets.menu.MenuItem;


public class Menu extends com.smartgwt.client.widgets.menu.Menu {

	public Menu() {
		super();
		setShowIcons(false);
		//setBaseStyle("menuMainNoBG");
		//setStylePrimaryName("menuMainNoBG");
		//setStyleName("menuMain");
		//setBodyBackgroundColor("#f7f7f7");
		//setBorder("1px solid #ababab");
		//setStyleName("menuMainNoBG");
		//setBodyStyleName("menuMainNoBG");
		//setIconWidth(1);
		setCellHeight(30);
	}

	public Menu(MenuItem... items) {
		this();
		setItems(items);
	}
	
	

}
