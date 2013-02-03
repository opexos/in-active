package com.app.shared.exceptions;

public class ExFileIsNotExcel extends Exception {

	public ExFileIsNotExcel() {
		super();
	}

	public ExFileIsNotExcel(String message) {
		super(message);
	}

	public ExFileIsNotExcel(Throwable cause) {
		super(cause);
	}

	public ExFileIsNotExcel(String message, Throwable cause) {
		super(message, cause);
	}

}
