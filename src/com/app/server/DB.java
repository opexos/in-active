package com.app.server;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Properties;

import com.app.shared.GS;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.log.Logger;
import com.isomorphic.rpc.RPCManager;
import com.isomorphic.sql.SQLDataSource;

public class DB {

	// public static final Object OUTPARAM = new Object();
	private static final Logger m_log = new Logger(DB.class.getName());
	private static final SimpleDateFormat m_dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	private static String m_url;

	// public static String scriptGetName(Connection con, Integer scriptId) throws SQLException {
	// CallableStatement stm = con.prepareCall("call script_get_name(?)");
	// stm.setInt(1, scriptId);
	// stm.execute();
	// ResultSet res = stm.getResultSet();
	// res.next();
	// return res.getString(1);
	// }

	// public static CallableStatement prepareCall(Connection con, String storedProcName, Object... params) throws SQLException {
	// String paramList = "";
	// for (int i = 0; i < params.length; i++)
	// paramList += paramList.equals("") ? "?" : ",?";
	//
	// String stm = "call " + storedProcName + "(" + paramList + ")";
	// CallableStatement st = null;
	// try {
	// st = con.prepareCall(stm);
	// } catch (SQLException e) {
	// m_log.error("prepare CallableStatement error: " + stm, e);
	// throw e;
	// }
	// int idx = 1;
	// for (Object p : params) {
	// if (p != OUTPARAM)
	// st.setObject(idx, p);
	// idx++;
	// }
	//
	// return st;
	// }

	public static Connection getConnection(String user) throws SQLException {
		try {
			if (m_url == null) {
				Properties prop = G.getServerProperties();
				String defDB = prop.getProperty(ServerProperties.DB_DEFAULT);

				Class.forName(prop.getProperty(String.format(ServerProperties.DB_DRIVER, defDB)));
				m_url = prop.getProperty(String.format(ServerProperties.DB_URL, defDB));
			}
			Connection con = DriverManager.getConnection(m_url);
			con.setAutoCommit(true);
			if (user!=null)
				executeProcedure(con, "user_auth", user);
			return con;
		} catch (Exception e) {
			throw new SQLException("Cannot create connection to DB: " + e.getMessage());
		}
	}
	
	public static Connection getConnectionAsSystem() throws SQLException {
		return getConnection("system");
	}
	
	public static Connection getConnection() throws SQLException {
		return getConnection((String)null);
	}

	public static Connection getConnection(DSRequest req) throws Exception {
		Connection con = ((SQLDataSource) req.getDataSource()).getTransactionalConnection(req);
		if (con == null)
			GS.ex("DB connection is not found");
		return con;
	}

	public static Connection getConnection(RPCManager man) {
		return (Connection) man.getAttribute("con");
	}

	public static void close(Connection con) {
		try {
			con.close();
		} catch (Exception e) {
		}
	}

	public static void close(PreparedStatement ps) {
		try {
			ps.close();
		} catch (Exception e) {
		}
	}

	public static void close(ResultSet rs) {
		try {
			rs.close();
		} catch (Exception e) {
		}
	}

	public static int executeStatement(String statement, Object... params) throws SQLException {
		Connection con = getConnection();
		try {
			return executeStatement(con, statement, params);
		} finally {
			close(con);
		}
	}

	public static int executeStatement(Connection con, String statement, Object... params) throws SQLException {
		synchronized (con) {
			try {
				m_log.debug("executeStatement. " + statement);
				PreparedStatement ps = con.prepareStatement(statement);
				try {
					for (int i = 0; i < params.length; i++)
						ps.setObject(i + 1, params[i]);
					return ps.executeUpdate();
				} finally {
					ps.close();
				}
			} catch (SQLException e) {
				m_log.error("executeStatement exception. " + statement, e);
				throw e;
			}
		}
	}

	public static void executeProcedure(Connection con, String procName, Object... params) throws SQLException {
		String paramList = "";
		for (int i = 0; i < params.length; i++)
			paramList += paramList.equals("") ? "?" : ",?";

		String stm = "{ call " + procName + "(" + paramList + ") }";
		m_log.debug("executeProcedure. " + stm);
		try {
			synchronized (con) {
				CallableStatement st = con.prepareCall(stm);

				for (int i = 0; i < params.length; i++)
					// if (!(params[i] instanceof OutParam))
					st.setObject(i + 1, params[i]);

				st.execute();

				// for (int i = 0; i < params.length; i++)
				// if (params[i] instanceof OutParam)
				// ((OutParam) params[i]).setValue(st.getObject(i + 1));
			}

		} catch (SQLException e) {
			m_log.error("executeProcedure exception. " + stm, e);
			throw e;
		}
	}

	public static void executeProcedure(String procName, Object... params) throws SQLException {
		Connection con = DB.getConnection();
		try {
			executeProcedure(con, procName, params);
		} finally {
			close(con);
		}
	}

	public static Rows query(Connection con, String sql, Object... params) throws SQLException {
		Rows result = new Rows();
		try {
			synchronized (con) {
				m_log.debug("query. " + sql);
				PreparedStatement ps = con.prepareStatement(sql);
				try {
					for (int i = 0; i < params.length; i++)
						ps.setObject(i + 1, params[i]);
					ResultSet rs = ps.executeQuery();
					try {
						ResultSetMetaData md = rs.getMetaData();
						while (rs.next()) {
							Row row = new Row();
							for (int i = 1; i <= md.getColumnCount(); i++)
								row.put(md.getColumnName(i).toUpperCase(), rs.getObject(i));
							result.add(row);
						}
					} finally {
						rs.close();
					}
				} finally {
					ps.close();
				}
			}
		} catch (SQLException e) {
			m_log.error("query exception. " + sql, e);
			throw e;
		}
		return result;
	}

	public static Rows query(String sql, Object... params) throws SQLException {
		Connection con = DB.getConnection();
		try {
			return query(con, sql, params);
		} finally {
			close(con);
		}
	}

	public static class Row extends HashMap<String, Object> {
		private static final long serialVersionUID = -3820250747383587977L;

		public boolean isNull(String key){
			return get(key)==null;
		}
		
		public Integer getInt(String key) {
			Object val = get(key);
			return val != null ? Integer.valueOf(val.toString()) : null;
		}

		public Double getDouble(String key) {
			Object val = get(key);
			return val != null ? Double.valueOf(val.toString()) : null;
		}

		public String getStr(String key) {
			Object val = get(key);
			if (val == null)
				return null;
			if (val instanceof Double) {
				Double v = (Double) val;
				if (v.compareTo(Math.floor(v)) == 0)
					return String.format("%.0f", v);
			} else if (val instanceof Timestamp) {
				return m_dateFormat.format((Timestamp) val);
			}

			return val.toString();
		}

		public Timestamp getTimestamp(String key) {
			Object val = get(key);
			return val != null ? Timestamp.valueOf(val.toString()) : null;
		}

		public Boolean getBool(String key, Boolean ifNull) {
			Object val = get(key);
			return val != null ? Boolean.valueOf(val.toString()) : ifNull;
		}

		public Boolean getBool(String key) {
			return getBool(key, null);
		}

	}

	public static class Rows extends ArrayList<Row> {
		private static final long serialVersionUID = 5324670906643825002L;

		public boolean containsRow(String field, Object value) {
			for (Row r : this) {
				Object val = r.get(field);
				if (val != null && val.toString().equals(value.toString()))
					return true;
			}
			return false;
		}

		public Rows findRows(String field, Object value) {
			Rows result = new Rows();
			for (Row r : this) {
				Object val = r.get(field);
				if (val != null && val.toString().equals(value.toString()))
					result.add(r);
			}
			return result;
		}

		public String getList(String field, String delimeter) {
			StringBuilder result = new StringBuilder();
			for (Row r : this) {
				Object val = r.get(field);
				if (val != null) {
					if (result.length() > 0)
						result.append(delimeter);
					result.append(val.toString());
				}
			}
			return result.toString();
		}

		@Override
		public String toString() {
			StringBuilder sb = new StringBuilder();
			for (Row r : this)
				sb.append(r.toString() + "\n");
			return sb.toString();
		}

	}

}
