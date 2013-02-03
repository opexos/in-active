package com.app.shared.exceptions;

public class ExSnmpSetError extends Exception {

	public ExSnmpSetError() {
		super();
	}

	public ExSnmpSetError(String message) {
		super(message);
	}

	public ExSnmpSetError(Throwable cause) {
		super(cause);
	}

	public ExSnmpSetError(String message, Throwable cause) {
		super(message, cause);
	}

}
