package com.app.server;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;
import java.util.TimeZone;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;

import com.isomorphic.log.Logger;

public class NoCacheFilter implements Filter {

	private Logger m_log = new Logger(this.getClass().getName());
	private SimpleDateFormat m_dateFormat = new SimpleDateFormat("EEE, d MMM yyyy HH:mm:ss", Locale.ENGLISH) {
		{
			setTimeZone(TimeZone.getTimeZone("GMT"));
		}
	};

	public void init(FilterConfig conf) throws ServletException {
		m_log.debug("init");
	}

	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
		m_log.debug("in doFilter");		
		setHeaders(resp);
		chain.doFilter(req, resp);
		setHeaders(resp);		
	}

	public void destroy() {
		m_log.debug("destroy");
	}
	
	private void setHeaders(ServletResponse resp){
		if (resp instanceof HttpServletResponse) {
			HttpServletResponse hr = (HttpServletResponse) resp;
			hr.setHeader("Expires", "Mon, 01 Jan 1990 00:00:00 GMT");
			hr.setHeader("Cache-Control", "no-cache, no-store, max-age=0, must-revalidate");
			hr.setHeader("Pragma", "no-cache");
			synchronized (m_dateFormat) {
				hr.setHeader("Last-Modified", m_dateFormat.format(new Date()) + " GMT");
			}
		}
	}
}
