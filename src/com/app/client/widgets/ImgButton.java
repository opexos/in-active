package com.app.client.widgets;

import com.smartgwt.client.widgets.events.ClickHandler;

public class ImgButton extends com.smartgwt.client.widgets.ImgButton {

	public ImgButton(String icon, String prompt, ClickHandler clickHandler, int size) {
		super();
		setWidth(size);
		setHeight(size);
		setShowDown(false);
		setShowRollOver(false);
		setCanFocus(false);
		setSrc(icon);
		setPrompt(prompt);
		setNoDoubleClicks(true);
		if (clickHandler != null)
			addClickHandler(clickHandler);
	}

}
