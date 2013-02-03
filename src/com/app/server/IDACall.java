package com.app.server;

import java.sql.Connection;
import java.util.HashMap;
import java.util.Map;

import com.app.shared.exceptions.ExLimitReached;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.rpc.RPCManager;
import com.isomorphic.rpc.RPCRequest;
import com.isomorphic.rpc.RPCResponse;
import com.isomorphic.servlet.RequestContext;

public class IDACall extends com.isomorphic.servlet.IDACall {

	private static Map<String, Long> lastCheck = new HashMap<String, Long>();

	@Override
	public DSResponse handleDSRequest(DSRequest request, RPCManager rpc, RequestContext context) {
		DSResponse response = null;
		try {
			Connection con = DB.getConnection(request);
			if (rpc.getRequests().get(0) == request /*сравниваем указатели*/) {
				DB.executeProcedure(con, "user_auth", request.getUserId());
				log.debug("User authenticated. User: " + request.getUserId() + " Connection: " + con.hashCode());
			}

			String ds = request.getDataSourceName();
			if ("cc_devices".equals(ds) || "pm_ports".equals(ds) || "dm_devices".equals(ds)) {
				String op = request.getOperationType();
				if ("add".equals(op))
					check(con, ds, true);
				else if ("fetch".equals(op)) {
					long now = System.currentTimeMillis();
					synchronized (lastCheck) {
						Long last = lastCheck.get(ds);
						if (last == null || now - last > 60000L) {
							check(con, ds, false);
							lastCheck.put(ds, now);
						}
					}
				}
			}

			response = request.execute();
		} catch (Exception e) {
			response = new DSResponse();
			response.setData(e.toString());
			response.setStatus(DSResponse.STATUS_FAILURE);
			log.warn("Error executing DSRequest. " + request.getOperationConfig(), e);
		}
		return response;
	}

	private void check(Connection con, String ds, boolean addOp) throws Exception {
		G.checkLicenses();
		int cnt = DB.query(con, "select count(0) a from " + ds).get(0).getInt("A") + (addOp ? 1 : 0);
		if (cnt > ("cc_devices".equals(ds) ? G.CC.qty : ("pm_ports".equals(ds) ? G.PM.qty : ("dm_devices".equals(ds) ? G.DM.qty : 0))))
			throw new ExLimitReached();
		// log.debug("Limits are not exceeded under license");
	}

	@Override
	public RPCResponse handleRPCRequest(RPCRequest request, RPCManager rpc, RequestContext context) {
		RPCResponse response = null;		
		try {
			Connection con = DB.getConnection();
			try {
				DB.executeProcedure(con, "user_auth", rpc.getUserId());
				rpc.setAttribute("con", con);
				response = request.execute();				
			} finally {
				DB.close(con);
			}
		} catch (Exception e) {
			response = new RPCResponse();	
			response.setData(e.toString()); 
			response.setStatus(RPCResponse.STATUS_FAILURE);
			log.warn("Error executing RPCRequest. " + request.getServerObjectID() + " " + request.getMethodName(), e);
		}
		return response;
	}
}
