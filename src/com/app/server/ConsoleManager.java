package com.app.server;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import com.app.server.DB.Rows;
import com.app.shared.GS;
import com.app.shared.exceptions.ExAccessDenied;
import com.app.shared.exceptions.ExNoConnection;
import com.app.shared.exceptions.ExNoDataFound;
import com.isomorphic.rpc.RPCManager;

public class ConsoleManager {

	private static List<Console> m_consoles = Collections.synchronizedList(new ArrayList<Console>());

	public static Map startConsole(int id, String idType, HttpSession sess, RPCManager man) throws Exception {
		Connection con = DB.getConnection(man);
		Device dev;
		int devId = 0;
		Rows rows = null;

		if ("DEV".equals(idType))
			rows = DB.query(con, "select id as device_id, case when map_config_devices(map_id) then 'FULL' end as access from devices where id=?", id);
		else
			rows = DB.query(con, String.format("select device_id, object_access(object_id) as access from %s_devices where id=?", idType), id);

		if (rows.size() == 0)
			throw new ExNoDataFound();

		if (!"FULL".equals(rows.get(0).getStr("ACCESS")))
			throw new ExAccessDenied();

		devId = rows.get(0).getInt("DEVICE_ID");
		dev = new Device(con, devId);
		Console cons = new Console(man.getUserId(), sess.getId(), dev, con);
		m_consoles.add(cons);
		Map m = new HashMap();
		m.put("ID", cons.getConsoleId());
		m.put("TITLE", dev.host + " - " + dev.name);
		return m;
	}

	public static void closeConsole(String consoleId, HttpSession sess) {
		Console con = findConsole(consoleId, sess);
		if (con != null) {
			con.close();
			m_consoles.remove(con);
		}
	}

	private static Console findConsole(String consoleId, HttpSession sess) {
		Console con = null;
		synchronized (m_consoles) {
			for (Console c : m_consoles) {
				if (c.getSessionId().equals(sess.getId()) && c.getConsoleId().equals(consoleId)) {
					con = c;
					break;
				}
			}
		}
		return con;
	}

	public static List getConsoleData(HttpSession sess) {
		List<Map> result = new ArrayList<Map>();
		long start = System.currentTimeMillis();

		while (result.size() == 0 && System.currentTimeMillis() - start < 10 * GS.ONESECOND) {
			synchronized (m_consoles) {
				Iterator<Console> it = m_consoles.iterator();
				while (it.hasNext()) {
					Console con = it.next();
					if (con.isClosed() && System.currentTimeMillis() - con.getLastGetData() > GS.ONEMINUTE) {
						it.remove();
						continue;
					}
					if (con.getSessionId().equals(sess.getId())) {
						String data = con.getData();
						if (data != null && !data.isEmpty()) {
							Map m = new HashMap();
							m.put("ID", con.getConsoleId());
							m.put("DATA", data);
							result.add(m);
						}
					}
				}
			}
			try {
				Thread.sleep(10);
			} catch (InterruptedException e) {
				break;
			}
		}

		return result;
	}

	public static void sendToConsole(String consoleId, String data, HttpSession sess) throws Exception {
		Console con = findConsole(consoleId, sess);
		if (con == null || con.isClosed())
			throw new ExNoConnection("No connection. ConsoleId=" + consoleId);
		con.send(GS.decode(data));
	}

}
