package com.app.server;

import java.io.IOException;
import java.io.OutputStream;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.isomorphic.log.Logger;

public class ImageFromDB extends HttpServlet {
	

	private static Logger m_log = new Logger(ImageFromDB.class.getName());

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		try {
			String filename = req.getPathInfo().substring(1);
			String mimeType = getServletContext().getMimeType(filename);

			resp.setContentType(mimeType);

			byte[] imgBytes = getImage(filename);

			if (imgBytes != null) {
				if ("image/svg+xml".equals(mimeType)) {
					Map<String, String[]> p = req.getParameterMap();
					if (p.size() > 0)
						imgBytes = passParams(imgBytes, p);
				}

				OutputStream output = resp.getOutputStream();
				try {
					output.write(imgBytes);
				} finally {
					output.close();
				}
			}
		} catch (Exception e) {
			m_log.error("Cannot retrieve image from DB", e);
		}

	}

	private byte[] getImage(String filename) throws Exception {
		byte[] imgBytes = null;

		Connection con = null;
		PreparedStatement ps = null;
		ResultSet rs = null;
		try {
			con = DB.getConnection();
			ps = con.prepareStatement("select image from images where filename = ?");
			ps.setString(1, filename);
			rs = ps.executeQuery();
			while (rs.next()) {
				imgBytes = rs.getBytes(1);
			}
		} finally {
			DB.close(rs);
			DB.close(ps);
			DB.close(con);
		}

		return imgBytes;
	}

	private byte[] passParams(byte[] svg, Map<String, String[]> params) throws Exception {
		String str = new String(svg, "utf-8");
		for (Map.Entry<String, String[]> entry : params.entrySet()) {
			String[] v = entry.getValue();
			if (v.length > 0) {
				String k = entry.getKey();
				if (!k.startsWith("@"))
					k = "@" + k;
				str = str.replace(k, v[0]);
			}
		}
		return str.getBytes("utf-8");
	}

}
