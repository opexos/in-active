package com.app.client.widgets;

import com.app.shared.GS;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.events.ChangeEvent;
import com.smartgwt.client.widgets.form.fields.events.ChangeHandler;

public class PasswordItem extends com.smartgwt.client.widgets.form.fields.PasswordItem implements CanClear {

	private ClearIcon m_clearIcon = new ClearIcon(this);

	public PasswordItem(DataSourceField field, String title, boolean canEdit) {
		this(field.getName(), title);
		setRequired(field.getRequired());
		setLength(field.getLength());
		if (!canEdit) {
			addChangeHandler(new ChangeHandler() {
				public void onChange(ChangeEvent event) {
					event.cancel();
				}
			});
		}
	}

	public PasswordItem(DataSourceField field, boolean canEdit) {
		this(field, field.getTitle(), canEdit);
	}

	public PasswordItem(String name, String title) {
		this(title);
		setName(name);
	}
	
	

	public PasswordItem(String title) {
		this();
		setTitle(title);
	}

	public PasswordItem() {
		super();
		setWidth("*");
		super.setIcons(m_clearIcon);
	}

	public PasswordItem required(boolean value) {
		setRequired(value);
		return this;
	}

	@Override
	public void setIcons(FormItemIcon... icons) {
		super.setIcons(GS.getArray(icons, m_clearIcon));
	}

	@Override
	public ClearIcon getClearIcon() {
		return m_clearIcon;
	}
	
	public PasswordItem showIf(FormItemIfFunction func) {
		setShowIfCondition(func);		
		return this;
	}
	

}
