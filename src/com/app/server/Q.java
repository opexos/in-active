package com.app.server;

import java.sql.Connection;
import java.sql.SQLException;

import com.app.server.DB.Rows;
import com.app.shared.exceptions.ExNoDataFound;

public class Q {

	public static boolean userIsAdmin(Connection con) throws SQLException {
		return DB.query(con, "select user_is_admin() x").get(0).getBool("X", false);
	}

	public static String getParam(Connection con, String name) throws SQLException {
		Rows rows = DB.query(con, "select val from params where name=?", name);
		if (rows.size() > 0)
			return rows.get(0).getStr("VAL");
		else
			return null;
	}

	public static void setParam(Connection con, String name, String value) throws SQLException {
		if (DB.executeStatement(con, "update params set val=? where name=?", value, name) == 0)
			DB.executeStatement(con, "insert into params(name,val) values ( ? , ? )", name, value);
	}

	public static String getScript(Connection con, int id) throws SQLException, ExNoDataFound {
		Rows rows = DB.query(con, "select script from scripts where id=?", id);
		if (rows.size() == 0)
			throw new ExNoDataFound("Script not found in database: scripts.id=" + id);
		return rows.get(0).getStr("SCRIPT");
	}

	public static String getScriptName(Connection con, int id) throws SQLException, ExNoDataFound {
		Rows rows = DB.query(con, "select name from scripts where id=?", id);
		if (rows.size() == 0)
			throw new ExNoDataFound("Script not found in database: scripts.id=" + id);
		return rows.get(0).getStr("NAME");
	}

	public static String getDeviceScript(Connection con, int deviceId, String scriptCode) throws SQLException {
		String result = null;
		Rows tmp = DB.query(con, "select s.script from devices d " +
				"join device_types dt on dt.id = d.device_type_id " +
				"join scripts s on s.id = dt." + scriptCode +
				" where d.id=?", deviceId);
		if (tmp.size() > 0) {
			result = tmp.get(0).getStr("SCRIPT");
			if (result.trim().isEmpty())
				result = null;
		}
		return result;
	}

}
