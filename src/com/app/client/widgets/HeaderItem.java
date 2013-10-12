package com.app.client.widgets;

public class HeaderItem extends com.smartgwt.client.widgets.form.fields.HeaderItem {

	public HeaderItem(String text) {
		super();
		setDefaultValue(text);
	}

	public HeaderItem(String name, String text) {
		super(name);
		setDefaultValue(text);
	}

	
}
