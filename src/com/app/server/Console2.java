package com.app.server;

import java.io.InputStream;
import java.security.Principal;
import java.sql.Connection;
import java.util.concurrent.atomic.AtomicLong;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

import com.app.server.DB.Rows;
import com.app.shared.ConsoleOutputFormatter;
import com.app.shared.GS;
import com.app.shared.ScriptExecuteStatus;

@ServerEndpoint("/console/{type}/{id}")
public class Console2 {

	private Connection m_dbCon;
	private Device m_dev;
	private DeviceConnection m_devCon;
	private DataReceiver m_thread;
	private Session m_session;
	private ConsoleOutputFormatter m_console = new ConsoleOutputFormatter(true);
	private String m_logScript;
	private ScriptExecutor m_exec;
	private long m_lastDataSent;

	private void send(String msg) {
		try {
			m_session.getBasicRemote().sendText(msg);
		} catch (Exception e) {
		}
	}

	private void closeWebSocket() {
		try {
			m_session.close();
		} catch (Exception e) {
		}
	}

	@OnOpen
	public void onOpen(Session session, @PathParam("type") String type, @PathParam("id") String id) {
		try {
			m_session = session;
			session.setMaxIdleTimeout(0);
			Principal usr = session.getUserPrincipal();
			if (usr == null)
				GS.ex("Access denied");

			m_dbCon = DB.getConnection();
			DB.executeProcedure(m_dbCon, "user_auth", usr.getName());

			Rows rows;
			if ("dev".equalsIgnoreCase(type))
				rows = DB.query(m_dbCon, "select id as device_id, case when map_config_devices(map_id) then 'FULL' end as access from devices where id=?",
						GS.getInt(id));
			else
				rows = DB.query(m_dbCon, String.format("select device_id, object_access(object_id) as access from %s_devices where id=?", type), GS.getInt(id));

			if (rows.size() == 0)
				GS.ex("Device is not found in database");

			if (!"FULL".equals(rows.get(0).getStr("ACCESS")))
				GS.ex("Access denied");

			m_dev = new Device(m_dbCon, rows.get(0).getInt("DEVICE_ID"));

			if (m_dev.connectType == null || m_dev.host == null || m_dev.consolePort == null)
				GS.ex("Connection settings is not defined");

			switch (m_dev.connectType) {
			case TELNET:
				m_devCon = new TelnetConnection(m_dev.host, m_dev.consolePort);
				break;
			case SSH:
				if (m_dev.login == null || m_dev.password == null)
					GS.ex("Login or password is not defined");
				m_devCon = new SSHConnection(m_dev.host, m_dev.consolePort, m_dev.login, m_dev.password);
				break;
			}

			m_exec = new ScriptExecutor(null, m_dev, m_dbCon);

			String script = Q.getDeviceScript(m_dbCon, m_dev.id, "console_auth");
			if (script != null) {
				m_exec.setScript(script);
				m_exec.execute(m_devCon);
				if (m_exec.getStatus().equals(ScriptExecuteStatus.ERROR))
					send("Authentication script failed!\r\n");
				send(m_exec.getConsole());
				m_console.put(m_exec.getConsole()); // формируем текст последней строки
			}

			m_logScript = Q.getDeviceScript(m_dbCon, m_dev.id, "console_log");

			m_thread = new DataReceiver();
			m_thread.start();

		} catch (Exception e) {
			send("\r\nError: " + e.getMessage());
			closeWebSocket();
		}
	}

	@OnMessage
	public void onMessage(String message, Session session) {
		try {
			for (byte a : message.getBytes()) {
				if (a == 13 && m_logScript != null) {
					while (System.currentTimeMillis() - m_thread.m_lastDataReceived.get() < 300 ||
							System.currentTimeMillis() - m_lastDataSent < 300) {
						Thread.sleep(10);
					}
					m_exec.setScript(m_logScript);
					m_exec.setVariable("text", m_console.get());
					m_exec.execute(m_devCon);
					if (m_exec.getStatus().equals(ScriptExecuteStatus.ERROR)) {
						send("\r\nError in script for logging work in the console: " + m_exec.getLog().replace("\n", "\r\n") + "\r\n");
						send("\r\nConnection will be closed");
						closeWebSocket();
						break;
					} else {
						String cmd = m_exec.getResult().trim();
						if (!cmd.isEmpty()) {
							DB.executeStatement(m_dbCon,
									"insert into console_log(device_host, device_name, command) values (?,?,?)",
									m_dev.host, m_dev.name, cmd);
						}
					}
				}
				m_devCon.getIn().write(a);
				m_lastDataSent = System.currentTimeMillis();
			}
		} catch (Exception e) {
			send("\r\nAn error occurred while sending data: " + e.getMessage());
			closeWebSocket();
		}

	}

	@OnClose
	public void onClose(Session session) {
		if (m_thread != null) {
			m_thread.interrupt();
			try {
				m_thread.join();
			} catch (InterruptedException e) {
			}
		}
		if (m_devCon != null)
			m_devCon.close();
		if (m_dbCon != null)
			DB.close(m_dbCon);
		if (m_exec != null)
			m_exec.dispose();
	}

	private class DataReceiver extends Thread {
		AtomicLong m_lastDataReceived = new AtomicLong(System.currentTimeMillis());

		@Override
		public void run() {
			try {
				InputStream out = m_devCon.getOut();
				byte[] buf = new byte[1024 * 10];

				while (!isInterrupted()) {
					if (out.available() > 0) {
						int len = out.read(buf);
						String s = new String(buf, 0, len);
						send(s);
						m_console.put(s); 
						m_lastDataReceived.set(System.currentTimeMillis());
					}
					if (System.currentTimeMillis() - m_lastDataReceived.get() > 10 * GS.ONEMINUTE) {
						send("\r\nThe connection is closed, because long time no activity");
						closeWebSocket();
						break;
					}
					Thread.sleep(10);
				}

			} catch (InterruptedException e) {
			} catch (Exception e) {
				send("\r\nError: " + e.getMessage());
				closeWebSocket();
			}
		}
	}

}