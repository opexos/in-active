package com.app.server;

import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.app.server.DB.Row;
import com.app.server.DB.Rows;
import com.app.server.G.LicState;
import com.app.shared.GS;
import com.app.shared.InputType;
import com.app.shared.ObjectType;
import com.app.shared.exceptions.ExAccessDenied;
import com.app.shared.exceptions.ExNoDataFound;
import com.app.shared.exceptions.ExScriptError;
import com.app.shared.exceptions.ExScriptIsNotDefined;
import com.app.shared.i18n.UIStr;
import com.isomorphic.rpc.RPCManager;

public class RPC {

	public static Map getStartupInfo(RPCManager man) throws Exception {
		Connection con = DB.getConnection(man);
		Map res = new HashMap();
		res.put("ADMIN", Q.userIsAdmin(con));
		res.put("JOURNALS", DB.query(con, "select journals x from users where id = user_id()").get(0).getBool("X"));
		res.put("CONFIG_DEVICES", DB.query(con, "select count(0) x from maps where map_config_devices(id)").get(0).getInt("X") > 0);
		return res;
	}

	private static Integer calcDaysLeft(Date date) {
		if (date == null)
			return null;
		int res = (int) ((date.getTime() - System.currentTimeMillis()) / GS.ONEDAY) + 1;
		if (res < 0)
			res = 0;
		return res;
	}

	public static Map getLicenseInfo(RPCManager man) throws Exception {
		Connection con = DB.getConnection(man);
		Rows res = DB.query(con,
				"select count(0) a, 1 from cc_devices union all " +
						"select count(0),2 from dm_devices union all " +
						"select count(0),3 from pm_ports " +
						"order by 2");
		Map m = new HashMap();
		m.put("ADMIN", Q.userIsAdmin(con));
		m.put("CLIENT", G.clientName);
		m.put("SERVER_ID", G.getServerId());
		m.put("CC_U", res.get(0).getInt("A"));
		m.put("CC_Q", G.CC.qty);
		m.put("CC_S", G.CC.state.toString());
		m.put("CC_E", calcDaysLeft(G.CC.expires));
		m.put("DM_U", res.get(1).getInt("A"));
		m.put("DM_Q", G.DM.qty);
		m.put("DM_S", G.DM.state.toString());
		m.put("DM_E", calcDaysLeft(G.DM.expires));
		m.put("PM_U", res.get(2).getInt("A"));
		m.put("PM_Q", G.PM.qty);
		m.put("PM_S", G.PM.state.toString());
		m.put("PM_E", calcDaysLeft(G.PM.expires));
		m.put("SP_S", G.SP.expires != null && System.currentTimeMillis() < (G.SP.expires.getTime() + GS.ONEDAY));
		m.put("SP_E", G.dateToString(G.SP.expires));
		return m;
	}

	public static Map enterLicenseKey(String module, String key, HttpServletRequest req, RPCManager man) throws Exception {
		Connection con = DB.getConnection(man);
		if (!Q.userIsAdmin(con))
			throw new ExAccessDenied();

		boolean ok = G.applyLicense(module, key);
		UIStr uistr = G.getUIStr(req);

		if (ok) {
			DB.executeProcedure(con, "lics_save", module, key);
		}

		Map res = new HashMap();
		res.put("OK", ok);
		res.put("MSG", ok ? uistr.activationKeyIsAccepted() : uistr.activationKeyIsIncorrect());
		return res;
	}

	public static void deleteLicenseKey(String module, RPCManager man) throws Exception {
		Connection con = DB.getConnection(man);
		if (!Q.userIsAdmin(con))
			throw new ExAccessDenied();

		if ("CC".equals(module)) {
			G.CC.qty = G.initCC;
			G.CC.expires = null;
			G.CC.state = LicState.UNLICENSED;
		} else if ("DM".equals(module)) {
			G.DM.qty = G.initDM;
			G.DM.expires = null;
			G.DM.state = LicState.UNLICENSED;
		} else if ("PM".equals(module)) {
			G.PM.qty = G.initPM;
			G.PM.expires = null;
			G.PM.state = LicState.UNLICENSED;
		} else if ("SP".equals(module)) {
			G.SP.expires = null;
		}

		G.checkLicenses();
		DB.executeProcedure(con, "lics_delete", module);
	}

	private static String[] split(String str) {
		List<String> res = new ArrayList<String>();
		StringBuilder sb = new StringBuilder();
		boolean quote = false;
		char[] chars = str.toCharArray();
		for (int i = 0; i < chars.length; i++) {
			if (chars[i] == ' ' && !quote && sb.length() > 0) {
				res.add(sb.toString());
				sb.setLength(0);
			} else if (chars[i] == '"') {
				quote = !quote;
			} else if (chars[i] == ' ' && sb.length() == 0) {
			} else
				sb.append(chars[i]);
		}
		if (sb.length() > 0)
			res.add(sb.toString());
		return res.toArray(new String[0]);
	}

	public static List parseInputVariables(String script) throws ExScriptError {
		List result = new ArrayList();
		int lineNum = 0;
		for (String line : script.replace("\r\n", "\n").split("\n")) {
			lineNum++;
			if (line.startsWith("input ")) {
				try {
					boolean mandatory = false;
					line = line.substring(6).trim();

					int pos = line.indexOf(' ');
					String varName = line.substring(0, pos);
					line = line.substring(pos).trim();

					pos = line.indexOf(' ');
					String str = line.substring(0, pos);
					if ("-mandatory".equals(str)) {
						mandatory = true;
						line = line.substring(pos).trim();
					}

					pos = line.indexOf(' ');
					String type = line.substring(0, pos).toUpperCase();
					line = line.substring(pos).trim();

					try {
						InputType.valueOf(type);
					} catch (IllegalArgumentException e) {
						throw new ExScriptError("Incorrect input type at line " + lineNum + ". Valid types: text, password, ip, date, boolean, list");
					}

					String[] list = split(line);

					if (list.length == 0 || (list.length == 1 && type.equalsIgnoreCase("list")) || (list.length > 1 && !type.equalsIgnoreCase("list")))
						GS.ex();

					Map m = new HashMap();
					m.put("VARIABLE", varName);
					m.put("TYPE", type);
					m.put("DESCR", list[list.length - 1]); 
					m.put("MANDATORY", mandatory);
					if (type.equalsIgnoreCase("list"))
						m.put("LIST", Arrays.asList(Arrays.copyOf(list, list.length - 1)));

					result.add(m);
				} catch (ExScriptError e) {
					throw e;
				} catch (Exception e) {
					throw new ExScriptError("Incorrect input command at line " + lineNum
							+ ". Should be: input variable ?-mandatory? type ?valuelist? description");
				}
			}
		}
		return result;
	}

	public static List parseInputVariables2(int scriptId, RPCManager man) throws ExScriptError, SQLException, ExNoDataFound {
		return parseInputVariables(Q.getScript(DB.getConnection(man), scriptId));
	}

	public static List parseInputVariables3(String what, int[] ids, String objectType, RPCManager man)
			throws ExScriptError, SQLException, ExNoDataFound, ExScriptIsNotDefined {
		Connection con = DB.getConnection(man);
		String tableName = null;
		switch (ObjectType.valueOf(objectType)) {
		case CONFIG_CONTROL:
			tableName = "cc_devices";
			break;
		case DEVICE_MANAGE:
			tableName = "dm_devices";
			break;
		case PORT_MANAGE:
			tableName = "pm_devices";
			break;
		}

		List res = new ArrayList();
		for (Row r : DB.query(con, String.format(
				"select distinct dt.%s as script_id from %s x " +
						"join devices d on d.id=x.device_id " +
						"join device_types dt on dt.id=d.device_type_id where x.id in (%s) ",
				what, tableName, GS.commaList(ids)))) {
			if (r.get("SCRIPT_ID") == null)
				throw new ExScriptIsNotDefined();
			for (Object o : parseInputVariables2(r.getInt("SCRIPT_ID"), man)) {
				boolean add = true;
				for (Object o2 : res) {
					if (((Map) o2).get("VARIABLE").equals(((Map) o).get("VARIABLE"))) {
						add = false;
						break;
					}
				}
				if (add)
					res.add(o);
			}

		}
		return res;
	}

	public static void saveSmtpSettings(Map settings, RPCManager man) throws ExAccessDenied, SQLException {
		Connection con = DB.getConnection(man);
		if (!Q.userIsAdmin(con))
			throw new ExAccessDenied();
		for (Object key : settings.keySet()) {
			Q.setParam(con, key.toString(), settings.get(key).toString());
		}
	}

	public static Map getSmtpSettings(RPCManager man) throws SQLException, ExAccessDenied {
		Connection con = DB.getConnection(man);
		if (!Q.userIsAdmin(con))
			throw new ExAccessDenied();
		return MailSender.getSmtpSettings(con);
	}

	public static Map testSmtpSettings(String receivers, String subject, String body, Map<String, String> smtp, RPCManager man)
			throws SQLException, ExAccessDenied {
		Connection con = DB.getConnection(man);
		if (!Q.userIsAdmin(con))
			throw new ExAccessDenied();
		return MailSender.sendEmail(receivers, subject, body, smtp);
	}

	public static void dummy() {
	}


	public static Map executeScriptCC(String what, int ccDeviceId, Map<String, String> params, String script, RPCManager man) throws Exception {
		return Script.executeScriptCC(what, ccDeviceId, params, script, DB.getConnection(man)).toMap();
	}

	public static Map executeScriptPM(String what, int pmDeviceId, Map<String, String> params, String script, RPCManager man) throws Exception {
		return Script.executeScriptPM(what, pmDeviceId, params, script, DB.getConnection(man)).toMap();
	}

	public static Map executeScriptDM(String what, int dmDeviceId, Map<String, String> params, String script, RPCManager man) throws Exception {
		return Script.executeScriptDM(what, dmDeviceId, params, script, DB.getConnection(man)).toMap();
	}

}
