package com.app.shared.exceptions;

public class ExIncorrectConnectionSettings extends Exception {

	public ExIncorrectConnectionSettings() {
		super();
	}

	public ExIncorrectConnectionSettings(String message) {
		super(message);
	}

	public ExIncorrectConnectionSettings(Throwable cause) {
		super(cause);
	}

	public ExIncorrectConnectionSettings(String message, Throwable cause) {
		super(message, cause);
	}

}
