package com.app.client.widgets;

import com.app.client.G;
import com.app.shared.GS;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.TextItem;
import com.smartgwt.client.widgets.form.validator.CustomValidator;

public class IPItem extends TextItem implements CanClear {
	
	private ClearIcon m_clearIcon = new ClearIcon(this);

	public IPItem(DataSourceField field) {
		this(field, field.getTitle());
	}

	public IPItem(DataSourceField field, String title) {
		this(title);
		setName(field.getName());
		setRequired(field.getRequired());
	}

	public IPItem(String name, String title) {
		this(title);
		setName(name);		
	}
	
	public IPItem(String title) {
		super();
		setTitle(title);
		setLength("255.255.255.255".length());
		setWidth("*");
		setValidators(new IPValidator());
		super.setIcons(m_clearIcon);
	}

	private static class IPValidator extends CustomValidator {
		public IPValidator() {
			setErrorMessage(G.S.incorrectValue());
		}

		protected boolean condition(Object value) {
			return value == null ? true : GS.ip2long(value.toString()) > 0;			
		}
	}
	
	public IPItem required(boolean value){
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

}
