package com.app.client.widgets;

import com.app.shared.GS;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.types.Alignment;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;

public class DateTimeItem extends com.smartgwt.client.widgets.form.fields.DateTimeItem implements CanClear {
	
	private ClearIcon m_clearIcon = new ClearIcon(this);

	public DateTimeItem(DataSourceField field) {
		this(field, field.getTitle());
	}

	public DateTimeItem(DataSourceField field, String title) {
		this(title);
		setName(field.getName());
		setRequired(field.getRequired());
	}
	
	public DateTimeItem(String name, String title){
		this(title);
		setName(name);
	}
	
	public DateTimeItem(String title){
		this();
		setTitle(title);
	}
	
	public DateTimeItem(){
		super();
		setWidth("*");
		setTextAlign(Alignment.LEFT);
		setType("datetime");
		super.setIcons(m_clearIcon);
	}
	
	
	
	public DateTimeItem required(boolean value){
		setRequired(value);
		return this;
	}
	
	public DateTimeItem showIf(FormItemIfFunction func){
		setShowIfCondition(func);
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
