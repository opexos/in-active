package com.app.client.widgets;

import java.util.Map;

import com.app.client.G;
import com.app.shared.GS;
import com.app.shared.Interval;
import com.smartgwt.client.types.Alignment;
import com.smartgwt.client.types.ListGridFieldType;
import com.smartgwt.client.widgets.grid.CellFormatter;
import com.smartgwt.client.widgets.grid.ListGridRecord;

public class ListGridField extends com.smartgwt.client.widgets.grid.ListGridField {

	public ListGridField(String name, String title) {
		super(name, title);
		setAlign(Alignment.LEFT);
		setWidth(150);
	}

	public ListGridField(String name, String title, Map<?, ?> valueMap) {
		this(name, title);
		selectItem(valueMap);
	}

	public ListGridField(String name, Map<?, ?> valueMap) {
		this(name);
		selectItem(valueMap);
	}

	public ListGridField(String name, int width) {
		super(name, width);
		setAlign(Alignment.LEFT);
	}

	public ListGridField(String name) {
		super(name);
		setAlign(Alignment.LEFT);
		setWidth(150);
	}
	
	public ListGridField(String name, String title, int width) {
		super(name, title, width);
	}
	
	public ListGridField(String name, String title, String width) {
		super(name, title);
		width(width);
	}

	public ListGridField filterOnKeyPress() {
		setFilterOnKeypress(true);
		return this;
	}

	public ListGridField centerAlign() {
		setAlign(Alignment.CENTER);
		return this;
	}

	public ListGridField prompt(String prompt) {
		setPrompt(prompt);
		return this;
	}

	public ListGridField noMenu() {
		setShowDefaultContextMenu(false);
		return this;
	}

	public ListGridField cellFormatter(CellFormatter fmt) {
		setCellFormatter(fmt);
		return this;
	}

	public ListGridField interval()
	{
		setWidth(130);
		setCellFormatter(new CellFormatter() {
			Interval m_interval = new Interval();

			public String format(Object value, ListGridRecord record, int rowNum, int colNum) {
				if (value == null)
					return null;
				m_interval.setInterval(value.toString());
				return m_interval.getDisplayValue(G.S, G.M);
			}
		});
		return this;
	}

	public ListGridField decode()
	{
		setCellFormatter(new CellFormatter() {
			public String format(Object value, ListGridRecord record, int rowNum, int colNum) {
				if (value == null)
					return null;
				return GS.decode(value);
			}
		});
		return this;
	}

	public ListGridField dayHourMinute(final String valueField)
	{
		setWidth(120);
		setCellFormatter(new CellFormatter() {
			public String format(Object value, ListGridRecord record, int rowNum, int colNum) {
				if (valueField != null)
					value = record.getAttribute(valueField);
				if (value == null)
					return null;
				String[] parts = value.toString().split(";");
				int days = Integer.parseInt(parts[0]);
				int hours = Integer.parseInt(parts[1]);
				int minutes = Integer.parseInt(parts[2]);
				String res = "";
				if (days > 0)
					res = days + " " + G.S.shortDays();
				if (hours > 0)
					res += (res.isEmpty() ? "" : " ") + hours + " " + G.S.shortHours();
				if (minutes > 0)
					res += (res.isEmpty() ? "" : " ") + minutes + " " + G.S.shortMinutes();
				return res;
			}
		});
		return this;
	}

	public ListGridField date() {
		setWidth(110);
		setFilterOnKeypress(true);
		return this;
	}

	public ListGridField bool() {
		setFilterOnKeypress(true);
		centerAlign();
		setType(ListGridFieldType.BOOLEAN);
		return this;
	}

	public ListGridField width(int width) {
		setWidth(width);
		return this;
	}

	public ListGridField width(String width) {
		setWidth(width);
		return this;
	}
	
	

	public ListGridField hidden() {
		setHidden(true);
		setCanHide(false);
		return this;
	}
	
	public ListGridField canEdit(){
		setCanEdit(true);
		return this;
	}
	

	public ListGridField noFilter(){
		setCanFilter(false);
		return this;
	}

	public ListGridField selectItem(Map<?, ?> valueMap) {
		setValueMap(valueMap);		
		setFilterEditorType(SelectItem.class);
		setFilterOnKeypress(true);
		return this;
	}

	public ListGridField selectItem(String... values) {
		setValueMap(values);		
		setFilterEditorType(SelectItem.class);
		setFilterOnKeypress(true);
		return this;
	}
	// public ListGridField sortAscending(){
	// setSortDirection(SortDirection.ASCENDING);
	// return this;
	// }
	//
	// public ListGridField sortDescending(){
	// setSortDirection(SortDirection.DESCENDING);
	// return this;
	// }

}
