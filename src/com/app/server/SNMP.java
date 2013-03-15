package com.app.server;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.snmp4j.smi.Integer32;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;

import com.app.server.DB.Row;
import com.app.server.DB.Rows;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.PortDuplex;
import com.app.shared.PortSpeed;
import com.app.shared.Result;
import com.app.shared.exceptions.ExAccessDenied;
import com.app.shared.exceptions.ExCantChangeVlanPortIsTrunk;
import com.app.shared.exceptions.ExIncorrectVlanType;
import com.app.shared.exceptions.ExNoDataFound;
import com.app.shared.exceptions.ExOperationNotSupportedByDevice;
import com.app.shared.exceptions.ExPortNotFound;
import com.app.shared.exceptions.ExSnmpNoResponse;
import com.app.shared.exceptions.ExVlanNotFound;
import com.isomorphic.log.Logger;

public class SNMP {

	private static long clientNamesFileLastRefresh;
	private static final Map<String, String> clientNamesFile = new HashMap<String, String>();
	private static final Map<String, String> dot3StatsDuplexStatusValues = new LinkedHashMap<String, String>();
	private static final Map<String, String> portDuplexValues = new LinkedHashMap<String, String>();
	private static final Map<String, String> portAdminSpeedValues = new LinkedHashMap<String, String>();

	static {
		// dot3StatsDuplexStatusValues.put("1", "unknown");
		dot3StatsDuplexStatusValues.put("2", "Half-duplex");
		dot3StatsDuplexStatusValues.put("3", "Full-duplex");
		portDuplexValues.put("1", "Half-duplex");
		portDuplexValues.put("2", "Full-duplex");
		portDuplexValues.put("3", "Disagree");
		portDuplexValues.put("4", "Auto");
		portAdminSpeedValues.put("1", "Autodetect");
		portAdminSpeedValues.put("2", "Autodetect 10/100");
		portAdminSpeedValues.put("10", "10 Gbps");
		portAdminSpeedValues.put("64000", "64 Kbps");
		portAdminSpeedValues.put("1544000", "1.5 Mbps");
		portAdminSpeedValues.put("2000000", "2 Mbps");
		portAdminSpeedValues.put("2048000", "2 Mbps");
		portAdminSpeedValues.put("4000000", "4 Mbps");
		portAdminSpeedValues.put("10000000", "10 Mbps");
		portAdminSpeedValues.put("16000000", "16 Mbps");
		portAdminSpeedValues.put("45000000", "45 Mbps");
		portAdminSpeedValues.put("64000000", "64 Mbps");
		portAdminSpeedValues.put("100000000", "100 Mbps");
		portAdminSpeedValues.put("155000000", "155 Mbps");
		portAdminSpeedValues.put("400000000", "400 Mbps");
		portAdminSpeedValues.put("622000000", "622 Mbps");
		portAdminSpeedValues.put("1000000000", "1 Gbps");
	}

	private static final OID ifName = new OID("1.3.6.1.2.1.31.1.1.1.1"); 
	private static final OID ifType = new OID("1.3.6.1.2.1.2.2.1.3"); 

	private static final OID vtpVlanName = new OID("1.3.6.1.4.1.9.9.46.1.3.1.1.4"); 
	private static final OID vtpVlanType = new OID("1.3.6.1.4.1.9.9.46.1.3.1.1.3"); 
	private static final OID dot1dTpFdbPort = new OID("1.3.6.1.2.1.17.4.3.1.2"); 
																				
	private static final OID dot1dBasePortIfIndex = new OID("1.3.6.1.2.1.17.1.4.1.2"); 
	private static final OID vmVlan = new OID("1.3.6.1.4.1.9.9.68.1.2.2.1.2"); 
	private static final OID vlanTrunkPortDynamicStatus = new OID("1.3.6.1.4.1.9.9.46.1.6.1.1.14"); 
	private static final OID ipNetToMediaPhysAddress = new OID("1.3.6.1.2.1.4.22.1.2"); 
	private static final OID ipNetToPhysicalPhysAddress = new OID("1.3.6.1.2.1.4.35.1.4");
	private static final OID ifAdminStatus = new OID("1.3.6.1.2.1.2.2.1.7");
	private static final OID ifOperStatus = new OID("1.3.6.1.2.1.2.2.1.8");
	private static final OID cdpCacheDeviceId = new OID("1.3.6.1.4.1.9.9.23.1.2.1.1.6");
	private static final OID cdpCacheDevicePort = new OID("1.3.6.1.4.1.9.9.23.1.2.1.1.7");
	private static final OID cdpCacheAddress = new OID("1.3.6.1.4.1.9.9.23.1.2.1.1.4");

	private static final OID ipAdEntIfIndex = new OID("1.3.6.1.2.1.4.20.1.2"); 
	private static final OID ipAdEntNetMask = new OID("1.3.6.1.2.1.4.20.1.3"); 

	private static final OID ifHighSpeed = new OID("1.3.6.1.2.1.31.1.1.1.15");
	private static final OID ifInDiscards = new OID("1.3.6.1.2.1.2.2.1.13");
	private static final OID ifInErrors = new OID("1.3.6.1.2.1.2.2.1.14");
	private static final OID ifOutDiscards = new OID("1.3.6.1.2.1.2.2.1.19");
	private static final OID ifOutErrors = new OID("1.3.6.1.2.1.2.2.1.20");
	private static final OID dot3StatsAlignmentErrors = new OID("1.3.6.1.2.1.10.7.2.1.2");
	private static final OID dot3StatsFCSErrors = new OID("1.3.6.1.2.1.10.7.2.1.3");
	private static final OID dot3StatsSingleCollisionFrames = new OID("1.3.6.1.2.1.10.7.2.1.4");
	private static final OID dot3StatsMultipleCollisionFrames = new OID("1.3.6.1.2.1.10.7.2.1.5");
	private static final OID dot3StatsDeferredTransmissions = new OID("1.3.6.1.2.1.10.7.2.1.7");
	private static final OID dot3StatsLateCollisions = new OID("1.3.6.1.2.1.10.7.2.1.8");
	private static final OID dot3StatsExcessiveCollisions = new OID("1.3.6.1.2.1.10.7.2.1.9");
	private static final OID dot3StatsCarrierSenseErrors = new OID("1.3.6.1.2.1.10.7.2.1.11");
	private static final OID dot3StatsFrameTooLongs = new OID("1.3.6.1.2.1.10.7.2.1.13");
	private static final OID dot3StatsDuplexStatus = new OID("1.3.6.1.2.1.10.7.2.1.19");
	private static final OID portIfIndex = new OID("1.3.6.1.4.1.9.5.1.4.1.1.11");
	private static final OID portAdminSpeed = new OID("1.3.6.1.4.1.9.5.1.4.1.1.9");
	private static final OID portDuplex = new OID("1.3.6.1.4.1.9.5.1.4.1.1.10");

	public static class Vlan {
		public int number;
		public String name;
		// public String ip;
		// public Integer prefix;
		// public String mask;
		public String net;
		// public String interfaceMac;
		public DataList macs;
		public DataList portIfIndex;
	}

	public static class Vlans extends ArrayList<Vlan> {

	}

	public static class PortClient {
		public String mac;
		public Integer vlan;
		public String cdpName;
		public boolean voice = false;

		public PortClient(String mac, Integer vlan, String cdpName) {
			this.mac = mac;
			this.vlan = vlan;
			this.cdpName = cdpName;
		}
	}

	public static class PortClients extends ArrayList<PortClient> {
		public PortClients findByMac(String mac) {
			PortClients result = new PortClients();
			for (PortClient cli : this)
				if (cli.mac.equals(mac))
					result.add(cli);
			return result;
		}
	}

	public static class PortInfo {
		public String port;
		public boolean offline;
		public boolean trunk;
		public Integer vlan;
		public int adminStatus;
		public int operStatus;
		public PortClients clients;
		public Integer speed;
		public Integer inDiscards;
		public Integer inErrors;
		public Integer outDiscards;
		public Integer outErrors;
		public Integer alignmentErrors;
		public Integer FCSErrors;
		public Integer singleCollisionFrames;
		public Integer multipleCollisionFrames;
		public Integer deferredTransmissions;
		public Integer lateCollisions;
		public Integer excessiveCollisions;
		public Integer carrierSenseErrors;
		public Integer frameTooLongs;

		@Override
		public String toString() {
			StringBuilder sb = new StringBuilder();
			sb.append("Port " + port + "\n");
			sb.append("Port VLAN " + vlan + "\n");
			sb.append("Clients:\n");
			for (PortClient cli : clients)
				sb.append("   " + cli.mac + "   " + cli.vlan + "\n");
			return sb.toString();
		}
	}

	public static class PortsInfo extends ArrayList<PortInfo> {
		public PortInfo findPortInfo(String port) {
			for (PortInfo pi : this)
				if (pi.port.equalsIgnoreCase(port))
					return pi;
			return null;
		}
	}

	public static class Arp {
		public String ip;
		public String mac;

		public Arp(String ip, String mac) {
			this.ip = ip;
			this.mac = mac;
		}
	}

	public static class ArpTable extends ArrayList<Arp> {
		public ArpTable findByIP(String ip) {
			ArpTable result = new ArpTable();
			for (Arp a : this)
				if (a.ip.equals(ip))
					result.add(a);
			return result;
		}

		public ArpTable findByMac(String mac) {
			ArpTable result = new ArpTable();
			for (Arp a : this)
				if (a.mac.equals(mac))
					result.add(a);
			return result;
		}
	}

	public static DataList getPorts(SnmpCon snmp) throws Exception {
		DataList interfaces = snmp.walk(ifName);
		DataList infTypes = snmp.walk(ifType);
		DataList result = new DataList();
		for (Data inf : interfaces) {
			Data typ = infTypes.findByLastOIDSubIdentifier(inf.oid.last());
			if (typ != null && (typ.value.equals("6") || typ.value.equals("161")))
				result.add(inf);
		}
		return result;
	}

	public static Vlans getVlans(SnmpCon snmp) throws Exception {
		Vlans result = new Vlans();
		DataList vlanTypes = snmp.walk(vtpVlanType);
		DataList vlanNames = snmp.walk(vtpVlanName);
		DataList ipIfIndex = snmp.walk(ipAdEntIfIndex);
		DataList ipNetMask = snmp.walk(ipAdEntNetMask);
		DataList ifNames = snmp.walk(ifName);

		for (Data d : vlanTypes) {
			if (!d.value.equals("1"))
				continue; 
			Vlan vlan = new Vlan();
			vlan.number = d.oid.last();
			vlan.name = vlanNames.findByLastOIDSubIdentifier(vlan.number).value;
			DataList inf = ifNames.findByValue("VL" + vlan.number);
			if (inf.size() > 0) {
				int ifIndex = inf.get(0).oid.last();
				DataList ip = ipIfIndex.findByValue(ifIndex);
				if (ip.size() > 0) {
					Data mask = ipNetMask.findByLastOIDSubIdentifiers(ip.get(0).oid, 4);
					if (mask != null) {
						byte[] tmp = ip.get(0).oid.toByteArray();
						byte[] ipArr = Arrays.copyOfRange(tmp, tmp.length - 4, tmp.length);
						vlan.net = GS.getNet(GS.getDottedString(ipArr), mask.value);
					}
				}
			}
			result.add(vlan);
		}
		return result;
	}

	public static ArpTable getArpTable(SnmpCon snmp, Device device, Connection con) throws Exception {
		final ArpTable result = new ArpTable();

			for (Data d : snmp.walk(ipNetToPhysicalPhysAddress, ValueType.Mac))
				result.add(new Arp(GS.getDottedString(d.oid.toByteArray(), 4), d.value));
			if (result.size() == 0)
				for (Data d : snmp.walk(ipNetToMediaPhysAddress, ValueType.Mac))
					result.add(new Arp(GS.getDottedString(d.oid.toByteArray(), 4), d.value));
		return result;
	}

	public static PortsInfo getPortsInfo(SnmpCon st, ArpTable arpTable) throws Exception {
		Logger log = new Logger(SNMP.class.getName(), "getPortsInfo");
		String host = st.getAddress();

		DataList interfaces = st.walk(ifName);
		DataList infTypes = st.walk(ifType);
		DataList trunk = st.walk(vlanTrunkPortDynamicStatus);
		DataList vlanMember = st.walk(vmVlan);
		DataList adminStatus = st.walk(ifAdminStatus);
		DataList operStatus = st.walk(ifOperStatus);
		DataList vlanTypes = st.walk(vtpVlanType);
		DataList cdpName = st.walk(cdpCacheDeviceId); 
		DataList cdpPort = st.walk(cdpCacheDevicePort); 
		DataList cdpAdr = st.walk(cdpCacheAddress, ValueType.IP); 
		Vlans vlans = new Vlans();

		for (Data vlanType : vlanTypes) {
			if (vlanType.value.equals("1"))  {
				int vlanNumber = vlanType.oid.last();
				try {
					Vlan vlan = new Vlan();
					vlan.number = vlanNumber;
					st.setVlan(vlanNumber);
					vlan.portIfIndex = st.walk(dot1dBasePortIfIndex);
					vlan.macs = st.walk(dot1dTpFdbPort);
					vlans.add(vlan);
					log.debug("Vlan macs and ports. Host " + host + " Vlan " + vlanNumber + "\n\n" + vlan.portIfIndex.toString() + "\n\n"
							+ vlan.macs.toString());
				} catch (ExSnmpNoResponse e) {
					log.warn("Can't request dot1dBasePortIfIndex and dot1dTpFdbPort for VLAN " + vlanNumber + " for host "
							+ host);
				}
			}
		}

		PortsInfo result = new PortsInfo();

		for (Data inf : interfaces) {
			int ifIndex = inf.oid.last();
			Data tmp = infTypes.findByLastOIDSubIdentifier(ifIndex);
			if (!(tmp != null && (tmp.value.equals("6") || tmp.value.equals("161")))) // 6 (ethernet) 161 (port channel)
				continue;

			PortInfo port = new PortInfo();
			port.port = inf.value;
			tmp = trunk.findByLastOIDSubIdentifier(ifIndex);
			port.trunk = tmp != null && tmp.value.equals("1");
			port.adminStatus = Integer.parseInt(adminStatus.findByLastOIDSubIdentifier(ifIndex).value);
			port.operStatus = Integer.parseInt(operStatus.findByLastOIDSubIdentifier(ifIndex).value);
			port.offline = !(port.adminStatus == 1 && port.operStatus == 1);

			if (!port.trunk) {
				tmp = vlanMember.findByLastOIDSubIdentifier(ifIndex);
				if (tmp != null)
					port.vlan = Integer.parseInt(tmp.value);
			}

			PortClients clients = new PortClients();
			DataList cdpDev = cdpName.findByPreLastOIDSubIdentifier(ifIndex);
			if (cdpDev.size() > 0 && port.trunk) {
				String name = cdpDev.get(0).value;
				Data prt = cdpPort.findByLastOIDSubIdentifiers(cdpDev.get(0).oid, 2);
				if (prt != null && prt.value != null)
					name += "/" + prt.value;
				clients.add(new PortClient(null, null, name));
			} else {
				for (Vlan vlan : vlans) {
					for (Data brPort : vlan.portIfIndex.findByValue(ifIndex)) {
						for (Data mac : vlan.macs.findByValue(brPort.oid.last())) {
							byte[] b = mac.oid.toByteArray();
							String macAdr = new OctetString(b, b.length - 6, 6).toHexString(':');

							String name = null;
							ArpTable a = arpTable.findByMac(macAdr);
							for (int i = 0; i < a.size(); i++) {
								DataList c = cdpAdr.findByPreLastOIDSubIdentifier(ifIndex).findByValue(a.get(i).ip);
								if (c.size() > 0) {
									Data d = cdpName.findByLastOIDSubIdentifiers(c.get(0).oid, 2);
									if (d != null) {
										name = d.value;
										break;
									}
								}
							}

							clients.add(new PortClient(macAdr, vlan.number, name));

						}
					}
				}
			}
			port.clients = clients;
			result.add(port);
		}

		return result;
	}

	public static void setPortVlan(SnmpCon snmp, String port, int vlan) throws Exception {
		DataList tmp = snmp.walk(ifName).findByValue(port.trim());
		if (tmp.size() == 0)
			throw new ExPortNotFound("Port not found. Device " + snmp + " Port " + port);
		int ifIndex = tmp.get(0).oid.last();

		Data tmp2 = snmp.walk(vlanTrunkPortDynamicStatus).findByLastOIDSubIdentifier(ifIndex);
		if (tmp2 != null && tmp2.value.equals("1"))
			throw new ExCantChangeVlanPortIsTrunk("Can't change vlan, port is trunk. Device " + snmp + " Port " + port);

		tmp2 = snmp.walk(vtpVlanType).findByLastOIDSubIdentifier(vlan);
		if (tmp2 == null)
			throw new ExVlanNotFound("Vlan not found. Device " + snmp + " Vlan " + vlan);
		if (!tmp2.value.equals("1"))
			throw new ExIncorrectVlanType("Incorrect vlan type. Device " + snmp + " Vlan " + vlan);

		snmp.set(new OID(vmVlan).append(ifIndex), new Integer32(vlan));
	}

	public static void setPortSpeed(SnmpCon snmp, String port, String speed) throws Exception {
		DataList d = snmp.walk(ifName).findByValue(port.trim());
		if (d.size() == 0)
			throw new ExPortNotFound("Port not found. Device " + snmp + " Port " + port);
		int ifIndex = d.get(0).oid.last();

		d = snmp.walk(portIfIndex).findByValue(ifIndex);
		if (d.size() == 0)
			throw new ExOperationNotSupportedByDevice("Operation not supported by device. Device " + snmp);
		OID oid = d.get(0).oid;

		int sp = 1;
		switch (PortSpeed.valueOf(speed)) {
		case AUTO:
			sp = 1;
			break;
		case G1:
			sp = 1000000000;
			break;
		case G10:
			sp = 10;
			break;
		case M10:
			sp = 10000000;
			break;
		case M100:
			sp = 100000000;
			break;
		}
		snmp.set(copyOID(portAdminSpeed, oid), new Integer32(sp));
	}

	public static void setPortDuplex(SnmpCon snmp, String port, String duplex) throws Exception {
		DataList d = snmp.walk(ifName).findByValue(port.trim());
		if (d.size() == 0)
			throw new ExPortNotFound("Port not found. Device " + snmp + " Port " + port);
		int ifIndex = d.get(0).oid.last();

		d = snmp.walk(portIfIndex).findByValue(ifIndex);
		if (d.size() == 0)
			throw new ExOperationNotSupportedByDevice("Operation not supported by device. Device " + snmp);
		OID oid = d.get(0).oid;

		int dup = 4; // auto
		switch (PortDuplex.valueOf(duplex)) {
		case AUTO:
			dup = 4;
			break;
		case FULL:
			dup = 2;
			break;
		case HALF:
			dup = 1;
			break;
		}
		snmp.set(copyOID(portDuplex, oid), new Integer32(dup));
	}

	public static void setPortAdminStatus(SnmpCon snmp, String port, int status) throws Exception {
		DataList tmp = snmp.walk(ifName).findByValue(port.trim());
		if (tmp.size() == 0)
			throw new ExPortNotFound("Port not found. Device " + snmp + " Port " + port);
		int ifIndex = tmp.get(0).oid.last();

		snmp.set(new OID(ifAdminStatus).append(ifIndex), new Integer32(status));
	}

	private static OID copyOID(OID src, OID dest) {
		for (int i = 0; i < Math.min(src.size(), dest.size()); i++)
			dest.set(i, src.get(i));
		return dest;
	}

	public static Map getPortInfo(SnmpCon snmp, String port) throws Exception {
		DataList tmp = snmp.walk(ifName).findByValue(port.trim());
		if (tmp.size() == 0)
			throw new ExPortNotFound("Port not found. Device " + snmp + " Port " + port);
		int ifIndex = tmp.get(0).oid.last();

		Map<String, String> info = new LinkedHashMap<String, String>();
		String operStatus = snmp.get(new OID(ifOperStatus).append(ifIndex));
		info.put("Status", operStatus == null ? null : (operStatus.equals("1") ? "Connected" : "Disconnected"));
		String duplex = null, speed = null;
		DataList d = snmp.walk(portIfIndex).findByValue(ifIndex);
		if (d.size() > 0) {
			OID oid = d.get(0).oid;
			duplex = portDuplexValues.get(snmp.get(copyOID(portDuplex, oid)));
			speed = portAdminSpeedValues.get(snmp.get(copyOID(portAdminSpeed, oid)));
		} else {
			duplex = dot3StatsDuplexStatusValues.get(snmp.get(new OID(dot3StatsDuplexStatus).append(ifIndex)));
			speed = snmp.get(new OID(ifHighSpeed).append(ifIndex)) + " mbps";
		}
		info.put("Speed", speed);
		info.put("Duplex mode", duplex);
		info.put("In discards", snmp.get(new OID(ifInDiscards).append(ifIndex)));
		info.put("In errors", snmp.get(new OID(ifInErrors).append(ifIndex)));
		info.put("Out discards", snmp.get(new OID(ifOutDiscards).append(ifIndex)));
		info.put("Out errors", snmp.get(new OID(ifOutErrors).append(ifIndex)));
		info.put("Alignment errors", snmp.get(new OID(dot3StatsAlignmentErrors).append(ifIndex)));
		info.put("FCS errors", snmp.get(new OID(dot3StatsFCSErrors).append(ifIndex)));
		info.put("Single collision frames", snmp.get(new OID(dot3StatsSingleCollisionFrames).append(ifIndex)));
		info.put("Multiple collision frames", snmp.get(new OID(dot3StatsMultipleCollisionFrames).append(ifIndex)));
		info.put("Deferred transmissions", snmp.get(new OID(dot3StatsDeferredTransmissions).append(ifIndex)));
		info.put("Late collisions", snmp.get(new OID(dot3StatsLateCollisions).append(ifIndex)));
		info.put("Excessive collisions", snmp.get(new OID(dot3StatsExcessiveCollisions).append(ifIndex)));
		info.put("Carrier sense errors", snmp.get(new OID(dot3StatsCarrierSenseErrors).append(ifIndex)));
		info.put("Frame too longs", snmp.get(new OID(dot3StatsFrameTooLongs).append(ifIndex)));
		return info;
	}

	public static List<Map> getPortsByDeviceId(int pmDeviceId) throws Exception {
		Connection con = DB.getConnection();
		try {
			SnmpCon st = new SnmpCon(Device.createByPMDeviceId(con, pmDeviceId));
			try {
				DataList inf = getPorts(st);
				Rows ports = DB.query(con, "select port from pm_ports where pm_device_id = ?", pmDeviceId);
				List<Map> res = new ArrayList<Map>();
				for (Data d : inf) {
					Map<String, Object> m = new HashMap<String, Object>();
					m.put("PORT", d.value);
					m.put("EXIST", ports.containsRow("PORT", d.value));
					res.add(m);
				}
				return res;
			} finally {
				st.close();
			}
		} finally {
			DB.close(con);
		}
	}

	public static List<Map> getVlansByDeviceId(int deviceId) throws Exception {
		SnmpCon st = new SnmpCon(new Device(deviceId));
		try {
			Vlans vlans = getVlans(st);
			List res = new ArrayList<Map>();
			for (Vlan d : vlans) {
				Map<String, Object> m = new HashMap<String, Object>();
				m.put("VLAN", d.number);
				m.put("NAME", d.name);
				m.put("NET", d.net);
				// m.put("IP", d.ip);
				// m.put("MASK", d.mask);
				// m.put("PREFIX", d.prefix);
				res.add(m);
			}
			return res;
		} finally {
			st.close();
		}
	}

	public static Map getPortInfoByPortId(int portId) throws Exception {
		Connection con = DB.getConnection();
		try {
			Rows rows = DB.query(con, "select * from pm_ports where id=?", portId);
			if (rows.size() == 0)
				throw new ExNoDataFound("Port not found. pm_ports.id=" + portId);
			Row dev = rows.get(0);
			SnmpCon st = new SnmpCon(Device.createByPMDeviceId(con, dev.getInt("PM_DEVICE_ID")));
			try {
				return getPortInfo(st, dev.getStr("PORT"));
			} finally {
				st.close();
			}
		} finally {
			DB.close(con);
		}
	}

	private interface SetPortChangesCallback {
		public void execute(Connection con, SnmpCon st, String port) throws Exception;
	}

	private static void setPortChanges(String user, int portId, SetPortChangesCallback callback) throws Exception {
		Connection con = DB.getConnection();
		try {
			DB.executeProcedure(con, "user_auth", user);
			Rows rows = DB.query(con,
					"select b.id, a.port, object_access(b.object_id) as access from pm_ports a join pm_devices b on b.id = a.pm_device_id where a.id=?",
					portId);
			if (rows.size() == 0)
				throw new ExNoDataFound("Port not found. pm_ports.id=" + portId);
			if (!"FULL".equals(rows.get(0).getStr("ACCESS")))
				throw new ExAccessDenied();
			SnmpCon st = new SnmpCon(Device.createByPMDeviceId(con, rows.get(0).getInt("ID")));
			try {
				callback.execute(con, st, rows.get(0).getStr("PORT"));
			} finally {
				st.close();
			}
		} finally {
			DB.close(con);
		}
	}

	public static void setPortVlanByPortId(final int portId, final int vlan, HttpServletRequest req) throws Exception {
		setPortChanges(req.getRemoteUser(), portId, new SetPortChangesCallback() {
			public void execute(Connection con, SnmpCon st, String port) throws Exception {
				setPortVlan(st, port, vlan);
				DB.executeStatement(con, "update pm_ports set vlan=? where id=?", vlan, portId);
				DB.executeProcedure(con, "PORT_LOG_CHANGE", portId, "SET_VLAN", vlan);
			}
		});
	}

	public static void setPortSpeedByPortId(final int portId, final String speed, HttpServletRequest req) throws Exception {
		setPortChanges(req.getRemoteUser(), portId, new SetPortChangesCallback() {
			public void execute(Connection con, SnmpCon st, String port) throws Exception {
				setPortSpeed(st, port, speed);
				DB.executeProcedure(con, "PORT_LOG_CHANGE", portId, "SET_SPEED", Const.PORT_SPEED.get(speed));
			}
		});
	}

	public static void setPortDuplexByPortId(final int portId, final String duplex, HttpServletRequest req) throws Exception {
		setPortChanges(req.getRemoteUser(), portId, new SetPortChangesCallback() {
			public void execute(Connection con, SnmpCon st, String port) throws Exception {
				setPortDuplex(st, port, duplex);
				DB.executeProcedure(con, "PORT_LOG_CHANGE", portId, "SET_DUPLEX", Const.PORT_DUPLEX.get(duplex));
			}
		});
	}

	public static void setPortAdminStatusByPortId(final int portId, final int status, HttpServletRequest req) throws Exception {
		setPortChanges(req.getRemoteUser(), portId, new SetPortChangesCallback() {
			public void execute(Connection con, SnmpCon st, String port) throws Exception {
				setPortAdminStatus(st, port, status);
				DB.executeStatement(con, "update pm_ports set admin_status=? where id=?", status, portId);
				if (status == Const.ADMIN_STATUS_UP)
					DB.executeProcedure(con, "PORT_LOG_CHANGE", portId, "ENABLE", null);
				else if (status == Const.ADMIN_STATUS_DOWN)
					DB.executeProcedure(con, "PORT_LOG_CHANGE", portId, "DISABLE", null);
			}
		});
	}

	public static void updateDeviceInfo(Connection con, int pmDeviceId) throws Exception {
		try {
			Rows rows = DB.query(con, "select * from pm_devices where id = ?", pmDeviceId);
			if (rows.size() == 0)
				throw new ExNoDataFound("Port manage device not found. pm_devices.id=" + pmDeviceId);
			Device device = new Device(con, rows.get(0).getInt("DEVICE_ID"));
			int objectId = rows.get(0).getInt("OBJECT_ID");
			int archiveDays = rows.get(0).getInt("ARCHIVE_DAYS");

			synchronized (clientNamesFile) {
				if ((System.currentTimeMillis() - clientNamesFileLastRefresh) > 10000L) { 
					clientNamesFile.clear(); 
					String file = G.getServerProperties().getProperty("clientNamesFile");
					if (file != null && file.trim().length() > 0) {
						List<String> lines = null;
						try {
							lines = Files.readAllLines(Paths.get(file.trim()), StandardCharsets.ISO_8859_1);
						} catch (Exception e) {
							GS.ex("An error occurred while reading the file " + file + " : " + e.toString());
						}
						for (String line : lines) {
							String[] parts = line.split(" ");
							if (parts.length == 3)
								clientNamesFile.put(parts[0], parts[2]);
						}
					}
					clientNamesFileLastRefresh = System.currentTimeMillis();
				}
			}

			SnmpCon st = new SnmpCon(device);
			try {

				Logger log = new Logger(SNMP.class.getName(), "updateDeviceInfo. Host " + device.host);
				log.debug("Start updating device info");

				Vlans snmpVlans = SNMP.getVlans(st);
				log.debug("Vlans found in device by SNMP - " + snmpVlans.size());
				for (Vlan vlan : snmpVlans)
					DB.executeStatement(con,
							"merge into pm_vlans a using (values(?,?,?,?)) as x(objid,vlan,name,net) on a.object_id=x.objid and a.vlan=x.vlan " +
									"when matched then update set a.name=coalesce(x.name,a.name),a.net=coalesce(x.net,a.net),a.last_detect=localtimestamp " +
									"when not matched then insert(object_id,vlan,name,net,last_detect) values x.objid,x.vlan,x.name,x.net,localtimestamp",
							objectId, vlan.number, vlan.name, vlan.net);

				ArpTable arp = getArpTable(st, device, con);
				log.debug("Records in ARP table found - " + arp.size());
				for (Arp a : arp) {
					DB.executeStatement(con,
							"merge into pm_arp a using (values(?,?,?,?)) as x(objid,mac,ip,devid) on a.object_id=x.objid and a.mac=x.mac and a.ip=x.ip " +
									"when matched then update set a.detected=sysdate, a.pm_device_id=x.devid " +
									"when not matched then insert(object_id,mac,ip,detected,pm_device_id) values x.objid, x.mac, x.ip, sysdate, x.devid",
							objectId, a.mac, a.ip, pmDeviceId);
				}

				Rows vlans = DB.query(con, "select * from pm_vlans where object_id=?", objectId);
				// log.debug("Full list of VLANs of OBJECT for device " + device.host + "\n" + vlans.toString());

				PortsInfo portsInfo = SNMP.getPortsInfo(st, arp);

				Rows macs = DB.query(con, "select mac from v_all_macs where object_id=?", objectId);

				StringBuilder newMacs = new StringBuilder();

				for (Row port : DB.query(con, "select * from pm_ports where pm_device_id=?", pmDeviceId)) {
					int portId = port.getInt("ID");
					String portName = port.getStr("PORT");

					DB.executeStatement(con, "delete from pm_port_clients where pm_port_id=? and last_detect < sysdate - ? day", portId, archiveDays);

					PortInfo actual = portsInfo.findPortInfo(portName.trim());
					if (actual == null) {
						DB.executeStatement(con, "update pm_ports set offline=coalesce(offline,sysdate), admin_status=? where id=?",
								Const.ADMIN_STATUS_DOWN, portId);
						continue; 
					}

					DB.executeStatement(con,
							"update pm_ports set trunk=?, offline=case when ? then coalesce(offline,sysdate) end, admin_status=?, vlan=? where id=?",
							actual.trunk, actual.offline, actual.adminStatus, actual.vlan, portId);

					if (actual.clients.size() == 0)
						continue;

					log.debug("Port information from device host " + device.host + "\n" + actual.toString());

					if (!actual.trunk) {
						Iterator<PortClient> it = actual.clients.iterator();
						while (it.hasNext()) {
							PortClient cli = it.next();

							if (actual.clients.findByMac(cli.mac).size() > 1) {
								if (cli.vlan.equals(actual.vlan)) {
									it.remove();
									continue;
								}
							}

							if (!cli.vlan.equals(actual.vlan)) {
								cli.voice = true;
								log.debug("Found voice client. Mac " + cli.mac + " Vlan " + cli.vlan + " Condition: client vlan != port vlan");
							} else if (vlans.findRows("VLAN", cli.vlan).findRows("VOICE", true).size() > 0) {
								cli.voice = true;
								log.debug("Found voice client. Mac " + cli.mac + " Vlan " + cli.vlan + " Condition: client vlan has voice flag");
							}
						}
					}

					for (PortClient cli : actual.clients) {
						if (cli.cdpName != null && actual.trunk) { 
							if (DB.executeStatement(con,
									"update pm_port_clients set last_detect=sysdate, cisco=true where pm_port_id=? and name=?",
									portId, cli.cdpName) == 0) {
								DB.executeStatement(con, "insert into pm_port_clients(pm_port_id,name,cisco,voice,first_detect,last_detect) " +
										" values(?,?,true,false,sysdate,sysdate)", portId, cli.cdpName);
							}
							break; 
						} else {
							if (cli.mac != null && !macs.containsRow("MAC", cli.mac)) {
								newMacs.append("<tr><td width=150px>");
								newMacs.append(portName);
								newMacs.append("</td><td width=100px>");
								newMacs.append(GS.nvl(port.getStr("PATCH"), ""));
								newMacs.append("</td><td width=300px>");
								newMacs.append(GS.nvl(port.getStr("LOCATION"), ""));
								newMacs.append("</td><td width=150px>");
								newMacs.append(cli.mac);
								newMacs.append("</td></tr>");
							}

							Rows ips = DB.query(con, "select ip, pm_device_id from pm_arp where object_id=? and mac=? order by detected desc",
									objectId, cli.mac);

							if (ips.size() == 0) {
								String name;
								synchronized (clientNamesFile) {
									name = clientNamesFile.get(cli.mac);
								}
								if (name != null && name.length() > 100)
									name = name.substring(0, 100);// 100 - размер поля в бд
								if (DB.executeStatement(con, "update pm_port_clients set last_detect=sysdate, name=? " +
										"where pm_port_id=? and mac=? and vlan=? and ip is null",
										name, portId, cli.mac, cli.vlan) == 0)
									if (DB.query(con, "select count(0) cnt from pm_port_clients where pm_port_id=? and mac=?",
											portId, cli.mac).get(0).getInt("CNT") == 0)
										DB.executeStatement(con,
												"insert into pm_port_clients(pm_port_id,mac,vlan,name,cisco,voice,first_detect,last_detect) " +
														" values(?,?,?,?,false,?,sysdate,sysdate)",
												portId, cli.mac, cli.vlan, cli.voice ? cli.cdpName : name, cli.voice);
							} else {
								for (Row ipp : ips) {
									String ip = ipp.getStr("IP");

									if (!cli.voice)
										for (Row vlan : vlans.findRows("VOICE", true)) {
											String net = vlan.getStr("NET");
											if (net != null && GS.isIPinNet(ip, net)) {
												cli.voice = true;
												cli.vlan = vlan.getInt("VLAN");
												log.debug("Found voice client by IP " + ip + ". Mac " + cli.mac + ". In voice VLAN " + cli.vlan + " " + net);
												break;
											}
										}

									String hostName;
									if (cli.voice)
										hostName = cli.cdpName;
									else {
										synchronized (clientNamesFile) {
											hostName = clientNamesFile.get(cli.mac);
										}
										if (hostName == null)
											hostName = G.getHostNameByIP(ip);
									}
									if (hostName != null && hostName.length() > 100)
										hostName = hostName.substring(0, 100);
									if (DB.executeStatement(con, "update pm_port_clients set name=?, last_detect=sysdate " +
											"where pm_port_id=? and mac=? and vlan=? and ip=?",
											hostName, portId, cli.mac, cli.vlan, ip) == 0)
										if (DB.executeStatement(con, "update pm_port_clients set ip=?, name=?, last_detect=sysdate " +
												"where pm_port_id=? and mac=? and vlan=? and ip is null",
												ip, hostName, portId, cli.mac, cli.vlan) == 0)
											DB.executeStatement(con,
													"insert into pm_port_clients(pm_port_id,ip,mac,vlan,name,cisco,voice,first_detect,last_detect) " +
															" values(?,?,?,?,?,false,?,sysdate,sysdate)",
													portId, ip, cli.mac, cli.vlan, hostName, cli.voice);
								}
							}


						}
					}
				}

				if (newMacs.length() > 0) {
					Rows t = DB.query(con, "select m.name map, o.name obj from objects o join maps m on m.id = o.map_id where o.id=?", objectId);
					if (t.size() > 0) {
						Rows rcvr = DB
								.query(con,
										"select distinct replace(u.name || '<'||u.email||'>', ',' , '_') as email from role_new_client_notice n join user_roles ur on ur.role_id = n.role_id "
												+
												"join users u on u.id = ur.user_id where n.object_id=? and u.email is not null",
										objectId);
						if (rcvr.size() > 0) {
							newMacs.insert(0, "<table border=1><tr bgcolor=\"silver\"><td>Port</td><td>Patch</td><td>Location</td><td>Mac</td></tr>");
							newMacs.append("</table>");
							newMacs.insert(0, "<p>Device: " + device.host + " " + device.name + "</p>");
							newMacs.insert(0, "<p>Object: " + t.get(0).getStr("OBJ") + "</p>");
							newMacs.insert(0, "<p>Map: " + t.get(0).getStr("MAP") + "</p>");

							DB.executeStatement(con, "insert into mail(receivers,subject,body) values (?,?,?)",
									rcvr.getList("EMAIL", ","), "New clients are found", newMacs.toString());
						}
					}
				}

				DB.executeStatement(con, "insert into pm_log(pm_device_id, result) values (?,?)", pmDeviceId, Result.OK.toString());
			} finally {
				st.close();
			}
		} catch (Exception e) {
			try {
				DB.executeStatement(con, "insert into pm_log(pm_device_id, result, error_log) values (?,?::t_result,?)",
						pmDeviceId, Result.ERROR.toString(), e.getMessage());
			} catch (Exception e1) {
			}
			throw e;
		}
	}

	public static void updateDeviceInfoByDeviceId(int pmDeviceId, HttpServletRequest req) throws Exception {
		Connection con = DB.getConnection();
		try {
			DB.executeProcedure(con, "user_auth", req.getRemoteUser());
			Rows rows = DB.query(con, "select object_access(object_id) as access from pm_devices where id=?", pmDeviceId);
			if (rows.size() == 0)
				throw new ExNoDataFound();
			if (!"FULL".equals(rows.get(0).getStr("ACCESS")))
				throw new ExAccessDenied();
			updateDeviceInfo(con, pmDeviceId);
		} finally {
			DB.close(con);
		}
	}


}
