package com.app.client.widgets;

import static com.app.client.G.img16;

import com.app.client.G;
import com.app.shared.GS;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.util.SC;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItemIcon;
import com.smartgwt.client.widgets.form.fields.events.FormItemClickHandler;
import com.smartgwt.client.widgets.form.fields.events.FormItemIconClickEvent;

public class TextItem extends com.smartgwt.client.widgets.form.fields.TextItem implements CanClear {

	private ClearIcon m_clearIcon = new ClearIcon(this);
	private FormItemIcon m_btn;

	public TextItem(DataSourceField field) {
		this(field, field.getTitle());
	}

	public TextItem(DataSourceField field, String title) {
		this(title);
		setName(field.getName());
		setRequired(field.getRequired());
		setLength(field.getLength());
	}

	public TextItem(String name, String title) {
		this(title);
		setName(name);
	}

	public TextItem(String title) {
		this();
		setTitle(title);
	}

	public TextItem() {
		super();
		setWidth("*");
		super.setIcons(m_clearIcon);
	}

	public TextItem canEditInForm() {
		m_btn = new FormItemIcon();
		m_btn.setName(SC.generateID()); // warning fix
		m_btn.setPrompt(G.S.editInSeparateWindow());
		m_btn.setSrc(img16("edit_in_window"));
		m_btn.setWidth(16);
		m_btn.setHeight(16);
		m_btn.addFormItemClickHandler(new FormItemClickHandler() {
			public void onFormItemClick(FormItemIconClickEvent event) {
				new EditWindow().show();
			}
		});
		super.setIcons(m_btn, m_clearIcon);
		return this;
	}

	public TextItem required(boolean value) {
		setRequired(value);
		return this;
	}
	
	public TextItem canEdit(boolean value) {
		setCanEdit(value);
		return this;
	}

	public TextItem length(Integer value) {
		setLength(value);
		return this;
	}

	public TextItem showIf(FormItemIfFunction func) {
		setShowIfCondition(func);		
		return this;
	}

	public TextItem noTitle() {
		setShowTitle(false);
		return this;
	}

	@Override
	public void setIcons(FormItemIcon... icons) {
		if (m_btn != null)
			super.setIcons(GS.getArray(GS.getArray(m_btn, icons), m_clearIcon));
		else
			super.setIcons(GS.getArray(icons, m_clearIcon));
	}

	@Override
	public ClearIcon getClearIcon() {
		return m_clearIcon;
	}

	private class EditWindow extends Window {

		private DynamicForm m_form;
		private TextAreaItem m_text;

		public EditWindow() {
			super(G.S.editing(), false, true);
			setCanDragResize(true);
			resizeTo(500, 400);

			m_text = new TextAreaItem();
			m_text.setLength(TextItem.this.getLength());
			m_text.setShowTitle(false);
			m_text.setWidth("*");
			m_text.setHeight("*");
			//m_text.setWrap(TextAreaWrap.OFF);

			m_form = new DynamicForm();
			m_form.setWidth100();
			m_form.setHeight100();
			m_form.setFields(m_text);
			m_form.setNumCols(1);
			m_form.setAutoFocus(true);

			HButtons btns = new HButtons(G.S.ok(), G.S.cancel()) {
				@Override
				protected void button1() {
					TextItem.this.setValue(m_text.getValue());
					EditWindow.this.destroy();
				}

				@Override
				protected void button2() {
					EditWindow.this.destroy();
				}
			};

			addItem(m_form);
			addItem(btns);
		}

		public void show() {
			m_text.setValue(TextItem.this.getValue());
			super.show();
		}

	}

}
