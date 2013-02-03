package com.app.shared.exceptions;

public class ExVlanNotFound extends Exception {

	public ExVlanNotFound() {
		super();
	}

	public ExVlanNotFound(String message) {
		super(message);
	}

	public ExVlanNotFound(Throwable cause) {
		super(cause);
	}

	public ExVlanNotFound(String message, Throwable cause) {
		super(message, cause);
	}

}
