package com.app.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.app.client.ServerCall.RecordsCallback;
import com.app.client.tabs.ConfigurationControl;
import com.app.client.tabs.ConsoleRealTime2;
import com.app.client.tabs.DeviceManage;
import com.app.client.tabs.PortManage;
import com.app.client.widgets.CheckboxItem;
import com.app.client.widgets.DateTimeItem;
import com.app.client.widgets.GenerateRandomString;
import com.app.client.widgets.HButtons;
import com.app.client.widgets.IButton;
import com.app.client.widgets.IPItem;
import com.app.client.widgets.Label;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.PasswordItem;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextItem;
import com.app.client.widgets.WaitDialog;
import com.app.client.widgets.Window;
import com.app.shared.ConnectType;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.GetConfigResult;
import com.app.shared.InputType;
import com.app.shared.ObjectType;
import com.app.shared.Result;
import com.app.shared.SmtpSecure;
import com.app.shared.exceptions.ExAuthenticationFailed;
import com.app.shared.exceptions.ExCantChangeVlanPortIsTrunk;
import com.app.shared.exceptions.ExConnectionFailed;
import com.app.shared.exceptions.ExExcelFileLoadError;
import com.app.shared.exceptions.ExFileIsNotExcel;
import com.app.shared.exceptions.ExIncompatibleScript;
import com.app.shared.exceptions.ExIncorrectAddress;
import com.app.shared.exceptions.ExIncorrectConnectionSettings;
import com.app.shared.exceptions.ExIncorrectVlanType;
import com.app.shared.exceptions.ExNoConnection;
import com.app.shared.exceptions.ExNoDataFound;
import com.app.shared.exceptions.ExOperationNotSupportedByDevice;
import com.app.shared.exceptions.ExPortNotFound;
import com.app.shared.exceptions.ExScriptError;
import com.app.shared.exceptions.ExScriptIsNotDefined;
import com.app.shared.exceptions.ExSnmpNoResponse;
import com.app.shared.exceptions.ExSnmpSetError;
import com.app.shared.exceptions.ExVlanNotFound;
import com.app.shared.i18n.UIMsg;
import com.app.shared.i18n.UIStr;
import com.google.gwt.core.client.GWT;
import com.google.gwt.i18n.client.DateTimeFormat;
import com.google.gwt.user.client.Cookies;
import com.google.gwt.user.client.Window.Location;
import com.smartgwt.client.core.Function;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.Criteria;
import com.smartgwt.client.data.Criterion;
import com.smartgwt.client.data.DSCallback;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DSResponse;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.data.Hilite;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.data.SortSpecifier;
import com.smartgwt.client.rpc.DMI;
import com.smartgwt.client.rpc.RPCCallback;
import com.smartgwt.client.rpc.RPCManager;
import com.smartgwt.client.rpc.RPCRequest;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.DSOperationType;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.util.BooleanCallback;
import com.smartgwt.client.util.Page;
import com.smartgwt.client.util.SC;
import com.smartgwt.client.util.StringUtil;
import com.smartgwt.client.util.ValueCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.HTMLPane;
import com.smartgwt.client.widgets.Img;
import com.smartgwt.client.widgets.events.CloseClickEvent;
import com.smartgwt.client.widgets.events.CloseClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.ButtonItem;
import com.smartgwt.client.widgets.form.fields.FileItem;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.form.fields.RadioGroupItem;
import com.smartgwt.client.widgets.form.fields.events.KeyPressEvent;
import com.smartgwt.client.widgets.form.fields.events.KeyPressHandler;
import com.smartgwt.client.widgets.form.validator.MatchesFieldValidator;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.VLayout;
import com.smartgwt.client.widgets.tab.Tab;
import com.smartgwt.client.widgets.tab.TabSet;

public class G {

	public static final UIStr S = (UIStr) GWT.create(UIStr.class);
	public static final UIMsg M = (UIMsg) GWT.create(UIMsg.class);
	public static final LinkedHashMap<String, String> SMTP_CON_SECURE = new LinkedHashMap<String, String>() {
		{
			put(SmtpSecure.NONE.toString(), S.no());
			put(SmtpSecure.STARTTLS.toString(), "STARTTLS");
			put(SmtpSecure.SSLTLS.toString(), "SSL/TLS");
		}
	};

	public static final int SCRIPT_COMMON = 0;
	public static final int SCRIPT_FOR_DEVICE = 1;
	public static final int SCRIPT_FOR_PORT = 2;

	public static final LinkedHashMap<Integer, String> SCRIPT_TYPES = new LinkedHashMap<Integer, String>() {
		{
			put(SCRIPT_COMMON, S.commonModule());
			put(SCRIPT_FOR_DEVICE, S.scriptForDevice());
			put(SCRIPT_FOR_PORT, S.scriptForPort());
		}
	};
	/*public static final LinkedHashMap<String, String> SCRIPT_TYPES = new LinkedHashMap<String, String>() {
		{
			put(ScriptType.DOWNLOAD_CONFIGURATION.toString(), S.downloadDeviceConfig());
			put(ScriptType.CONSOLE_AUTH.toString(), S.consoleAuth());
			put(ScriptType.DEVICE_MANAGE.toString(), S.deviceManage());
			put(ScriptType.GET_ARP.toString(), S.getArpTable());
			put(ScriptType.COMMON.toString(), S.common());
			put(ScriptType.PORT_INFO.toString(), S.getPortInfo());
		}
	};*/
	public static final LinkedHashMap<String, String> OBJECT_TYPES = new LinkedHashMap<String, String>() {
		{
			put(ObjectType.CONFIG_CONTROL.toString(), S.configurationControl());
			put(ObjectType.PORT_MANAGE.toString(), S.portManage());
			put(ObjectType.DEVICE_MANAGE.toString(), S.deviceManage());
		}
	};
	public static final LinkedHashMap<String, String> CONNECT_TYPES = new LinkedHashMap<String, String>() {
		{
			put(ConnectType.SSH.toString(), "SSH");
			put(ConnectType.TELNET.toString(), "Telnet");
		}
	};
	public static final LinkedHashMap<String, String> GET_CONFIG_RESULTS = new LinkedHashMap<String, String>() {
		{
			put(GetConfigResult.CHANGED.toString(), S.configChanged());
			put(GetConfigResult.UNCHANGED.toString(), S.configUnchanged());
			put(GetConfigResult.ERROR.toString(), S.configDownloadError());
		}
	};
	public static final LinkedHashMap<String, String> RESULT = new LinkedHashMap<String, String>() {
		{
			put(Result.OK.toString(), S.ok());
			put(Result.ERROR.toString(), S.error());
		}
	};
	public static final LinkedHashMap<String, String> TRUE_FALSE = new LinkedHashMap<String, String>() {
		{
			put("true", S.yes());
			put("false", S.no());
		}
	};
	public static final LinkedHashMap<String, String> ADMIN_STATUS = new LinkedHashMap<String, String>() {
		{
			put(Integer.toString(Const.ADMIN_STATUS_UP), "Up");
			put(Integer.toString(Const.ADMIN_STATUS_DOWN), "Down");
			put(Integer.toString(Const.ADMIN_STATUS_TESTING), "Testing");
		}
	};
	public static final LinkedHashMap<String, String> MODIFY_ACTIONS = new LinkedHashMap<String, String>() {
		{
			put("I", S.modifyActionInsert());
			put("U", S.modifyActionUpdate());
			put("D", S.modifyActionDelete());
		}
	};
	public static final LinkedHashMap<String, String> PORT_CHANGE_ACTIONS = new LinkedHashMap<String, String>() {
		{
			put("SET_VLAN", S.portSetVlan());
			put("SET_SPEED", S.portSetSpeed());
			put("SET_DUPLEX", S.portSetDuplex());
			put("ENABLE", S.portEnable());
			put("DISABLE", S.portDisable());
		}
	};
	public static final LinkedHashMap<String, String> OBJECT_ACCESS_MODE = new LinkedHashMap<String, String>() {
		{
			put("FULL", S.fullAccess());
			put("READ_ONLY", S.readOnly());
		}
	};
	private static final LinkedHashMap<String, String> ERR_MSG = new LinkedHashMap<String, String>() {
		{
			put(ExNoDataFound.class.getName(), S.errorNoDataFound());
			put(ExSnmpNoResponse.class.getName(), S.noResponseFromSNMPAgent());
			put(ExSnmpSetError.class.getName(), S.snmpSetError());
			put(ExIncorrectAddress.class.getName(), S.incorrectAddress());
			put(ExIncorrectVlanType.class.getName(), S.incorrectVlanType());
			put(ExCantChangeVlanPortIsTrunk.class.getName(), S.forTrunkPortsCantChangeVlan());
			put(ExPortNotFound.class.getName(), S.portNotFound());
			put(ExVlanNotFound.class.getName(), S.vlanNotFound());
			put(ExFileIsNotExcel.class.getName(), S.fileMustBeExcel());
			put(ExExcelFileLoadError.class.getName(), S.excelFileLoadError());
			put(ExOperationNotSupportedByDevice.class.getName(), S.operationNotSupportedByDevice());
			put(ExAuthenticationFailed.class.getName(), S.authenticationFailed());
			put(ExConnectionFailed.class.getName(), S.connectionFailed());
			put(ExIncorrectConnectionSettings.class.getName(), S.incorrectConnectionSettings());
			put(ExNoConnection.class.getName(), S.noConnection());
			put(ExScriptError.class.getName(), S.errorsInScript());
			put(ExScriptIsNotDefined.class.getName(), S.scriptIsNotDefined());
			put(ExIncompatibleScript.class.getName(), S.incompatibleScript());
			put("DEVICES_UNIQUE_NAME_IN_MAP", S.deviceWithSameNameExistsInMap());
			put("DEVICE_TYPES_UNIQUE_NAME", S.deviceTypeWithSameNameExists());
			put("MAPS_UNIQUE_NAME", S.mapWithSameNameExists());
			put("SCRIPTS_UNIQUE_NAME", S.scriptWithSameNameExists());
			put("USERS_UNIQUE_LOGIN", S.userWithSameLoginExists());
			put("USERS_UNIQUE_NAME", S.userWithSameNameExists());
			put("PM_PORTS_UNIQUE_PORT_IN_DEVICE", S.samePortExistsInDevice());
			put("PM_VLANS_UNIQUE_VLAN_IN_OBJECT", S.sameVlanAlreadyExists());
			put("DICT_UNIQUE_NAME", S.dictWithSameNameExists());
			put("DICT_VALUES_UNIQUE_VAL", S.sameValueExistsInDict());
			put("PM_PORTS_UNIQUE_PATCH", S.patchAlreadyInUseInObject());
			put("FOREIGN KEY NO ACTION", S.errorForeignKeyNoAction());
			put("FOREIGN KEY NO PARENT", S.errorForeignKeyNoParent());
			put("DATA EXCEPTION: STRING DATA, RIGHT TRUNCATION", S.errorStringDataTooLong());
			put("UNIQUE CONSTRAINT", S.errorUniqueConstraint());
			put("NOT NULL CHECK CONSTRAINT", S.errorNotNullConstraint());
			put("THIS OPERATION REQUIRES ROLE", S.accessDenied());
			put("ACCESS DENIED", S.accessDenied());
			put("LIMIT REACHED", S.licenseLimitReached());
		}
	};
	public static TabSet TABSET;
	private static WaitDialog m_waitDialog;
	private static boolean m_listenConsoleDataWork = false;
	private static DateTimeFormat m_formatTimestamp = DateTimeFormat.getFormat("yyyy-MM-dd HH:mm:ss");

	public static native String calcMD5(String data) /*-{
		return $wnd.calcMD5(data);
	}-*/;

	// public static native void showLineNums(Element el, String name) /*-{
	// $wnd.showLineNums(el, name);
	// }-*/;

	// public static native void setMonospace(Element el, String name) /*-{
	// $wnd.setMonospace(el, name);
	// }-*/;

	// public static native void placeCaretAtEnd(Element el) /*-{
	// $wnd.placeCaretAtEnd(el);
	// }-*/;

	public static String getList(Record[] records, String attributeName, String delimeter) {
		String result = "";
		for (Record rec : records)
			result += (result.isEmpty() ? "" : delimeter) + rec.getAttribute(attributeName);
		return result;
	}

	public static String[] getEnumValues(Class<?> e) {
		Enum<?>[] enum_values = (Enum<?>[]) e.getEnumConstants();
		String[] values = new String[enum_values.length];
		for (int i = 0; i < values.length; i++)
			values[i] = enum_values[i].toString();
		return values;
	}

	public static void openObject(final Integer id) {
		fetch(DS.OBJECTS, null, null, null, new AdvancedCriteria("ID", OperatorId.EQUALS, id), new FetchCallback() {
			public void execute(Record[] records) {
				if (records.length == 1) {
					String objType = records[0].getAttribute("TYPE");
					if (objType.equals(ObjectType.CONFIG_CONTROL.toString()))
						new ConfigurationControl(records[0]).show();
					else if (objType.equals(ObjectType.PORT_MANAGE.toString()))
						new PortManage(records[0]).show();
					else if (objType.equals(ObjectType.DEVICE_MANAGE.toString())) {
						final Record obj = records[0];
						fetch(DS.DM_FIELDS, null, null, null, new AdvancedCriteria("OBJECT_ID", OperatorId.EQUALS, id), new FetchCallback() {
							public void execute(Record[] records) {
								new DeviceManage(obj, records.length > 0 ? records[0] : null).show();
							}
						});
					}
				} else
					G.dialogWarning(G.S.errorNoDataFound());
			}
		});
	}

	public interface FetchCallback {
		public void execute(Record[] records);
	}

	public static void fetch(DataSource datasource, String operationId, String outputs, String sortBy, Criteria criteria, final FetchCallback callback) {
		DSRequest req = new DSRequest();
		req.setShowPrompt(false);
		if (operationId != null)
			req.setOperationId(operationId);
		if (outputs != null)
			req.setOutputs(outputs);
		if (sortBy != null)
			req.setSortBy(SortSpecifier.convertToArray(sortBy));

		datasource.fetchData(criteria, new DSCallback() {
			public void execute(DSResponse response, Object rawData, DSRequest request) {
				if (response.getStatus() == DSResponse.STATUS_SUCCESS)
					callback.execute(response.getData());
			}
		}, req);
	}

	public static void checkSession(final Function callback) {
		// to check if the session is alive, we make a simple call to the server
		serverCall("dummy", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				callback.execute();
			}
		}, new Object[] {});
	}

	public static void download(DataSource datasource, String fieldName, Criteria criteria, String filename, String contentType) {
		DSRequest req = new DSRequest();
		req.setOutputs(fieldName);
		req.setDownloadResult(true);
		req.setDownloadToNewWindow(false);
		req.setOperationId("DOWNLOAD");
		criteria.addCriteria(Const.PARAM_FILENAME, filename);
		criteria.addCriteria(Const.PARAM_CONTENT_TYPE, contentType);
		datasource.fetchData(criteria, null, req);
	}

	public static void showText(String title, String text) {
		HTMLPane pane = new HTMLPane();
		// this is a method of displaying "flat" text, so the text is "processed" for correct display
		pane.setContents("<pre>" + StringUtil.asHTML(text) + "</pre>");
		showInWindow(title, 900, 700, true, null, pane);
	}

	public interface RefreshRowInCacheCallback {
		public void afterRefresh(RefreshRowResult result, Record record);
	}

	public enum RefreshRowResult {
		Refreshed, Deleted, Error
	}

	public static void refreshRowInCache(final DataSource datasource, String operationId, String outputs, final Criteria criteria,
			final RefreshRowInCacheCallback callback) {
		if (criteria.isAdvanced()) {
			// it is allowed to use only the usual conditions, because calling
			// removeRowFromCache(datasource, new Record(criteria.getValues()));
			// with using AdvancedCriteria will be incorrect
			G.dialogWarning("Cache refresh error");
			return;
		}
		fetch(datasource, operationId, outputs, null, criteria, new FetchCallback() {
			public void execute(Record[] records) {
				RefreshRowResult result;
				if (records.length > 0) {
					if (records.length == 1) {
						DSResponse resp = new DSResponse();
						resp.setOperationType(DSOperationType.UPDATE);
						resp.setData(new ListGridRecord(records[0].getJsObj()));
						datasource.updateCaches(resp);
						result = RefreshRowResult.Refreshed;
					} else {
						SC.logWarn("refreshRowInCache: fetch returned more than one row");
						result = RefreshRowResult.Error;
					}
				} else {
					removeRowFromCache(datasource, new Record(criteria.getValues()));
					result = RefreshRowResult.Deleted;
				}
				if (callback != null)
					callback.afterRefresh(result, result.equals(RefreshRowResult.Refreshed) ? records[0] : null);
			}
		});
	}

	public static void refreshRowsInCache(final DataSource datasource, String operationId, String outputs, final Criteria criteria) {
		fetch(datasource, operationId, outputs, null, criteria, new FetchCallback() {
			public void execute(Record[] records) {
				for (Record rec : records) {
					DSResponse resp = new DSResponse();
					resp.setOperationType(DSOperationType.UPDATE);
					resp.setData(new ListGridRecord(rec.getJsObj()));
					datasource.updateCaches(resp);
				}
			}
		});
	}

	public static void removeRowFromCache(DataSource datasource, Record record) {
		DSResponse resp = new DSResponse();
		resp.setOperationType(DSOperationType.REMOVE);
		resp.setData(new ListGridRecord(record));
		datasource.updateCaches(resp);
	}

	public static String getErrMsg(String msg) {
		if (msg != null) {
			Iterator<String> iterator = ERR_MSG.keySet().iterator();
			while (iterator.hasNext()) {
				String key = iterator.next();
				if (msg.toUpperCase().contains(key.toUpperCase()))
					return ERR_MSG.get(key);
			}
		}
		return null;
	}

	public static String getAllFieldsExceptComma(DataSource datasource, String... exceptFields) {
		String result = "";
		boolean ok;
		for (String field : datasource.getFieldNames()) {
			ok = true;
			for (String ex : exceptFields)
				if (field.equals(ex)) {
					ok = false;
					break;
				}
			if (ok)
				result += result.isEmpty() ? field : ("," + field);
		}
		return result;
	}

	public static String[] getAllFieldsExcept(DataSource datasource, String... exceptFields) {
		List<String> result = new ArrayList<String>();
		boolean ok;
		for (String field : datasource.getFieldNames()) {
			ok = true;
			for (String ex : exceptFields)
				if (field.equals(ex)) {
					ok = false;
					break;
				}
			if (ok)
				result.add(field);
		}
		return result.toArray(new String[0]);
	}

	public static void showLogin() {
		new Window(G.S.login(), false, true) {
			{
				final DynamicForm form = new DynamicForm();
				form.setShowErrorStyle(false);
				form.setFields(
						new TextItem("LOGIN", G.S.user()).required(true),
						new PasswordItem("PWD", G.S.password()) {
							{
								addKeyPressHandler(new KeyPressHandler() {
									public void onKeyPress(KeyPressEvent event) {
										if ("enter".equalsIgnoreCase(event.getKeyName())) {
											if (form.validate())
												login(form.getValueAsString("LOGIN"), form.getValueAsString("PWD"));
										}
									}
								});
							}
						}.required(true),
						new ButtonItem() {
							{
								setTitle(G.S.enter());
								addClickHandler(new com.smartgwt.client.widgets.form.fields.events.ClickHandler() {
									public void onClick(com.smartgwt.client.widgets.form.fields.events.ClickEvent event) {
										if (form.validate())
											login(form.getValueAsString("LOGIN"), form.getValueAsString("PWD"));
									}
								});
							}
						});
				form.setAutoFocus(true);
				form.setPadding(Const.DEFAULT_PADDING);
				form.setWidth(300);
				addItem(form);
			}

			void login(final String login, final String pwd) {
				RPCRequest req1 = new RPCRequest();
				req1.setActionURL("main.jsp");
				Cookies.removeCookie("JSESSIONID"); 
				// we delete the session number forcibly, because there are cases when the web 
				// server thinks that the user is authorized, but this user is no longer in the database, 
				// or he is blocked. To pass the re-authorization. 
				RPCManager.sendRequest(req1, new RPCCallback() {
					public void execute(RPCResponse response, Object rawData, RPCRequest request) {
						String resp = String.valueOf(rawData);
						if (resp.contains("<!--login form-->")) {
							// make a request for authorization
							RPCRequest req2 = new RPCRequest();
							req2.setContainsCredentials(true);
							req2.setActionURL("j_security_check");
							req2.setUseSimpleHttp(true);
							req2.setShowPrompt(false);
							Map<String, String> params = new HashMap<String, String>();
							params.put("j_username", login);
							params.put("j_password", G.calcMD5(pwd));
							req2.setParams(params);
							RPCManager.sendRequest(req2, new RPCCallback() {
								public void execute(RPCResponse response, Object rawData, RPCRequest request) {
									String error = Cookies.getCookie("loginError");
									Cookies.removeCookie("loginError");
									if ("1".equals(error)) {
										G.dialogWarning(G.S.loginFailed());
									} else {
										hide();
										RPCManager.resendTransaction();
									}
								}
							});
						} else {
							// somehow magically already logged in
							hide();
							RPCManager.resendTransaction();
						}
					}
				});
			}
		}.show();
	}

	public static void logout() {
		RPCRequest req = new RPCRequest();
		req.setActionURL("logout.jsp");
		RPCManager.sendRequest(req, new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				Location.reload();
			}
		});
	}

	public static String getRedText(String text) {
		return "<span style=\"color:red;\">" + text + "</span>";
	}

	public static String getGreenText(String text) {
		return "<span style=\"color:green;\">" + text + "</span>";
	}

	public static void waitDialogShow() {
		if (m_waitDialog == null)
			m_waitDialog = new WaitDialog();
		m_waitDialog.clearInfo();
		m_waitDialog.show();
	}

	public static void waitDialogHide() {
		if (m_waitDialog != null)
			m_waitDialog.hide();
	}

	public static void waitDialogSetInfo(String text) {
		if (m_waitDialog != null)
			m_waitDialog.setInfo(text);
	}

	public static boolean markDiffValues(String markField, String[] compareFieldPairs, ListGridRecord rec) {
		boolean mark = false;
		String f1 = null, f2 = null;
		for (int i = 0; i < compareFieldPairs.length; i++) {
			if (compareFieldPairs[i].equals(markField)) {
				mark = true;
				f1 = compareFieldPairs[i];
				f2 = i % 2 == 0 ? compareFieldPairs[i + 1] : compareFieldPairs[i - 1];
				break;
			}
		}

		if (mark) {
			String v1 = rec.getAttribute(f1);
			if (v1 == null)
				v1 = "";
			String v2 = rec.getAttribute(f2);
			if (v2 == null)
				v2 = "";
			mark = !v1.equals(v2);
		}

		return mark;
	}

	public static Window showInWindow(String title, int width, int height, boolean canDragResize, CloseClickHandler closeClickHandler, Canvas... elements) {
		Window w = new Window(title, true, true);
		w.setCanDragResize(canDragResize);
		if (width > 0 && height > 0)
			w.resizeTo(availWidth(width), availHeight(height));
		if (closeClickHandler != null)
			w.addCloseClickHandler(closeClickHandler);
		else
			w.destroyOnClose();
		for (Canvas c : elements)
			w.addItem(c);
		w.show();
		return w;
	}

	public static Window showInWindow(String title, Canvas... elements) {
		return showInWindow(title, 0, 0, false, null, elements);
	}

	public static Window showInWindow(String title, CloseClickHandler closeClickHandler, Canvas... elements) {
		return showInWindow(title, 0, 0, false, closeClickHandler, elements);
	}

	public static Window findParentWindow(Canvas c) {
		while (c != null && !(c instanceof Window))
			c = c.getParentCanvas();
		return (Window) c;
	}

	public static void uploadData(String title, String operation, final Runnable afterUpload, Object[] values, final Object[] columns) {
		final DynamicForm form = new DynamicForm();
		form.setWidth(300);
		form.setShowErrorStyle(false);
		form.setDataSource(DS.UPLOAD);
		form.setAddOperation(operation);
		form.setNumCols(1);
		final FileItem fi = new FileItem("FILE");
		fi.setShowTitle(false);
		fi.setMultiple(false);
		// fi.setRequired(true);
		// fi.setValidators(new FileItemValidator(FileType.Excel));
		form.setFields(fi);
		form.editNewRecord();
		// passing values
		for (int i = 0; i < values.length; i += 2)
			form.setValue(values[i].toString(), values[i + 1].toString());
		// we pass the correspondence of localized column names and internal
		final boolean dsf;
		if (columns[0] instanceof DataSourceField) {
			dsf = true;
			for (int i = 0; i < columns.length; i += 2) {
				DataSourceField f = (DataSourceField) columns[i];
				form.setValue(f.getName(), f.getTitle());
			}
		} else {
			dsf = false;
			for (int i = 0; i < columns.length; i += 3)
				form.setValue(columns[i].toString(), columns[i + 1].toString());
		}

		final HLayout hl = new HLayout(Const.DEFAULT_PADDING);
		hl.setPadding(Const.DEFAULT_PADDING);
		hl.setAutoHeight();
		hl.addMember(new IButton(G.S.load()) {
			@Override
			public void onClick() {
				// it is impossible for the form to be redrawn, because file data is lost
				// if (!form.validate())
				// return;
				if (fi.getValue() == null) {
					G.dialogWarning(G.S.specifyFile());
					return;
				}
				String ext = GS.getFileExtension(fi.getValue().toString());
				if (!("xls".equalsIgnoreCase(ext) || "xlsx".equalsIgnoreCase(ext))) {
					G.dialogWarning(G.S.fileMustBeExcel());
					return;
				}

				// before starting, we check the session, because if it has expired, it will not work correctly 
				checkSession(new Function() {
					public void execute() {
						G.waitDialogShow();
						form.saveData(new DSCallback() {
							public void execute(DSResponse resp, Object data, DSRequest dsRequest) {
								G.waitDialogHide();
								if (resp.getStatus() != DSResponse.STATUS_SUCCESS)
									return;
								G.findParentWindow(hl).destroy();

								// create columns for display
								final ListGridField[] fields = new ListGridField[columns.length / (dsf ? 2 : 3) + 1];
								int colWidth = 30;
								for (int i = 0, idx = 0; i < columns.length; i += (dsf ? 2 : 3), idx++) {
									int w = Integer.parseInt(columns[i + (dsf ? 1 : 2)].toString());
									colWidth += w;
									if (dsf) {
										DataSourceField f = (DataSourceField) columns[i];
										fields[idx] = new ListGridField(f.getName(), f.getTitle()).width(w);
									} else
										fields[idx] = new ListGridField(columns[i].toString(), columns[i + 1].toString()).width(w);
								}
								fields[fields.length - 1] = new ListGridField("RESULT", G.S.result()).width(300);
								colWidth += 300;

								// create a grid to display download results
								final ListGrid gr = new ListGrid() {
									@Override
									protected void gridInitFields() {
										setFields(fields);
									}

									/*@Override
									protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
										// color red errors
										if (getFieldName(colNum).equals("RESULT") && record.getAttributeAsBoolean("ERROR"))
											return Const.CSS_RED_TEXT;
										return super.getCellCSSText(record, rowNum, colNum);
									}*/
								};
								RecordList records = new RecordList(resp.getDataAsObject());
								for (int i = 0; i < records.getLength(); i++) {
									// converting some server errors
									String res = G.getErrMsg(records.get(i).getAttribute("RESULT"));
									if (res != null)
										records.get(i).setAttribute("RESULT", res);
								}
								gr.setData(records);
								gr.setHilites(new Hilite[] {
										new Hilite() {
											{
												setFieldNames("RESULT");
												setCriteria(new Criterion("ERROR", OperatorId.EQUALS, true));
												setCssText("color:red;");
												setHtmlBefore(Canvas.imgHTML(img16("import_error")) + " ");
											}
										},
										new Hilite() {
											{
												setFieldNames("RESULT");
												setCriteria(new Criterion("ERROR", OperatorId.NOT_EQUAL, true));
												setHtmlBefore(Canvas.imgHTML(img16("import_ok")) + " ");
											}
										} });

								G.showInWindow(G.S.result(), availWidth(colWidth), availHeight(600), true, new CloseClickHandler() {
									public void onCloseClick(CloseClickEvent event) {
										G.findParentWindow(gr).destroy();
										if (afterUpload != null)
											afterUpload.run();
									}
								}, gr);
							}
						});
					}
				});
			}
		});
		hl.addMember(new IButton(G.S.cancel()) {
			@Override
			public void onClick() {
				G.findParentWindow(hl).destroy();
			}
		});

		G.showInWindow(title, form, hl);
	}

	public static void listenConsoleData(boolean recursive) {
		if (!recursive && m_listenConsoleDataWork)
			return;
		m_listenConsoleDataWork = true;
		ServerCall.getConsoleData(new RecordsCallback() {
			public void execute(RecordList recs) {
				if (recs != null) {
					for (int i = 0; i < recs.getLength(); i++) {
						Record rec = recs.get(i);
						String consoleId = rec.getAttribute("ID");
						String conseleData = rec.getAttribute("DATA");
						Tab t = TABSET.getTab(consoleId);
						if (t != null)
							((ConsoleTab) t).processData(conseleData);
					}
				}
				// we continue to poll the server if there are console bookmarks
				int cnt = 0;
				for (Tab t : TABSET.getTabs())
					if (t instanceof ConsoleTab)
						cnt++;
				if (cnt > 0)
					listenConsoleData(true);
				else
					m_listenConsoleDataWork = false;
			}
		});
	}

	public static boolean allResponseSuccess(RPCResponse[] responses) {
		for (RPCResponse resp : responses)
			if (resp.getStatus() != RPCResponse.STATUS_SUCCESS)
				return false;
		return true;
	}

	public static String getErrorsFromResponses(RPCResponse[] responses) {
		Map<String, Object> m = new HashMap<String, Object>();

		for (RPCResponse resp : responses)
			if (resp.getStatus() == RPCResponse.STATUS_FAILURE) {
				String err = resp.getDataAsString();
				if (err != null && err.length() > 0) {
					SC.logWarn("Receive error from server: " + err);
					String x = G.getErrMsg(err);
					if (x != null)
						m.put(x, null); // we form a list of errors without repetitions
				}
			}

		StringBuilder sb = new StringBuilder();

		Iterator it = m.keySet().iterator();
		while (it.hasNext()) {
			sb.append(it.next());
			sb.append("<br>");
		}

		if (sb.length() == 0)
			sb.append(S.errorServerRequest());
		return sb.toString();
	}

	public static int availWidth(int width) {
		return Math.min(width, Page.getWidth() - 100);
	}

	public static int availHeight(int height) {
		return Math.min(height, Page.getHeight() - 100);
	}

	public static void startConsole(String title, int id, String idType) {
		checkSession(new Function() {
			public void execute() {
				// we check the session, because if the user is not authorized, then WebSocket will not be able to connect
				new ConsoleRealTime2(title, idType, id).show();
			}
		});
		/*G.waitDialogShow();
		ServerCall.startConsole(id, idType, new MapCallback() {
			public void execute(Map map) {
				G.waitDialogHide();
				new ConsoleRealTime(map.get("TITLE").toString(), map.get("ID").toString()).show();
			}
		});*/
	}

	public static boolean isEqual(Record a, Record b, String... compareAttributes) {
		if (a == null && b == null)
			return true;
		else if (a != null && b != null) {
			for (String attr : compareAttributes) {
				Object x = a.getAttributeAsObject(attr);
				Object y = b.getAttributeAsObject(attr);
				if (x == null && y == null)
					continue;
				else if (x != null && y != null && x.equals(y))
					continue;
				else
					return false;
			}
			return true;
		} else
			return false;
	}

	/*public static void setValues(DynamicForm form, Map values) {
		if (values != null) {
			// передаем только значения, для которых есть соответствующий элемент на форме
			Iterator<String> it = values.keySet().iterator();
			while (it.hasNext()) {
				String key = it.next();
				if (form.getField(key) == null)
					it.remove();
			}
			form.setValues(values);
		}
	}*/

	public static void inputVariables(RecordList list, Map<String, String> defaultValues, final MapCallback callback) {
		int len = list.getLength();
		if (len > 0) {
			List<FormItem> items = new ArrayList<FormItem>();
			for (int i = 0; i < len; i++) {
				Record rec = list.get(i);
				String var = rec.getAttribute("VARIABLE");
				String descr = rec.getAttribute("DESCR");
				boolean mandatory = rec.getAttributeAsBoolean("MANDATORY");
				switch (InputType.valueOf(rec.getAttribute("TYPE"))) {
				case TEXT:
					items.add(new TextItem(var, descr).required(mandatory));
					break;
				case PASSWORD:
					MatchesFieldValidator v = new MatchesFieldValidator();
					v.setOtherField(var);
					v.setErrorMessage(G.S.passwordsDoNotMatch());

					PasswordItem pwdAgain = new PasswordItem(var + "_PWDCHKAGAIN", descr + " " + G.S.passwordAgain()).required(mandatory);
					pwdAgain.setValidators(v);

					PasswordItem pwd = new PasswordItem(var, descr).required(mandatory);
					pwd.setLength(50);
					pwd.setIcons(new GenerateRandomString(Const.DEFAULT_PASSWORD_LENGTH, G.S.generatePassword())
							.showResultInWindow(G.S.generatedNewPassword())
							.setValueToFormItems(pwdAgain));

					items.add(pwd);
					items.add(pwdAgain);
					break;
				case IP:
					items.add(new IPItem(var, descr).required(mandatory));
					break;
				case BOOLEAN:
					items.add(new CheckboxItem(var, descr).required(mandatory).allowEmptyValue(true));
					break;
				case DATE:
					items.add(new DateTimeItem(var, descr).required(mandatory));
					break;
				case LIST:
					items.add(new SelectItem(var, descr, rec.getAttributeAsStringArray("LIST")).required(mandatory));
					break;
				}
			}
			final DynamicForm form = new DynamicForm();
			form.setShowErrorStyle(false);
			form.setWidth(500);
			form.setColWidths("150", "*");
			form.setPadding(Const.DEFAULT_PADDING);
			form.setItems(items.toArray(new FormItem[0]));
			if (defaultValues != null)
				form.setValues(defaultValues);
			HButtons btns = new HButtons(G.S.ok(), G.S.cancel()) {
				@Override
				protected void button1() {
					if (form.validate()) {
						Map values = new HashMap();
						for (FormItem fi : form.getFields())
							if (!fi.getName().endsWith("_PWDCHKAGAIN")) {
								if (fi instanceof DateTimeItem) // dates are immediately converted to the desired format									
									values.put(fi.getName(), G.formatDateTimestamp((Date) fi.getValue()));
								else
									values.put(fi.getName(), fi.getValue());
							}
						G.findParentWindow(this).destroy();
						callback.execute(values);
					}
				};

				@Override
				protected void button2() {
					G.findParentWindow(this).destroy();
				};
			};
			G.showInWindow(G.S.inputScriptParams(), form, btns);
		} else {
			callback.execute(new HashMap());
		}			
	}

	public static String formatDateTimestamp(Date value) {
		return value == null ? null : m_formatTimestamp.format(value);
	}

	public static String textWithIcon16(String icon, String text) {
		return Canvas.imgHTML(img16(icon)) + "&nbsp;&nbsp;" + text;
	}

	public static interface DialogCallback {
		public void buttonPressed(String button);
	}

	public static interface VariantCallback {
		public void execute(int variant);
	}

	public static void dialog(String title, String msg, String img, final String escapeButton, final DialogCallback callback, String... buttons) {

		Img im = new Img(img, 32, 32);
		Label la = new Label(msg);
		la.setWidth(300);

		HLayout hl = new HLayout(20);
		hl.setAutoHeight();
		hl.addMember(la);
		hl.addMember(im);

		final Window d = new Window(title, false, true);
		if (escapeButton != null) {
			d.addKeyPressHandler(new com.smartgwt.client.widgets.events.KeyPressHandler() {
				@Override
				public void onKeyPress(com.smartgwt.client.widgets.events.KeyPressEvent event) {
					if ("escape".equalsIgnoreCase(event.getKeyName())) {
						d.destroy();
						if (callback != null)
							callback.buttonPressed(escapeButton);
					}
				}
			});
		}
		HLayout btns = new HLayout(20);
		for (final String s : buttons) {
			btns.addMember(new IButton(s) {
				@Override
				protected void onClick() {
					d.destroy();
					if (callback != null)
						callback.buttonPressed(s);
				}
			});
		}

		VLayout vl = new VLayout(20);
		vl.setPadding(20);
		vl.setAutoHeight();
		vl.addMember(hl);
		vl.addMember(btns);

		d.addItem(vl);
		d.show();
		btns.getMember(0).focus();
	}

	public static void dialogWarning(String msg) {
		dialog(G.S.dialogWarningTitle(), msg, "[SKIN]Dialog/warn.png", G.S.ok(), null, G.S.ok());
	}

	public static void dialogAskForVariant(String title, String[] variants, VariantCallback callback) {
		dialogAskForVariant(title, variants, 0, callback);
	}

	public static void dialogAskForVariant(String title, String[] variants, int defaultVariant, VariantCallback callback) {
		RadioGroupItem rg = new RadioGroupItem();
		rg.setWrap(false);
		rg.setShowTitle(false);
		rg.setValueMap(variants);
		rg.setRequired(true);
		rg.setValue(variants[defaultVariant]);

		DynamicForm df = new DynamicForm();
		df.setColWidths("*");
		df.setNumCols(1);
		df.setItems(rg);

		HButtons btns = new HButtons(0, G.S.ok(), G.S.cancel()) {
			@Override
			protected void button1() {
				if (df.validate()) {
					G.findParentWindow(this).markForDestroy();
					callback.execute(getIndex(rg.getValue(), variants));
				}
			};

			@Override
			protected void button2() {
				G.findParentWindow(this).destroy();
				callback.execute(-1);
			};
		};
		G.showInWindow(title, G.wrapToVLayout(df, btns));
	}

	public static void dialogSay(String msg) {
		dialog(G.S.dialogSayTitle(), msg, "[SKIN]Dialog/say.png", G.S.ok(), null, G.S.ok());
	}

	public static void dialogAsk(String question, final BooleanCallback callback) {
		dialog(G.S.dialogAskTitle(), question, "[SKIN]Dialog/ask.png", G.S.no(), new DialogCallback() {
			@Override
			public void buttonPressed(String button) {
				callback.execute(button.equals(G.S.yes()));
			}
		}, G.S.yes(), G.S.no());
	}

	public static void dialogAskForValue(String msg, final ValueCallback callback) {

		Label la = new Label(msg);
		la.setWidth(350);

		final TextItem ti = new TextItem();
		ti.setShowTitle(false);

		DynamicForm df = new DynamicForm();
		df.setItems(ti);
		df.setWidth(350);
		df.setNumCols(1);

		final Window d = new Window(G.S.dialogAskForValueTitle(), false, true);
		d.addKeyPressHandler(new com.smartgwt.client.widgets.events.KeyPressHandler() {
			@Override
			public void onKeyPress(com.smartgwt.client.widgets.events.KeyPressEvent event) {
				if ("escape".equalsIgnoreCase(event.getKeyName())) {
					d.destroy();
					if (callback != null)
						callback.execute(null);
				}
			}
		});

		final Runnable clickOk = new Runnable() {
			public void run() {
				String result = ti.getValueAsString();
				d.destroy();
				if (callback != null)
					callback.execute(result);
			}
		};
		HLayout btns = new HLayout(20);
		final IButton btnOk = new IButton(G.S.ok()) {
			@Override
			protected void onClick() {
				clickOk.run();
			}
		};
		btns.addMember(btnOk);
		ti.addKeyPressHandler(new KeyPressHandler() {
			public void onKeyPress(KeyPressEvent event) {
				if ("enter".equalsIgnoreCase(event.getKeyName()))
					clickOk.run();
			}
		});
		btns.addMember(new IButton(G.S.cancel()) {
			@Override
			protected void onClick() {
				d.destroy();
				if (callback != null)
					callback.execute(null);
			}
		});

		VLayout vl = new VLayout(20);
		vl.setPadding(20);
		vl.setAutoHeight();
		vl.addMember(la);
		vl.addMember(df);
		vl.addMember(btns);

		d.addItem(vl);
		d.show();
		ti.focusInItem();
	}

	public static VLayout wrapToVLayout(Canvas... members) {
		return wrapToVLayout(Const.DEFAULT_PADDING, Const.DEFAULT_PADDING, members);
	}

	public static VLayout wrapToVLayout(int padding, int membersMargin, Canvas... members) {
		VLayout res = new VLayout(membersMargin);
		res.setPadding(padding);
		res.addMembers(members);
		return res;
	}

	public static void serverCall(String methodName, RPCCallback callback, Object[] arguments) {
		DMI.call("app", "RPC", methodName, callback, arguments, null);
	}

	public static void serverCall(String methodName, RPCCallback callback, Object[] arguments, RPCRequest requestParams) {
		DMI.call("app", "RPC", methodName, callback, arguments, requestParams);
	}

	public static RPCRequest willHandleError() {
		return new RPCRequest() {
			{
				setWillHandleError(true);
			}
		};
	}

	public static int getIndex(Object value, Object[] array) {
		for (int i = 0; i < array.length; i++) {
			if (value == null && array[i] == null)
				return i;
			if (value == null || array[i] == null)
				continue;
			if (value.toString().equals(array[i].toString()))
				return i;
		}
		return -1;
	}

	public static String img16(String filename) {
		return "[SKIN]16x16/" + filename + ".png";
	}

	public static String img24(String filename) {
		return "[SKIN]24x24/" + filename + ".png";
	}
}
