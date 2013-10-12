package com.app.client.widgets;

import com.smartgwt.client.types.Alignment;

public class Label extends com.smartgwt.client.widgets.Label {

	private int m_sizePercent;
	private boolean m_bold;
	private String m_contents;
	private int m_sizePixels;
	private String m_color;

	public Label(String contents) {
		super(contents);
		setAutoHeight();
		m_contents = contents;
	}

	public Label() {
		this("");
	}

	public void setContents(String contents) {
		StringBuilder sb = new StringBuilder();
		sb.append("<span style=\"");
		if (m_sizePercent > 0)
			sb.append("font-size:" + m_sizePercent + "%;");
		else if (m_sizePixels > 0)
			sb.append("font-size:" + m_sizePixels + "px;");
		if (m_bold)
			sb.append("font-weight:bold;");
		if (m_color != null)
			sb.append("color:" + m_color + ";");
		sb.append("\">");
		sb.append(contents);
		sb.append("</span>");
		super.setContents(sb.toString());
	}

	public Label noWrap() {
		setWrap(false);
		return this;
	}

	public Label background(String color) {
		setBackgroundColor(color);
		return this;
	}

	public Label color(String color) {
		m_color = color;
		setContents(m_contents);
		return this;
	}
	
	public Label autoFit(boolean value) {
		setAutoFit(value);
		return this;
	}

	public Label backgroundLightSilver() {
		return background("rgb(240,240,240)");
	}

	public Label sizePercent(int percent) {
		m_sizePercent = percent;
		setContents(m_contents);
		return this;
	}

	public Label sizePixels(int pixels) {
		m_sizePixels = pixels;
		setContents(m_contents);
		return this;
	}

	public Label bold() {
		m_bold = true;
		setContents(m_contents);
		return this;
	}

	public Label padding(int padding) {
		setPadding(padding);
		return this;
	}

	public Label gridTitle() {
		sizePercent(120);
		padding(3);
		return this;
	}

	public Label withBottomBorder() {
		setStyleName("labelWithBottomBorder");
		return this;
	}
	
	public Label layoutAlign(Alignment align){
		setLayoutAlign(align);
		return this;
	}
	
	public Label align(Alignment align){
		setAlign(align);
		return this;
	}

}
