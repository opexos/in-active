package com.app.shared.exceptions;

public class ExPortNotFound extends Exception {

	public ExPortNotFound() {
		super();
	}

	public ExPortNotFound(String message) {
		super(message);
	}

	public ExPortNotFound(Throwable cause) {
		super(cause);
	}

	public ExPortNotFound(String message, Throwable cause) {
		super(message, cause);
	}

}
