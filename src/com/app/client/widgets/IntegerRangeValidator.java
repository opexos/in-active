package com.app.client.widgets;


public class IntegerRangeValidator extends com.smartgwt.client.widgets.form.validator.IntegerRangeValidator {
	
	public IntegerRangeValidator(int min, int max){
		super();
		setMin(min);
		setMax(max);
	}

}
