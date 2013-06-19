package com.app.server;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.app.shared.GS;
import com.isomorphic.log.Logger;

public class HistoryCleaner implements ServletContextListener {

	private Logger m_log = new Logger(this.getClass().getName());
	private Thread m_thread;

	public void contextInitialized(ServletContextEvent sce) {
		m_log.debug("Create and start thread");

		m_thread = new Thread() {
			@Override
			public void run() {
				m_log.debug("Thread started");
				setName("History cleaner");
				while (!isInterrupted()) {
					try {
						sleep(GS.ONEHOUR);
					} catch (InterruptedException e) {
						break;
					}

					try {
						DB.executeProcedure("CLEAN_HISTORY");
					} catch (Exception e) {
						m_log.error("History cleaner error. ", e);
					}

				}
				m_log.debug("Thread finished");
			}
		};
		m_thread.start();
	}

	public void contextDestroyed(ServletContextEvent sce) {
		m_log.debug("Context destroyed. Interrupt thread and wait end of execution.");
		G.interruptAndJoin(m_thread);
	}

}