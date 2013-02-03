package com.app.shared.exceptions;

public class ExNoDataFound extends Exception {

	public ExNoDataFound() {
		super();
	}

	public ExNoDataFound(String message, Throwable cause) {
		super(message, cause);
	}

	public ExNoDataFound(String message) {
		super(message);
	}

	public ExNoDataFound(Throwable cause) {
		super(cause);
	}

}
