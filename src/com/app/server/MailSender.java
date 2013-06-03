package com.app.server;

import java.io.PrintWriter;
import java.io.Writer;
import java.net.UnknownHostException;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.io.output.StringBuilderWriter;
import org.apache.commons.net.PrintCommandListener;
import org.apache.commons.net.smtp.SMTPClient;
import org.apache.commons.net.smtp.SMTPReply;
import org.apache.commons.net.smtp.SMTPSClient;
import org.apache.commons.net.smtp.SimpleSMTPHeader;

import com.app.server.DB.Row;
import com.app.shared.GS;
import com.app.shared.SmtpSecure;
import com.isomorphic.log.Logger;

public class MailSender implements ServletContextListener {

	private Logger m_log = new Logger(this.getClass().getName());
	private Thread m_thread;

	public void contextInitialized(ServletContextEvent sce) {

		m_log.debug("Create and start thread");
		m_thread = new Thread() {
			@Override
			public void run() {
				m_log.debug("Thread started");
				setName("Mail sender");
				while (!isInterrupted()) {
					try {
						sleep(GS.ONEMINUTE);
						process();
					} catch (InterruptedException e) {
						break; // выходим из цикла
					} catch (Exception e) {
						m_log.error("Mail sender error. ", e);
					}
				}
				m_log.debug("Thread finished");
			}
		};
		m_thread.start();
	}

	public void contextDestroyed(ServletContextEvent sce) {
		m_log.debug("Context destroyed. Interupt thread and wait end of execution.");
		G.interruptAndJoin(m_thread);
	}

	private void process() throws Exception {
		Connection con = DB.getConnection();
		try {
			Map smtp = getSmtpSettings(con);
			if (smtp.size() > 0) {
				for (Row mail : DB.query(con, "select * from mail where processed is null or " +
						"(last_error is not null and error_count<24 and localtimestamp-processed>1 hour)")) {
					Map res = sendEmail(mail.getStr("RECEIVERS"), mail.getStr("SUBJECT"), mail.getStr("BODY"), smtp);
					if ((boolean) res.get("OK"))
						DB.executeStatement(con, "update mail set processed=localtimestamp,last_error=null,error_count=null where id=?", mail.getInt("ID"));
					else
						DB.executeStatement(con, "update mail set processed=localtimestamp,last_error=?,error_count=coalesce(error_count,0)+1 where id=?",
								res.get("MSG"), mail.getInt("ID"));
				}
			}
		} finally {
			DB.close(con);
		}
	}
	
	public static Map getSmtpSettings(Connection con) throws SQLException {
		Map m = new HashMap();
		for (Row r : DB.query(con, "select * from params where name like 'SMTP_%'"))
			m.put(r.get("NAME"), r.get("VAL"));
		return m;
	}
	
	public static Map sendEmail(String receivers, String subject, String body, Map<String, String> smtp) {
		StringBuilderWriter log = new StringBuilderWriter();
		Map res = new HashMap();
		String _secure = smtp.get("SMTP_SECURE");
		String _adr = smtp.get("SMTP_ADR");
		String _port = smtp.get("SMTP_PORT");
		String _sender = smtp.get("SMTP_SENDER");
		String _auth = smtp.get("SMTP_AUTH");
		String _pwd = smtp.get("SMTP_PWD");
		try {

			SmtpSecure secure = _secure == null ? null : SmtpSecure.valueOf(_secure);
			if (secure == null)
				log.append("Incorrect connection secure method\n");
			if (_adr == null || _adr.trim().isEmpty())
				log.append("Empty server address\n");
			int port = GS.getInt(_port);
			if (port <= 0 || port > 65535)
				log.append("Incorrect port\n");
			if (_sender == null || _sender.trim().isEmpty())
				log.append("Empty sender email\n");
			boolean auth = Boolean.parseBoolean(_auth);
			if (auth && (_pwd == null || _pwd.trim().isEmpty()))
				log.append("Authentication required, but password is empty\n");

			if (log.getBuilder().length() > 0)
				GS.ex("Incorrect SMTP server connection settings");

			SMTPClient client;
			if (SmtpSecure.NONE.equals(secure)) {
				client = new SMTPClient();
			} else {
				client = new SMTPSClient(SmtpSecure.SSLTLS.equals(secure));
			}
			client.addProtocolCommandListener(new PrintCommandListener(new PrintWriter(log), true));
			client.setDefaultTimeout(5000);
			client.connect(_adr, port);

			if (!SMTPReply.isPositiveCompletion(client.getReplyCode())) {
				client.disconnect();
				GS.ex("SMTP server refused connection.");
			}

			if (SmtpSecure.STARTTLS.equals(secure)) {
				if (!((SMTPSClient) client).execTLS()) {
					client.disconnect();
					GS.ex("STARTTLS command failed");
				}
			}

			client.login();

			if (auth) {
				client.sendCommand("AUTH LOGIN");
				client.sendCommand(G.encodeBase64(_sender));
				client.sendCommand(G.encodeBase64(_pwd));
				if (!SMTPReply.isPositiveCompletion(client.getReplyCode())) {
					client.logout();
					client.disconnect();
					GS.ex("Authentication failed");
				}
			}

			client.setSender(_sender);
			StringBuilder rcvrs = new StringBuilder();
			for (String a : receivers.split(",")) {
				a = a.trim();
				int b = a.indexOf("<");
				int c = a.indexOf(">");
				if (rcvrs.length() > 0)
					rcvrs.append(",");
				if (b >= 0 && c >= 0) {
					rcvrs.append(G.utf8mail(a.substring(0, b).trim()));
					rcvrs.append(" ");
					rcvrs.append(a.substring(b));
					a = a.substring(b + 1, c);
				} else {
					rcvrs.append(a);
				}
				if (!client.addRecipient(a)) {
					client.logout();
					client.disconnect();
					GS.ex("Add recipient command failed");
				}

			}

			Writer writer = client.sendMessageData();

			if (writer == null) {
				client.logout();
				client.disconnect();
				GS.ex("Send mail data failed");
			}

			SimpleSMTPHeader header = new SimpleSMTPHeader("IN Active <" + _sender + ">", rcvrs.toString(), G.utf8mail(subject));
			header.addHeaderField("Content-Type", "text/html; charset=\"utf-8\"");
			header.addHeaderField("Content-Transfer-Encoding", "base64");
			writer.write(header.toString());
			writer.write(G.encodeBase64("<html><body>" + body + "</body></html>"));
			writer.close();
			if (!client.completePendingCommand()) {
				client.logout();
				client.disconnect();
				GS.ex("Send mail data failed");
			}

			client.logout();
			client.disconnect();
			res.put("OK", true);

		} catch (UnknownHostException e) {
			res.put("OK", false);
			res.put("MSG", "Unknown host: " + _adr);
		} catch (Exception e) {
			res.put("OK", false);
			res.put("MSG", e.getMessage() + "\n" + log.toString());
		}
		return res;

	}	

}