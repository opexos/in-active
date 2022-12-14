package com.app.client;

import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.tab.Tab;

public abstract class AppTab extends Tab {

	public AppTab() {
		super();
	}
	
	protected abstract Canvas getContent();

	protected void onClose() {
	}

	protected void onShow() {
	}

	protected void onSelect() {
	}
	
	protected void onResize() {
	}

	public void show() {
		boolean onTabSet = false;
		for (Tab t : G.TABSET.getTabs())
			if (t == this)
				onTabSet = true;

		if (!onTabSet) {
			setPane(getContent());
			G.TABSET.setVisible(true);
			G.TABSET.addTab(this);
			onShow();
		}
		
		G.TABSET.selectTab(this);
	}

	public void setTitle(String icon, String title) {
		super.setTitle(Canvas.imgHTML(icon,16,16) + " " + title);
	}

}
