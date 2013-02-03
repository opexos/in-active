package com.app.server;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.net.Socket;

import com.app.shared.exceptions.ExConnectionFailed;

public class TelnetConnection implements DeviceConnection {

	private Socket m_socket;
	private InputStream m_out;
	private OutputStream m_in;

	public TelnetConnection(String host, Integer port) throws Exception {
		if (host == null)
			throw new IllegalArgumentException("Host not defined");
		if (port == null)
			port = 23;

		m_socket = new Socket();
		try {
			m_socket.connect(new InetSocketAddress(host, port), 10000);
		} catch (Exception e) {
			throw new ExConnectionFailed("Connection failed. Host " + host + " Port " + port);
		}
		try {
			m_out = m_socket.getInputStream();
			m_in = m_socket.getOutputStream();

			long start = System.currentTimeMillis();
			while (m_out.available() == 0) {
				if (System.currentTimeMillis() - start > 10000)
					throw new ExConnectionFailed("The connection was successful, but there is no data received from the device");
				Thread.sleep(100);
			}
		} catch (Exception e) {
			close();
			throw e;
		}
	}

	@Override
	public InputStream getOut() {
		return m_out;
	}

	@Override
	public OutputStream getIn() {
		return m_in;
	}

	@Override
	public void close() {
		try {
			m_in.close();
		} catch (Exception e) {
		}
		try {
			m_out.close();
		} catch (Exception e) {
		}
		try {
			m_socket.close();
		} catch (Exception e) {
		}
	}

}
