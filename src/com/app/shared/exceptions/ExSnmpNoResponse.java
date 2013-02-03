package com.app.shared.exceptions;

public class ExSnmpNoResponse extends Exception {

	public ExSnmpNoResponse() {
		super();
	}

	public ExSnmpNoResponse(String message) {
		super(message);
	}

	public ExSnmpNoResponse(Throwable cause) {
		super(cause);
	}

	public ExSnmpNoResponse(String message, Throwable cause) {
		super(message, cause);
	}

}
