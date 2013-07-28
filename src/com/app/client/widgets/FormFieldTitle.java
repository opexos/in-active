package com.app.client.widgets;

import com.smartgwt.client.widgets.Img;
import com.smartgwt.client.widgets.Label;
import com.smartgwt.client.widgets.layout.HLayout;

public class FormFieldTitle extends HLayout {

	private Label m_label;
	private Img m_img;
	private String m_contents;
	private boolean m_required = false;
	private boolean m_error = false;

	public FormFieldTitle(String contents) {
		super(5);
		m_contents = contents;
		m_label = new Label();
		m_label.setStyleName("formTitle");
		m_label.setWrap(false);
		m_img = new Img(getImgURL("[SKIN]/actions/exclamation.png"), 16, 16);
		m_img.hide();
		setMembers(m_label, m_img);
		setHeight(16);
		refresh();
	}

	public void setError(boolean error) {
		m_error = error;
		if (error)
			m_img.show();
		else
			m_img.hide();
	}

	public boolean getError() {
		return m_error;
	}

	public void setErrorMessage(String msg) {
		m_img.setPrompt(msg);
	}

	public void setRequired(boolean required) {
		m_required = required;
		refresh();
	}

	private void refresh() {
		m_label.setContents((m_required ? "<b>" : "") + m_contents + " :" + (m_required ? "</b>" : ""));
	}


}
