package com.app.server;

import java.io.IOException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.snmp4j.smi.OID;

import com.app.server.DB.Row;
import com.app.server.DB.Rows;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.ScriptExecuteResult;
import com.app.shared.ScriptExecuteStatus;
import com.app.shared.exceptions.ExConnectionFailed;

import tcl.lang.Command;
import tcl.lang.Interp;
import tcl.lang.TCL;
import tcl.lang.TclBoolean;
import tcl.lang.TclDict;
import tcl.lang.TclException;
import tcl.lang.TclInterruptedException;
import tcl.lang.TclList;
import tcl.lang.TclNumArgsException;
import tcl.lang.TclObject;
import tcl.lang.TclString;

public class ScriptExecutor {

	private StringBuffer m_log = new StringBuffer();
	private StringBuffer m_console = new StringBuffer();
	private StringBuffer m_result = new StringBuffer();
	private String m_script;
	private ScriptExecuteStatus m_status;
	private Interp m_interp;
	private SaveCmd m_saveCmd;
	// private ArpCmd m_arpCmd;
	// private MapIdCmd m_mapIdCmd;
	// private ObjectIdCmd m_objectIdCmd;
	private Connection m_dbCon;
	private Device m_dev;
	private DeviceConnection m_devCon;
	private boolean m_shouldCloseDevCon; 
	private Thread m_reader;
	private Thread m_timeoutCheck;
	private SnmpCon m_snmp;
	private AtomicInteger m_timeout = new AtomicInteger(1000 * 60);
	private List<String> m_modules = new ArrayList<String>();

	// public static interface ArpCmd {
	// public void execute(String ip, String mac) throws Exception;
	// }

	/*public static interface MapIdCmd {
		public Integer execute();
	}
	
	public static interface ObjectIdCmd {
		public Integer execute();
	}*/

	public static interface SaveCmd {
		public void execute(Connection con, String var, String value) throws Exception;
	}

	public ScriptExecutor(String script, Device dev, Connection dbCon) {
		setStatus(ScriptExecuteStatus.NONE);
		m_dbCon = dbCon;
		m_script = script;
		m_dev = dev;
		m_interp = new Interp();

		setVariable(Const.VAR_LOGIN, dev.login);
		setVariable(Const.VAR_PASSWORD, dev.password);
		setVariable(Const.VAR_ENABLEPASSWORD, dev.enablePassword);
		setVariable(Const.VAR_DEVICENAME, dev.name);
		setVariable(Const.VAR_DEVICETYPE, dev.deviceType);
		setVariable(Const.VAR_SNMP_VER, dev.snmpVersion);

		m_interp.createCommand("input", new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
			}
		});

		m_interp.createCommand("include", cmdInclude());
		m_interp.createCommand("timeout", cmdTimeout());
		m_interp.createCommand("console", cmdConsole());
		m_interp.createCommand("log", cmdLog());
		m_interp.createCommand("result", cmdResult());
		m_interp.createCommand("send", cmdSend());
		m_interp.createCommand("genpwd", cmdGenPwd());
		m_interp.createCommand("save", cmdSave());
		// m_interp.createCommand("arp", cmdArp());
		// m_interp.createCommand("mapid", cmdMapId());
		// m_interp.createCommand("objectid", cmdObjectId());
		m_interp.createCommand("getvar", cmdGetVar());
		m_interp.createCommand("setvar", cmdSetVar());
		m_interp.createCommand("snmpget", cmdSnmpGet());
		m_interp.createCommand("snmpwalk", cmdSnmpWalk());
		m_interp.createCommand("snmpcontext", cmdSnmpContext());
		m_interp.createCommand("snmpcomsuffix", cmdSnmpComSuffix());
		m_interp.createCommand("dnslookup", cmdDNSlookup());
		m_interp.createCommand("sqlselect", cmdSQLselect());
		m_interp.createCommand("sqlstatement", cmdSQLstatement());
		

	}

	private Command cmdInclude() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 2)
					throw new TclNumArgsException(interp, 1, objv, "scriptName");

				String scriptName = objv[1].toString();

				if (m_modules.contains(scriptName.toUpperCase()))
					return;
				m_modules.add(scriptName.toUpperCase());

				try {
					Rows rows;
					try {
						rows = DB.query(m_dbCon, "select script from scripts where upper(trim(name))=upper(trim(?))", scriptName);
					} catch (SQLException e) {
						throw new TclException(interp, "Database query error: " + e.getMessage());
					}
					if (rows.size() == 0)
						throw new TclException(interp, "Script '" + scriptName + "' is not found");
					interp.eval(rows.get(0).getStr("SCRIPT"));
				} catch (TclException e) {
					int code = e.getCompletionCode();

					if (code == TCL.RETURN) {
						int realCode = interp.updateReturnInfo();
						if (realCode != TCL.OK) {
							e.setCompletionCode(realCode);
							throw e;
						}
					} else if (code == TCL.ERROR) {
						// Record information telling where the error occurred.
						interp.addErrorInfo("\n   (line " + interp.getErrorLine() + ")");
						throw e;
					} else {
						throw e;
					}
				}
			}
		};
	}

	private Command cmdTimeout() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 2)
					throw new TclNumArgsException(interp, 1, objv, "milliseconds");

				Integer a = GS.getInteger(objv[1].toString());
				if (a == null)
					throw new TclException(interp, "Incorrect number.");
				m_timeout.set(a);
			}
		};
	}

	private Command cmdConsole() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 1)
					throw new TclNumArgsException(interp, 1, objv, null);
				try {
					chkCon();
				} catch (Exception e) {
					throw new TclException(interp, "Cannot receive data from the device: " + e.getMessage());
				}
				interp.setResult(getConsole());
			}
		};
	}

	private Command cmdLog() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				int i = 1; // Index to the next arg in argv
				boolean newline = true; // Indicates to print a newline in result
				if ((objv.length >= 2) && (objv[1].toString().equals("-nonewline"))) {
					newline = false;
					i++;
				}
				if (i != objv.length - 1) {
					throw new TclNumArgsException(interp, 1, objv, "?-nonewline? string");
				}
				appendLog(objv[i].toString() + (newline ? "\n" : ""));
			}
		};
	}

	private Command cmdResult() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				int i = 1; // Index to the next arg in argv
				boolean newline = true; // Indicates to print a newline in result
				if ((objv.length >= 2) && (objv[1].toString().equals("-nonewline"))) {
					newline = false;
					i++;
				}
				if (i != objv.length - 1) {
					throw new TclNumArgsException(interp, 1, objv, "?-nonewline? string");
				}
				appendResult(objv[i].toString() + (newline ? "\n" : ""));
			}
		};
	}

	private Command cmdSend() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 2)
					throw new TclNumArgsException(interp, 1, objv, "string");
				try {
					chkCon();
					m_devCon.getIn().write(objv[1].toString().getBytes("utf-8"));
					m_devCon.getIn().flush();
				} catch (Exception e) {
					String err = e.getMessage();
					throw new TclException(interp, "Cannot send data to the device. " + err == null ? "" : err);
				}
			}
		};
	}

	private Command cmdGenPwd() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				String paramsExample = "?length? ?-digits? ?-lowercase? ?-uppercase?";

				if (objv.length > 5)
					throw new TclNumArgsException(interp, 1, objv, paramsExample);

				int len = Const.DEFAULT_PASSWORD_LENGTH;
				boolean digits = false, lowerCase = false, upperCase = false;

				for (int i = 1; i < objv.length; i++) {
					String param = objv[i].toString();
					if (i == 1 && GS.isInteger(param))
						len = GS.getInt(param);
					else if ("-digits".equals(param))
						digits = true;
					else if ("-lowercase".equals(param))
						lowerCase = true;
					else if ("-uppercase".equals(param))
						upperCase = true;
					else
						throw new TclNumArgsException(interp, 1, objv, paramsExample);
				}

				if (len > 50)
					throw new TclException(interp, "Length of password must be less or equal than 50.");
				if (len <= 0)
					throw new TclException(interp, "Length of password must be greater than 0.");

				if (!digits && !lowerCase && !upperCase)
					digits = upperCase = lowerCase = true;

				StringBuilder sb = new StringBuilder();
				if (digits)
					sb.append("123456789"); 
				if (lowerCase)
					sb.append("abcdefghijklmnopqrstuvwxyz");
				if (upperCase)
					sb.append("ABCDEFGHIJKLMNPQRSTUVWXYZ"); 

				interp.setResult(GS.generateRandomString(len, sb.toString()));
			}
		};
	}

	private Command cmdSave() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 3)
					throw new TclNumArgsException(interp, 1, objv, "variable value");
				try {
					String var = objv[1].toString();
					String value = objv[2].toString();

					if (var.equals(Const.VAR_LOGIN))
						m_dev.changeLogin(m_dbCon, value);
					else if (var.equals(Const.VAR_PASSWORD))
						m_dev.changePassword(m_dbCon, value);
					else if (var.equals(Const.VAR_ENABLEPASSWORD))
						m_dev.changeEnablePassword(m_dbCon, value);
					else if (var.equals(Const.VAR_DEVICENAME))
						m_dev.changeDeviceName(m_dbCon, value);
					else {
						if (m_saveCmd == null)
							throw new TclException(interp,
									"Unknown variable '" + var + "'. You must use the standard variables or object's fields (only 'device manage' objects).");
						m_saveCmd.execute(m_dbCon, var, value);
					}
				} catch (Exception e) {
					throw new TclException(interp, "Cannot save value: " + e.getMessage());
				}
			}
		};
	}

	// private Command cmdArp() {
	// return new Command() {
	// public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
	// if (objv.length != 3)
	// throw new TclNumArgsException(interp, 1, objv, "ip mac");
	// String ip = objv[1].toString();
	// String mac = objv[2].toString().toLowerCase();
	//
	// if (GS.ip2long(ip) == 0)
	// throw new TclException(interp, "Incorrect IP: " + ip);
	//
	// try {
	// String[] x = mac.split(":");
	// if (x.length != 6)
	// GS.ex();
	//
	// for (int i = 0; i < 6; i++)
	// if (Integer.parseInt(x[i], 16) > 255)
	// GS.ex();
	// } catch (Exception e) {
	// throw new TclException(interp, "Incorrect MAC: " + mac + " Correct format: xx:xx:xx:xx:xx:xx");
	// }
	//
	// if (m_arpCmd != null) {
	// try {
	// m_arpCmd.execute(ip, mac);
	// } catch (Exception e) {
	// throw new TclException(interp, "Cannot save data. " + e.getMessage());
	// }
	// } else
	// appendLog("Arp command. ip: " + ip + " mac: " + mac + "\n");
	// }
	// };
	// }

	/*private Command cmdMapId() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (m_mapIdCmd == null)
					throw new TclException(interp, "Command 'mapid' is not available");
				if (objv.length != 1)
					throw new TclNumArgsException(interp, 1, objv, null);
				interp.setResult(m_mapIdCmd.execute());
			}
		};
	}
	
	private Command cmdObjectId() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (m_objectIdCmd == null)
					throw new TclException(interp, "Command 'objectid' is not available");
				if (objv.length != 1)
					throw new TclNumArgsException(interp, 1, objv, null);
				interp.setResult(m_objectIdCmd.execute());
			}
		};
	}*/

	private Command cmdGetVar() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 2)
					throw new TclNumArgsException(interp, 1, objv, "variable");
				String result = "";
				try {
					Rows rows = DB.query(m_dbCon, "select script_var_get(?) val", objv[1].toString());
					if (rows.size() > 0)
						result = rows.get(0).getStr("VAL");
				} catch (Exception e) {
					throw new TclException(interp, "Cannot get variable value from database. " + e.getMessage());
				}
				interp.setResult(result);
			}
		};
	}

	private Command cmdDNSlookup() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 2)
					throw new TclNumArgsException(interp, 1, objv, "ip");
				String result = "";
				try {
					result = G.getHostNameByIP(objv[1].toString());
				} catch (Exception e) {
					throw new TclException(interp, "Cannot resolve name by ip: " + e.getMessage());
				}
				interp.setResult(result);
			}
		};
	}

	private Command cmdSQLselect() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length < 2)
					throw new TclNumArgsException(interp, 1, objv, "sql ?param1? ?param2? ...");
				try {
					TclObject res = TclList.newInstance();
					Object[] params = new Object[objv.length - 2];
					for (int i = 2; i < objv.length; i++) {
						params[i - 2] = objv[i].toString();
					}
					for (Row r : DB.query(m_dbCon, objv[1].toString(), params)) {
						TclObject dict = TclDict.newInstance();
						for (String field : r.keySet()) {
							TclDict.put(interp, dict, TclString.newInstance(field),
									r.get(field) instanceof Boolean ? TclBoolean.newInstance(r.getBool(field)) : TclString.newInstance(r.getStr(field)));
						}
						TclList.append(interp, res, dict);
					}

					interp.setResult(res);
				} catch (Exception e) {
					throw new TclException(interp, "SQL error: " + e.getMessage());
				}
			}
		};
	}

	private Command cmdSQLstatement() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length < 2)
					throw new TclNumArgsException(interp, 1, objv, "sql ?param1? ?param2? ...");
				try {
					Object[] params = new Object[objv.length - 2];
					for (int i = 2; i < objv.length; i++) {
						params[i - 2] = objv[i].toString();
					}
					int rowsProcessed = DB.executeStatement(m_dbCon, objv[1].toString(), params);
					interp.setResult(rowsProcessed);
				} catch (Exception e) {
					throw new TclException(interp, "SQL error: " + e.getMessage());
				}
			}
		};
	}

	private Command cmdSetVar() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 3)
					throw new TclNumArgsException(interp, 1, objv, "variable value");
				String var = objv[1].toString();
				String val = objv[2].toString();
				try {
					DB.executeProcedure(m_dbCon, "script_var_set", var, val);
				} catch (Exception e) {
					throw new TclException(interp, "Cannot save variable value to database. " + e.getMessage());
				}
			}
		};
	}

	private Command cmdSnmpContext() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 2)
					throw new TclNumArgsException(interp, 1, objv, "context");

				try {
					chkSnmp();
					m_snmp.setContext(objv[1].toString());
				} catch (Exception e) {
					throw new TclException(interp, "SNMP set context error: " + e.getMessage());
				}
			}
		};
	}

	private Command cmdSnmpComSuffix() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				if (objv.length != 2)
					throw new TclNumArgsException(interp, 1, objv, "communitySuffix");

				try {
					chkSnmp();
					m_snmp.setCommunitySuffix(objv[1].toString());
				} catch (Exception e) {
					throw new TclException(interp, "SNMP set community suffix error: " + e.getMessage());
				}
			}
		};
	}

	private Command cmdSnmpGet() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				String paramsExample = "OID ?-ipvalue? ?-macvalue?";

				if (objv.length > 4 || objv.length < 2)
					throw new TclNumArgsException(interp, 1, objv, paramsExample);

				String oid = objv[1].toString();
				ValueType valueType = null;

				for (int i = 2; i < objv.length; i++) {
					String param = objv[i].toString();
					if ("-ipvalue".equals(param))
						valueType = ValueType.IP;
					else if ("-macvalue".equals(param))
						valueType = ValueType.Mac;
					else
						throw new TclNumArgsException(interp, 1, objv, paramsExample);
				}

				try {
					chkSnmp();
					interp.setResult(m_snmp.get(new OID(oid), valueType));
				} catch (Exception e) {
					throw new TclException(interp, "SNMPGET error: " + e.getMessage());
				}
			}
		};
	}

	private Command cmdSnmpWalk() {
		return new Command() {
			public void cmdProc(Interp interp, TclObject[] objv) throws TclException {
				String paramsExample = "OID ?-ipvalue? ?-macvalue?";

				if (objv.length > 4 || objv.length < 2)
					throw new TclNumArgsException(interp, 1, objv, paramsExample);

				String oid = objv[1].toString();
				ValueType valueType = null;

				for (int i = 2; i < objv.length; i++) {
					String param = objv[i].toString();
					if ("-ipvalue".equals(param))
						valueType = ValueType.IP;
					else if ("-macvalue".equals(param))
						valueType = ValueType.Mac;
					else
						throw new TclNumArgsException(interp, 1, objv, paramsExample);
				}

				try {
					chkSnmp();
					TclObject res = TclList.newInstance();
					for (Data d : m_snmp.walk(new OID(oid), valueType)) {
						TclList.append(interp, res, TclString.newInstance(d.oid.toString()));
						TclList.append(interp, res, TclString.newInstance(d.value));
					}
					interp.setResult(res);
				} catch (Exception e) {
					throw new TclException(interp, "SNMPWALK error: " + e.getMessage());
				}
			}
		};
	}

	public void dispose() {
		try {
			m_interp.dispose();
		} catch (Exception e) {
		}
	}

	private void chkSnmp() throws Exception {
		if (m_snmp == null) {
			m_snmp = new SnmpCon(m_dev);
		}
	}

	private void chkCon() throws ExConnectionFailed {
		if (m_devCon == null) {
			try {
				if (m_dev.connectType == null)
					throw new Exception("Unknown connection type");

				switch (m_dev.connectType) {
				case SSH:
					m_devCon = new SSHConnection(m_dev.host, m_dev.consolePort, m_dev.login, m_dev.password);
					break;
				case TELNET:
					m_devCon = new TelnetConnection(m_dev.host, m_dev.consolePort);
					break;
				}
				m_shouldCloseDevCon = true; 

			} catch (Exception e) {
				throw new ExConnectionFailed("Fails to connect to the device: " + e.getMessage());
			}
		}

		if (m_reader == null && m_devCon != null) {
			m_reader = new Thread() {
				@Override
				public void run() {
					byte[] buf = new byte[1024 * 16];
					int len;
					try {
						while (!isInterrupted()) {
							while (m_devCon.getOut().available() > 0 && (len = m_devCon.getOut().read(buf)) > 0) {
								m_console.append(new String(buf, 0, len));
							}
							try {
								sleep(100);
							} catch (InterruptedException e) {
								break;
							}
						}
					} catch (IOException e) {
						appendLog("\nAn error occurred when receiving data from the device\n");
						setStatus(ScriptExecuteStatus.ERROR);
					}
				}
			};
			m_reader.start();
		}
	}

	public ScriptExecuteResult execute() {
		return execute(null);
	}

	public void setScript(String script) {
		m_script = script;
	}

	public ScriptExecuteResult execute(DeviceConnection devCon) {
		m_result.setLength(0);
		m_console.setLength(0);
		m_log.setLength(0);

		setStatus(ScriptExecuteStatus.RUNNING);
		try {
			try {
				m_devCon = devCon;
				m_shouldCloseDevCon = false; 
				m_timeoutCheck = new Thread() {
					@Override
					public void run() {
						long start = System.currentTimeMillis();
						while (!isInterrupted()) {
							try {
								sleep(1000);
							} catch (InterruptedException e) {
								break;
							}
							if (start + m_timeout.get() < System.currentTimeMillis()) {
								m_interp.setInterrupted();
								break;
							}
						}
					}
				};
				m_timeoutCheck.start();
				try {
					m_interp.eval(m_script);
				} catch (TclException e) {
					throw new Exception(m_interp.getResult() + " at line " + m_interp.getErrorLine());
				}
			} finally {
				if (m_timeoutCheck != null) {
					m_timeoutCheck.interrupt();
					m_timeoutCheck.join();
				}
				if (m_reader != null) {
					m_reader.interrupt();
					m_reader.join();
				}
				if (m_devCon != null && m_shouldCloseDevCon) {
					m_devCon.close();
				}
				if (m_snmp != null) {
					m_snmp.close();
				}
			}
			setStatus(ScriptExecuteStatus.OK);
		} catch (TclInterruptedException e) {
			appendLog("\nThe script was interrupted because it was run for a long time\n");
			setStatus(ScriptExecuteStatus.ERROR);
		} catch (Exception e) {
			appendLog("\nAn error occurred during the execution of the script: " + e.getMessage() + "\n");
			setStatus(ScriptExecuteStatus.ERROR);
		}
		return new ScriptExecuteResult(){{
			status = getStatus();
			result = getResult();
			log = getLog();
			console = getConsole();			
		}};
	}

	public void setStatus(ScriptExecuteStatus status) {
		m_status = status;
	}

	public ScriptExecuteStatus getStatus() {
		return m_status;
	}

	/*public void setLog(String text) {
		m_log.setLength(0);
		m_log.trimToSize();
		m_log.append(text);
	}*/

	public void appendLog(String text) {
		m_log.append(text);
	}

	public void appendResult(String text) {
		m_result.append(text);
	}

	public String getLog() {
		return m_log.toString();
	}

	public String getResult() {
		return m_result.toString();
	}

	/*public void setAuthVariables(String login, String password, String enablePassword) {
		setVariable(Const.VAR_LOGIN, login);
		setVariable(Const.VAR_PASSWORD, password);
		setVariable(Const.VAR_ENABLEPASSWORD, enablePassword);
	}*/

	public void setVariable(String name, Object value) {
		try {
			m_interp.setVar(name, null, value == null ? "" : value.toString(), 0);
		} catch (Exception e) {
			appendLog(String.format("\nCannot set value to variable '%s': %s\n", name, e.getMessage()));
		}
	}

	public String getVariable(String name) {
		try {
			return m_interp.getVar(name, 0).toString();
		} catch (Exception e) {
			appendLog(String.format("\nCannot get value of variable '%s': %s\n", name, e.getMessage()));
			return null;
		}
	}

	public String getConsole() {
		return m_console.toString();
	}

	public void setSaveCmd(SaveCmd saveCmd) {
		m_saveCmd = saveCmd;
	}

	// public void setArpCmd(ArpCmd arpCmd) {
	// m_arpCmd = arpCmd;
	// }

	/*public void setMapIdCmd(MapIdCmd mapIdCmd) {
		m_mapIdCmd = mapIdCmd;
	}
	
	public void setObjectIdCmd(ObjectIdCmd objectIdCmd) {
		m_objectIdCmd = objectIdCmd;
	}*/

}
