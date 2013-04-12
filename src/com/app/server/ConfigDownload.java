package com.app.server;

import java.sql.Connection;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.app.server.DB.Row;
import com.app.shared.GS;
import com.app.shared.Interval;
import com.app.shared.ScriptExecuteResult;
import com.app.shared.ScriptExecuteStatus;
import com.isomorphic.log.Logger;

public class ConfigDownload implements ServletContextListener {

	private Logger m_log = new Logger(this.getClass().getName());
	private Thread m_queueManager;
	private Thread m_downloadStarter;
	private List<CCDevice> m_queue = new ArrayList<CCDevice>();
	private int m_maxThreads;
	private AtomicInteger m_threadCount = new AtomicInteger(0);
	// private Connection m_con; 

	public void contextInitialized(ServletContextEvent sce) {
		m_log.debug("Read max threads from properties");
		try {
			m_maxThreads = Integer.parseInt(G.getServerProperties().getProperty("configDownloadMaxThreads"));
		} catch (Exception e) {
			m_maxThreads = 3;
		}

		// m_log.debug("Connect to database");
		// try {
		// m_con = DB.getConnection();
		// } catch (SQLException e) {
		// throw new RuntimeException(e);
		// }

		m_log.debug("Create and start threads");

		m_queueManager = new QueueManager();
		m_queueManager.start();
		m_downloadStarter = new DownloadStarter();
		m_downloadStarter.start();
	}

	public void contextDestroyed(ServletContextEvent sce) {
		m_log.debug("Context destroyed. Interrupt threads and wait end of execution.");

		G.interruptAndJoin(m_queueManager);
		G.interruptAndJoin(m_downloadStarter);

		// DB.close(m_con);
	}

	private class CCDevice {
		public int id;
		public AtomicBoolean started = new AtomicBoolean(false);
		public AtomicLong startAt = new AtomicLong(0L);
		public int errors = 0;

		public CCDevice(int id) {
			this.id = id;
		}

		@Override
		public boolean equals(Object obj) {
			return this.id == ((CCDevice) obj).id;
		}

		@Override
		public String toString() {
			return "cc_devices.id=" + id;
		}
	}

	private class QueueManager extends Thread {

		@Override
		public void run() {
			m_log.debug("QueueManager thread started");
			setName("Configuration download queue manager");
			while (!isInterrupted()) {
				try {
					sleep(GS.ONEMINUTE);
				} catch (InterruptedException e) {
					break; 
				}

				try {
					Date curDate = new Date();
					synchronized (m_queue) { 
						for (Row row : DB.query("select c.*, cc_device_last_get_config_date(c.id) as last from cc_devices c")) {
							CCDevice dev = new CCDevice(row.getInt("ID"));
							Interval interval = new Interval(row.getStr("GET_CONFIG_INTERVAL"));
							if (interval.isEmpty() || !interval.isValid()) {
								m_log.debug("Device has incorrect interval in DB. " + dev);
								continue; 
							}
							if (row.isNull("LAST") || curDate.after(G.getIncrementedDate(row.getTimestamp("LAST"), interval))) {
								if (!m_queue.contains(dev)) {
									m_queue.add(dev);
									m_queue.notify();
								}
							}
						}
					}
				} catch (Exception e) {
					m_log.error("QueueManager error.", e);
				}
			}
			m_log.debug("QueueManager thread finished");
		}
	}

	private class TooManyThreads extends Exception {
	}

	private class DownloadStarter extends Thread {
		@Override
		public void run() {
			m_log.debug("DownloadStarter thread started");
			setName("Configuration download starter");
			while (!isInterrupted()) {
				try {
					try {
						synchronized (m_queue) {
							for (CCDevice dev : m_queue) {
								if (!dev.started.get() && System.currentTimeMillis() >= dev.startAt.get())
									new Downloader(dev);
							}
							m_queue.wait(GS.ONESECOND);
						}
					} catch (TooManyThreads e) {
						synchronized (m_threadCount) {
							while (m_threadCount.get() >= m_maxThreads)
								m_threadCount.wait();
						}
					}
				} catch (InterruptedException e) {
					break; 
				}
			}
			m_log.debug("DownloadStarter thread finished");
		}
	}

	private class Downloader extends Thread {
		private CCDevice m_ccDevice;

		public Downloader(CCDevice ccDevice) throws TooManyThreads {
			synchronized (m_threadCount) {
				if (m_threadCount.get() + 1 > m_maxThreads)
					throw new TooManyThreads();
				m_threadCount.incrementAndGet();
			}
			m_ccDevice = ccDevice;
			m_ccDevice.started.set(true);
			start();
		}

		@Override
		public void run() {
			boolean removeFromQueue = true;
			try {
				m_log.debug("Config download started for device. " + m_ccDevice);
				try {
					setName("Configuration downloader. " + m_ccDevice);
					Connection con = DB.getConnectionAsSystem();
					try {
						ScriptExecuteResult conf = callScript(con, m_ccDevice.id);
						if (conf.status.equals(ScriptExecuteStatus.ERROR)) {
							m_ccDevice.errors++;
							if (m_ccDevice.errors < 3) {
								removeFromQueue = false;
								m_ccDevice.startAt.set(System.currentTimeMillis() + GS.ONEMINUTE);
								m_ccDevice.started.set(false);
								m_log.debug("Config download error for device. " + m_ccDevice + " Retry later.");
							} else {
								m_log.debug("Config download error for device. " + m_ccDevice);
								DB.executeProcedure(con, "CC_DEVICE_SAVE_ERROR_LOG", m_ccDevice.id, conf.log);
							}
						} else {
							DB.executeProcedure(con, "CC_DEVICE_SAVE_CONFIG", m_ccDevice.id, conf.result);
						}
					} finally {
						DB.close(con);
					}
				} catch (Exception e) {
					m_log.error("Downloader thread error. " + m_ccDevice, e);
				}
				m_log.debug("Config download finished for device. " + m_ccDevice);
			} finally {
				if (removeFromQueue) {
					synchronized (m_queue) {
						m_queue.remove(m_ccDevice);
					}
				}
				synchronized (m_threadCount) {
					m_threadCount.decrementAndGet();
					m_threadCount.notify();
				}
			}
		}

		private ScriptExecuteResult callScript(Connection con, int ccDeviceId) {
			try {
				ScriptExecuteResult r = Script.executeScriptCC("cc_get_config", ccDeviceId, null, null, con);
				if (r.result.trim().isEmpty()) {
					r.log = r.log + "\n\nThe script did not return results";
					r.status = ScriptExecuteStatus.ERROR;
				}
				return r;
			} catch (Exception e) {
				ScriptExecuteResult r = new ScriptExecuteResult();
				r.status = ScriptExecuteStatus.ERROR;
				r.log = "An error has occurred: " + e.getMessage();
				return r;
			}
		}
		
		
	}


}