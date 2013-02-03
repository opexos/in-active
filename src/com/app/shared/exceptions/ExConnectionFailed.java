package com.app.shared.exceptions;

public class ExConnectionFailed extends Exception {

	public ExConnectionFailed() {
		super();
	}

	public ExConnectionFailed(String message, Throwable cause) {
		super(message, cause);
	}

	public ExConnectionFailed(String message) {
		super(message);
	}

	public ExConnectionFailed(Throwable cause) {
		super(cause);
	}

}
