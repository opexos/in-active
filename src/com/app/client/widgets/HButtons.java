package com.app.client.widgets;

import com.app.shared.Const;
import com.smartgwt.client.widgets.layout.HLayout;

public class HButtons extends HLayout {

	private IButton button1;
	private IButton button2;
	private IButton button3;

	public HButtons(Integer padding, String... buttonTitles) {
		super(Const.DEFAULT_PADDING);
		setAutoHeight();		
		if (padding != null)
			setPadding(padding);

		if (buttonTitles.length >= 1) {
			button1 = new IButton(buttonTitles[0]) {
				@Override
				public void onClick() {
					button1();
				}
			};
			addMember(button1);
		}
		if (buttonTitles.length >= 2) {
			button2 = new IButton(buttonTitles[1]) {
				@Override
				public void onClick() {
					button2();
				}
			};
			addMember(button2);
		}
		if (buttonTitles.length >= 3) {
			button3 = new IButton(buttonTitles[2]) {
				@Override
				public void onClick() {
					button3();
				}
			};
			addMember(button3);
		}
		if (buttonTitles.length >= 4)
			throw new RuntimeException("Maximum 3 buttons allowed");
	}

	public HButtons(String... buttonTitles) {
		this(Const.DEFAULT_PADDING, buttonTitles);
	}

	public void setIcons(String... icons) {
		for (int i = 0; i < icons.length; i++) {
			if (icons[i] != null)
				((IButton) getMember(i)).setIcon(icons[i]);
		}
	}
	
	public IButton getButton1() {
		return button1;
	}
	public IButton getButton2() {
		return button2;
	}
	public IButton getButton3() {
		return button3;
	}

	protected void button1() {
	}

	protected void button2() {
	}

	protected void button3() {
	}

}
