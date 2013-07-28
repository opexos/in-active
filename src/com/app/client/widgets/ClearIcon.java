package com.app.client.widgets;
import static com.app.client.G.img16;

import com.app.client.G;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.events.FormItemClickHandler;
import com.smartgwt.client.widgets.form.fields.events.FormItemIconClickEvent;

public class ClearIcon extends FormItemIcon {

	private boolean m_pressed;
	private boolean m_visible;
	private FormItem m_item;
	private boolean m_requiredField;

	public ClearIcon(FormItem item) {
		super();
		m_item = item;
		setSrc(img16("remove_gray"));
		setWidth(16);
		setHeight(16);
		setPrompt(G.S.clear());
		setTabIndex(-1);
		setNeverDisable(true);
		setDisableOnReadOnly(false);

		addFormItemClickHandler(new FormItemClickHandler() {
			public void onFormItemClick(FormItemIconClickEvent event) {
				if (m_requiredField)
					G.dialogWarning(G.S.cannotClearRequiredField());
				else
					setPressed(!m_pressed);
			}
		});

		setShowIfCondition(new FormItemIfFunction() {
			public boolean execute(FormItem item, Object value, DynamicForm form) {
				return m_visible;
			}
		});
	}

	public boolean getPressed() {
		return m_pressed;
	}

	public void setPressed(boolean value) {
		m_pressed = value;
		setSrc(value ? img16("remove") : img16("remove_gray"));
		if (value)
			m_item.blurItem(); 
		m_item.setDisabled(value);
		m_item.redraw();
	}

	public void show(Boolean requiredField) {
		m_requiredField = requiredField!=null && requiredField;
		m_visible = true;
		m_item.redraw();
	}

	public void hide() {
		m_visible = false;
		m_item.redraw();
	}

}
