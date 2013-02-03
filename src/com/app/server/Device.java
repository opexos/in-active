package com.app.server;

import java.sql.Connection;
import java.sql.SQLException;

import com.app.server.DB.Row;
import com.app.server.DB.Rows;
import com.app.shared.ConnectType;
import com.app.shared.GS;
import com.app.shared.exceptions.ExNoDataFound;

public class Device {

	public int id;
	public String host;
	public String name;
	public Integer consolePort;
	public ConnectType connectType;
	public String login;
	public String password;
	public String enablePassword;
	public Integer snmpPort;
	public Integer snmpVersion;
	public String readCommunity;
	public String writeCommunity;	
	public String snmpUserName;
	public String snmpAuthProt;
	public String snmpAuthPwd;
	public String snmpPrivProt;
	public String snmpPrivPwd;
	public Integer deviceTypeId;
	public String deviceType;

	public Device(int id) throws SQLException, ExNoDataFound {
		Connection con = DB.getConnection();
		try {
			init(con, id);
		} finally {
			DB.close(con);
		}
	}

	public Device(Connection con, int id) throws SQLException, ExNoDataFound {
		init(con, id);
	}

	private void init(Connection con, int id) throws SQLException, ExNoDataFound {
		Rows rows = DB.query(con, "select d.*,dt.name as device_type from devices d join device_types dt on dt.id=d.device_type_id where d.id=?", id);
		if (rows.size() == 0)
			throw new ExNoDataFound("Device not found in database. devices.id=" + id);
		Row row = rows.get(0);

		this.id = id;
		this.host = row.getStr("HOST");
		this.name = row.getStr("NAME");
		this.consolePort = row.getInt("CONSOLE_PORT");
		this.connectType = ConnectType.parse(row.getStr("CONNECT_TYPE"));
		this.login = GS.decode(row.getStr("LOGIN"));
		this.password = GS.decode(row.getStr("PWD"));
		this.enablePassword = GS.decode(row.getStr("ENABLE_PWD"));
		this.snmpPort = row.getInt("SNMP_PORT");
		this.snmpVersion = row.getInt("SNMP_VERSION");
		this.readCommunity = GS.decode(row.getStr("READ_COMMUNITY"));
		this.writeCommunity = GS.decode(row.getStr("WRITE_COMMUNITY"));
		this.snmpUserName = GS.decode(row.getStr("SNMP_USER"));
		this.snmpAuthProt = row.getStr("SNMP_AUTH_PROT");
		this.snmpAuthPwd = GS.decode(row.getStr("SNMP_AUTH_PWD"));
		this.snmpPrivProt = row.getStr("SNMP_PRIV_PROT");
		this.snmpPrivPwd = GS.decode(row.getStr("SNMP_PRIV_PWD"));
		this.deviceTypeId = row.getInt("DEVICE_TYPE_ID");
		this.deviceType = row.getStr("DEVICE_TYPE");
	}

	public void changeLogin(Connection con, String login) throws SQLException {
		DB.executeStatement(con, "update devices set login=? where id=?", GS.encode(login), this.id);
		this.login = login;
	}

	public void changePassword(Connection con, String password) throws SQLException {
		DB.executeStatement(con, "update devices set pwd=? where id=?", GS.encode(password), this.id);
		this.password = password;
	}

	public void changeEnablePassword(Connection con, String enablePassword) throws SQLException {
		DB.executeStatement(con, "update devices set enable_pwd=? where id=?", GS.encode(enablePassword), this.id);
		this.enablePassword = enablePassword;
	}

	public void changeDeviceName(Connection con, String devName) throws SQLException {
		DB.executeStatement(con, "update devices set name=? where id=?", devName, this.id);
		this.name = devName;
	}

	public static Device createByPMDeviceId(Connection con, int id) throws SQLException, ExNoDataFound  {
		Rows rows = DB.query(con, "select device_id from pm_devices where id=?", id);
		if (rows.size() == 0)
			throw new ExNoDataFound("Device not found in database (Port manage): pm_devices.id=" + id);
		return new Device(con, rows.get(0).getInt("DEVICE_ID"));
	}

	public static Device createByDMDeviceId(Connection con, int id) throws SQLException, ExNoDataFound {
		Rows rows = DB.query(con, "select device_id from dm_devices where id=?", id);
		if (rows.size() == 0)
			throw new ExNoDataFound("Device not found in database (Device manage): dm_devices.id=" + id);
		return new Device(con, rows.get(0).getInt("DEVICE_ID"));
	}

	public static Device createByCCDeviceId(Connection con, int id) throws SQLException, ExNoDataFound {
		Rows rows = DB.query(con, "select device_id from cc_devices where id=?", id);
		if (rows.size() == 0)
			throw new ExNoDataFound("Device not found in database (Configuration control): cc_devices.id=" + id);
		return new Device(con, rows.get(0).getInt("DEVICE_ID"));
	}

}
