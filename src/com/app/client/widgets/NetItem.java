package com.app.client.widgets;

import com.app.client.G;
import com.app.shared.GS;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.TextItem;
import com.smartgwt.client.widgets.form.validator.CustomValidator;

public class NetItem extends TextItem implements CanClear {

	private ClearIcon m_clearIcon = new ClearIcon(this);

	public NetItem(DataSourceField field) {
		this(field, field.getTitle());
	}

	public NetItem(DataSourceField field, String title) {
		this(title);
		setName(field.getName());
		setRequired(field.getRequired());
	}

	public NetItem(String name, String title) {
		this(title);
		setName(name);
	}

	public NetItem(String title) {
		super();
		setTitle(title);
		setLength("255.255.255.255/32".length());
		setWidth("*");
		setValidators(new NetValidator());
		super.setIcons(m_clearIcon);
	}

	private static class NetValidator extends CustomValidator {
		public NetValidator() {
			setErrorMessage(G.S.incorrectValue());
		}

		protected boolean condition(Object value) {
			if (value == null)
				return true;
			return GS.netIsCorrect(value.toString());
		}
	}

	public NetItem required(boolean value) {
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
