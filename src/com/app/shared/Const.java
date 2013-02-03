package com.app.shared;

import java.util.LinkedHashMap;

public class Const {

	public static final LinkedHashMap<String, String> PORT_SPEED = new LinkedHashMap<String, String>() {
		{
			put(PortSpeed.AUTO.toString(), "Auto");
			put(PortSpeed.M10.toString(), "10 Mbps");
			put(PortSpeed.M100.toString(), "100 Mbps");
			put(PortSpeed.G1.toString(), "1 Gbps");
			put(PortSpeed.G10.toString(), "10 Gbps");
		}
	};

	public static final LinkedHashMap<String, String> PORT_DUPLEX = new LinkedHashMap<String, String>() {
		{
			put(PortDuplex.AUTO.toString(), "Auto");
			put(PortDuplex.FULL.toString(), "Full");
			put(PortDuplex.HALF.toString(), "Half");
		}
	};
	public static final String[] SNMP_AUTH_PROT = new String[] { "MD5", "SHA" };
	public static final String[] SNMP_PRIV_PROT = new String[] { "DES", "3DES", "AES128", "AES192", "AES256" };


	public static final int DB_VERSION = 23;
	public static final String APP_VERSION = "2.25";
	public static final String CONTENT_TYPE_TEXT_PLAIN = "text/plain";
	public static final int DEFAULT_PADDING = 10;
	public static final int STORE_CONFIG_DAYS_MAX = 10000;
	public static final int ARCHIVE_DAYS_MAX = 1000;
	public static final int DEFAULT_PASSWORD_LENGTH = 8;

	public static final String CSS_RED_TEXT = "color:red";
	public static final String CSS_RED_BACKGROUND = "background:#ff8080";
	public static final String CSS_RED_BACKGROUND_SELECTED = "background:#e3c5d5";
	public static final String CSS_GREEN_BACKGROUND = "background:#a8ffa3";
	public static final String CSS_GREEN_BACKGROUND_SELECTED = "background:#bdf2cf";
	public static final String CSS_PURPLE_BACKGROUND = "background:#c0bfff";
	public static final String CSS_PURPLE_BACKGROUND_SELECTED = "background:#ccd4ff";
	public static final String CSS_ORANGE_BACKGROUND = "background:#ffd2a8";
	public static final String CSS_ORANGE_BACKGROUND_SELECTED = "background:#e8dbd1";

	public static final String PARAM_FILENAME = "_param_filename";
	public static final String PARAM_CONTENT_TYPE = "_param_content_type";
	public static final String PARAM_REFETCH = "_param_refetch";

	public static final String VAR_LOGIN = "dev_login";
	public static final String VAR_PASSWORD = "dev_pwd";
	public static final String VAR_ENABLEPASSWORD = "dev_enpwd";
	public static final String VAR_DEVICENAME = "dev_name";
	public static final String VAR_DEVICETYPE = "dev_type";
	public static final String VAR_PORT = "dev_port";
	public static final String VAR_SNMP_VER = "dev_snmp_ver";

	public static final int ADMIN_STATUS_UP = 1;
	public static final int ADMIN_STATUS_DOWN = 2;
	public static final int ADMIN_STATUS_TESTING = 3;

}
