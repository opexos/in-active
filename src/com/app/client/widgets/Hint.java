package com.app.client.widgets;
import static com.app.client.G.img16;

import com.app.client.G;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.events.FormItemClickHandler;
import com.smartgwt.client.widgets.form.fields.events.FormItemIconClickEvent;

public class Hint extends FormItemIcon {

	public Hint(final String message) {
		super();
		setSrc(img16("info"));
		setWidth(16);
		setHeight(16);
		setPrompt(message);
		setDisableOnReadOnly(false);

		addFormItemClickHandler(new FormItemClickHandler() {
			public void onFormItemClick(FormItemIconClickEvent event) {
				G.dialogSay(message);
			}
		});
	}

}
