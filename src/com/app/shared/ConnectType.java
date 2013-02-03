package com.app.shared;

public enum ConnectType {
	SSH, TELNET;

	public static ConnectType parse(String value) {
		ConnectType result = null;
		try {
			result = ConnectType.valueOf(value);
		} catch (Exception e) {
		}
		return result;
	}
}
