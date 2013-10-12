package com.app.client.widgets;

import com.app.client.G;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;

public class IButton extends com.smartgwt.client.widgets.IButton {

	public IButton(String title, String icon) {
		super(title);
		//if ((title.length() >= 10 && icon!=null) || title.length() >= 13)
			setAutoFit(true);
		//setTitle("<span style=\"vertical-align:middle\">" + title + "</span>");
		if (icon != null)
			setIcon(icon);
		addClickHandler(new ClickHandler() {
			public void onClick(ClickEvent event) {
				IButton.this.onClick();
			}
		});
	}

	public IButton(String title) {
		this(title, null);
		if (title.equals(G.S.ok())||title.equals(G.S.save())||title.equals(G.S.yes())||title.equals(G.S.load()))
			setIcon(G.img16("ok"));
		else if (title.equals(G.S.cancel())||title.equals(G.S.no()))
			setIcon(G.img16("cancel"));
		else if (title.equals(G.S.copy()))
			setIcon(G.img16("copy"));
	}

	protected void onClick() {

	}

}
