package com.app.shared.exceptions;

public class ExSnmpError extends Exception {

	public ExSnmpError() {
		super();
	}

	public ExSnmpError(String message) {
		super(message);
	}

	public ExSnmpError(Throwable cause) {
		super(cause);
	}

	public ExSnmpError(String message, Throwable cause) {
		super(message, cause);
	}

}
