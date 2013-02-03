package com.app.shared;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.smartgwt.client.widgets.grid.ListGridRecord;

public class GS {

	public static final int ONESECOND = 1000;
	public static final int ONEMINUTE = ONESECOND * 60;
	public static final int ONEHOUR = ONEMINUTE * 60;
	public static final int ONEDAY = ONEHOUR * 24;
	private static final byte[] KEY = new byte[] { 23, 76, 112, 87, 45, 87, 32, 36, 98, 15, 88 };

	public static Integer getInteger(Object value) {
		if (value == null)
			return null;
		try {
			return Integer.parseInt(value.toString());
		} catch (NumberFormatException e) {
			return null;
		}
	}

	public static int getInt(Object value) {
		if (value == null)
			return 0;
		try {
			return Integer.parseInt(value.toString());
		} catch (NumberFormatException e) {
			return 0;
		}
	}

	public static boolean isInteger(Object value) {
		if (value == null)
			return false;
		try {
			Integer.parseInt(value.toString());
			return true;
		} catch (NumberFormatException e) {
			return false;
		}
	}

	public static boolean isEmpty(String s) {
		return s == null || s.isEmpty();
	}

	public static boolean timeIsValid(String time) {
		try {
			String[] parts = time.split(":");
			if (parts.length != 2)
				GS.ex();
			Integer hh = getInteger(parts[0]);
			Integer mm = getInteger(parts[1]);
			if (hh == null || mm == null)
				GS.ex();
			if (hh < 0 || hh > 23 || mm < 0 || mm > 59)
				GS.ex();
			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public static String long2ip(Long i) {
		if (i == null)
			return null;
		return ((i >> 24) & 0xFF) + "." + ((i >> 16) & 0xFF) + "." + ((i >> 8) & 0xFF) + "." + (i & 0xFF);
	}

	public static Long ip2long(String address, boolean check4octets) {
		if (address == null)
			return null;
		long result = 0L;
		try {
			String[] parts = address.split("\\.");
			if (check4octets && parts.length != 4)
				ex();
			for (String part : parts) {
				result = result << 8;
				int a = Integer.parseInt(part);
				if (a < 0 || a > 255)
					ex();
				result |= a;
			}
		} catch (Exception e) {
			result = 0L;
		}
		return result;
	}
	
	public static Long ip2long(String address) {
		return ip2long(address,true);
	}

	public static boolean isIPinNet(String ip, String netIp, String mask) {
		try {
			long netIp_ = ip2long(netIp);
			long mask_ = ip2long(mask);
			long ip_ = ip2long(ip);

			long netBegin = netIp_ & mask_;
			long netEnd = netIp_ | ~(int) mask_;
			return (ip_ >= netBegin) && (ip_ <= netEnd);
		} catch (Exception e) {
			return false;
		}
	}

	public static String getNet(String ip, String mask) {
		long ip_ = ip2long(ip);
		long mask_ = ip2long(mask);
		long netBegin = ip_ & mask_;
		/*String[] net = long2ip(netBegin).split("\\.");
		int prefLen = maskToPrefixLength(mask);
		if (prefLen > 24)
			return getDottedString(net, 0, 4) + "/" + prefLen;
		else if (prefLen > 16)
			return getDottedString(net, 0, 3) + "/" + prefLen;
		else if (prefLen > 8)
			return getDottedString(net, 0, 2) + "/" + prefLen;
		else
			return getDottedString(net, 0, 1) + "/" + prefLen;*/
		return long2ip(netBegin) + "/" + getMaskLength(mask);
	}

	public static boolean isIPinNet(String ip, String net) {
		try {
			// из строкового представления сети вида 192.168.1/24 нужно получить ip и маску подсети
			String[] a = net.split("/");
			if (a.length != 2)
				ex();
			if (a[0].trim().isEmpty())
				ex();
			String[] b = a[0].split("\\.");
			if (b.length > 4)
				ex();
			String netIp = a[0];
			for (int i = b.length; i < 4; i++)
				netIp += ".0";
			return isIPinNet(ip, netIp, getMaskByLength(Integer.parseInt(a[1])));
		} catch (Exception e) {
			return false;
		}
	}

	public static int getMaskLength(String mask) {
		String bits = "";
		for (String s : mask.split("\\."))
			bits += Integer.toBinaryString(Integer.parseInt(s));
		return bits.replace('0', ' ').trim().length();
	}

	public static String getMaskByLength(int maskLength) {
		String bits = "";
		for (int i = 0; i < 32; i++)
			bits += i < maskLength ? '1' : '0';
		String mask = "";
		for (int i = 0; i < 4; i++)
			mask += (i > 0 ? "." : "") + Integer.parseInt(bits.substring(i * 8, i * 8 + 8), 2);
		return mask;
	}

	public static String commaList(String... list) {
		String result = "";
		for (String el : list)
			result += (result.equals("") ? "" : ",") + el;
		return result;
	}
	
	public static String commaList(int... list) {
		String result = "";
		for (int el : list)
			result += (result.equals("") ? "" : ",") + el;
		return result;
	}
	
	public static String commaList(String field, ListGridRecord... gridRecords){
		String result = "";
		for (ListGridRecord el : gridRecords)
			result += (result.equals("") ? "" : ",") + el.getAttributeAsString(field);
		return result;
	}
	
	public static int[] getArrayInt(String field, ListGridRecord... gridRecords){
		int[] result = new int[gridRecords.length];
		for (int i=0; i<gridRecords.length; i++){
			result[i] = gridRecords[i].getAttributeAsInt(field);
		}		
		return result;
	}

	public static <T> T[] getArray(T firstElement, T[] nextElements) {
		List<T> list = new ArrayList<T>();
		list.add(firstElement);
		for (T el : nextElements)
			list.add(el);
		return list.toArray(nextElements);
	}

	public static <T> T[] getArray(T[] firstElements, T lastElement) {
		List<T> list = new ArrayList<T>();
		for (T el : firstElements)
			list.add(el);
		list.add(lastElement);
		return list.toArray(firstElements);
	}

	public static String byteArrayToHexString(byte[] bytes) {
		final char[] hexArray = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F' };
		char[] hexChars = new char[bytes.length * 2];
		int v;
		for (int j = 0; j < bytes.length; j++) {
			v = bytes[j] & 0xFF;
			hexChars[j * 2] = hexArray[v >>> 4];
			hexChars[j * 2 + 1] = hexArray[v & 0x0F];
		}
		return new String(hexChars);
	}

	public static byte[] hexStringToByteArray(String s) {
		int len = s.length();
		byte[] data = new byte[len / 2];
		for (int i = 0; i < len; i += 2) {
			data[i / 2] = (byte) ((Character.digit(s.charAt(i), 16) << 4)
					+ Character.digit(s.charAt(i + 1), 16));
		}
		return data;
	}

	public static String encode(Object text) {
		if (text == null)
			return null;
		try {
			byte[] bytes = text.toString().getBytes("UTF-8");
			for (int i = 0, j = 0; i < bytes.length; i++) {
				bytes[i] += KEY[j++];
				if (j == KEY.length)
					j = 0;
			}
			return byteArrayToHexString(bytes);
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		} catch (Exception e) {
			return null;
		}
	}

	public static String decode(Object text) {
		if (text == null)
			return null;
		try {
			byte[] bytes = hexStringToByteArray(text.toString());
			for (int i = 0, j = 0; i < bytes.length; i++) {
				bytes[i] -= KEY[j++];
				if (j == KEY.length)
					j = 0;
			}
			return new String(bytes, "UTF-8");
		} catch (UnsupportedEncodingException e) {
			throw new RuntimeException(e);
		} catch (Exception e) {
			return null;
		}
	}

	public static boolean isEqual(Object a, Object b) {
		return (a == null && b == null) || (a != null && b != null && a.equals(b));
	}

	public static String getFileExtension(String fileName) {
		String extension = "";
		int i = fileName.lastIndexOf('.');
		int p = Math.max(fileName.lastIndexOf('/'), fileName.lastIndexOf('\\'));
		if (i > p)
			extension = fileName.substring(i + 1);
		return extension;
	}

	public static void ex(String msg) throws Exception {
		throw new Exception(msg);
	}

	public static void ex() throws Exception {
		throw new Exception();
	}

	public static String getDottedString(String[] nums, int offset, int length) {
		StringBuilder sb = new StringBuilder();
		for (int i = offset; i < offset + length; i++) {
			if (i > offset)
				sb.append('.');
			sb.append(nums[i]);
		}
		return sb.toString();
	}

	public static String getDottedString(byte[] nums, int offset, int length) {
		StringBuilder sb = new StringBuilder();
		for (int i = offset; i < offset + length; i++) {
			if (i > offset)
				sb.append('.');
			sb.append(nums[i] & 0xFF);
		}
		return sb.toString();
	}

	public static String getDottedString(byte[] nums, int lastNums) {
		return getDottedString(nums, nums.length - lastNums, lastNums);
	}

	public static String getDottedString(byte[] nums) {
		return getDottedString(nums, 0, nums.length);
	}

	public static boolean contains(String value, String[] list) {
		for (String v : list)
			if (v.equals(value))
				return true;
		return false;
	}

	public static String generateRandomString(int length, String chars) {
		// большую О и ноль не используем, т.к. они визуально очень похожи, чтобы лишний раз никто не путался
		char[] symbols = chars.toCharArray();
		String pass = "";
		Random rnd = new Random();
		while (pass.length() < length)
			pass += symbols[rnd.nextInt(symbols.length)];
		return pass;
	}

	public static String generateRandomString(int length) {
		return generateRandomString(length, "ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789");
	}

	public static String nvl(String a, String b) {
		return a != null ? a : b;
	}

	public static boolean netIsCorrect(String net) {
		// проверяет корректность указанной сети
		try {
			String[] x = net.split("/");

			if (x.length != 2)
				ex();

			int maskLength = getInt(x[1]);

			if (maskLength <= 0 || maskLength > 32)
				ex();

			if (x[0] == null || x[0].equals(""))
				ex();

			if (ip2long(x[0]) == 0L)
				ex();

			// указанный айпи должен быть адресом сети, т.е. первым адресом в сети, накладываем маску и проверяем это
			long ip_ = ip2long(x[0]);
			long mask_ = ip2long(GS.getMaskByLength(maskLength));
			long netBegin = ip_ & mask_;

			if (ip_ != netBegin)
				ex();

			return true;
		} catch (Exception e) {
			return false;
		}
	}

	public static class NetInfo {
		public String startIP;
		public int maskLength;
	}

	public static NetInfo parseNet(String net) throws IllegalArgumentException {
		if (!netIsCorrect(net))
			throw new IllegalArgumentException("Invalid network description: " + net);
		
		String[] x = net.split("/");		
		NetInfo result = new NetInfo();
		result.startIP = x[0];
		result.maskLength = getInt(x[1]);
		return result;
	}
}
