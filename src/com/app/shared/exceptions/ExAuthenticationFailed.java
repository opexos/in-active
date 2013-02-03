package com.app.shared.exceptions;

public class ExAuthenticationFailed extends Exception {

	public ExAuthenticationFailed() {
		super();
	}

	public ExAuthenticationFailed(String message, Throwable cause) {
		super(message, cause);
	}

	public ExAuthenticationFailed(String message) {
		super(message);
	}

	public ExAuthenticationFailed(Throwable cause) {
		super(cause);
	}

}
