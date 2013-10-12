package com.app.client.widgets;
import static com.app.client.G.img16;

import java.util.LinkedHashMap;

import com.app.client.G;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.Interval;
import com.app.shared.IntervalType;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.util.SC;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.FormItemValueFormatter;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.IntegerItem;
import com.smartgwt.client.widgets.form.fields.RadioGroupItem;
import com.smartgwt.client.widgets.form.fields.TextItem;
import com.smartgwt.client.widgets.form.fields.TimeItem;
import com.smartgwt.client.widgets.form.fields.events.ChangeEvent;
import com.smartgwt.client.widgets.form.fields.events.ChangeHandler;
import com.smartgwt.client.widgets.form.fields.events.FormItemClickHandler;
import com.smartgwt.client.widgets.form.fields.events.FormItemIconClickEvent;
import com.smartgwt.client.widgets.form.validator.CustomValidator;
import com.smartgwt.client.widgets.layout.VLayout;

public class IntervalItem extends TextItem implements CanClear {

	private ClearIcon m_clearIcon = new ClearIcon(this);
	private EditWindow m_editWindow;
	private Interval m_interval = new Interval();
	private FormItemIcon m_btn;

	public IntervalItem(DataSourceField field, String title) {
		super(field.getName(), title);
		setRequired(field.getRequired());
		setWidth("*");

		addChangeHandler(new ChangeHandler() {
			public void onChange(ChangeEvent event) {
				event.cancel();
			}
		});

		setEditorValueFormatter(new FormItemValueFormatter() {
			public String formatValue(Object value, Record record, DynamicForm form, FormItem item) {
				if (value == null)
					return null;
				m_interval.setInterval(value.toString());
				return m_interval.getDisplayValue(G.S, G.M);
			}
		});

		setValidators(new IntervalValidator());

		m_btn = new FormItemIcon();
		m_btn.setName(SC.generateID()); // warning fix
		m_btn.setPrompt(G.S.selectInterval());
		m_btn.addFormItemClickHandler(new FormItemClickHandler() {
			public void onFormItemClick(FormItemIconClickEvent event) {
				if (m_editWindow == null)
					m_editWindow = new EditWindow();
				m_editWindow.show();
			}
		});
		m_btn.setSrc(img16("select_interval"));
		m_btn.setWidth(16);
		m_btn.setHeight(16);
		super.setIcons(m_btn, m_clearIcon);
	}

	public IntervalItem(DataSourceField field) {
		this(field, field.getTitle());
	}

	public IntervalItem icons(FormItemIcon... icons) {
		setIcons(icons);
		return this;
	}

	public void setIcons(FormItemIcon... icons) {
		super.setIcons(GS.getArray(GS.getArray(m_btn, icons), m_clearIcon));
	}

	@Override
	public ClearIcon getClearIcon() {
		return m_clearIcon;
	}

	private static class IntervalValidator extends CustomValidator {
		private Interval m_interval = new Interval();

		public IntervalValidator() {
			setErrorMessage(G.S.incorrectValue());
		}

		protected boolean condition(Object value) {
			if (value == null)
				return true;
			m_interval.setInterval(value.toString());
			return m_interval.isValid();
		}
	}

	private class EditWindow extends Window {

		private Interval m_interval = new Interval();
		private RadioGroupItem m_rg;
		private IntegerItem m_hours;
		private IntegerItem m_days;
		private TimeItem m_time;
		private DynamicForm m_form;
		private HButtons m_btns;

		public EditWindow() {
			super(G.S.interval(), false, true);

			LinkedHashMap<String, String> intervals = new LinkedHashMap<String, String>();
			intervals.put(IntervalType.HOUR.toString(), G.S.everySomeHours());
			intervals.put(IntervalType.DAYTIME.toString(), G.S.everySomeDaysAtTime());

			m_rg = new RadioGroupItem();
			// m_rg.setTitle("");
			m_rg.setShowTitle(false);
			m_rg.setColSpan(2);
			m_rg.setRequired(true);
			m_rg.setValueMap(intervals);
			m_rg.setRedrawOnChange(true);

			final FormItemIfFunction hourSelected = new FormItemIfFunction() {
				public boolean execute(FormItem item, Object value, DynamicForm form) {
					return IntervalType.HOUR.toString().equals(m_rg.getValueAsString());
				}
			};

			final FormItemIfFunction dayTimeSelected = new FormItemIfFunction() {
				public boolean execute(FormItem item, Object value, DynamicForm form) {
					return IntervalType.DAYTIME.toString().equals(m_rg.getValueAsString());
				}
			};

			m_hours = new IntegerItem();
			m_hours.setTitle(G.S.hours());
			m_hours.setValidators(new IntegerRangeValidator(1, 1000));
			m_hours.setRequired(true);
			m_hours.setShowIfCondition(hourSelected);

			m_days = new IntegerItem();
			m_days.setTitle(G.S.days());
			m_days.setValidators(new IntegerRangeValidator(1, 1000));
			m_days.setRequired(true);
			m_days.setShowIfCondition(dayTimeSelected);

			m_time = new TimeItem();
			m_time.setTitle(G.S.time());
			m_time.setRequired(true);
			m_time.setShowIfCondition(dayTimeSelected);

			m_form = new DynamicForm();
			m_form.setShowErrorStyle(false);
			m_form.setWidth(400);
			m_form.setTitleWidth(70);
			m_form.setFields(m_rg, m_hours, m_days, m_time);

			m_btns = new HButtons(G.S.ok(), G.S.cancel(), G.S.clear()) {
				@Override
				protected void button1() {
					if (m_form.validate()) {
						if (hourSelected.execute(null, null, null))
							m_interval.setIntervalHour(m_hours.getValueAsInteger());
						else if (dayTimeSelected.execute(null, null, null))
							m_interval.setIntervalDayTime(m_days.getValueAsInteger(), m_time.getDisplayValue());
						IntervalItem.this.setValue(m_interval.getValue());
						G.findParentWindow(this).hide();
					}
				}

				@Override
				protected void button2() {
					G.findParentWindow(this).hide();
				}
				
				@Override
				protected void button3() {
					IntervalItem.this.clearValue();
					G.findParentWindow(this).hide();
				}
			};
			m_btns.setIcons(null,null,img16("remove"));

			VLayout vl = new VLayout(Const.DEFAULT_PADDING);
			vl.setPadding(Const.DEFAULT_PADDING);
			vl.addMembers(m_form, m_btns);

			addItem(vl);

		}

		public void show() {
			m_form.clearValues();
			m_interval.setInterval(IntervalItem.this.getValueAsString());
			if (!m_interval.isEmpty() && m_interval.isValid()) {
				switch (m_interval.getType()) {
				case HOUR:
					m_rg.setValue(IntervalType.HOUR.toString());
					m_hours.setValue(m_interval.getHours());
					break;
				case DAYTIME:
					m_rg.setValue(IntervalType.DAYTIME.toString());
					m_days.setValue(m_interval.getDays());
					m_time.setValue(m_interval.getTime());
					break;
				}
			}
			m_btns.getButton3().setVisible(!getRequired());
			super.show();
		}

	}

}
