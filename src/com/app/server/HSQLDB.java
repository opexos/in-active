package com.app.server;

import java.io.File;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Date;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.hsqldb.Server;
import org.hsqldb.lib.tar.DbBackupMain;
import org.hsqldb.persist.HsqlProperties;

import com.app.shared.Const;
import com.app.shared.GS;
import com.isomorphic.log.Logger;

public class HSQLDB implements ServletContextListener {

	private Logger m_log = new Logger(this.getClass().getName());
	private Server m_server;
	private static String m_acl = "acl.txt";
	private Thread m_backupThread;

	public void contextInitialized(ServletContextEvent sce) {
		try {
			ServletContext context = sce.getServletContext();

			File appPath = new File(context.getRealPath(""));
			File dbPathInSrv = new File(appPath.getParentFile().getParent(), "in-db");
			File backupPath = new File(appPath.getParentFile().getParent(), "in-db-backup");
			File dbPathInApp = new File(appPath, "WEB-INF/in-db");

			if (!dbPathInSrv.exists()) {
				if (!dbPathInApp.exists())
					GS.ex("Database not found at " + dbPathInSrv.getPath() + " and " + dbPathInApp.getPath());
				FileUtils.moveDirectory(dbPathInApp, dbPathInSrv);
			}

			if (dbPathInApp.exists())
				FileUtils.deleteDirectory(dbPathInApp);

			String dbPathFull = new File(dbPathInSrv, "app").getPath();

			Class.forName(G.getServerProperties().getProperty(ServerProperties.DB_DRIVER));
			Connection con = DriverManager.getConnection("jdbc:hsqldb:file:" + dbPathFull, "ca", "ca");
			con.setAutoCommit(true);
			try {
				m_log.info("Start updating database");
				checkDB(con, dbPathInSrv, backupPath);
				m_log.info("Finish updating database");
			} finally {
				if (!con.isClosed()) {
					DB.executeStatement(con, "SHUTDOWN");
					con.close();
				}
			}

			m_log.info("Starting database");
			m_server = new Server();
			m_server.setDatabaseName(0, "app");
			m_server.setDatabasePath(0, "file:" + dbPathFull);
			m_server.setNoSystemExit(true);
			File acl = new File(dbPathInSrv, m_acl);
			if (acl.exists()) {
				HsqlProperties p = new HsqlProperties();
				p.setProperty("server.acl", acl.getPath());
				m_server.setProperties(p);
				m_log.info("Access list applied " + acl.getPath());
			}
			m_server.start();
			m_log.info("Database started");

			m_backupThread = new Backup(backupPath.getPath());
			m_backupThread.start();

		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	public void contextDestroyed(ServletContextEvent sce) {
		m_log.debug("Context destroyed. Shutdown and stop database server.");
		try {
			DB.executeStatement("SHUTDOWN");
		} catch (Exception e) {
		}
		m_server.stop();
		G.interruptAndJoin(m_backupThread);
	}

	private void checkDB(Connection con, File dbPath, File backupPath) throws Exception {
		int currentDBVersion = GS.getInt(Q.getParam(con, "DB_VERSION"));
		if (currentDBVersion == 0)
			GS.ex("Unable to determine the version of the database");
		m_log.info("Current version of database is " + currentDBVersion);

		if (currentDBVersion == Const.DB_VERSION) {
			m_log.info("Database update does not require");
		}
		else if (currentDBVersion > Const.DB_VERSION) {
			GS.ex("The database version is newer than the application. Update the application.");
		}
		else {
			m_log.info("Start database backup before update");
			String backupFilePath = new File(backupPath, getArcFilename("before-update")).getPath();
			DB.executeStatement(con, "backup database to '" + backupFilePath + "'");
			m_log.info("Finish database backup before update");

			try {
				for (int i = currentDBVersion; i < Const.DB_VERSION; i++) {
					m_log.info("Start database update to version " + (i + 1));

					InputStream stream = getClass().getResourceAsStream("/dbupdate" + i + "to" + (i + 1));
					if (stream == null)
						GS.ex("Script that updates the database from version " + i + " to version " + (i + 1) + " is not found");
					try {
						for (String sql : IOUtils.toString(stream, "utf-8").replace("\r\n", "\n").split("\n/\n")) {
							if (!sql.trim().isEmpty()) {
								String firstRow = sql.split("\n")[0];
								m_log.info("Start execute statement " + firstRow + " ...");
								try {
									DB.executeStatement(con, sql);
								} catch (Exception e) {
									GS.ex("Error in statement: " + sql + " (Updating database from version " + i + " to " + (i + 1) + ")\n" + e.getMessage());
								}
								m_log.info("Finish execute statement " + firstRow + " ...");
							}
						}
					} finally {
						stream.close();
					}
					m_log.info("Finish database update to version " + (i + 1));
				}
				Q.setParam(con, "DB_VERSION", String.valueOf(Const.DB_VERSION));
			} catch (Exception e) {
				DB.executeStatement(con, "SHUTDOWN");
				con.close();
				for (File f : dbPath.listFiles())
					if (!f.getName().equalsIgnoreCase(m_acl))
						f.delete();
				DbBackupMain.main(new String[] { "--extract", backupFilePath, dbPath.getPath() });

				GS.ex("An error occurred while updating the database.\n" + e.getMessage());
			}
		}
	}

	private static String getArcFilename(String prefix) {
		return String.format("%1$s-%2$tY-%2$tm-%2$td-%2$tH-%2$tM-%2$tS.tar.gz", prefix, new Date());
	}

	private class Backup extends Thread {

		String m_defaultBackupPath;

		public Backup(String backupPath) {
			m_defaultBackupPath = backupPath;
		}

		@Override
		public void run() {
			while (!isInterrupted()) {
				try {
					Thread.sleep(GS.ONEMINUTE);
					if (String.format("%1$tH:%1$tM", new Date()).equals(G.getServerProperties().getProperty("backupDatabaseTime"))) {
						doBackup();
					}
				} catch (InterruptedException e) {
					break;
				} catch (Exception e) {
					m_log.error("An error occurred while creating the database backup", e);
				}
			}
		}

		private void doBackup() throws Exception {
			m_log.info("Start database backup");
			String backupPath = G.getServerProperties().getProperty("backupDatabasePath");
			String path = new File((backupPath == null || backupPath.trim().equals("") || backupPath.equalsIgnoreCase("default")) ? m_defaultBackupPath
					: backupPath, getArcFilename("backup")).getPath();
			Connection con = DB.getConnection();
			try {
				DB.executeStatement(con, "backup database to '" + path + "' NOT BLOCKING");
			} finally {
				DB.close(con);
			}
			m_log.info("Finish database backup");
		}

	}

}