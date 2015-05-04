package com.app.shared;

import java.util.HashMap;
import java.util.Map;

public class ScriptExecuteResult {
	public ScriptExecuteStatus status;
	public String result;
	public String console;
	public String log;

	public ScriptExecuteResult(Map map) {
		status = ScriptExecuteStatus.valueOf(map.get("STATUS").toString());
		result = map.get("RESULT").toString();
		console = map.get("CONSOLE").toString();
		log = map.get("LOG").toString();
	}

	public ScriptExecuteResult() {
	}

	public Map toMap() {
		Map res = new HashMap();
		res.put("STATUS", status.toString());
		res.put("RESULT", result);
		res.put("LOG", log);
		res.put("CONSOLE", console);
		return res;
	}

}