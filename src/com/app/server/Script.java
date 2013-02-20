package com.app.server;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.app.server.DB.Row;
import com.app.server.DB.Rows;
import com.app.shared.GS;
import com.app.shared.ScriptExecuteResult;
import com.app.shared.ScriptExecuteStatus;
import com.app.shared.exceptions.ExAccessDenied;
import com.app.shared.exceptions.ExIncompatibleScript;
import com.app.shared.exceptions.ExNoDataFound;
import com.app.shared.exceptions.ExScriptIsNotDefined;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DataSource;
import com.isomorphic.sql.SQLClauseType;
import com.isomorphic.sql.SQLDataSource;

import tcl.lang.TclRuntimeError;

public class Script {

	public static ScriptExecuteResult executeScriptCC(String what, int ccDeviceId, Map<String, String> params, String script, Connection con) throws Exception {
		int scriptId = 0;
		if (script != null) {
			if (!Q.userIsAdmin(con))
				throw new ExAccessDenied();
		} else {
			scriptId = checkAccessAndCalcScriptId("cc", ccDeviceId, what, con);
		}

		if (params == null)
			params = new HashMap<String, String>();
		setVariables("cc", ccDeviceId, con, params);

		Device dev = Device.createByCCDeviceId(con, ccDeviceId);
		return executeScriptInternal(con, scriptId, dev, params, script);
	}

	public static ScriptExecuteResult executeScriptPM(String what, int pmDeviceId, Map<String, String> params, String script, Connection con) throws Exception {
		int scriptId = 0;
		if (script != null) {
			if (!Q.userIsAdmin(con))
				throw new ExAccessDenied();
		} else {
			scriptId = checkAccessAndCalcScriptId("pm", pmDeviceId, what, con);
		}

		if (params == null)
			params = new HashMap<String, String>();
		setVariables("pm", pmDeviceId, con, params);

		Device dev = Device.createByPMDeviceId(con, pmDeviceId);
		return executeScriptInternal(con, scriptId, dev, params, script);
	}

	private static ScriptExecuteResult executeScriptInternal(Connection con, int scriptId, Device dev, Map<String, String> params, String script)
			throws Exception {
		ScriptExecuteResult result = null;
		ScriptExecutor exec = new ScriptExecutor(script != null ? script : Q.getScript(con, scriptId), dev, con);
		try {
			if (params != null)
				for (String varName : params.keySet())
					exec.setVariable(varName, params.get(varName));
			result = exec.execute();
		} finally {
			exec.dispose();
		}
		if (scriptId > 0)
			executeScriptSaveToLog(con, dev, scriptId, params, result);
		return result;
	}

	public static ScriptExecuteResult executeScriptDM(String what, int dmDeviceId, Map<String, String> params, String script, Connection con) throws Exception {
		int scriptId = 0;
		if (script != null) {
			if (!Q.userIsAdmin(con))
				throw new ExAccessDenied();
		} else {
			scriptId = checkAccessAndCalcScriptId("dm", dmDeviceId, what, con);
		}
		if (params == null)
			params = new HashMap<String, String>();
		setVariables("dm", dmDeviceId, con, params);
		Device dev = Device.createByDMDeviceId(con, dmDeviceId);
		ScriptExecuteResult result = executeScriptDMinternal(script != null ? script : Q.getScript(con, scriptId), dmDeviceId, params, con, dev);
		if (scriptId > 0)
			executeScriptSaveToLog(con, dev, scriptId, params, result);
		return result;
	}


	private static ScriptExecuteResult executeScriptDMinternal(String script, int dmDeviceId, Map<String, String> params, Connection con, Device dev)
			throws Exception {
		ScriptExecuteResult result = null;
		ScriptExecutor exec = new ScriptExecutor(script, dev, con);
		try {
			try {
				final Row dmDev = DB.query(con, SQLDataSource.getSQLClause(SQLClauseType.All,
						new DSRequest("dm_devices", DataSource.OP_FETCH).setCriteria("ID", dmDeviceId))).get(0);

				Rows tmp;
				tmp = DB.query(con, SQLDataSource.getSQLClause(SQLClauseType.All, new DSRequest("dm_fields", DataSource.OP_FETCH)
						.setCriteria("OBJECT_ID", dmDev.getInt("OBJECT_ID"))));
				final Row dmFields = tmp.size() > 0 ? tmp.get(0) : null;

				if (params != null)
					for (String varName : params.keySet())
						exec.setVariable(varName, params.get(varName));

				final Map<String, String> varToField = new HashMap<String, String>();
				if (dmFields != null) {
					Iterator<String> it = dmFields.keySet().iterator();
					while (it.hasNext()) {
						String field = it.next();
						if (field.startsWith("BOOL") || field.startsWith("TEXT") || field.startsWith("IP") || field.startsWith("DATE")
								|| (field.startsWith("DICT") && !field.startsWith("DICT_ID"))) {
							String fieldTitle = dmFields.getStr(field);
							if (fieldTitle != null && !fieldTitle.isEmpty()) {
								String var = fieldTitle.replace(' ', '_').toLowerCase();
								exec.setVariable(var, dmDev.getStr(field));
								varToField.put(var, field);
							}
						}
					}
				}

				exec.setSaveCmd(new com.app.server.ScriptExecutor.SaveCmd() {
					public void execute(Connection con, String var, String value) throws Exception {
						if (value != null && value.isEmpty())
							value = null;

						String field = varToField.get(var);
						if (field == null)
							throw new TclRuntimeError("Unknown variable " + var);

						if (field.startsWith("BOOL") && value == null)
							throw new TclRuntimeError("Empty boolean value is not allowed.");

						Map vals = new HashMap();
						if (value == null)
							vals.put(field, null);
						else {
							if (field.startsWith("BOOL")) {
								if (value.equals("1") || value.equalsIgnoreCase("true") || value.equalsIgnoreCase("t"))
									vals.put(field, true);
								else if (value.equals("0") || value.equalsIgnoreCase("false") || value.equalsIgnoreCase("f"))
									vals.put(field, false);
								else
									throw new TclRuntimeError("Incorrect boolean value. Correct value is 1,0,true,false,t,f");
							} else if (field.startsWith("TEXT")) {
								vals.put(field, value);
							} else if (field.startsWith("IP")) {
								if (GS.ip2long(value) > 0)
									vals.put(field, value);
								else
									throw new TclRuntimeError("Incorrect IP address");
							} else if (field.startsWith("DATE")) {
								try {
									vals.put(field, Timestamp.valueOf(value));
								} catch (IllegalArgumentException e) {
									throw new TclRuntimeError("Incorrect date. Correct format is yyyy-mm-dd hh:mm:ss");
								}
							} else if (field.startsWith("DICT")) {
								Integer dictId = dmFields.getInt("DICT_ID" + field.substring(4));
								if (dictId != null) {
									Rows rows = DB.query(con,
											"select id from dict_values where dict_id=? and upper(trim(val))=upper(trim(?))",
											dictId, value);
									if (rows.size() > 0)
										vals.put("DICT_VAL_ID" + field.substring(4), rows.get(0).getInt("ID"));
									else
										throw new TclRuntimeError("Value is not found in dictionary");
								}
							}
						}
						DB.executeStatement(con, SQLDataSource.getSQLClause(SQLClauseType.All, new DSRequest("dm_devices", DataSource.OP_UPDATE)
								.setCriteria("ID", dmDeviceId).setValues(vals)));

					}
				});
				result = exec.execute();
			} catch (Exception e) {
				result.status = ScriptExecuteStatus.ERROR;
				result.log = exec.getLog() + "\nAn error has occurred: " + e.getMessage();
			}

		} finally {
			exec.dispose();
		}
		return result;
	}

	private static void setVariables(String objCode, int id, Connection con, Map<String, String> params) throws SQLException {
		Rows rows = DB.query(con, String.format("select d.object_id, o.map_id from %s_devices d join objects o on o.id=d.object_id where d.id=?", objCode), id);
		params.put("object_id", rows.get(0).getStr("OBJECT_ID"));
		params.put("map_id", rows.get(0).getStr("MAP_ID"));
		params.put(objCode + "_device_id", Integer.toString(id));
		rows = DB.query(con, "select login from users where id=user_id()");
		params.put("user", rows.get(0).getStr("LOGIN"));
	}

	private static int checkAccessAndCalcScriptId(String objCode, int devObjId, String what, Connection con)
			throws ExAccessDenied, SQLException, ExNoDataFound, ExScriptIsNotDefined, ExIncompatibleScript {
		Rows tmp = DB.query(con, "select object_access(object_id) A, object_id, device_id from " + objCode + "_devices where id = ?", devObjId);
		if (tmp.size() == 0)
			throw new ExNoDataFound("Device not found");
		if (!"FULL".equals(tmp.get(0).getStr("A")))
			throw new ExAccessDenied();
		int objectId = tmp.get(0).getInt("OBJECT_ID");
		int deviceId = tmp.get(0).getInt("DEVICE_ID");

		int scriptId = GS.getInt(what);
		if (scriptId > 0) {
			tmp = DB.query(con, "select public,all_device_types from scripts where id=?", scriptId);
			if (tmp.size() == 0)
				throw new ExNoDataFound("Script not found");
			if (!tmp.get(0).getBool("PUBLIC")) {
				if (DB.query(con, "select 1 from object_scripts where object_id=? and script_id=?", objectId, scriptId).size() == 0)
					throw new ExAccessDenied();
			}
			if (!tmp.get(0).getBool("ALL_DEVICE_TYPES")) {
				if (DB.query(con, "select 1 from devices d join device_type_scripts dts on dts.device_type_id = d.device_type_id " +
						"where d.id=? and dts.script_id=?", deviceId, scriptId).size() == 0)
					throw new ExIncompatibleScript();
			}
		} else {
			if (!what.toLowerCase().startsWith(objCode.toLowerCase()))
				throw new ExAccessDenied();
			try {
				tmp = DB.query(con, "select dt." + what + " as x from devices d join device_types dt on dt.id = d.device_type_id where d.id=?", deviceId);
			} catch (SQLException e) {
				throw new ExNoDataFound("Incorrect script code");
			}
			if (tmp.get(0).get("X") == null)
				throw new ExScriptIsNotDefined("Script is not defined");
			scriptId = tmp.get(0).getInt("X");
		}
		return scriptId;
	}

	private static void executeScriptSaveToLog(Connection con, Device dev, int scriptId, Map params, ScriptExecuteResult result) throws Exception {
		DB.executeStatement(con,
				"insert into script_execute_log(dev_host,dev_name,script_name,script_params,console,log,result,status) " +
						"values(?,?,?,?,?,?,?,?::t_result)",
				dev.host, dev.name, Q.getScriptName(con, scriptId), G.formatMap(params, true),
				result.console.replaceAll("\u0000", ""),
				result.log.replaceAll("\u0000", ""),
				result.result.replaceAll("\u0000", ""),
				result.status.toString().replaceAll("\u0000", ""));

	}

	

}
