package com.app.client.widgets;

import com.app.client.G;
import com.smartgwt.client.widgets.events.CloseClickEvent;
import com.smartgwt.client.widgets.events.CloseClickHandler;

public class Window extends com.smartgwt.client.widgets.Window {

	public Window(String title, boolean closeButton, boolean modal) {
		super();
		setAutoCenter(true); // always show at center
		setTitle(title);
		setShowCloseButton(closeButton);
		setShowMaximizeButton(false);
		setShowMinimizeButton(false);
		setIsModal(modal);
		setAutoSize(true);
		setDismissOnEscape(false);		
	}

	public Window destroyOnClose() {
		addCloseClickHandler(new CloseClickHandler() {
			@Override
			public void onCloseClick(CloseClickEvent event) {
				destroy();
			}
		});
		return this;
	}
	
	@Override
	public Boolean resizeTo(int width, int height) {
		setAutoSize(false);
		return super.resizeTo(G.availWidth(width), G.availHeight(height));		
	}
	
	
	public Window minSize(int width, int height){
		setMinWidth(width);
		setMinHeight(height);
		return this;
	}

}
