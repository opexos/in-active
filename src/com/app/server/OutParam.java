package com.app.server;

public class OutParam {

	private Object m_value;

	public OutParam() {
	}

	public void setValue(Object value) {
		m_value = value;
	}

	public Integer getInt() {
		return m_value == null ? null : Integer.parseInt(m_value.toString());
	}

	public String getStr() {
		return m_value == null ? null : m_value.toString();
	}

	public Boolean getBool() {
		return m_value == null ? null : Boolean.parseBoolean(m_value.toString());
	}

}
