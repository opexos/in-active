package com.app.client;

import static com.app.client.G.img24;

import java.util.HashMap;
import java.util.Map;

import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.Menu;
import com.app.client.widgets.MenuItem;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.ObjectType;
import com.app.shared.ScriptExecuteResult;
import com.app.shared.ScriptExecuteStatus;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.Criteria;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.data.SortSpecifier;
import com.smartgwt.client.rpc.RPCCallback;
import com.smartgwt.client.rpc.RPCRequest;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.util.BooleanCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickEvent;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickHandler;
import com.smartgwt.client.widgets.menu.events.ItemClickEvent;
import com.smartgwt.client.widgets.menu.events.ItemClickHandler;

public class ScriptExec {

	private static Map<String, Map> m_params = new HashMap<String, Map>();
	private static String FIELD_DATA = "___DATA___";
	private static String FIELD_STATUS = "___STATUS___";

	public static void showScripts(final ListGridRecord[] devices, int objectId, ObjectType objectType, Canvas atCanvas) {
		// if all devices have the same device type, then we pass it to the request, otherwise we pass 0, 
		// and then the list of scripts will be formed without compatibility check
		int deviceTypeId = devices[0].getAttributeAsInt("DEVICE_TYPE_ID");
		for (ListGridRecord rec : devices) {
			if (deviceTypeId != rec.getAttributeAsInt("DEVICE_TYPE_ID")) {
				deviceTypeId = 0;
				break;
			}
		}

		// clearing past script results
		for (ListGridRecord rec : devices) {
			rec.setAttribute(FIELD_DATA, (String) null);
			rec.setAttribute(FIELD_STATUS, (String) null);
		}

		Criteria crit = new Criteria();
		crit.addCriteria("OBJECT_ID", objectId);
		crit.addCriteria("DEVICE_TYPE_ID", deviceTypeId);
		// if there is a PORT field in the transmitted strings, then a list of ports was passed
		if (devices[0].getAttribute("PORT") != null)
			crit.addCriteria("TYPE", G.SCRIPT_FOR_PORT);
		else
			crit.addCriteria("TYPE", G.SCRIPT_FOR_DEVICE);

		G.fetch(DS.SCRIPTS, "OBJECT_SCRIPTS", "ID,NAME", "NAME", crit,
				new G.FetchCallback() {
					public void execute(Record[] records) {
						if (records.length == 0) {
							G.dialogWarning(G.S.noAvailableScripts());
							return;
						}
						Menu menu = new Menu();
						menu.addItemClickHandler(new ItemClickHandler() {
							public void onItemClick(final ItemClickEvent event) {
								G.dialogAsk(G.M.askScriptExecute(event.getItem().getTitle()), new BooleanCallback() {
									public void execute(Boolean value) {
										// menu.markForDestroy();
										if (value != null && value) {
											executeScript(event.getItem().getAttribute("ID"), devices, objectType, null);
										}
									}
								});
							}
						});
						for (Record o : records) {
							MenuItem mi = new MenuItem(o.getAttribute("NAME"));
							Record.copyAttributesInto(mi, o, "ID");
							menu.addItem(mi);
						}
						menu.setLeft(atCanvas.getAbsoluteLeft());
						menu.setTop(atCanvas.getAbsoluteTop() + atCanvas.getHeight());
						menu.show();
					}
				});
	}

	public static void executeScript(final String what, final ListGridRecord[] devices, ObjectType objectType, Map inParams) {
		String parser = null;
		Object[] params = null;

		if (GS.getInt(what) > 0) {
			parser = "parseInputVariables2";
			params = new Object[] { GS.getInt(what) };
		} else {
			parser = "parseInputVariables3";
			// both a list of devices and a list of ports can be transmitted, we process this situation
			params = new Object[] { what, GS.getArrayInt(devices[0].getAttribute("PORT") != null ? "PM_DEVICE_ID" : "ID", devices),
					objectType.toString() };
		}

		G.serverCall(parser, new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				G.inputVariables(new RecordList(response.getDataAsObject()), m_params.get(what), new MapCallback() {
					public void execute(Map map) {
						m_params.put(what, map); // запоминаем параметры
						G.waitDialogShow();
						// we create a copy, because we do not want to modify the saved parameters
						if (map != null)
							map = new HashMap(map);
						else
							map = new HashMap();
						// adding the passed parameters
						if (inParams != null)
							map.putAll(inParams);
						executeScript(what, devices, map, 0, objectType);
					}
				});
			}
		}, params);
	}

	private static String getProcName(ObjectType objectType) {
		String procName = null;
		switch (objectType) {
		case CONFIG_CONTROL:
			procName = "executeScriptCC";
			break;
		case DEVICE_MANAGE:
			procName = "executeScriptDM";
			break;
		case PORT_MANAGE:
			procName = "executeScriptPM";
			break;
		}
		return procName;
	}

	private static void executeScript(final String what, final ListGridRecord[] devices, final Map params, final int idx, ObjectType objectType) {
		if (idx == devices.length) {
			G.waitDialogHide();
			showResults(devices, objectType);
		} else {
			if (devices.length > 1)
				G.waitDialogSetInfo((idx + 1) + " / " + devices.length);

			int devId = 0;
			if (devices[idx].getAttribute("PORT") != null) {
				// run the script on the list of ports
				params.put(Const.VAR_PORT, devices[idx].getAttribute("PORT"));
				devId = devices[idx].getAttributeAsInt("PM_DEVICE_ID");
			} else {
				devId = devices[idx].getAttributeAsInt("ID");
			}

			G.serverCall(getProcName(objectType),
					new RPCCallback() {
						public void execute(RPCResponse response, Object rawData, RPCRequest request) {
							if (response.getStatus() == RPCResponse.STATUS_SUCCESS) {
								Map res = response.getDataAsMap();
								ScriptExecuteResult result = new ScriptExecuteResult(res);
								devices[idx].setAttribute(FIELD_DATA, res);
								devices[idx].setAttribute(FIELD_STATUS, result.status.equals(ScriptExecuteStatus.OK) ? G.S.ok() : G.getRedText(G.S.error()));
							} else {
								devices[idx].setAttribute(FIELD_STATUS,
										G.getRedText(GS.nvl(G.getErrMsg(response.getDataAsString()), G.S.errorServerRequest())));
							}
							executeScript(what, devices, params, idx + 1, objectType);
						}
					},
					new Object[] { what, devId, params, null },
					G.willHandleError());
		}
	}

	private static void showResults(final ListGridRecord[] rows, ObjectType objectType) {
		// if scripts were executed on devices from the "device management" object, then we will update the 
		// data in the cache so that the new field values ​​are immediately displayed
		if (objectType.equals(ObjectType.DEVICE_MANAGE)) {
			Integer[] ids = new Integer[rows.length];
			for (int i = 0; i < ids.length; i++)
				ids[i] = rows[i].getAttributeAsInt("ID");
			AdvancedCriteria cr = new AdvancedCriteria("ID", OperatorId.IN_SET, ids);
			G.refreshRowsInCache(DS.DM_DEVICES, null, null, cr);
		}

		if (rows.length > 1) {
			final ListGrid gr = new ListGrid() {
				{
					addButton(img24("view_script_execute_result"), G.S.showResult(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							showResult();
						}
					});
					addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
						public void onRecordDoubleClick(RecordDoubleClickEvent event) {
							showResult();
						}
					});
					setData(rows);
					setSelectionType(SelectionStyle.SINGLE);
				}

				void showResult() {
					ListGridRecord rec = getSelectedRecord();
					if (rec != null) {
						Map m = rec.getAttributeAsMap(FIELD_DATA);
						if (m != null)
							new ScriptResultViewer(m).show();
					}
				}

				@Override
				protected void gridInitFields() {
					if (rows[0].getAttribute("PORT") != null) {
						setFields(
								new ListGridField("HOST", G.S.ip()).width(150),
								new ListGridField("DEVICE_NAME", G.S.name()).width(150),
								new ListGridField("PORT", G.S.port()).width(100),
								new ListGridField(FIELD_STATUS, G.S.status()).width("*"));
						setSort(SortSpecifier.convertToArray("HOST,PORT"));
					} else {
						setFields(
								new ListGridField("HOST", G.S.ip()).width(150),
								new ListGridField("DEVICE_NAME", G.S.name()).width(150),
								new ListGridField(FIELD_STATUS, G.S.status()).width("*"));
						setSort(SortSpecifier.convertToArray("HOST"));
					}
				}

				/*@Override
				protected Canvas createRecordComponent(ListGridRecord record, Integer colNum) {
					if (getFieldName(colNum).equals("SHOW_RESULT")) {
						final String text = record.getAttribute("RESULT");
						if (text != null && !text.trim().isEmpty()) {
							ImgButton button = new ImgButton("text_view.png", G.S.showResult(),
									new ClickHandler() {
										public void onClick(ClickEvent event) {
											G.showText(G.S.result(), text);
										}
									}, 16);
							return button;
						}
					}
					if (getFieldName(colNum).equals("SHOW_LOG")) {
						final String text = record.getAttribute("LOG");
						if (text != null && !text.trim().isEmpty()) {
							ImgButton button = new ImgButton("text_view.png", G.S.showLog(),
									new ClickHandler() {
										public void onClick(ClickEvent event) {
											G.showText(G.S.log(), text);
										}
									}, 16);
							return button;
						}
					}
					if (getFieldName(colNum).equals("SHOW_CONSOLE")) {
						final String text = record.getAttribute("CONSOLE");
						if (text != null && !text.isEmpty()) {
							ImgButton button = new ImgButton("console.png", G.S.showConsole(),
									new ClickHandler() {
										public void onClick(ClickEvent event) {
											G.showText(G.S.console(), text);
										}
									}, 16);
							return button;
						}
					}
					return null;
				}*/
			};
			// gr.setShowRecordComponents(true);
			// gr.setShowRecordComponentsByCell(true);
			G.showInWindow(G.S.result(), 700, 500, true, null, G.wrapToVLayout(gr));
		} else {
			// if there was some error on the server, then FIELD_DATA will be empty
			if (rows[0].getAttribute(FIELD_DATA) != null)
				new ScriptResultViewer(rows[0].getAttributeAsMap(FIELD_DATA)).show();
			else
				G.dialogWarning(rows[0].getAttribute(FIELD_STATUS));
		}
	}
}
