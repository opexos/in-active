package com.app.client.widgets;

import com.app.shared.GS;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;

public class IntegerItem extends com.smartgwt.client.widgets.form.fields.IntegerItem implements CanClear {

	private ClearIcon m_clearIcon = new ClearIcon(this);

	public IntegerItem(DataSourceField field, String title) {
		this();
		setName(field.getName());
		setTitle(title);
		setRequired(field.getRequired());
		setLength(field.getLength());
	}

	public IntegerItem(DataSourceField field) {
		this(field, field.getTitle());
	}

	public IntegerItem(String title) {
		this();
		setTitle(title);
	}
	
	public IntegerItem(String name, String title) {
		this(title);
		setName(name);
	}
	

	public IntegerItem() {
		super();
		setWidth("*");
		super.setIcons(m_clearIcon);
	}

	public IntegerItem icons(FormItemIcon... icons) {
		setIcons(icons);
		return this;
	}

	public IntegerItem required(boolean value) {
		setRequired(value);
		return this;
	}

	public IntegerItem range(int min, int max) {
		setValidators(new IntegerRangeValidator(min, max));
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
