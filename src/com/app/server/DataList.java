package com.app.server;

import java.util.ArrayList;

import org.snmp4j.smi.OID;

public class DataList extends ArrayList<Data> {
	private static final long serialVersionUID = 1876135132541627460L;

	public DataList findByValue(String value) {
		DataList res = new DataList();
		for (Data d : this)
			if (d.value != null && d.value.equalsIgnoreCase(value))
				res.add(d);
		return res;
	}

	public DataList findByValue(Integer value) {
		return findByValue(value.toString());
	}

	public Data findByLastOIDSubIdentifier(int num) {
		for (Data d : this)
			if (d.oid.last() == num)
				return d;
		return null;
	}

	public Data findByLastOIDSubIdentifiers(OID oid, int lastSubIdentifiers) {
		for (Data d : this)
			if (d.oid.rightMostCompare(lastSubIdentifiers, oid) == 0)
				return d;
		return null;
	}

	public DataList findByPreLastOIDSubIdentifier(int num) {
		DataList res = new DataList();
		for (Data d : this)
			if (d.oid.get(d.oid.size() - 2) == num)
				res.add(d);
		return res;
	}

}