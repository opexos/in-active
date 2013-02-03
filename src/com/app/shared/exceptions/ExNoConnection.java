package com.app.shared.exceptions;

public class ExNoConnection extends Exception {

	public ExNoConnection() {
		super();
	}

	public ExNoConnection(String message) {
		super(message);
	}

	public ExNoConnection(Throwable cause) {
		super(cause);
	}

	public ExNoConnection(String message, Throwable cause) {
		super(message, cause);
	}

}
