package com.app.shared.exceptions;

public class ExExcelFileLoadError extends Exception {

	public ExExcelFileLoadError() {
		super();
	}

	public ExExcelFileLoadError(String message) {
		super(message);
	}

	public ExExcelFileLoadError(Throwable cause) {
		super(cause);
	}

	public ExExcelFileLoadError(String message, Throwable cause) {
		super(message, cause);
	}

}
