package com.app.client.widgets;

import java.util.LinkedHashMap;

import com.app.client.G;
import com.app.shared.GS;
import com.smartgwt.client.data.Criteria;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;

public class SelectItem extends com.smartgwt.client.widgets.form.fields.SelectItem implements CanClear {

	private ClearIcon m_clearIcon = new ClearIcon(this);

	{
		setWidth("*");
		super.setIcons(m_clearIcon);
	}

	public SelectItem(DataSourceField field, String title) {
		super(field.getName(), title);
		setRequired(field.getRequired());
		if (getRequired() == null || !getRequired())
			setAllowEmptyValue(true);
	}

	public SelectItem(DataSourceField field, LinkedHashMap<?, ?> valueMap) {
		this(field, field.getTitle(), valueMap);
	}

	public SelectItem(DataSourceField field, String title, LinkedHashMap<?, ?> valueMap) {
		this(field, title);
		setValueMap(valueMap);
	}

	public SelectItem(DataSourceField field, String[] valueMap) {
		this(field, field.getTitle(), valueMap);
	}

	public SelectItem(DataSourceField field, String title, String[] valueMap) {
		this(field, title);
		setValueMap(valueMap);
	}

	public SelectItem(String name, String title, String[] valueMap) {
		this();
		setName(name);
		setTitle(title);
		setValueMap(valueMap);
	}

	public SelectItem(String name, String title, LinkedHashMap<?, ?> valueMap) {
		this();
		setName(name);
		setTitle(title);
		setValueMap(valueMap);
	}

	public SelectItem(DataSourceField field, String title, Class<?> enumClass) {
		this(field, title, G.getEnumValues(enumClass));
	}

	public SelectItem(DataSourceField field, DataSource optionDataSource, String odsValueField, String odsDisplayField) {
		this(field, field.getTitle(), optionDataSource, odsValueField, odsDisplayField);
	}
	
	public SelectItem(DataSourceField field) {
		super(field.getName(), field.getTitle());
	}

	public SelectItem(String name, String title, DataSource optionDataSource, String odsValueField, String odsDisplayField) {
		this();
		setName(name);
		setTitle(title);
		setOptionDataSource(optionDataSource);
		setValueField(odsValueField);
		setDisplayField(odsDisplayField);
		setSortField(odsDisplayField);
		setFetchDisplayedFieldsOnly(true);
	}

	public SelectItem(DataSourceField field, String title, DataSource optionDataSource, String odsValueField, String odsDisplayField) {
		this(field, title);
		setOptionDataSource(optionDataSource);
		setValueField(odsValueField);
		setDisplayField(odsDisplayField);
		setSortField(odsDisplayField);
		setFetchDisplayedFieldsOnly(true);

		// DSRequest req = new DSRequest();
		// req.setOutputs(GS.commaList(odsValueField, odsDisplayField));
		// if (odsCriteria != null)
		// req.setCriteria(odsCriteria);
		// setPickListCriteria(req);

		// setFetchDisplayedFieldsOnly(true); данное св-во работает некорректно, т.к. когда контрол подтягивает

	}

	public SelectItem criteria(Criteria crit) {
		setPickListCriteria(crit);
		return this;
	}

	// public SelectItem sort(String field){
	// setSortField(field);
	// return this;
	// }

	/*public SelectItem copyFieldsValues(final String... fields) {
		addChangedHandler(new ChangedHandler() {
			public void onChanged(ChangedEvent event) {
				for (int i = 0; i < fields.length / 2; i++)
					event.getForm().setValue(fields[i + 1], SelectItem.this.getSelectedRecord().getAttribute(fields[i]));
			}
		});
		return this;
	}*/

	public SelectItem(String title, LinkedHashMap<?, ?> valueMap) {
		super();
		setTitle(title);
		setValueMap(valueMap);
	}

	public SelectItem() {
		super();
	}

	public SelectItem required(boolean value) {
		setRequired(value);
		return this;
	}

	public SelectItem noTitle() {
		setShowTitle(false);
		return this;
	}

	public SelectItem allowEmptyValue() {
		setAllowEmptyValue(true);
		return this;
	}
	
	public SelectItem showIf(FormItemIfFunction func) {
		setShowIfCondition(func);
		return this;
	}
	
	public SelectItem redrawOnChange(){
		setRedrawOnChange(true);
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
	
	public SelectItem icons(FormItemIcon... icons) {
		setIcons(icons);
		return this;
	}


}
