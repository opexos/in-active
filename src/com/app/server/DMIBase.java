package com.app.server;

import java.sql.Connection;

import com.app.server.DMI.Executor;
import com.app.shared.GS;
import com.app.shared.i18n.UIMsg;
import com.app.shared.i18n.UIStr;
import com.isomorphic.datasource.DSRequest;
import com.isomorphic.datasource.DSResponse;
import com.isomorphic.log.Logger;

public abstract class DMIBase {

	public DSResponse add(DSRequest req) throws Exception {
		return DMI.doExecute(this.getClass(), "ADD", req, new Executor() {
			public void execute(MapWrapper values, DSRequest req, UIStr str, UIMsg msg, Connection con, Logger log) throws Exception {
				doAdd(values, req, str, msg, con, log);
			}
		});
	}

	public DSResponse update(DSRequest req) throws Exception {
		return DMI.doExecute(this.getClass(), "UPDATE", req, new Executor() {
			public void execute(MapWrapper values, DSRequest req, UIStr str, UIMsg msg, Connection con, Logger log) throws Exception {
				doUpdate(values, req, str, msg, con, log);
			}
		});
	}

	public DSResponse remove(DSRequest req) throws Exception {
		return DMI.doExecute(this.getClass(), "REMOVE", req, new Executor() {
			public void execute(MapWrapper values, DSRequest req, UIStr str, UIMsg msg, Connection con, Logger log) throws Exception {
				doRemove(values, req, str, msg, con, log);
			}
		});
	}

	protected void doAdd(MapWrapper values, DSRequest req, UIStr str, UIMsg msg, Connection con, Logger log) throws Exception {
		GS.ex("unimplemented");
	}

	protected void doUpdate(MapWrapper values, DSRequest req, UIStr str, UIMsg msg, Connection con, Logger log) throws Exception {
		GS.ex("unimplemented");
	}

	protected void doRemove(MapWrapper values, DSRequest req, UIStr str, UIMsg msg, Connection con, Logger log) throws Exception {
		GS.ex("unimplemented");
	}

}
