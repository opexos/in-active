package com.app.client;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import com.app.shared.GS;
import com.app.shared.ScriptExecuteResult;
import com.smartgwt.client.core.Function;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.rpc.DMI;
import com.smartgwt.client.rpc.RPCCallback;
import com.smartgwt.client.rpc.RPCRequest;
import com.smartgwt.client.rpc.RPCResponse;

public class ServerCall {
	
	

	public interface ExecuteScriptCallback {
		public void execute(ScriptExecuteResult result);
	}

	public interface RecordsCallback {
		public void execute(RecordList records);
	}

	public interface OperationCallback {
		public void execute(boolean ok, String msg);
	}

	public interface StringCallback {
		public void execute(String str);
	}


	/*
	public static void downloadConfig(String script, String host, String connectionType, int port, String login, String pwd, String enable_pwd,
			final DownloadConfigCallback callback) {
		DMI.call("app", "DMI", "downloadConfig", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				Map m = response.getDataAsMap();
				callback.execute((Boolean) m.get("OK"), (String) m.get("CONSOLE"), (String) m.get("LOG"), (String) m.get("CONFIG"));
			}
		}, new Object[] { script, host, connectionType, port, login, pwd, enable_pwd });
	}
	*/


	public static void executeScript(String script, int deviceId, Map params, final ExecuteScriptCallback callback) {
		DMI.call("app", "DMI", "executeScript", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute(new ScriptExecuteResult(response.getDataAsMap()));
			}
		}, new Object[] { script, deviceId, params });
	}


	public static void deviceManageExecuteScript(Integer scriptId, String script, int dmDeviceId, Map params, final ExecuteScriptCallback callback) {
		if (params != null) {
			params = new HashMap(params); // in order not to change the passed parameters from outside, we create a copy
			// if we pass the date, then we bring it to the desired format
			for (Object key : params.keySet()) {
				Object value = params.get(key);
				if (value instanceof Date)
					params.put(key, G.formatDateTimestamp((Date) value));
			}
		}

		DMI.call("app", "DMI", "deviceManageExecuteScript", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute(new ScriptExecuteResult(response.getDataAsMap()));
			}
		}, new Object[] { scriptId, script, dmDeviceId, params });
	}

	public static void getPortsByDeviceId(int deviceId, final RecordsCallback callback) {
		DMI.call("app", "SNMP", "getPortsByDeviceId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute(new RecordList(response.getDataAsObject()));
			}
		}, new Object[] { deviceId });
	}

	public static void getVlansByDeviceId(int deviceId, final RecordsCallback callback) {
		DMI.call("app", "SNMP", "getVlansByDeviceId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute(new RecordList(response.getDataAsObject()));
			}
		}, new Object[] { deviceId });
	}

	public static void updateDeviceInfoByDeviceId(int deviceId, final OperationCallback callback) {
		RPCRequest params = new RPCRequest();
		params.setWillHandleError(true);
		DMI.call("app", "SNMP", "updateDeviceInfoByDeviceId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute(response.getStatus() == RPCResponse.STATUS_SUCCESS, response.getDataAsString());
			}
		}, new Object[] { deviceId }, params);
	}

	public static void setPortVlanByPortId(int portId, int vlan, final OperationCallback callback) {
		RPCRequest params = new RPCRequest();
		params.setWillHandleError(true);
		DMI.call("app", "SNMP", "setPortVlanByPortId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				String resp = response.getDataAsString();
				callback.execute(resp == null || resp.isEmpty(), resp);
			}
		}, new Object[] { portId, vlan }, params);
	}

	public static void setPortAdminStatusByPortId(int portId, int status, final OperationCallback callback) {
		RPCRequest params = new RPCRequest();
		params.setWillHandleError(true);
		DMI.call("app", "SNMP", "setPortAdminStatusByPortId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				String resp = response.getDataAsString();
				callback.execute(resp == null || resp.isEmpty(), resp);
			}
		}, new Object[] { portId, status }, params);
	}


	public static void setPortSpeedByPortId(int portId, String speed, final OperationCallback callback) {
		RPCRequest params = new RPCRequest();
		params.setWillHandleError(true);
		DMI.call("app", "SNMP", "setPortSpeedByPortId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				String resp = response.getDataAsString();
				callback.execute(resp == null || resp.isEmpty(), resp);
			}
		}, new Object[] { portId, speed }, params);
	}

	public static void setPortDuplexByPortId(int portId, String duplex, final OperationCallback callback) {
		RPCRequest params = new RPCRequest();
		params.setWillHandleError(true);
		DMI.call("app", "SNMP", "setPortDuplexByPortId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				String resp = response.getDataAsString();
				callback.execute(resp == null || resp.isEmpty(), resp);
			}
		}, new Object[] { portId, duplex }, params);
	}

	public static void startConsole(int id, String idType, final MapCallback callback) {
		DMI.call("app", "ConsoleManager", "startConsole", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute(response.getDataAsMap());
			}
		}, new Object[] { id, idType });
	}

	public static void sendToConsole(String consoleId, String data, final Function callback) {
		DMI.call("app", "ConsoleManager", "sendToConsole", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				if (callback != null)
					callback.execute();
			}
		}, new Object[] { consoleId, GS.encode(data) });
	}

	public static void closeConsole(String consoleId) {
		DMI.call("app", "ConsoleManager", "closeConsole", null, new Object[] { consoleId });
	}

	public static void getConsoleData(final RecordsCallback callback) {
		RPCRequest params = new RPCRequest();
		params.setWillHandleError(true);
		DMI.call("app", "ConsoleManager", "getConsoleData", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute(response.getStatus() == RPCResponse.STATUS_SUCCESS ? new RecordList(response.getDataAsObject()) : null);
			}
		}, new Object[] {}, params);
	}

}
