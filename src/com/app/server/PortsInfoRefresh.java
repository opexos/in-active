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

public class PortsInfoRefresh implements ServletContextListener {

	private Logger m_log = new Logger(this.getClass().getName());
	private Thread m_queueManager;
	private Thread m_starter;
	private List<PMDevice> m_queue = new ArrayList<PMDevice>();
	private int m_maxThreads;
	private AtomicInteger m_threadCount = new AtomicInteger(0);

	private class PMDevice {
		public int id;
		public AtomicBoolean started = new AtomicBoolean(false);
		public AtomicLong startAt = new AtomicLong(0L);
		public int errors = 0;

		public PMDevice(int id) {
			this.id = id;
		}

		@Override
		public boolean equals(Object obj) {
			return this.id == ((PMDevice) obj).id;
		}

		@Override
		public String toString() {
			return "pm_devices.id=" + id;
		}
	}

	public void contextInitialized(ServletContextEvent sce) {
		try {
			m_maxThreads = Integer.parseInt(G.getServerProperties().getProperty("portRefreshMaxThreads"));
		} catch (Exception e) {
			m_maxThreads = 3;
		}

		m_log.debug("Create and start threads");

		m_queueManager = new QueueManager();
		m_queueManager.start();
		m_starter = new Starter();
		m_starter.start();
	}

	public void contextDestroyed(ServletContextEvent sce) {
		m_log.debug("Context destroyed. Interrupt threads and wait end of execution.");

		G.interruptAndJoin(m_queueManager);
		G.interruptAndJoin(m_starter);
	}

	private class QueueManager extends Thread {

		@Override
		public void run() {
			m_log.debug("QueueManager thread started");
			setName("Ports info refresh queue manager");
			while (!isInterrupted()) {
				try {
					sleep(GS.ONEMINUTE);
				} catch (InterruptedException e) {
					break; 
				}

				try {
					Date curDate = new Date();
					synchronized (m_queue) { 
						for (Row row : DB.query("select d.*, pm_device_last_refresh_date(d.id) as last from pm_devices d")) {
							PMDevice dev = new PMDevice(row.getInt("ID"));
							Interval interval = new Interval(row.getStr("REFRESH_INTERVAL"));
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

	private class Starter extends Thread {
		@Override
		public void run() {
			m_log.debug("Starter thread started");
			setName("Ports info refresh starter");
			while (!isInterrupted()) {
				try {
					try {
						synchronized (m_queue) {
							for (PMDevice dev : m_queue) {
								if (!dev.started.get() && System.currentTimeMillis() >= dev.startAt.get())
									new RefreshPortInfo(dev);
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
			m_log.debug("Starter thread finished");
		}
	}

	private class RefreshPortInfo extends Thread {
		private PMDevice m_pmDevice;

		public RefreshPortInfo(PMDevice device) throws TooManyThreads {
			synchronized (m_threadCount) {
				if (m_threadCount.get() + 1 > m_maxThreads)
					throw new TooManyThreads();
				m_threadCount.incrementAndGet();
			}
			m_pmDevice = device;
			m_pmDevice.started.set(true);
			start();
		}

		@Override
		public void run() {
			boolean removeFromQueue = true;
			try {
				m_log.debug("Port refresh started for device. " + m_pmDevice);
				try {
					setName("Port refresh. " + m_pmDevice);
					Connection con = DB.getConnectionAsSystem();
					try {
						ScriptExecuteResult res = callScript(con, m_pmDevice.id);
						if (res.status.equals(ScriptExecuteStatus.ERROR)) {
							m_pmDevice.errors++;
							if (m_pmDevice.errors < 3) {
								removeFromQueue = false;
								m_pmDevice.startAt.set(System.currentTimeMillis() + GS.ONEMINUTE);
								m_pmDevice.started.set(false);
								m_log.debug("Port refresh error for device. " + m_pmDevice + " Retry later.");
							} else {
								m_log.debug("Port refresh error for device. " + m_pmDevice);
								DB.executeProcedure(con, "PM_DEVICE_SAVE_LOG", m_pmDevice.id, "ERROR", res.log);
							}
						} else {
							DB.executeProcedure(con, "PM_DEVICE_SAVE_LOG", m_pmDevice.id, "OK", null);
						}
					} finally {
						DB.close(con);
					}
				} catch (Exception e) {
					m_log.error("Port refresh thread error. " + m_pmDevice, e);
				}
				m_log.debug("Port refresh finished for device. " + m_pmDevice);
			} finally {
				if (removeFromQueue) {
					synchronized (m_queue) {
						m_queue.remove(m_pmDevice);
					}
				}
				synchronized (m_threadCount) {
					m_threadCount.decrementAndGet();
					m_threadCount.notify();
				}
			}
		}
		
		private ScriptExecuteResult callScript(Connection con, int pmDeviceId) {
			try {
				return Script.executeScriptPM("pm_refresh_data", pmDeviceId, null, null, con);
			} catch (Exception e) {
				ScriptExecuteResult r = new ScriptExecuteResult();
				r.status = ScriptExecuteStatus.ERROR;
				r.log = "An error has occurred: " + e.getMessage();
				return r;
			}
		}
		


	}

}