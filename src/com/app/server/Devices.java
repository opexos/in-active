package com.app.server;

import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.app.shared.GS;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;

public class Devices {

	private static final String[] FIELDS = new String[] {
			"LOGIN", "PWD", "ENABLE_PWD", "READ_COMMUNITY", "WRITE_COMMUNITY","SNMP_USER","SNMP_AUTH_PWD","SNMP_PRIV_PWD",
			"OLD_LOGIN", "OLD_PWD", "OLD_ENABLE_PWD", "OLD_READ_COMMUNITY", "OLD_WRITE_COMMUNITY","OLD_SNMP_USER","OLD_SNMP_AUTH_PWD","OLD_SNMP_PRIV_PWD",
			"NEW_LOGIN", "NEW_PWD", "NEW_ENABLE_PWD", "NEW_READ_COMMUNITY", "NEW_WRITE_COMMUNITY","NEW_SNMP_USER","NEW_SNMP_AUTH_PWD","NEW_SNMP_PRIV_PWD" };

	public static DSResponse encode(DSRequest req) throws Exception {
		Map m = req.getValues();
		for (String f : FIELDS) {
			if (m.containsKey(f))
				m.put(f, GS.encode(m.get(f)));
		}
		return req.execute();
	}

	public static DSResponse decode(DSRequest req) throws Exception {
		DSResponse resp = req.execute();
		List rows = resp.getDataList();
		Iterator it = rows.iterator();
		while (it.hasNext()) {
			Map row = (Map) it.next();
			for (String f : FIELDS)
				if (row.containsKey(f))
					row.put(f, GS.decode(row.get(f)));
		}
		return resp;
	}

}
