package com.app.server;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.io.UnsupportedEncodingException;
import java.text.ParseException;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.io.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.hsqldb.jdbc.JDBCClobClient;
import org.xbill.DNS.Lookup;
import org.xbill.DNS.Name;
import org.xbill.DNS.PTRRecord;
import org.xbill.DNS.Record;
import org.xbill.DNS.ReverseMap;
import org.xbill.DNS.Type;

import com.app.server.DB.Row;
import com.app.server.DB.Rows;
import com.app.shared.GS;
import com.app.shared.Interval;
import com.app.shared.exceptions.ExFileIsNotExcel;
import com.app.shared.i18n.UIMsg;
import com.app.shared.i18n.UIStr;
import com.ibm.icu.text.SimpleDateFormat;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.log.Logger;
import com.mattbertolini.hermes.Hermes;

public class G {
	private static Logger m_log = new Logger(G.class.getName());
	private static Map<String, UIMsg> m_UIMsgCache = new HashMap<String, UIMsg>();
	private static Map<String, UIStr> m_UIStrCache = new HashMap<String, UIStr>();
	private static final SimpleDateFormat DATEFMT = new SimpleDateFormat("dd.MM.yyyy");
	public static int initCC = 3;
	public static int initDM = 3;
	public static int initPM = 24;

	static {
		// generateI18NConstantsMethods();
	}

	public enum LicState {
		LICENSED, UNLICENSED, DEMO
	};

	public static String clientName;

	public static class CC {
		static int qty = initCC;
		static LicState state = LicState.UNLICENSED;
		static Date expires;
	}

	public static class DM {
		static int qty = initDM;
		static LicState state = LicState.UNLICENSED;
		static Date expires;
	}

	public static class PM {
		static int qty = initPM;
		static LicState state = LicState.UNLICENSED;
		static Date expires;
	}

	public static class SP {
		static Date expires;
	}

	public static void checkLicenses() {
		if (CC.expires != null && System.currentTimeMillis() > (CC.expires.getTime() + GS.ONEDAY)) {
			CC.state = LicState.UNLICENSED;
			CC.expires = null;
			CC.qty = initCC;
		}
		if (DM.expires != null && System.currentTimeMillis() > (DM.expires.getTime() + GS.ONEDAY)) {
			DM.state = LicState.UNLICENSED;
			DM.expires = null;
			DM.qty = initDM;
		}
		if (PM.expires != null && System.currentTimeMillis() > (PM.expires.getTime() + GS.ONEDAY)) {
			PM.state = LicState.UNLICENSED;
			PM.expires = null;
			PM.qty = initPM;
		}
		if (SP.expires != null && System.currentTimeMillis() > (SP.expires.getTime() + GS.ONEDAY)) {
			SP.expires = null;
		}
		if (G.CC.state.equals(LicState.UNLICENSED) &&
				G.DM.state.equals(LicState.UNLICENSED) &&
				G.PM.state.equals(LicState.UNLICENSED) &&
				G.SP.expires == null)
			G.clientName = null;
	}

	public static String getLocale(HttpServletRequest req) {
		Cookie[] cookies = req.getCookies();
		if (cookies != null) {
			for (Cookie c : cookies)
				if ("locale".equals(c.getName()))
					return c.getValue();
		}
		return "en";
	}

	public static UIMsg getUIMsg(HttpServletRequest req) throws IOException {
		String locale = getLocale(req);
		synchronized (m_UIMsgCache) {
			if (!m_UIMsgCache.containsKey(locale))
				m_UIMsgCache.put(locale, Hermes.get(UIMsg.class, locale));
			return m_UIMsgCache.get(locale);
		}
	}

	public static UIStr getUIStr(HttpServletRequest req) throws IOException {
		String locale = getLocale(req);
		synchronized (m_UIStrCache) {
			if (!m_UIStrCache.containsKey(locale))
				m_UIStrCache.put(locale, Hermes.get(UIStr.class, locale));
			return m_UIStrCache.get(locale);
		}
	}

	public static String getFromOldValues(DSRequest req, String fieldName/*Class<?> beanClass*/) {
		String result = null;
		Map<?, ?> oldValues = req.getOldValues();

		if (oldValues != null) {
			/*
			String nameField = null;
			for (Field f : beanClass.getDeclaredFields()) {
				if (f.isAnnotationPresent(NameField.class)) {
					nameField = f.getName();
					break;
				}
			}
			if (nameField != null)
				result = oldValues.get(nameField).toString();
				*/
			result = oldValues.get(fieldName).toString();
		}
		return result;
	}

	public static String getString(Object o) {
		String result = null;
		try {
			if (o == null)
				result = null;
			else if (o instanceof InputStream)
				result = IOUtils.toString((InputStream) o);
			else if (o instanceof Reader)
				result = IOUtils.toString((Reader) o);
			else if (o instanceof JDBCClobClient)
				result = IOUtils.toString(((JDBCClobClient) o).getCharacterStream());
			else
				result = o.toString();
		} catch (Exception e) {
			result = null;
			m_log.error("getString error. ", e);
		}
		return result;
	}

	public static Properties getServerProperties() throws IOException {
		Properties props = new Properties();
		props.load(G.class.getResourceAsStream("/server.properties"));
		return props;
	}

	public static void generateI18NConstantsMethods() {
		try {
			Properties p = new Properties();
			p.load(G.class.getResourceAsStream("/com/app/shared/i18n/UIStr.properties"));
			Iterator<Object> iterator = p.keySet().iterator();
			while (iterator.hasNext())
				System.out.println("String " + iterator.next().toString() + "();");
		} catch (Exception e) {
			System.err.println("generateI18NConstantsMethods exception: " + e.toString());
		}
	}

	public static Date getIncrementedDate(Date date, Interval interval) {
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		switch (interval.getType()) {
		case HOUR:
			cal.add(Calendar.HOUR_OF_DAY, interval.getHours());
			break;
		case DAYTIME:
			cal.add(Calendar.DATE, interval.getDays());
			String[] time = interval.getTime().split(":");
			cal.set(Calendar.HOUR_OF_DAY, Integer.parseInt(time[0]));
			cal.set(Calendar.MINUTE, Integer.parseInt(time[1]));
			cal.set(Calendar.SECOND, 0);
			break;
		}
		return cal.getTime();
	}

	public static void interruptAndJoin(Thread t) {
		t.interrupt();
		try {
			t.join(GS.ONESECOND * 5);
		} catch (InterruptedException e) {
		}
	}

	public static String dateToString(Date date) {
		return date == null ? null : DATEFMT.format(date);
	}

	public static Date stringToDate(String str) {
		try {
			return str != null && !str.isEmpty() && !str.equals("-") ? DATEFMT.parse(str) : null;
		} catch (ParseException e) {
			return null;
		}
	}

	public static String k1(String s) {
		byte[] b = s.getBytes();
		return new String(new byte[] { b[8], b[4], b[9], b[0], b[3], b[1], b[2], b[6], b[7], b[4], b[8], b[2], b[5], b[9], b[2], b[1] });
	}

	public static String k2(String s) {
		byte[] b = s.getBytes();
		return new String(new byte[] { b[2], b[8], b[6], b[9], b[4], b[3], b[7], b[0], b[4], b[3], b[7], b[9], b[1], b[3], b[8], b[6] });
	}

	public static String getHostNameByIP(String ip) {
		try {
			Name name = ReverseMap.fromAddress(ip);
			Record[] records = new Lookup(name, Type.PTR).run();
			if (records == null)
				return null;
			PTRRecord ptr = (PTRRecord) records[0];
			String dnsName = ptr.getTarget().toString(true);

			try {
				StringBuilder sb = new StringBuilder();
				byte[] buf = new byte[1000];
				int bufPos = 0;
				String num = null;

				for (char ch : dnsName.toCharArray()) {
					if (ch == '\\') {
						if (num != null && num.length() > 0)
							buf[bufPos++] = (byte) (Integer.parseInt(num) & 0xFF);
						num = "";
						continue;
					}
					if (num != null) {
						if (num.length() < 3)
							num += ch;

						if (num.length() == 3) {
							buf[bufPos++] = (byte) (Integer.parseInt(num) & 0xFF);
							num = null;
						}
					} else {
						if (bufPos > 0) {
							sb.append(new String(buf, 0, bufPos, "UTF-8"));
							bufPos = 0;
						}
						sb.append(ch);
					}

				}

				return sb.toString();
			} catch (Exception e) {
				return dnsName;
			}

		} catch (Exception e) {
			return null;
		}
	}

	public static Rows loadExcelFile(InputStream input, String fileExtension) throws Exception {
		Map<Integer, String> fields = new HashMap<Integer, String>();
		Rows result = new Rows();
		Workbook workbook = null;
		if (fileExtension.equalsIgnoreCase("xls"))
			workbook = new HSSFWorkbook(input);
		else if (fileExtension.equalsIgnoreCase("xlsx"))
			workbook = new XSSFWorkbook(input);
		else
			throw new ExFileIsNotExcel("File is not excel. File extension: " + fileExtension);
		try {
			Sheet sheet = workbook.getSheetAt(0);
			Iterator<org.apache.poi.ss.usermodel.Row> rowIterator = sheet.iterator();

			while (rowIterator.hasNext()) {
				org.apache.poi.ss.usermodel.Row row = rowIterator.next();
				Iterator<Cell> cellIterator = row.cellIterator();
				Row r = new Row();
				while (cellIterator.hasNext()) {
					Cell cell = cellIterator.next();
					int colIdx = cell.getColumnIndex();
					int rowIdx = cell.getRowIndex();
					Object value = null;
					switch (cell.getCellType()) {
					case Cell.CELL_TYPE_STRING:
						value = cell.getStringCellValue();
						break;
					case Cell.CELL_TYPE_NUMERIC:
						if (cell.getCellStyle().getDataFormatString().toUpperCase().contains("YY"))
							value = cell.getDateCellValue();
						else
							value = cell.getNumericCellValue();
						break;
					}

					if (rowIdx == 0)
						fields.put(colIdx, value.toString());
					else {
						String field = fields.get(colIdx);
						if (field != null)
							r.put(field, value);
					}
				}
				if (r.size() > 0)
					result.add(r);
			}
		} finally {
			workbook.close();
		}
		return result;
	}

	

	

	public static String md5(String str) {
		try {
			java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
			byte[] array = md.digest(str.getBytes());
			StringBuffer sb = new StringBuffer();
			for (int i = 0; i < array.length; i++) {
				sb.append(Integer.toHexString((array[i] & 0xFF) | 0x100).substring(1, 3));
			}
			return sb.toString();
		} catch (java.security.NoSuchAlgorithmException e) {
		}
		return str;
	}

	public static String enc(String k1, String k2, String value) throws Exception {
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		cipher.init(Cipher.ENCRYPT_MODE, new SecretKeySpec(k1.getBytes("UTF-8"), "AES"), new IvParameterSpec(k2.getBytes("UTF-8")));
		return new String(Base64.encodeBase64(cipher.doFinal(value.getBytes("UTF-8"))), "UTF-8");
	}

	public static String dec(String k1, String k2, String value) throws Exception {
		Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5PADDING");
		cipher.init(Cipher.DECRYPT_MODE, new SecretKeySpec(k1.getBytes("UTF-8"), "AES"), new IvParameterSpec(k2.getBytes("UTF-8")));
		return new String(cipher.doFinal(Base64.decodeBase64(value.getBytes("UTF-8"))), "UTF-8");
	}

	public static String formatMap(Map map, boolean nullAsEmptyString) {
		StringBuilder sb = new StringBuilder();
		if (map != null) {
			Iterator it = map.keySet().iterator();
			while (it.hasNext()) {
				Object key = it.next();
				Object value = map.get(key);
				sb.append(String.format("%s = %s\n", String.valueOf(key), (value == null && nullAsEmptyString) ? "" : String.valueOf(value)));
			}
		}
		return sb.toString();
	}

	private static final byte[] a = new byte[] { 106, 97, 118, 97, 46, 104, 111, 109, 101 };
	private static final byte[] b = new byte[] { 102, 105, 108, 101, 46, 115, 101, 112, 97, 114, 97, 116, 111, 114 };
	private static final byte[] c = new byte[] { 98, 105, 110 };

	public static String getServerId() {
		String id = Long.toString(new File(System.getProperty(new String(a)) + System.getProperty(new String(b)) + new String(c)).lastModified());
		for (int i = 0; i < 55; i++)
			id = G.md5(id);
		return new String(new char[] {
				id.charAt(7),
				id.charAt(3),
				id.charAt(28),
				id.charAt(15),
				id.charAt(5),
				id.charAt(23),
				id.charAt(30),
				id.charAt(8),
				id.charAt(19),
				id.charAt(11) });
	}

	public static boolean applyLicense(String module, String key) {
		boolean result = true;
		try {
			String srvId = getServerId();
			String[] parts = dec(k1(srvId), k2(srvId), key).split(";");
			if (parts.length != 4)
				GS.ex();
			if (G.clientName != null && !parts[0].equals(G.clientName))
				GS.ex();
			if (!parts[1].equals(module))
				GS.ex();
			Date expires = stringToDate(parts[3]);
			if (expires != null && System.currentTimeMillis() > (expires.getTime() + GS.ONEDAY))
				GS.ex();

			G.clientName = parts[0];
			if ("CC".equals(module)) {
				CC.qty = GS.getInt(parts[2]);
				CC.expires = expires;
				CC.state = expires == null ? LicState.LICENSED : LicState.DEMO;
			} else if ("DM".equals(module)) {
				DM.qty = GS.getInt(parts[2]);
				DM.expires = expires;
				DM.state = expires == null ? LicState.LICENSED : LicState.DEMO;
			} else if ("PM".equals(module)) {
				PM.qty = GS.getInt(parts[2]);
				PM.expires = expires;
				PM.state = expires == null ? LicState.LICENSED : LicState.DEMO;
			} else if ("SP".equals(module)) {
				SP.expires = expires;
			}
		} catch (Exception e) {
			result = false;
		}
		return result;

	}

	public static String encodeBase64(String a) throws UnsupportedEncodingException {
		return new String(Base64.encodeBase64(a.getBytes("UTF-8")), "UTF-8");
	}

	public static String utf8mail(String a) throws UnsupportedEncodingException {
		return "=?utf-8?B?" + G.encodeBase64(a) + "?=";
	}

}
