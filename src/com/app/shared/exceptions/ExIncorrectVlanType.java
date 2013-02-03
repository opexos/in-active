package com.app.shared.exceptions;

public class ExIncorrectVlanType extends Exception {

	public ExIncorrectVlanType() {
		super();
	}

	public ExIncorrectVlanType(String message) {
		super(message);
	}

	public ExIncorrectVlanType(Throwable cause) {
		super(cause);
	}

	public ExIncorrectVlanType(String message, Throwable cause) {
		super(message, cause);
	}

}
