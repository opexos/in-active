package com.app.client.widgets;

import com.app.shared.GS;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;

public class CheckboxItem extends com.smartgwt.client.widgets.form.fields.CheckboxItem implements CanClear {

	private ClearIcon m_clearIcon = new ClearIcon(this);

	public CheckboxItem(DataSourceField field, String title) {
		this(field.getName(), title);
	}

	public CheckboxItem(DataSourceField field) {
		this(field, field.getTitle());
	}

	public CheckboxItem(String name, String title) {
		super(name, title);
		setWidth("*");
		setLabelAsTitle(true);
		super.setIcons(m_clearIcon);
	}

	public CheckboxItem labelAsTitle(boolean value) {
		setLabelAsTitle(value);
		return this;
	}

	public CheckboxItem required(boolean value) {
		setRequired(value);
		return this;
	}

	public CheckboxItem allowEmptyValue(boolean allow) {
		setAllowEmptyValue(allow);
		return this;
	}

	public CheckboxItem defaultValue(boolean value) {
		setDefaultValue(value);
		return this;
	}

	public CheckboxItem visible(boolean value) {
		setVisible(value);
		return this;
	}
	
	public CheckboxItem redrawOnChange() {
		setRedrawOnChange(true);
		return this;
	}

	public CheckboxItem showIf(FormItemIfFunction condition) {
		setShowIfCondition(condition);
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
}
