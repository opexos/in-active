package com.app.client.tabs;

import static com.app.client.G.img16;
import static com.app.client.G.img24;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.G.FetchCallback;
import com.app.client.G.VariantCallback;
import com.app.client.MapCallback;
import com.app.client.ScriptResultViewer;
import com.app.client.widgets.CheckboxItem;
import com.app.client.widgets.HButtons;
import com.app.client.widgets.IButton;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextItem;
import com.app.client.widgets.Window;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.ScriptExecuteResult;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.smartgwt.client.core.Function;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.DSCallback;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DSResponse;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.data.RequestTransformer;
import com.smartgwt.client.data.ResponseTransformer;
import com.smartgwt.client.data.SortSpecifier;
import com.smartgwt.client.rpc.RPCCallback;
import com.smartgwt.client.rpc.RPCRequest;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.DSOperationType;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ResizedEvent;
import com.smartgwt.client.widgets.events.ResizedHandler;
import com.smartgwt.client.widgets.events.VisibilityChangedEvent;
import com.smartgwt.client.widgets.events.VisibilityChangedHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickEvent;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickHandler;

public class Scripts extends AppTab {

	//private DMObjectList m_objList;
	private DMDeviceList m_DMdevList;
	private CCDeviceList m_CCdevList;
	private PMDeviceList m_PMdevList;
	private PMDeviceListWithPorts m_PMdevListPort;
	private List<Window> m_destroyOnEditWindowHide = new ArrayList<Window>();
	private Map m_lastInputVars;
	private int m_lastDeviceListVariant;


	public Scripts() {
		super();
		setTitle(img16("scripts_title"), G.S.scripts());
	}

	@Override
	protected void onClose() {
		super.onClose();
		if (m_DMdevList != null)
			m_DMdevList.destroy();
		if (m_PMdevList != null)
			m_PMdevList.destroy();
		if (m_CCdevList != null)
			m_CCdevList.destroy();
		if (m_PMdevListPort!=null)
			m_PMdevListPort.destroy();
	}

	protected Canvas getContent() {
		final ListGrid grid = new ListGrid(DS.SCRIPTS, true) {

			private Canvas m_scriptCanvas;
			private JavaScriptObject m_scriptEditor;
			// private IButton m_variableButton;

			// private void tuneVarBtn() {
			// m_variableButton.setVisible(GS.getInt(getEditWindowForm().getValue("TYPE")) == 1);
			// }

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				if (mode.equals(Mode.Add))
					scriptEditorSetValue(m_scriptEditor, "");
				else if (mode.equals(Mode.Update))
					scriptEditorSetValue(m_scriptEditor, editRecords[0].getAttributeAsString("SCRIPT"));
				// tuneVarBtn();
			}

			@Override
			protected void editWindowAfterHide(Mode mode) {
				super.editWindowAfterHide(mode);
				while (m_destroyOnEditWindowHide.size() > 0) {
					m_destroyOnEditWindowHide.remove(0).destroy();
				}
			}

			@Override
			protected void editWindowAfterShow(Mode mode) {
				super.editWindowAfterShow(mode);
				scriptEditorSetFocus(m_scriptEditor);
			}

			@Override
			protected void editWindowInit(Window w) {
				super.editWindowInit(w);
				w.setCanDragResize(true);
				w.resizeTo(G.availWidth(1200), G.availHeight(800));
				w.minSize(800, 500);
				w.addResizedHandler(new ResizedHandler() {
					public void onResized(ResizedEvent event) {
						// G.showLineNums(getEditWindowForm().getDOM(), "SCRIPT");
						// G.makeScriptEditor(getEditWindowForm().getDOM(), "SCRIPT");
					}
				});
				w.addVisibilityChangedHandler(new VisibilityChangedHandler() {
					public void onVisibilityChanged(VisibilityChangedEvent event) {
						// G.showLineNums(getEditWindowForm().getDOM(), "SCRIPT");
						// G.makeScriptEditor(getEditWindowForm().getDOM(), "SCRIPT");
					}
				});
			}

			@Override
			protected Canvas editWindowBottom() {
				m_scriptCanvas = new Canvas() {
					{
						setWidth100();
						setHeight100();
						setBorder("1px solid silver");
					}
				};
				return m_scriptCanvas;
			}

			@Override
			protected void editWindowAfterDraw(Window w) {
				m_scriptEditor = makeScriptEditor(m_scriptCanvas.getContentElement());
			}

			@Override
			protected void editFormInit(final DynamicForm form, DataSource ds) {
				form.setWidth100();
				// form.setHeight100();
				form.setFields(
						new TextItem(ds.getField("NAME")),
						new SelectItem(ds.getField("TYPE"), G.SCRIPT_TYPES) /*{
																			{
																			addChangedHandler(new ChangedHandler() {
																			public void onChanged(ChangedEvent event) {
																			tuneVarBtn();
																			}
																			});
																			}
																			}*/);
			}

			@Override
			protected Canvas[] editWindowAdditionalButtons() {
				// m_variableButton = new IButton(G.S.variables(), img("variables")) {
				// @Override
				// protected void onClick() {
				// /*RecordList rl = new RecordList();
				// rl.add(newRec(Const.VAR_DEVICENAME, G.S.deviceName(), G.S.text()));
				// rl.add(newRec(Const.VAR_LOGIN, G.S.login(), G.S.text()));
				// rl.add(newRec(Const.VAR_PASSWORD, G.S.password(), G.S.text()));
				// rl.add(newRec(Const.VAR_ENABLEPASSWORD, G.S.enablePassword(), G.S.text()));*/
				//
				// if (m_objList == null)
				// m_objList = new DMObjectList();
				// m_objList.show();
				// }
				// };
				return new Canvas[] {
						new IButton(G.S.execute(), img24("run_script")) {
							@Override
							protected void onClick() {
								DynamicForm f = getEditWindowForm();
								if (f.validate())
									executeScript(f.getValueAsString("TYPE"), scriptEditorGetValue(m_scriptEditor));
							}
						} // , m_variableButton
				};
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("NAME").width(300),
						new ListGridField("TYPE", G.SCRIPT_TYPES).width(300));
			}

			@Override
			protected void beforeSave(Mode mode, Record record) {
				super.beforeSave(mode, record);
				record.setAttribute("SCRIPT", scriptEditorGetValue(m_scriptEditor));
			}

		};
		grid.addButton(img24("link_script_to_objects"), G.S.linkScriptToObjects(), new com.smartgwt.client.widgets.events.ClickHandler() {
			public void onClick(com.smartgwt.client.widgets.events.ClickEvent event) {
				linkToObjects(grid);
			}
		});
		grid.addButton(img24("link_script_to_device_types"), G.S.linkScriptToDeviceTypes(), new com.smartgwt.client.widgets.events.ClickHandler() {
			public void onClick(com.smartgwt.client.widgets.events.ClickEvent event) {
				linkToDeviceTypes(grid);
			}
		});
		grid.setFieldStateId("GridScripts");
		grid.setSortField("NAME");
		grid.setFieldNameForDeleteQuestion("NAME");
		grid.setAutoFetchData(true);
		return grid;
	}

	private static final String OP_SCRIPT_LINK = "SCRIPT_LINK";

	private boolean isScriptLinkRequest(DSRequest req) {
		return //req.getDataSource().equals("objects") &&
				req.getOperationType().equals(DSOperationType.UPDATE) &&
				OP_SCRIPT_LINK.equals(req.getOperationId());
	}

	private void linkToObjects(ListGrid grid) {
		final Record editedRecord = grid.getSelectedRecordIfOnlyOne();
		if (editedRecord == null)
			return;
		// if (!editedRecord.getAttribute("TYPE").equals(ScriptType.DEVICE_MANAGE.toString())) {
		// G.dialogWarning(G.M.actionAvailableOnlyForScriptsWithType(G.SCRIPT_TYPES.get(ScriptType.DEVICE_MANAGE.toString())));
		// return;
		// }

		DataSource ds = DataSource.get("objects",
				new RequestTransformer() {
					protected Object transformRequest(DSRequest req) {
						if (isScriptLinkRequest(req)) {
							// передаем дополнительно код скрипта, чтобы корректно отработался кастомный запрос
							Record rec = new Record(req.getData());
							rec.setAttribute("SCRIPT_ID", editedRecord.getAttribute("ID"));
							req.setData(rec);
						}
						return getDefaultTransformRequest(req);
					}
				},
				new ResponseTransformer() {
					protected void transformResponse(DSResponse response, DSRequest req, Object data) {
						if (isScriptLinkRequest(req)) {
							// т.к. для изменения данных отрабатывает кастомный запрос, то система пытается полностью обновить кэш - нам это не нужно,
							// только лишняя трата времени и ресурсов
							response.setInvalidateCache(false);
						}
					}
				});

		final ListGrid gr = new ListGrid(ds, true, false, false, false, false, false) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("LINKED", G.S.linked()).bool().canEdit().noFilter().width(100),
						new ListGridField("MAP_NAME", G.S.map()).width("*"),
						new ListGridField("NAME", G.S.object()).width("*"));
			}
		};
		gr.setSelectionType(SelectionStyle.NONE);
		gr.setWidth(500);
		gr.setHeight(500);
		gr.setSort(SortSpecifier.convertToArray("MAP_NAME,NAME"));
		// gr.addCriteria("TYPE", OperatorId.EQUALS, ObjectType.DEVICE_MANAGE.toString());
		gr.addCriteria("SCRIPT_ID", OperatorId.EQUALS, editedRecord.getAttribute("ID"));
		gr.setFetchOperation(OP_SCRIPT_LINK);
		gr.setUpdateOperation(OP_SCRIPT_LINK);
		gr.setAutoSaveEdits(false);
		gr.setAutoFetchData(true);

		final DynamicForm df = new DynamicForm();
		df.setDataSource(DS.SCRIPTS, new CheckboxItem("PUBLIC", G.S.availableInAllObjects()).labelAsTitle(false));
		// чтобы форма передавала на сервер только апдейт флага, а не всех полей, создаем новую запись только с перв. ключом и флагом
		df.editRecord(Record.copyAttributes(editedRecord, "ID", "PUBLIC"));

		HButtons btns = new HButtons((Integer) null, G.S.save(), G.S.cancel()) {
			@Override
			protected void button1() {
				df.saveData(new DSCallback() {
					public void execute(DSResponse dsResponse, Object data, DSRequest dsRequest) {
						if (dsResponse.getStatus() == DSResponse.STATUS_SUCCESS) {
							if (dsResponse.getDataAsObject() == null) {
								G.dialogWarning(G.S.errorNoDataFound());
								G.removeRowFromCache(DS.SCRIPTS, editedRecord);
							} else {
								if (gr.hasChanges())
									gr.saveAllEdits(new Function() {
										public void execute() {
											G.findParentWindow(gr).destroy();
										}
									});
								else
									G.findParentWindow(gr).destroy();
							}
						}
					}
				});
			}

			@Override
			protected void button2() {
				G.findParentWindow(this).destroy();
			}
		};
		G.showInWindow(G.S.linkScriptToObjects(), G.wrapToVLayout(df, gr, btns));
	}

	private void linkToDeviceTypes(ListGrid grid) {
		final Record editedRecord = grid.getSelectedRecordIfOnlyOne();
		if (editedRecord == null)
			return;

		DataSource ds = DataSource.get("device_types",
				new RequestTransformer() {
					protected Object transformRequest(DSRequest req) {
						if (isScriptLinkRequest(req)) {
							Record rec = new Record(req.getData());
							rec.setAttribute("SCRIPT_ID", editedRecord.getAttribute("ID"));
							req.setData(rec);
						}
						return getDefaultTransformRequest(req);
					}
				},
				new ResponseTransformer() {
					protected void transformResponse(DSResponse response, DSRequest req, Object data) {
						if (isScriptLinkRequest(req)) {
							response.setInvalidateCache(false);
						}
					}
				});

		final ListGrid gr = new ListGrid(ds, true, false, false, false, false, false) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("LINKED", G.S.linked()).bool().canEdit().noFilter().width(100),
						new ListGridField("NAME", G.S.deviceType()).width("*"));
			}
		};
		gr.setSelectionType(SelectionStyle.NONE);
		gr.setWidth(500);
		gr.setHeight(500);
		gr.setSort(SortSpecifier.convertToArray("NAME"));
		// gr.addCriteria("TYPE", OperatorId.EQUALS, ObjectType.DEVICE_MANAGE.toString());
		gr.addCriteria("SCRIPT_ID", OperatorId.EQUALS, editedRecord.getAttribute("ID"));
		gr.setFetchOperation(OP_SCRIPT_LINK);
		gr.setUpdateOperation(OP_SCRIPT_LINK);
		gr.setAutoSaveEdits(false);
		gr.setAutoFetchData(true);

		final DynamicForm df = new DynamicForm();
		df.setDataSource(DS.SCRIPTS, new CheckboxItem("ALL_DEVICE_TYPES", G.S.compatibleWithAllDeviceTypes()).labelAsTitle(false));
		df.editRecord(Record.copyAttributes(editedRecord, "ID", "ALL_DEVICE_TYPES"));

		HButtons btns = new HButtons(0, G.S.save(), G.S.cancel()) {
			@Override
			protected void button1() {
				df.saveData(new DSCallback() {
					public void execute(DSResponse dsResponse, Object data, DSRequest dsRequest) {
						if (dsResponse.getStatus() == DSResponse.STATUS_SUCCESS) {
							if (dsResponse.getDataAsObject() == null) {
								G.dialogWarning(G.S.errorNoDataFound());
								G.removeRowFromCache(DS.SCRIPTS, editedRecord);
							} else {
								if (gr.hasChanges())
									gr.saveAllEdits(new Function() {
										public void execute() {
											G.findParentWindow(gr).destroy();
										}
									});
								else
									G.findParentWindow(gr).destroy();
							}
						}
					}
				});
			}

			@Override
			protected void button2() {
				G.findParentWindow(this).destroy();
			}
		};
		G.showInWindow(G.S.linkScriptToDeviceTypes(), G.wrapToVLayout(df, gr, btns)).setCanDragResize(true);;
	}

	
	private void executeScript(final String type, final String script) {
		G.serverCall("parseInputVariables", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				if (response.getStatus() == RPCResponse.STATUS_SUCCESS) {
					// запрашиваем параметры и отрабатываем скрипт
					G.inputVariables(new RecordList(response.getDataAsObject()), m_lastInputVars,
							new MapCallback() {
								public void execute(Map map) {
									m_lastInputVars = map;
									if (type.equals("2")) { 
										if (m_PMdevListPort == null)
											m_PMdevListPort = new PMDeviceListWithPorts();
										m_PMdevListPort.script = script;
										m_PMdevListPort.params = map;
										m_PMdevListPort.show();
									} else {
										G.dialogAskForVariant(G.S.whatDevicesShow(),
												new String[] { G.S.fromDMObjects(), G.S.fromCCObjects(), G.S.fromPMObjects()},
												m_lastDeviceListVariant,
												new VariantCallback() {
													public void execute(int variant) {
														if (variant != -1) 
															m_lastDeviceListVariant = variant;
														if (variant == 0) {
															if (m_DMdevList == null)
																m_DMdevList = new DMDeviceList();
															m_DMdevList.script = script;
															m_DMdevList.params = map;
															m_DMdevList.show();
														} else if (variant == 1) {
															if (m_CCdevList == null)
																m_CCdevList = new CCDeviceList();
															m_CCdevList.script = script;
															m_CCdevList.params = map;
															m_CCdevList.show();
														}else if (variant == 2) {
															if (m_PMdevList == null)
																m_PMdevList = new PMDeviceList();
															m_PMdevList.script = script;
															m_PMdevList.params = map;
															m_PMdevList.show();
														}
													}
												});
									}

								}
							});
				} else {
					String err = response.getDataAsString();
					int pos = err.indexOf(":");
					if (pos >= 0)
						err = err.substring(pos + 1);
					G.dialogWarning(err);
				}
			}
		},
				new Object[] { script },
				new RPCRequest() {
					{
						setWillHandleError(true);
					}
				});

	}

	/*private static class ConnectParams extends Window {
		String script;
		String type;
	
		public ConnectParams() {
			super(G.S.connectionParams(), true, true);
			final SelectItem conType = new SelectItem(G.S.connectionType(), G.CONNECT_TYPES).required(true);
			final TextItem host = new TextItem(G.S.ip()).required(true);
			final IntegerItem port = new IntegerItem(G.S.port()).range(1, 65535).required(true);
			final TextItem login = new TextItem(G.S.login());
			final PasswordItem pwd = new PasswordItem(G.S.password());
			final PasswordItem enPwd = new PasswordItem(G.S.enablePassword());
			final DynamicForm form = new DynamicForm();
			form.setWidth(300);
			form.setShowErrorStyle(false);
	
			ButtonItem btnExecuteScript = new ButtonItem();
			btnExecuteScript.setTitle(G.S.executeScript());
			btnExecuteScript.setIcon("green_triangle.png");
			btnExecuteScript.addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
					if (!form.validate())
						return;
					G.waitDialogShow();
					if (ScriptType.DOWNLOAD_CONFIGURATION.toString().equals(type)) {
						ServerCall.downloadConfig(script, host.getValueAsString(), conType.getValueAsString(), port.getValueAsInteger(),
								login.getValueAsString(), pwd.getValueAsString(), enPwd.getValueAsString(), new DownloadConfigCallback() {
									public void execute(boolean ok, String console, String log, String config) {
										G.waitDialogHide();
										new ExecuteResult(ok, console, log, config, null).show();
									};
								});
					} else {
						ServerCall.executeScript(script, host.getValueAsString(), conType.getValueAsString(), port.getValueAsInteger(),
								login.getValueAsString(), pwd.getValueAsString(), enPwd.getValueAsString(), new ExecuteScriptCallback() {
									public void execute(boolean ok, String console, String log) {
										G.waitDialogHide();
										new ExecuteResult(ok, console, log, null, null).show();
									};
								});
					}
				}
			});
	
			form.setPadding(Const.DEFAULT_PADDING);
			form.setFields(conType, host, port, login, pwd, enPwd, btnExecuteScript);
			addItem(form);
		}
	}*/

	/*private class DMObjectList extends Window {

		public DMObjectList() {
			super(G.S.selectObject(), true, true);
			resizeTo(G.availWidth(800), G.availHeight(500));
			minSize(500, 300);
			setCanDragResize(true);

			final ListGrid gr = new ListGrid(DS.OBJECTS, true, false, false, false, true, true) {
				{
					addCriteria("TYPE", OperatorId.EQUALS, ObjectType.DEVICE_MANAGE.toString());
					setAutoFetchData(true);
					setSelectionType(SelectionStyle.SINGLE);
					setWidth100();
					setHeight100();
				}

				@Override
				protected void gridInitFields() {
					setFields(
							new ListGridField("MAP_NAME", G.S.map()).width("*"),
							new ListGridField("NAME", G.S.object()).width("*"));
				}
			};
			gr.addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
				public void onRecordDoubleClick(RecordDoubleClickEvent event) {
					selected(gr);
				}
			});
			HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
				protected void button1() {
					selected(gr);
				};

				protected void button2() {
					DMObjectList.this.hide();
				};
			};
			addItem(G.wrapToVLayout(gr, btns));
		}

		void selected(ListGrid gr) {
			final ListGridRecord obj = gr.getSelectedRecordIfOnlyOne();
			if (obj == null)
				return;
			DMObjectList.this.hide();
			G.fetch(DS.DM_FIELDS, null, null, null, new AdvancedCriteria("OBJECT_ID", OperatorId.EQUALS, obj.getAttribute("ID")), new FetchCallback() {
				public void execute(Record[] records) {
					RecordList rl = new RecordList();
					if (records.length > 0) {
						for (String field : records[0].getAttributes()) {
							String title = records[0].getAttribute(field);
							if (title != null && !title.isEmpty()) {
								String var = title.replace(' ', '_').toLowerCase();
								if (field.startsWith("BOOL"))
									rl.add(newRec(var, title, G.S.checkbox()));
								else if (field.startsWith("TEXT"))
									rl.add(newRec(var, title, G.S.text()));
								else if (field.startsWith("IP"))
									rl.add(newRec(var, title, G.S.ip()));
								else if (field.startsWith("DATE"))
									rl.add(newRec(var, title, G.S.date()));
								else if (field.startsWith("DICT") && !field.startsWith("DICT_ID"))
									rl.add(newRec(var, title, G.S.dictionary()));
							}
						}
					}
					ListGrid gr = new ListGrid() {
						{
							setData(rl);
							setSelectionType(SelectionStyle.SINGLE);
							setWidth100();
							setHeight100();
						}

						@Override
						protected void gridInitFields() {
							setFields(new ListGridField("VAR", G.S.variable()).width("*"),
									new ListGridField("DESCR", G.S.description()).width("*"),
									new ListGridField("TYPE", G.S.type()).width(100));
						}
					};
					Window w = new Window(G.S.availableVariables(), true, false);
					w.setCanDragResize(true);
					// w.setShowMinimizeButton(true);
					w.resizeTo(G.availWidth(600), G.availHeight(500));
					w.addItem(G.wrapToVLayout(new Label(obj.getAttribute("MAP_NAME") + " - " + obj.getAttribute("NAME")), gr));
					w.show();
					m_destroyOnEditWindowHide.add(w);
				}
			});
		}

	}*/

	Record newRec(String var, String descr, String type) {
		Record r = new Record();
		r.setAttribute("VAR", var);
		r.setAttribute("DESCR", descr);
		r.setAttribute("TYPE", type);
		return r;
	}

	private static class DMDeviceList extends Window {
		String script;
		Map params;

		public DMDeviceList() {
			super(G.S.selectDeviceForScriptExecute(), true, true);
			resizeTo(1000, 500);
			minSize(500, 300);
			setCanDragResize(true);

			final ListGrid gr = new ListGrid(DS.DM_DEVICES, true, false, false, false, true, true) {
				{
					setAutoFetchData(true);
					setSelectionType(SelectionStyle.SINGLE);
					setWidth100();
					setHeight100();
				}

				@Override
				protected void gridInitFields() {
					setFields(
							new ListGridField("MAP_NAME", G.S.map()).width("*"),
							new ListGridField("OBJECT_NAME", G.S.object()).width("*"),
							new ListGridField("HOST", G.S.ip()).width("*"),
							new ListGridField("DEVICE_NAME", G.S.name()).width("*"),
							new ListGridField("DEVICE_TYPE_NAME", G.S.deviceType()).width("*"));
				}
			};
			gr.addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
				public void onRecordDoubleClick(RecordDoubleClickEvent event) {
					selected(gr);
				}
			});
			HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
				protected void button1() {
					selected(gr);
				};

				protected void button2() {
					DMDeviceList.this.hide();
				};
			};
			addItem(G.wrapToVLayout(gr, btns));
		}

		void selected(ListGrid gr) {
			final ListGridRecord dev = gr.getSelectedRecordIfOnlyOne();
			if (dev == null)
				return;
			DMDeviceList.this.hide();
			G.waitDialogShow();
			G.fetch(DS.DM_FIELDS, null, null, null, new AdvancedCriteria("OBJECT_ID", OperatorId.EQUALS, dev.getAttribute("OBJECT_ID")), new FetchCallback() {
				public void execute(Record[] records) {
					final Record fields = records.length > 0 ? records[0] : null;
					G.fetch(DS.DM_DEVICES, "WITH_CREDENTIALS", null, null, new AdvancedCriteria("ID", OperatorId.EQUALS, dev.getAttribute("ID")),
							new FetchCallback() {
								public void execute(Record[] records) {
									if (records.length == 0) {
										G.waitDialogHide();
										G.dialogWarning(G.S.deviceNotFound());
										return;
									}
									final Record oldValues = records[0];
									G.serverCall("executeScriptDM", new RPCCallback() {
										public void execute(RPCResponse response, Object rawData, RPCRequest request) {
											G.fetch(DS.DM_DEVICES, "WITH_CREDENTIALS", null, null,
													new AdvancedCriteria("ID", OperatorId.EQUALS, dev.getAttribute("ID")),
													new FetchCallback() {
														public void execute(Record[] records) {
															Record newValues = records.length > 0 ? records[0] : null;
															RecordList rl = null;
															if (newValues != null) {
																rl = new RecordList();
																rl.add(newRec(G.S.deviceName(),
																		oldValues.getAttribute("DEVICE_NAME"),
																		newValues.getAttribute("DEVICE_NAME")));
																rl.add(newRec(G.S.login(),
																		GS.decode(oldValues.getAttribute("LOGIN")),
																		GS.decode(newValues.getAttribute("LOGIN"))));
																rl.add(newRec(G.S.password(),
																		GS.decode(oldValues.getAttribute("PWD")),
																		GS.decode(newValues.getAttribute("PWD"))));
																rl.add(newRec(G.S.enablePassword(),
																		GS.decode(oldValues.getAttribute("ENABLE_PWD")),
																		GS.decode(newValues.getAttribute("ENABLE_PWD"))));
																if (fields != null) {
																	for (String field : fields.getAttributes()) {
																		String title = fields.getAttribute(field);
																		if (title != null && !title.isEmpty()) {
																			if (field.startsWith("DATE"))
																				rl.add(newRec(title,
																						G.formatDateTimestamp(oldValues.getAttributeAsDate(field)),
																						G.formatDateTimestamp(newValues.getAttributeAsDate(field))));
																			else if (field.startsWith("BOOL") ||
																					field.startsWith("TEXT") ||
																					field.startsWith("IP") ||
																					(field.startsWith("DICT") && !field.startsWith("DICT_ID"))) {
																				rl.add(newRec(title, oldValues.getAttribute(field),
																						newValues.getAttribute(field)));
																			}
																		}
																	}
																}
															}
															G.waitDialogHide();
															new ScriptResultViewer(new ScriptExecuteResult(response.getDataAsMap()), rl,null).show();
														}
													});
										};
									}, new Object[] {null, dev.getAttributeAsInt("ID"), params, script});

								}
							});
				}
			});

		}

		Record newRec(String title, String oldValue, String newValue) {
			Record r = new Record();
			r.setAttribute("TITLE", title);
			r.setAttribute("OLD", oldValue);
			r.setAttribute("NEW", newValue);
			return r;
		}
	}

	private static class CCDeviceList extends Window {
		String script;
		Map params;

		public CCDeviceList() {
			super(G.S.selectDeviceForScriptExecute(), true, true);
			resizeTo(1000, 500);
			minSize(500, 300);
			setCanDragResize(true);

			final ListGrid gr = new ListGrid(DS.CC_DEVICES, true, false, false, false, true, true) {
				{
					setAutoFetchData(true);
					setSelectionType(SelectionStyle.SINGLE);
					setWidth100();
					setHeight100();
				}

				@Override
				protected void gridInitFields() {
					setFields(
							new ListGridField("MAP_NAME", G.S.map()).width("*"),
							new ListGridField("OBJECT_NAME", G.S.object()).width("*"),
							new ListGridField("HOST", G.S.ip()).width("*"),
							new ListGridField("DEVICE_NAME", G.S.name()).width("*"),
							new ListGridField("DEVICE_TYPE_NAME", G.S.deviceType()).width("*"));
				}
			};
			gr.addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
				public void onRecordDoubleClick(RecordDoubleClickEvent event) {
					selected(gr);
				}
			});
			HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
				protected void button1() {
					selected(gr);
				};

				protected void button2() {
					CCDeviceList.this.hide();
				};
			};
			addItem(G.wrapToVLayout(gr, btns));
		}

		void selected(ListGrid gr) {
			final ListGridRecord dev = gr.getSelectedRecordIfOnlyOne();
			if (dev == null)
				return;
			CCDeviceList.this.hide();
			G.waitDialogShow();
			G.serverCall("executeScriptCC", new RPCCallback() {
				public void execute(RPCResponse response, Object rawData, RPCRequest request) {
					G.waitDialogHide();
					new ScriptResultViewer(response).show();
				}
			}, new Object[] { null, dev.getAttributeAsInt("ID"), params, script });			
		}

	}

	private static class PMDeviceList extends Window {
		String script;
		Map params;

		public PMDeviceList() {
			super(G.S.selectDeviceForScriptExecute(), true, true);
			resizeTo(1000, 500);
			minSize(500, 300);
			setCanDragResize(true);

			final ListGrid gr = new ListGrid(DS.PM_DEVICES, true, false, false, false, true, true) {
				{
					setAutoFetchData(true);
					setSelectionType(SelectionStyle.SINGLE);
					setWidth100();
					setHeight100();
				}

				@Override
				protected void gridInitFields() {
					setFields(
							new ListGridField("MAP_NAME", G.S.map()).width("*"),
							new ListGridField("OBJECT_NAME", G.S.object()).width("*"),
							new ListGridField("HOST", G.S.ip()).width("*"),
							new ListGridField("DEVICE_NAME", G.S.name()).width("*"),
							new ListGridField("DEVICE_TYPE_NAME", G.S.deviceType()).width("*"));
				}
			};
			gr.addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
				public void onRecordDoubleClick(RecordDoubleClickEvent event) {
					selected(gr);
				}
			});
			HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
				protected void button1() {
					selected(gr);
				};

				protected void button2() {
					PMDeviceList.this.hide();
				};
			};
			addItem(G.wrapToVLayout(gr, btns));
		}

		void selected(ListGrid gr) {
			final ListGridRecord dev = gr.getSelectedRecordIfOnlyOne();
			if (dev == null)
				return;
			PMDeviceList.this.hide();
			G.waitDialogShow();
			G.serverCall("executeScriptPM", new RPCCallback() {
				public void execute(RPCResponse response, Object rawData, RPCRequest request) {
					G.waitDialogHide();
					new ScriptResultViewer(response).show();
				}
			}, new Object[] { null, dev.getAttributeAsInt("ID"), params, script });			
		}

	}


	private static class PMDeviceListWithPorts extends Window {
		String script;
		Map params;

		public PMDeviceListWithPorts() {
			super(G.S.selectDeviceForScriptExecute(), true, true);
			resizeTo(1000, 500);
			minSize(500, 300);
			setCanDragResize(true);

			final ListGrid gr = new ListGrid(DS.PM_PORTS, true, false, false, false, true, true) {
				{
					setOutputs("MAP_NAME,OBJECT_NAME,HOST,NAME,DEVICE_TYPE_NAME,PORT");
					setAutoFetchData(true);
					setSelectionType(SelectionStyle.SINGLE);
					setWidth100();
					setHeight100();
				}

				@Override
				protected void gridInitFields() {
					setFields(
							new ListGridField("MAP_NAME", G.S.map()).width("*"),
							new ListGridField("OBJECT_NAME", G.S.object()).width("*"),
							new ListGridField("HOST", G.S.ip()).width("*"),
							new ListGridField("NAME", G.S.name()).width("*"),
							new ListGridField("DEVICE_TYPE_NAME", G.S.deviceType()).width("*"),
							new ListGridField("PORT", G.S.port()).width("*"));
				}
			};
			gr.addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
				public void onRecordDoubleClick(RecordDoubleClickEvent event) {
					selected(gr);
				}
			});
			HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
				protected void button1() {
					selected(gr);
				};

				protected void button2() {
					PMDeviceListWithPorts.this.hide();
				};
			};
			addItem(G.wrapToVLayout(gr, btns));
		}

		void selected(ListGrid gr) {
			final ListGridRecord dev = gr.getSelectedRecordIfOnlyOne();
			if (dev == null)
				return;
			PMDeviceListWithPorts.this.hide();
			G.waitDialogShow();
			params.put(Const.VAR_PORT, dev.getAttribute("PORT"));
			G.serverCall("executeScriptPM", new RPCCallback() {
				public void execute(RPCResponse response, Object rawData, RPCRequest request) {
					G.waitDialogHide();
					new ScriptResultViewer(response).show();
				}
			}, new Object[] { null, dev.getAttributeAsInt("ID"), params, script });

		}

	}

	/*private static class DeviceList extends Window {
		String script;
		Map params;

		public DeviceList() {
			super(G.S.selectDeviceForScriptExecute(), true, true);
			resizeTo(G.availWidth(1000), G.availHeight(500));
			minSize(500, 300);
			setCanDragResize(true);

			final ListGrid gr = new ListGrid(DS.DEVICES, true, false, false, false, true, true) {
				{
					setOutputs("MAP_NAME,HOST,NAME,DEVICE_TYPE_NAME,ID");
					setAutoFetchData(true);
					setSelectionType(SelectionStyle.SINGLE);
					setWidth100();
					setHeight100();
				}

				@Override
				protected void gridInitFields() {
					setFields(
							new ListGridField("MAP_NAME", G.S.map()).width("*"),
							new ListGridField("HOST", G.S.ip()).width("*"),
							new ListGridField("NAME", G.S.name()).width("*"),
							new ListGridField("DEVICE_TYPE_NAME", G.S.deviceType()).width("*"));
				}
			};
			gr.addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
				public void onRecordDoubleClick(RecordDoubleClickEvent event) {
					selected(gr);
				}
			});
			HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
				protected void button1() {
					selected(gr);
				};

				protected void button2() {
					DeviceList.this.hide();
				};
			};
			addItem(G.wrapToVLayout(gr, btns));
		}

		void selected(ListGrid gr) {
			final ListGridRecord dev = gr.getSelectedRecordIfOnlyOne();
			if (dev == null)
				return;
			DeviceList.this.hide();
			G.waitDialogShow();
			G.serverCall("executeScriptEditor", new RPCCallback() {
				public void execute(RPCResponse response, Object rawData, RPCRequest request) {
					// показываем результаты
					G.waitDialogHide();
					new ScriptResultViewer(response).show();
				}
			}, new Object[] { script, dev.getAttributeAsInt("ID"), params });

		}

	}*/

	private native JavaScriptObject makeScriptEditor(Element el) /*-{
		var editor = $wnd.CodeMirror(function(elt) {
			el.parentNode.replaceChild(elt, el);
		}, {
			lineNumbers : true,
			matchBrackets : true,
			highlightSelectionMatches : true,
			smartIndent : true,
			tabSize : 4,
			indentWithTabs : true,
			indentUnit : 4,
			autoCloseBrackets : true
		});
		editor.setOption("extraKeys", {
			"Ctrl-Space" : function(cm) {
				cm.toggleComment();
			}
		});
		return editor;
	}-*/;

	private native String scriptEditorGetValue(JavaScriptObject ed) /*-{
																	return ed.getValue();
																	}-*/;

	private native void scriptEditorSetValue(JavaScriptObject ed, String value) /*-{
																				ed.setValue(value);
																				}-*/;

	private native void scriptEditorSetFocus(JavaScriptObject ed) /*-{
																	ed.focus();
																	}-*/;
}
