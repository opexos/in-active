package com.app.server;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

import com.app.server.DB.Row;

public class Init implements ServletContextListener {

	@Override
	public void contextInitialized(ServletContextEvent sce) {
		System.setProperty("log4j.ignoreTCL", "true");

		try {
			for (Row lic : DB.query("select * from lics")) {
				G.applyLicense(lic.getStr("MDL"), lic.getStr("KEY"));
			}
		} catch (Exception e) {
			throw new RuntimeException("Can't load licenses from DB. " + e.getMessage());
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent sce) {
	}

}