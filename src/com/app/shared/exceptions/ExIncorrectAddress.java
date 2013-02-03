package com.app.shared.exceptions;

public class ExIncorrectAddress extends Exception {

	public ExIncorrectAddress() {
		super();
	}

	public ExIncorrectAddress(String message) {
		super(message);
	}

	public ExIncorrectAddress(Throwable cause) {
		super(cause);
	}

	public ExIncorrectAddress(String message, Throwable cause) {
		super(message, cause);
	}

}
