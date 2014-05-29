package com.app.client.widgets;

import com.smartgwt.client.widgets.menu.events.ClickHandler;

public class MenuItem extends com.smartgwt.client.widgets.menu.MenuItem {

	public MenuItem(String title, String icon) {
		super(title, icon);
	}

	public MenuItem(String title) {
		super(title);
	}

	public MenuItem(String title, String icon, ClickHandler clickHandler) {
		super(title, icon);
		addClickHandler(clickHandler);
	}
	
	public MenuItem(String title, ClickHandler clickHandler) {
		super(title);
		addClickHandler(clickHandler);
	}
	
	public MenuItem(String title, MenuItem... submenu){
		super(title);
		setSubmenu(new Menu(submenu));
	}

}
