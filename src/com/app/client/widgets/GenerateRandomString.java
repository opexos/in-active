package com.app.client.widgets;
import static com.app.client.G.img16;

import com.app.client.G;
import com.app.shared.GS;
import com.smartgwt.client.widgets.HTMLFlow;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.events.FormItemClickHandler;
import com.smartgwt.client.widgets.form.fields.events.FormItemIconClickEvent;
import com.smartgwt.client.widgets.layout.VLayout;

public class GenerateRandomString extends FormItemIcon {

	private String m_windowTitle;
	private boolean m_storeAsMD5Hash;
	private FormItem[] m_addItems;

	public GenerateRandomString(final int length, String prompt) {
		super();
		setSrc(img16("generate_password"));
		setWidth(16);
		setHeight(16);
		setPrompt(prompt);
		setTabIndex(-1);

		addFormItemClickHandler(new FormItemClickHandler() {
			public void onFormItemClick(FormItemIconClickEvent event) {
				String str = GS.generateRandomString(length);

				if (m_windowTitle != null) {
					VLayout vl = new VLayout();
					vl.setPadding(50);
					vl.addMember(new HTMLFlow("<span style=\"font-family:Cousine,monospace; font-size:200%\">" + str + "</span>"));
					G.showInWindow(m_windowTitle, vl);
				}

				if (m_storeAsMD5Hash)
					str = G.calcMD5(str);

				event.getItem().setValue(str);
				if (m_addItems != null) {
					for (FormItem itm : m_addItems)
						itm.setValue(str);
				}
			}
		});

	}

	public GenerateRandomString showResultInWindow(String windowTitle) {
		m_windowTitle = windowTitle;
		return this;
	}

	public GenerateRandomString storeAsMD5Hash() {
		m_storeAsMD5Hash = true;
		return this;
	}

	public GenerateRandomString setValueToFormItems(FormItem... items) {
		m_addItems = items;
		return this;
	}

}
