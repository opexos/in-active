package com.app.server;

import java.io.InputStream;
import java.io.Reader;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;

import com.app.server.DB.Row;
import com.app.server.DB.Rows;
import com.app.server.DiffMatchPatch.Diff;
import com.app.server.DiffMatchPatch.LinesToCharsResult;
import com.app.shared.ConnectType;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.exceptions.ExAccessDenied;
import com.app.shared.exceptions.ExExcelFileLoadError;
import com.app.shared.exceptions.ExLimitReached;
import com.app.shared.exceptions.ExNoDataFound;
import com.app.shared.i18n.UIMsg;
import com.app.shared.i18n.UIStr;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.datasource.DataSource;
import com.isomorphic.log.Logger;
import com.isomorphic.rpc.RPCManager;
import com.isomorphic.servlet.ISCFileItem;

public class DMI {

	/*	public static final String SQLSTATE_FOREIGN_KEY_NO_ACTION = "23504";
	
		public static boolean isForeignKeyNoAction(Exception ex) {
			return (ex instanceof SQLException) && (((SQLException) ex).getSQLState().equals(SQLSTATE_FOREIGN_KEY_NO_ACTION));
		}*/

	public interface Executor {
		void execute(MapWrapper values, DSRequest req, UIStr str, UIMsg msg, Connection con, Logger log) throws Exception;
	}

	public static DSResponse doExecute(Class<?> clazz, String logDescr, DSRequest req, Executor exec) throws Exception {
		Logger log = new Logger(clazz.getName());
		Map<?, ?> values = req.getValues();
		log.debug(logDescr + " START. " + values);

		DSResponse result = new DSResponse();
		if (req.getRPCManager().queueHasFailures()) {
			log.debug(logDescr + " CANCELED. Queue has failures. " + values);
			result.setStatus(DSResponse.STATUS_TRANSACTION_FAILED);
		} else {
			try {
				UIStr str = G.getUIStr(req.getHttpServletRequest());
				UIMsg msg = G.getUIMsg(req.getHttpServletRequest());
				Connection con = DB.getConnection(req);
				exec.execute(new MapWrapper(values), req, str, msg, con, log);
				Object refetch = values.get(Const.PARAM_REFETCH);
				if (refetch != null && Boolean.parseBoolean(refetch.toString())) {
					log.debug(logDescr + " REFETCH. " + values);
					DataSource ds = req.getDataSource();
					Map<String, Object> criteria = new LinkedHashMap<String, Object>();
					Iterator<?> pk = ds.getPrimaryKeys().iterator();
					while (pk.hasNext()) {
						String keyField = pk.next().toString();
						criteria.put(keyField, values.get(keyField));
					}
					req.setOperationType(DataSource.OP_FETCH);
					req.setCriteria(criteria);
					DSResponse resp = ds.execute(req);
					result.setData(resp.getRecord());
				} else
					result.setData(values);
				result.setStatus(DSResponse.STATUS_SUCCESS);
				log.debug(logDescr + " SUCCESS. " + result.getDataMap());
			} catch (Exception e) {
				result.setStatus(DSResponse.STATUS_FAILURE);
				result.setData(e.toString());
				log.error(logDescr + " FAILURE. " + values + " " + e.toString());
			}
		}
		return result;
	}

	public static void download(DSRequest req, RPCManager rpc) {
		Logger log = new Logger(DMI.class.getName(), "download");

		rpc.doCustomResponse();
		HttpServletResponse response = rpc.getContext().response;

		try {
			log.debug("doing data request");
			DSResponse resp = req.execute();

			byte[] result = new byte[0];
			List<?> list = resp.getDataList();
			Iterator<?> iterator = list.iterator();
			if (iterator.hasNext()) {
				log.debug("result has records");
				Map<?, ?> record = (Map<?, ?>) iterator.next();
				Object o = record.values().iterator().next();
				if (o instanceof InputStream)
					result = IOUtils.toByteArray((InputStream) o);
				else if (o instanceof Reader)
					result = IOUtils.toByteArray((Reader) o);
				else
					result = o.toString().getBytes();
			} else
				log.debug("result has NO records");

			log.debug("returning data");
			String filename = req.getCriteriaValue(Const.PARAM_FILENAME).toString();
			String content_type = req.getCriteriaValue(Const.PARAM_CONTENT_TYPE).toString();
			response.setHeader("content-disposition", "attachment; filename=" + filename);
			response.setContentType(content_type);
			response.getOutputStream().write(result);
		} catch (Exception e) {
			log.error(req.getDataSourceName() + " " + req.getCriteria().toString(), e);
			response.setHeader("content-disposition", "attachment; filename=error");
		}
	}

	public static DSResponse compare(DSRequest req) throws Exception {
		Logger log = new Logger(DMI.class.getName(), "compare");

		DSResponse resp = req.execute();
		List list = resp.getDataList();
		Iterator iterator = list.iterator();
		String new_value = null, old_value = null;
		int row = 0;
		while (iterator.hasNext()) {
			row++;
			log.debug("process record " + row);
			Map record = (Map) iterator.next();
			Object o = record.values().iterator().next();
			if (row == 1)
				new_value = G.getString(o);
			else if (row == 2)
				old_value = G.getString(o);
			else
				break;
		}

		if (old_value == null || new_value == null)
			GS.ex("no values for compare");

		log.debug("doing compare");
		DiffMatchPatch diff = new DiffMatchPatch();
		LinesToCharsResult res = diff.diff_linesToChars(old_value, new_value);
		LinkedList<Diff> diffs = diff.diff_main(res.chars1, res.chars2, false);
		diff.diff_charsToLines(diffs, res.lineArray);
		resp.setStatus(DSResponse.STATUS_SUCCESS);
		// resp.setData(diff.diff_prettyHtml(diffs));
		List result = new ArrayList();
		for (final Diff d : diffs) {
			result.add(new HashMap() {
				{
					put("OPERATION", d.operation.toString());
					put("TEXT", d.text);
				}
			});
		}
		resp.setData(result);
		resp.setDropExtraFields(false);
		return resp;
	}

	private interface Uploader {
		String processRow(Connection con, MapWrapper requestValues, Row row, UIStr str, UIMsg msg) throws Exception;
	}

	private static DSResponse upload(DSRequest req, Uploader uploader) throws Exception {
		ISCFileItem file = req.getUploadedFile("FILE");
		String ext = GS.getFileExtension(file.getFileName());
		Rows data = null;
		try {
			data = G.loadExcelFile(req.getUploadedFileStream("FILE"), ext);
		} catch (Exception e) {
			throw new ExExcelFileLoadError("Excel file load error", e);
		}
		MapWrapper val = new MapWrapper(req.getValues());
		Connection con = DB.getConnection(req);
		UIStr str = G.getUIStr(req.getHttpServletRequest());
		UIMsg msg = G.getUIMsg(req.getHttpServletRequest());
		for (Row row : data) {
			Iterator it = val.getMap().keySet().iterator();
			while (it.hasNext()) {
				Object k = it.next();
				String localeFieldName = val.getStr(k.toString());
				if (row.containsKey(localeFieldName) && !localeFieldName.equals(k.toString())) {
					row.put(k.toString(), row.get(localeFieldName));
					row.remove(localeFieldName);
				}
			}
			try {
				row.put("RESULT", uploader.processRow(con, val, row, str, msg));
				row.put("ERROR", false);
				con.commit(); 
			} catch (Exception e) {
				con.rollback(); 
				row.put("RESULT", e.getMessage());
				row.put("ERROR", true);
			}
		}

		DSResponse resp = new DSResponse();
		resp.setData(data);
		resp.setDropExtraFields(false);
		return resp;
	}

	public static DSResponse uploadPorts(DSRequest req) throws Exception {
		return upload(req, new Uploader() {
			public String processRow(Connection con, MapWrapper requestValues, Row row, UIStr str, UIMsg msg) throws Exception {
				int objectId = requestValues.getInt("OBJECT_ID");
				Rows acc = DB.query(con, "select object_access(id) as access from objects where id = ?", objectId);
				if (acc.size() == 0)
					throw new ExNoDataFound("objects.id=" + objectId);
				if (!"FULL".equals(acc.get(0).getStr("ACCESS")))
					throw new ExAccessDenied();
				if (DB.query(con, "select count(0) a from pm_ports").get(0).getInt("A") >= G.PM.qty)
					throw new ExLimitReached();

				String host = row.getStr("HOST");
				String name = row.getStr("NAME");
				String port = row.getStr("PORT");
				String telco = row.getStr("TELCO");
				String patch = row.getStr("PATCH");
				String comment = row.getStr("COMMENT");

				if (host == null)
					GS.ex(str.hostNotDefined());
				if (name == null)
					GS.ex(str.nameNotDefined());
				if (port == null)
					GS.ex(str.portNotDefined());

				Rows dev = DB.query(con, "select p.id from pm_devices p join devices d on d.id=p.device_id " +
						"where p.object_id=? and lower(trim(d.host))=lower(trim(?)) and lower(trim(d.name))=lower(trim(?))", objectId, host, name);
				if (dev.size() == 0)
					GS.ex(str.deviceNotFound());
				int pmDeviceId = dev.get(0).getInt("ID");

				Integer pmPatchId = null;
				if (patch != null) {
					Rows pat = DB.query(con, "select id from pm_patch where object_id=? and lower(trim(patch))=lower(trim(?))", objectId, patch);
					if (pat.size() == 0)
						GS.ex(str.patchNotFound());
					pmPatchId = pat.get(0).getInt("ID");
				}

				if (DB.executeStatement(con,
						"update pm_ports set telco=?, pm_patch_id=?, comment=? where pm_device_id=? and lower(trim(port))=lower(trim(?))",
						telco, pmPatchId, comment, pmDeviceId, port) > 0) {
					return str.portUpdated();
				} else {
					DB.executeStatement(con, "insert into pm_ports(telco,pm_patch_id,comment,pm_device_id,port) values(?,?,?,?,?)",
							telco, pmPatchId, comment, pmDeviceId, port);
					return str.portCreated();
				}
			}
		});
	}

	public static DSResponse uploadDevices(DSRequest req) throws Exception {
		return upload(req, new Uploader() {
			public String processRow(Connection con, MapWrapper requestValues, Row row, UIStr str, UIMsg msg) throws Exception {
				int mapId = requestValues.getInt("MAP_ID");

				Rows acc = DB.query(con, "select map_config_devices(id) as access from maps where id = ?", mapId);
				if (acc.size() == 0)
					throw new ExNoDataFound("maps.id=" + mapId);
				if (!acc.get(0).getBool("ACCESS"))
					throw new ExAccessDenied();

				String host = row.getStr("HOST");
				String login = row.getStr("LOGIN");
				String pwd = row.getStr("PWD");
				String enablePwd = row.getStr("ENABLE_PWD");
				String consolePort = row.getStr("CONSOLE_PORT");
				String name = row.getStr("NAME");
				String comment = row.getStr("COMMENT");
				String location = row.getStr("LOCATION");
				String deviceType = row.getStr("DEVICE_TYPE_NAME");
				String connectType = row.getStr("CONNECT_TYPE");
				String snmpPort = row.getStr("SNMP_PORT");
				String snmpVersion = row.getStr("SNMP_VERSION");
				String readCommunity = row.getStr("READ_COMMUNITY");
				String writeCommunity = row.getStr("WRITE_COMMUNITY");
				String snmpUser = row.getStr("SNMP_USER");
				String snmpAuthProt = row.getStr("SNMP_AUTH_PROT");
				String snmpAuthPwd = row.getStr("SNMP_AUTH_PWD");
				String snmpPrivProt = row.getStr("SNMP_PRIV_PROT");
				String snmpPrivPwd = row.getStr("SNMP_PRIV_PWD");

				// if (consolePort == null)
				// GS.ex(str.consolePortNotDefined());

				if (host == null)
					GS.ex(str.hostNotDefined());

				// if (login == null)
				// GS.ex(str.loginNotDefined());
				//
				// if (pwd == null)
				// GS.ex(str.passwordNotDefined());
				//
				// if (enablePwd == null)
				// GS.ex(str.enablePasswordNotDefined());

				if (name == null)
					GS.ex(str.nameNotDefined());

				if (deviceType == null)
					GS.ex(str.deviceTypeNotDefined());

				// if (connectType == null)
				// GS.ex(str.connectionTypeNotDefined());

				// if (snmpPort == null)
				// GS.ex(str.snmpPortNotDefined());
				//
				// if (snmpVersion == null)
				// GS.ex(str.snmpVersionNotDefined());
				//
				// if (readCommunity == null)
				// GS.ex(str.readCommunityNotDefined());
				//
				// if (writeCommunity == null)
				// GS.ex(str.writeCommunityNotDefined());

				// ищем тип устройства
				Rows qRes = DB.query(con, "select id from device_types where lower(trim(name))=lower(trim(?))", deviceType);
				if (qRes.size() == 0)
					GS.ex(str.deviceTypeNotFound());
				int deviceTypeId = qRes.get(0).getInt("ID");

				if (connectType != null) {
					connectType = connectType.toUpperCase();
					if (ConnectType.parse(connectType) == null)
						GS.ex(str.incorrectConnectionType());
				}

				if (snmpVersion != null) {
					int t = GS.getInt(snmpVersion);
					if (t < 1 || t > 3)
						GS.ex(str.incorrectSnmpVersion());
				}

				if (consolePort != null) {
					int t = GS.getInt(consolePort);
					if (t <= 0 || t >= 0xFFFF)
						GS.ex(str.consolePortIncorrect());
				}

				if (snmpPort != null) {
					int t = GS.getInt(snmpPort);
					if (t <= 0 || t >= 0xFFFF)
						GS.ex(str.snmpPortIncorrect());
				}

				if (snmpAuthProt != null && !snmpAuthProt.isEmpty()) {
					snmpAuthProt = snmpAuthProt.toUpperCase();
					if (!GS.contains(snmpAuthProt, Const.SNMP_AUTH_PROT))
						GS.ex(str.incorrectAuthenticateProtocol());
				}

				if (snmpPrivProt != null && !snmpPrivProt.isEmpty()) {
					snmpPrivProt = snmpPrivProt.toUpperCase();
					if (!GS.contains(snmpPrivProt, Const.SNMP_PRIV_PROT))
						GS.ex(str.incorrectPrivacyProtocol());
				}

				if (DB.executeStatement(con,
						"update devices set host=?,location=?,comment=?,device_type_id=?,console_port=?,login=?,pwd=?,enable_pwd=?,connect_type=?::t_connect_type,"
								+
								"snmp_port=?,snmp_version=?,read_community=?,write_community=?," +
								"snmp_user=?,snmp_auth_prot=?,snmp_auth_pwd=?,snmp_priv_prot=?,snmp_priv_pwd=? where map_id=? and name=?",
						host, location, comment, deviceTypeId, GS.getInteger(consolePort), GS.encode(login), GS.encode(pwd), GS.encode(enablePwd), connectType,
						GS.getInteger(snmpPort), GS.getInteger(snmpVersion), GS.encode(readCommunity), GS.encode(writeCommunity),
						GS.encode(snmpUser), snmpAuthProt, GS.encode(snmpAuthPwd), snmpPrivProt, GS.encode(snmpPrivPwd), mapId, name) > 0) {
					return str.deviceUpdated();
				} else {
					DB.executeStatement(con,
							"insert into devices(name,location,comment,device_type_id,console_port,login,pwd,enable_pwd,connect_type," +
									"snmp_port,snmp_version,read_community,write_community,map_id,host,snmp_user,snmp_auth_prot," +
									"snmp_auth_pwd,snmp_priv_prot,snmp_priv_pwd) values(?,?,?,?,?,?,?,?,?::t_connect_type,?,?,?,?,?,?,?,?,?,?,?)",
							name, location, comment, deviceTypeId, GS.getInteger(consolePort), GS.encode(login), GS.encode(pwd), GS.encode(enablePwd),
							connectType,
							GS.getInteger(snmpPort), GS.getInteger(snmpVersion), GS.encode(readCommunity), GS.encode(writeCommunity), mapId, host,
							GS.encode(snmpUser), snmpAuthProt, GS.encode(snmpAuthPwd), snmpPrivProt, GS.encode(snmpPrivPwd));
					return str.deviceCreated();
				}
			}
		});
	}

	public static DSResponse uploadVlans(DSRequest req) throws Exception {
		return upload(req, new Uploader() {
			public String processRow(Connection con, MapWrapper requestValues, Row row, UIStr str, UIMsg msg) throws Exception {
				int objectId = requestValues.getInt("OBJECT_ID");
				Rows acc = DB.query(con, "select object_access(id) as access from objects where id = ?", objectId);
				if (acc.size() == 0)
					throw new ExNoDataFound("objects.id=" + objectId);
				if (!"FULL".equals(acc.get(0).getStr("ACCESS")))
					throw new ExAccessDenied();

				String vlan = row.getStr("VLAN");
				if (vlan == null || vlan.isEmpty())
					GS.ex(str.vlanNotDefined());
				if (!GS.isInteger(vlan))
					GS.ex(str.incorrectVlanNumber());

				String name = row.getStr("NAME");
				String net = row.getStr("NET");
				if (net != null) {
					if (!GS.netIsCorrect(net))
						GS.ex(str.incorrectNetDescribe());
				}

				String descr = row.getStr("DESCR");

				Boolean voice = row.getBool("VOICE");
				if (voice == null)
					voice = false;

				Rows r = DB.query(con, "select last_detect from pm_vlans where object_id=? and vlan=?", objectId, vlan);
				if (r.size() > 0) {
					if (r.get(0).getTimestamp("LAST_DETECT") == null) {
						DB.executeStatement(con,
								"update pm_vlans set name=?, net=?, voice=?, descr=? where object_id=? and vlan=?",
								name, net, voice, descr, objectId, vlan);
						return str.vlanUpdated();
					} else {
						DB.executeStatement(con,
								"update pm_vlans set name=?, voice=?, descr=? where object_id=? and vlan=?",
								name, voice, descr, objectId, vlan);
						return str.vlanUpdatedExceptNet();
					}
				} else {
					DB.executeStatement(con, "insert into pm_vlans(object_id,vlan,name,net,voice,descr) values (?,?,?,?,?,?)",
							objectId, vlan, name, net, voice, descr);
					return str.vlanCreated();
				}
			}
		});
	}

	public static DSResponse uploadPMPatch(DSRequest req) throws Exception {
		return upload(req, new Uploader() {
			public String processRow(Connection con, MapWrapper requestValues, Row row, UIStr str, UIMsg msg) throws Exception {
				Rows rows = DB.query(con, "select admin from users where id = user_id()");
				if (rows.size() == 0)
					throw new ExAccessDenied();
				if (!rows.get(0).getBool("ADMIN"))
					throw new ExAccessDenied();

				int objectId = requestValues.getInt("OBJECT_ID");
				String patch = row.getStr("PATCH");
				String location = row.getStr("LOCATION");

				if (patch == null || patch.isEmpty())
					GS.ex(str.patchNotDefined());

				if (DB.executeStatement(con,
						"update pm_patch set location=? where object_id=? and patch=?",
						location, objectId, patch) > 0) {
					return str.patchUpdated();
				} else {
					DB.executeStatement(con, "insert into pm_patch(object_id,patch,location) values (?,?,?)",
							objectId, patch, location);
					return str.patchCreated();
				}
			}
		});
	}

	public static DSResponse uploadDMDevices(DSRequest req) throws Exception {
		return upload(req, new Uploader() {
			public String processRow(Connection con, MapWrapper requestValues, Row row, UIStr str, UIMsg msg) throws Exception {
				int objectId = requestValues.getInt("OBJECT_ID");
				Rows acc = DB.query(con, "select object_access(id) as access from objects where id = ?", objectId);
				if (acc.size() == 0)
					throw new ExNoDataFound("objects.id=" + objectId);
				if (!"FULL".equals(acc.get(0).getStr("ACCESS")))
					throw new ExAccessDenied();
				if (DB.query(con, "select count(0) a from dm_devices").get(0).getInt("A") >= G.DM.qty)
					throw new ExLimitReached();

				String host = row.getStr("HOST");
				String deviceName = row.getStr("DEVICE_NAME");

				Rows tmp = DB.query(con, "select d.id from objects o join devices d on d.map_id=o.map_id " +
						"where o.id=? and upper(trim(d.host))=upper(trim(?)) and upper(trim(d.name))=upper(trim(?))", objectId, host, deviceName);
				if (tmp.size() == 0)
					GS.ex(str.deviceNotFound());
				int deviceId = tmp.get(0).getInt("ID");

				tmp = DB.query(con, "select * from dm_fields where object_id=?", objectId);
				Row fieldsDescr = tmp.size() == 0 ? null : tmp.get(0);

				List params = new ArrayList();

				for (int i = 1; i <= 20; i++) {
					Object t = row.get("DATE" + i);
					if (t != null) {
						if (t instanceof Date)
							params.add(new java.sql.Timestamp(((Date) t).getTime()));
						else
							GS.ex(str.fieldTypeMustBeDate()+" ("+t.toString()+")");
					} else {
						params.add(null);
					}
				}

				for (int i = 1; i <= 20; i++) {
					String t = row.getStr("BOOL" + i);
					if (t != null && !(t.equalsIgnoreCase("true") || t.equalsIgnoreCase("false")))
						GS.ex(msg.incorrectValue(t));
					params.add(t == null ? false : Boolean.parseBoolean(t));
				}

				for (int i = 1; i <= 20; i++) {
					String t = row.getStr("TEXT" + i);
					if (t != null && t.length() > 1000)
						t = t.substring(0, 1000);
					params.add(t);
				}

				for (int i = 1; i <= 20; i++) {
					String t = row.getStr("IP" + i);
					if (t != null && GS.ip2long(t).equals(0L))
						GS.ex(msg.incorrectValue(t));
					params.add(t);
				}

				for (int i = 1; i <= 20; i++) {
					String t = row.getStr("DICT" + i);
					Integer id = null;
					if (t != null && fieldsDescr != null) {
						tmp = DB.query(con, "select * from dict_values where dict_id=? and upper(trim(val))=upper(trim(?))",
								fieldsDescr.getInt("DICT_ID" + i), t);
						if (tmp.size() == 0)
							GS.ex(msg.incorrectValue(t));
						id = tmp.get(0).getInt("ID");
					}
					params.add(id);
				}

				params.add(objectId);
				params.add(deviceId);

				if (DB.executeStatement(
						con,
						"update dm_devices "
								+
								"set date1=?,date2=?,date3=?,date4=?,date5=?,date6=?,date7=?,date8=?,date9=?,date10=?,date11=?,date12=?,date13=?,date14=?,date15=?,date16=?,date17=?,date18=?,date19=?,date20=?,"
								+
								"bool1=?,bool2=?,bool3=?,bool4=?,bool5=?,bool6=?,bool7=?,bool8=?,bool9=?,bool10=?,bool11=?,bool12=?,bool13=?,bool14=?,bool15=?,bool16=?,bool17=?,bool18=?,bool19=?,bool20=?,"
								+
								"text1=?,text2=?,text3=?,text4=?,text5=?,text6=?,text7=?,text8=?,text9=?,text10=?,text11=?,text12=?,text13=?,text14=?,text15=?,text16=?,text17=?,text18=?,text19=?,text20=?,"
								+
								"ip1=?,ip2=?,ip3=?,ip4=?,ip5=?,ip6=?,ip7=?,ip8=?,ip9=?,ip10=?,ip11=?,ip12=?,ip13=?,ip14=?,ip15=?,ip16=?,ip17=?,ip18=?,ip19=?,ip20=?,"
								+
								"dict_val_id1=?,dict_val_id2=?,dict_val_id3=?,dict_val_id4=?,dict_val_id5=?,dict_val_id6=?,dict_val_id7=?,dict_val_id8=?,dict_val_id9=?,dict_val_id10=?,"
								+
								"dict_val_id11=?,dict_val_id12=?,dict_val_id13=?,dict_val_id14=?,dict_val_id15=?,dict_val_id16=?,dict_val_id17=?,dict_val_id18=?,dict_val_id19=?,dict_val_id20=?"
								+
								" where object_id=? and device_id=?",
						params.toArray()) > 0) {
					return str.deviceUpdated();
				} else {
					DB.executeStatement(
							con,
							"insert into dm_devices(date1,date2,date3,date4,date5,date6,date7,date8,date9,date10,date11,date12,date13,date14,date15,date16,date17,date18,date19,date20, "
									+
									"bool1,bool2,bool3,bool4,bool5,bool6,bool7,bool8,bool9,bool10,bool11,bool12,bool13,bool14,bool15,bool16,bool17,bool18,bool19,bool20, "
									+
									"text1,text2,text3,text4,text5,text6,text7,text8,text9,text10,text11,text12,text13,text14,text15,text16,text17,text18,text19,text20, "
									+
									"ip1,ip2,ip3,ip4,ip5,ip6,ip7,ip8,ip9,ip10,ip11,ip12,ip13,ip14,ip15,ip16,ip17,ip18,ip19,ip20, "
									+
									"dict_val_id1,dict_val_id2,dict_val_id3,dict_val_id4,dict_val_id5,dict_val_id6,dict_val_id7,dict_val_id8,dict_val_id9,dict_val_id10, "
									+
									"dict_val_id11,dict_val_id12,dict_val_id13,dict_val_id14,dict_val_id15,dict_val_id16,dict_val_id17,dict_val_id18,dict_val_id19,dict_val_id20, "
									+
									"object_id,device_id) " +
									"values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, " +
									"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, " +
									"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, " +
									"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, " +
									"?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?, " +
									"?,?)",
							params.toArray());
					return str.deviceLinkedToObject();
				}
			}
		});
	}



}
