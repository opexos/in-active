package com.app.server;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.SQLException;

import com.app.shared.ConsoleOutputFormatter;
import com.app.shared.GS;
import com.app.shared.ScriptExecuteStatus;
import com.app.shared.exceptions.ExIncorrectConnectionSettings;

public class Console {
	private static Integer m_generator = 1;
	private String m_consoleId;
	private String m_sessionId;
	private String m_userId;
	private Device m_dev;
	private DeviceConnection m_con;
	private Thread m_thread;
	private StringBuffer m_data = new StringBuffer();
	private ConsoleOutputFormatter m_console = new ConsoleOutputFormatter(false);
	private int m_pos = 0;
	private long m_lastGetData;
	private boolean m_closed = false;

	private static Integer getNextNum() {
		synchronized (m_generator) {
			return m_generator++;
		}
	}

	public Console(String userId, String sessionId, Device dev, Connection con) throws Exception {
		if (dev.connectType == null || dev.host == null || dev.consolePort == null)
			throw new ExIncorrectConnectionSettings();

		switch (dev.connectType) {
		case TELNET:
			m_con = new TelnetConnection(dev.host, dev.consolePort);
			break;
		case SSH:
			if (dev.login == null || dev.password == null)
				throw new ExIncorrectConnectionSettings();
			m_con = new SSHConnection(dev.host, dev.consolePort, dev.login, dev.password);
			break;
		}
		String script = Q.getDeviceScript(con, dev.id, "console_auth");
		if (script != null) {
			ScriptExecutor d = new ScriptExecutor(script, dev, con);
			try {
				d.execute(m_con);
				if (d.getStatus().equals(ScriptExecuteStatus.ERROR))
					m_data.append("Authentication script failed!\n\n");
				m_data.append(d.getConsole());
			} finally {
				d.dispose();
			}
		}
		m_consoleId = "con" + getNextNum();
		m_sessionId = sessionId;
		m_userId = userId;
		m_dev = dev;
		m_thread = new DataReceiver();
		m_thread.start();
	}

	public String getConsoleId() {
		return m_consoleId;
	}

	public String getSessionId() {
		return m_sessionId;
	}

	public void close() {
		if (m_thread != null)
			m_thread.interrupt();
	}

	public boolean isClosed() {
		return m_closed;
	}

	private class DataReceiver extends Thread {
		@Override
		public void run() {
			try {
				long lastDataReceived = System.currentTimeMillis();
				m_lastGetData = System.currentTimeMillis(); 
				InputStream out = m_con.getOut();
				byte[] buf = new byte[1024 * 10];

				while (!isInterrupted()) {
					if (out.available() > 0) {
						int len = out.read(buf);
						String s = new String(buf, 0, len);
						m_data.append(s);
						catchUserCommands(s);
						lastDataReceived = System.currentTimeMillis();
					}
					if ((System.currentTimeMillis() - lastDataReceived > 10 * GS.ONEMINUTE) ||
							(System.currentTimeMillis() - m_lastGetData > GS.ONEMINUTE)) {
						m_data.append("\n\nThe connection is closed, because long time no activity");
						break;
					}
					Thread.sleep(10);
				}

			} catch (InterruptedException | IOException e) {
				m_data.append("\n\nThe connection is closed");
			} catch (SQLException e) {
				m_data.append("\n\nDatabase access error");
			} catch (Exception e) {
				m_data.append("\n\nError: " + e.getMessage());
			} finally {
				m_closed = true;
				m_con.close();
			}
		}
	}

	public long getLastGetData() {
		return m_lastGetData;
	}

	public void send(String data) {
		try {
			m_con.getIn().write(data.getBytes());
		} catch (Exception e) {
			close();
		}
	}

	public String getData() {
		String result = m_data.substring(m_pos);
		m_pos += result.length();
		m_lastGetData = System.currentTimeMillis();
		return result;
	}

	private void catchUserCommands(String s) throws SQLException {
		m_console.put(s);
		String line;
		while ((line = m_console.getNextLine()) != null) {
			int x = line.indexOf("#");
			if (x >= 0 && line.substring(0, x).toLowerCase().indexOf("description") == -1) {
				String cmd = line.substring(x + 1).trim();
				if (!cmd.isEmpty()) {
					Connection con = DB.getConnection();
					try {
						DB.executeProcedure(con, "user_auth", m_userId);
						DB.executeStatement(con,
								"insert into console_log(device_host, device_name, command) values (?,?,?)",
								m_dev.host, m_dev.name, cmd);

					} finally {
						DB.close(con);
					}
				}
			}
		}
	}

}
