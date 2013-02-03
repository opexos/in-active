package com.app.server;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.security.Principal;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.isomorphic.log.Logger;

public class SessionCheckFilter implements Filter {

	private static Logger m_log = new Logger(SessionCheckFilter.class.getName());

	public void init(FilterConfig conf) throws ServletException {
		m_log.debug("init");
	}

	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws IOException, ServletException {
		m_log.debug("in doFilter");

		if (req instanceof HttpServletRequest) {
			HttpServletRequest hr = (HttpServletRequest) req;

			Principal principal = hr.getUserPrincipal();
			if (principal == null)
				m_log.debug("principal is null");
			else
				m_log.debug("principal is not null");

			String remoteUser = hr.getRemoteUser();
			m_log.debug("remote user: " + remoteUser);

			HttpSession ses = hr.getSession(false);
			if (ses == null)
				m_log.debug("session is null");
			else
				m_log.debug("session is not null");

			if (ses == null || principal == null || remoteUser == null || remoteUser.equals("")) {
				m_log.debug("session is expired or not logged on");

				PrintWriter out = resp.getWriter();
				InputStream in = this.getClass().getResourceAsStream("loginRequiredMarker.html");
				BufferedReader reader = new BufferedReader(new InputStreamReader(in));
				try {
					String line;
					while ((line = reader.readLine()) != null)
						out.println(line);
				} finally {
					reader.close();
				}

			} else {
				m_log.debug("session is ok");
				chain.doFilter(req, resp);
			}

		} else {
			m_log.debug("not HttpServletRequest");
			chain.doFilter(req, resp);
		}
	}

	public void destroy() {
		m_log.debug("destroy");
	}
}
