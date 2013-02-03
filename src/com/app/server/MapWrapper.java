package com.app.server;

import java.util.Map;

public class MapWrapper {

	private Map<Object, Object> m_map;

	@SuppressWarnings("unchecked")
	public MapWrapper(Map<?, ?> m_map) {
		super();
		this.m_map = (Map<Object, Object>) m_map;
	}

	public String getStr(String key) {
		Object res = m_map.get(key);
		return res != null ? res.toString() : null;
	}

	public Integer getInt(String key) {
		Object res = m_map.get(key);
		return res != null ? Integer.parseInt(res.toString()) : null;
	}
	
	public Long getLong(String key){
		Object res = m_map.get(key);
		return res != null ? Long.parseLong(res.toString()) : null;
	}

	public Boolean getBool(String key) {
		Object res = m_map.get(key);
		return res != null ? Boolean.parseBoolean(res.toString()) : null;
	}
	
	public Object getValue(String key) {
		return m_map.get(key);
	}

	public void put(Object key, Object value) {
		m_map.put(key, value);
	}

	public Map<Object, Object> getMap() {
		return m_map;
	}

}
