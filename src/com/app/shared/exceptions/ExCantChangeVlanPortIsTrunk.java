package com.app.shared.exceptions;

public class ExCantChangeVlanPortIsTrunk extends Exception {

	public ExCantChangeVlanPortIsTrunk() {
		super();
	}

	public ExCantChangeVlanPortIsTrunk(String message) {
		super(message);
	}

	public ExCantChangeVlanPortIsTrunk(Throwable cause) {
		super(cause);
	}

	public ExCantChangeVlanPortIsTrunk(String message, Throwable cause) {
		super(message, cause);
	}

}
