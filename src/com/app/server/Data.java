package com.app.server;

import org.snmp4j.smi.OID;

public class Data {
	public OID oid;
	public String value;

	public Data(OID oid, String value) {
		this.oid = oid;
		this.value = value;
	}

	@Override
	public String toString() {
		return oid.toString() + " - " + value;
	}
}