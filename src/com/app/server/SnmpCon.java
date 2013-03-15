package com.app.server;

import org.snmp4j.CommunityTarget;
import org.snmp4j.PDU;
import org.snmp4j.PDUv1;
import org.snmp4j.ScopedPDU;
import org.snmp4j.Snmp;
import org.snmp4j.Target;
import org.snmp4j.TransportMapping;
import org.snmp4j.UserTarget;
import org.snmp4j.event.ResponseEvent;
import org.snmp4j.mp.MPv3;
import org.snmp4j.mp.SnmpConstants;
import org.snmp4j.security.AuthMD5;
import org.snmp4j.security.AuthSHA;
import org.snmp4j.security.Priv3DES;
import org.snmp4j.security.PrivAES128;
import org.snmp4j.security.PrivAES192;
import org.snmp4j.security.PrivAES256;
import org.snmp4j.security.PrivDES;
import org.snmp4j.security.SecurityLevel;
import org.snmp4j.security.SecurityModels;
import org.snmp4j.security.SecurityProtocols;
import org.snmp4j.security.USM;
import org.snmp4j.security.UsmUser;
import org.snmp4j.smi.Address;
import org.snmp4j.smi.GenericAddress;
import org.snmp4j.smi.OID;
import org.snmp4j.smi.OctetString;
import org.snmp4j.smi.Variable;
import org.snmp4j.smi.VariableBinding;
import org.snmp4j.transport.DefaultUdpTransportMapping;

import com.app.shared.GS;
import com.app.shared.exceptions.ExIncorrectAddress;
import com.app.shared.exceptions.ExIncorrectConnectionSettings;
import com.app.shared.exceptions.ExSnmpError;
import com.app.shared.exceptions.ExSnmpNoResponse;
import com.app.shared.exceptions.ExSnmpSetError;

public class SnmpCon {
	private Snmp m_snmp;
	private TransportMapping m_transport;
	private Target m_target;
	private String m_readCommunity;
	private String m_writeCommunity;
	private Integer m_vlan;
	private String m_context;
	private String m_communitySuffix;

	public SnmpCon(Device dev) throws Exception {
		if (dev.snmpVersion == null)
			throw new ExIncorrectConnectionSettings("SNMP version is not defined");
		if (dev.snmpVersion < 1 || dev.snmpVersion > 3)
			throw new ExIncorrectConnectionSettings("SNMP version is incorrect");
		if (GS.isEmpty(dev.host))
			throw new ExIncorrectConnectionSettings("Host is not defined");
		if (dev.snmpPort == null)
			dev.snmpPort = 161;

		Address adr = GenericAddress.parse(dev.host + "/" + dev.snmpPort);
		if (adr == null)
			throw new ExIncorrectAddress("Address " + dev.host + " port " + dev.snmpPort + " is incorrect");

		m_transport = new DefaultUdpTransportMapping();
		m_transport.listen();
		m_snmp = new Snmp(m_transport);

		if (dev.snmpVersion == 3) {
			if (GS.isEmpty(dev.snmpUserName))
				throw new ExIncorrectConnectionSettings("SNMP user name is not defined");

			OID authProt = null;
			if ("MD5".equals(dev.snmpAuthProt))
				authProt = AuthMD5.ID;
			else if ("SHA".equals(dev.snmpAuthProt))
				authProt = AuthSHA.ID;
			else if (!GS.isEmpty(dev.snmpAuthProt))
				throw new ExIncorrectConnectionSettings("SNMP authentication protocol is incorrect");

			if (authProt != null && GS.isEmpty(dev.snmpAuthPwd))
				throw new ExIncorrectConnectionSettings("SNMP authentication password is not defined");
			if (authProt == null && !GS.isEmpty(dev.snmpAuthPwd))
				throw new ExIncorrectConnectionSettings("SNMP authentication protocol is not defined");

			OID privProt = null;
			if ("DES".equals(dev.snmpPrivProt))
				privProt = PrivDES.ID;
			else if ("3DES".equals(dev.snmpPrivProt))
				privProt = Priv3DES.ID;
			else if ("AES128".equals(dev.snmpPrivProt))
				privProt = PrivAES128.ID;
			else if ("AES192".equals(dev.snmpPrivProt))
				privProt = PrivAES192.ID;
			else if ("AES256".equals(dev.snmpPrivProt))
				privProt = PrivAES256.ID;
			else if (!GS.isEmpty(dev.snmpPrivProt))
				throw new ExIncorrectConnectionSettings("SNMP privacy protocol is incorrect");

			if (privProt != null && GS.isEmpty(dev.snmpPrivPwd))
				throw new ExIncorrectConnectionSettings("SNMP privacy password is not defined");
			if (privProt == null && !GS.isEmpty(dev.snmpPrivPwd))
				throw new ExIncorrectConnectionSettings("SNMP privacy protocol is not defined");

			int securityLevel;
			if (authProt != null && privProt != null)
				securityLevel = SecurityLevel.AUTH_PRIV;
			else if (authProt != null && privProt == null)
				securityLevel = SecurityLevel.AUTH_NOPRIV;
			else if (authProt == null && privProt == null)
				securityLevel = SecurityLevel.NOAUTH_NOPRIV;
			else
				throw new ExIncorrectConnectionSettings("Couldn't detect SNMP security level");

			USM usm = new USM(SecurityProtocols.getInstance(), new OctetString(MPv3.createLocalEngineID()), 0);
			SecurityModels.getInstance().addSecurityModel(usm);

			usm.addUser(new UsmUser(
					new OctetString(dev.snmpUserName),
					authProt,
					authProt != null ? new OctetString(dev.snmpAuthPwd) : null,
					privProt,
					privProt != null ? new OctetString(dev.snmpPrivPwd) : null));

			m_target = new UserTarget();
			m_target.setAddress(adr);
			m_target.setRetries(2);
			m_target.setTimeout(2000);
			m_target.setVersion(SnmpConstants.version3);
			m_target.setSecurityLevel(securityLevel);
			m_target.setSecurityName(new OctetString(dev.snmpUserName));
		} else {
			m_target = new CommunityTarget();
			m_target.setAddress(adr);
			m_target.setRetries(2);
			m_target.setTimeout(2000);
			m_target.setVersion(dev.snmpVersion == 1 ? SnmpConstants.version1 : SnmpConstants.version2c);
			m_readCommunity = dev.readCommunity;
			m_writeCommunity = dev.writeCommunity;
			readMode();
		}

	}

	public void close() {
		try {
			m_snmp.close();
		} catch (Exception e) {
		}
		try {
			m_transport.close();
		} catch (Exception e) {
		}
	}

	private void readMode() throws ExIncorrectConnectionSettings {
		if (m_target.getVersion() != SnmpConstants.version3) {
			if (GS.isEmpty(m_readCommunity))
				throw new ExIncorrectConnectionSettings("Read community is not defined");
			String a = null;
			if (m_communitySuffix!=null && !m_communitySuffix.isEmpty())
				a= m_readCommunity+ m_communitySuffix;
			else if (m_vlan!=null)
				a=m_readCommunity+"@"+m_vlan;
			else
				a=m_readCommunity;
			
			((CommunityTarget) m_target).setCommunity(new OctetString(a));
		}
	}

	private void writeMode() throws ExIncorrectConnectionSettings {
		if (m_target.getVersion() != SnmpConstants.version3) {
			if (GS.isEmpty(m_writeCommunity))
				throw new ExIncorrectConnectionSettings("Write community is not defined");
			((CommunityTarget) m_target).setCommunity(new OctetString(m_writeCommunity));
		}
	}

	private PDU createPDU() {
		PDU res = null;
		switch (m_target.getVersion()) {
		case SnmpConstants.version1:
			res = new PDUv1();
			break;
		case SnmpConstants.version2c:
			res = new PDU();
			break;
		case SnmpConstants.version3:
			res = new ScopedPDU();
			if (m_context!=null && !m_context.isEmpty())
				((ScopedPDU) res).setContextName(new OctetString(m_context));
			else if (m_vlan != null)
				((ScopedPDU) res).setContextName(new OctetString("vlan-" + m_vlan));
			break;
		}
		return res;
	}

	public void setVlan(Integer vlan) throws ExIncorrectConnectionSettings {
		m_vlan = vlan;
		readMode();
	}
	
	public void setContext(String context){
		m_context = context;
	}
	
	public void setCommunitySuffix(String suffix){
		m_communitySuffix = suffix;
	}

	public String getAddress() {
		return m_target.getAddress().toString();
	}

	public DataList walk(OID base, ValueType valueType) throws Exception {
		// Logger log = new Logger(SNMP.class.getName(), "walk. Host " + GS.getDottedString(st.getTarget().getAddress().toByteArray()));
		// log.debug("Base OID - " + base.toDottedString());

		DataList res = new DataList();
		OID oid = new OID(base);
		PDU pdu = createPDU();
		if (m_target.getVersion() == SnmpConstants.version1) {
			pdu.setType(PDU.GETNEXT);
			// log.debug("GETNEXT");
		} else {
			pdu.setType(PDU.GETBULK);
			pdu.setMaxRepetitions(20);
			// log.debug("GETBULK");
		}
		readMode();
		boolean finish = false;
		while (!finish) {
			pdu.clear();
			pdu.add(new VariableBinding(oid));
			// log.debug("Request OID - " + oid.toDottedString());

			ResponseEvent response = m_snmp.send(pdu, m_target);
			PDU responsePDU = response.getResponse();
			if (responsePDU != null) {
				// log.debug("Response status - " + responsePDU.getErrorStatus());
				if (responsePDU.getErrorStatus() != PDU.noError)
					throw new ExSnmpError("Walk error. Device " + getAddress() + " . " + responsePDU.getErrorStatusText());
				// log.debug("Response size - " + responsePDU.size());
				for (int i = 0; i < responsePDU.size(); i++) {
					if (oid.equals(responsePDU.get(i).getOid())) {
						// log.warn("Repeating response OIDs found! Exit from response loop. Base OID " + base.toDottedString() + " Looped OID " +
						// oid.toDottedString());
						finish = true;
						break;
					}
					oid = responsePDU.get(i).getOid();
					// log.debug("Response OID - " + oid.toDottedString());
					if (!oid.startsWith(base)) {
						finish = true;
						break;
					}
					res.add(new Data(oid, fmtVar(responsePDU.get(i).getVariable(), valueType)));
				}
			} else
				throw new ExSnmpNoResponse("No response from device " + getAddress());
		}
		// log.debug("Result - " + res.size() + " records");
		return res;
	}

	public String get(OID oid, ValueType valueType) throws Exception {
		PDU pdu = createPDU();
		pdu.setType(PDU.GET);
		pdu.add(new VariableBinding(oid));
		readMode();

		String res = null;
		ResponseEvent response = m_snmp.send(pdu, m_target);
		PDU responsePDU = response.getResponse();
		if (responsePDU != null) {
			if (responsePDU.size() > 0 && responsePDU.getErrorStatus() == SnmpConstants.SNMP_ERROR_SUCCESS) {
				Variable v = responsePDU.get(0).getVariable();
				if (!v.isException())
					res = fmtVar(v, valueType);
			}
		} else
			throw new ExSnmpNoResponse("No response from device " + getAddress());

		return res;
	}

	private String fmtVar(Variable v, ValueType t) {
		String res;
		if (ValueType.Mac.equals(t) && v instanceof OctetString)
			res = ((OctetString) v).toHexString(':').toLowerCase();
		else if (ValueType.IP.equals(t) && v instanceof OctetString)
			res = GS.getDottedString(((OctetString) v).toByteArray());
			//res = ((OctetString) v).toString('.', 10); 
		else
			res = v.toString();
		return res;
	}

	public String get(OID oid) throws Exception {
		return get(oid, null);
	}

	public DataList walk(OID base) throws Exception {
		return walk(base, null);
	}

	public void set(OID oid, Variable value) throws Exception {
		PDU pdu = createPDU();
		pdu.setType(PDU.SET);
		pdu.add(new VariableBinding(oid, value));
		writeMode();
		ResponseEvent response = m_snmp.send(pdu, m_target);
		PDU responsePDU = response.getResponse();
		if (responsePDU == null)
			throw new ExSnmpNoResponse("No response from device " + getAddress());
		if (responsePDU.getErrorStatus() != PDU.noError)
			throw new ExSnmpSetError("Can't set value for OID " + oid + " to device " + getAddress());
	}

}