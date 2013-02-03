package com.app.shared.exceptions;

public class ExOperationNotSupportedByDevice extends Exception {

	public ExOperationNotSupportedByDevice() {
		super();
	}

	public ExOperationNotSupportedByDevice(String message) {
		super(message);
	}

	public ExOperationNotSupportedByDevice(Throwable cause) {
		super(cause);
	}

	public ExOperationNotSupportedByDevice(String message, Throwable cause) {
		super(message, cause);
	}

}
