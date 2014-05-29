package com.app.client.widgets;

import com.app.client.G;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.form.validator.CustomValidator;

public class RequiredIfOtherHaveValueValidator extends CustomValidator {

	private FormItem m_item;

	public RequiredIfOtherHaveValueValidator(FormItem checkedFormItem) {
		setErrorMessage(G.S.valueIsRequired());
		m_item = checkedFormItem;
	}

	protected boolean condition(Object value) {
		if (m_item.getValue() != null && value == null)
			return false;
		else
			return true;
	}
}
