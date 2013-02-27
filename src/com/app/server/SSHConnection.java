package com.app.server;

import java.io.InputStream;
import java.io.OutputStream;

import com.app.shared.exceptions.ExConnectionFailed;

import ch.ethz.ssh2.Connection;
import ch.ethz.ssh2.InteractiveCallback;
import ch.ethz.ssh2.Session;

public class SSHConnection implements DeviceConnection {

	private Connection m_con;
	private InputStream m_out;
	private OutputStream m_in;
	private Session m_ses;

	public SSHConnection(String host, Integer port, String login, final String pwd) throws Exception {
		if (host == null)
			throw new IllegalArgumentException("Host not defined");
		if (login == null)
			throw new IllegalArgumentException("Login not defined");
		if (pwd == null)
			throw new IllegalArgumentException("Password not defined");
		if (port == null)
			port = 22;

		m_con = new Connection(host, port);
		try {
			m_con.connect(null, 10000, 10000);
		} catch (Exception e) {
			throw new ExConnectionFailed("Connection failed. Host " + host + " Port " + port);
		}
		try {
			boolean conn = false;
			if (m_con.isAuthMethodAvailable(login, "password"))
				conn = m_con.authenticateWithPassword(login, pwd);

			if (!conn && m_con.isAuthMethodAvailable(login, "keyboard-interactive")) {
				conn = m_con.authenticateWithKeyboardInteractive(login, new InteractiveCallback() {
					@Override
					public String[] replyToChallenge(String name, String instruction, int numPrompts, String[] prompt, boolean[] echo) throws Exception {
						String[] result = new String[numPrompts];
						for (int i = 0; i < numPrompts; i++)
							result[i] = pwd;
						return result;
					}
				});

			}

			if (!conn)
				throw new ExConnectionFailed("Authentication failed");

			m_ses = m_con.openSession();
			//m_ses.requestDumbPTY();
			m_ses.requestPTY("xterm", 80, 24, 0, 0, null);
			m_ses.startShell();

			m_out = m_ses.getStdout();
			m_in = m_ses.getStdin();

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
			m_ses.close();
		} catch (Exception e) {
		}
		try {
			m_con.close();
		} catch (Exception e) {
		}
	}

}
