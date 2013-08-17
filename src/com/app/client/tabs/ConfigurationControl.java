package com.app.client.tabs;

import static com.app.client.G.img16;
import static com.app.client.G.img24;

import java.util.ArrayList;
import java.util.List;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.G.FetchCallback;
import com.app.client.G.RefreshRowInCacheCallback;
import com.app.client.G.RefreshRowResult;
import com.app.client.ScriptExec;
import com.app.client.widgets.FormFieldTitle;
import com.app.client.widgets.ImgButton;
import com.app.client.widgets.IntegerItem;
import com.app.client.widgets.IntervalItem;
import com.app.client.widgets.Label;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.ToolStrip;
import com.app.shared.ColorText;
import com.app.shared.Const;
import com.app.shared.GetConfigResult;
import com.app.shared.ObjectType;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.Criteria;
import com.smartgwt.client.data.DSCallback;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DSResponse;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.SortSpecifier;
import com.smartgwt.client.rpc.RPCManager;
import com.smartgwt.client.rpc.RPCQueueCallback;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SelectionAppearance;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.types.SortDirection;
import com.smartgwt.client.util.BooleanCallback;
import com.smartgwt.client.util.ValueCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.HTMLPane;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.events.CloseClickEvent;
import com.smartgwt.client.widgets.events.CloseClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.grid.events.SelectionUpdatedEvent;
import com.smartgwt.client.widgets.grid.events.SelectionUpdatedHandler;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.VLayout;

public class ConfigurationControl extends AppTab {

	private Record m_objectInfo;
	private ListGrid m_grid;
	private boolean readOnly;
	private ImgButton m_executeScriptBtn;

	public ConfigurationControl(Record objectInfo) {
		super();
		m_objectInfo = objectInfo;
		readOnly = "READ_ONLY".equals(objectInfo.getAttribute("ACCESS"));
		setTitle(img16("configuration_control_title"), objectInfo.getAttribute("MAP_NAME") + " - " + objectInfo.getAttribute("NAME"));
	}

	protected Canvas getContent() {
		m_grid = new ListGrid(DS.CC_DEVICES, true, !readOnly, !readOnly, !readOnly, true, true) {
			ListGrid m_dev;
			FormFieldTitle m_label;

			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				if (getFieldName(colNum).equals("LAST_GET_CONFIG_RESULT"))
					if (GetConfigResult.ERROR.toString().equals(record.getAttribute("LAST_GET_CONFIG_RESULT")))
						return Const.CSS_RED_TEXT;
				if (getFieldName(colNum).equals("HAS_UNCHECKED_CONFIG"))
					if (Boolean.parseBoolean(record.getAttribute("HAS_UNCHECKED_CONFIG")))
						return Const.CSS_RED_TEXT;
				return super.getCellCSSText(record, rowNum, colNum);
			}

			@Override
			protected Canvas editWindowTop() {
				m_label = new FormFieldTitle(G.S.devicesToAdd());
				m_label.setRequired(true);
				m_label.setErrorMessage(G.S.selectDevicesToAdd());

				m_dev = new ListGrid() {
					@Override
					protected void gridInitFields() {
						setFields(new ListGridField("HOST"),
								new ListGridField("NAME"),
								new ListGridField("DEVICE_TYPE_NAME"),
								new ListGridField("LOCATION"),
								new ListGridField("COMMENT"));
					}
				};
				m_dev.setDataSource(DS.DEVICES);
				m_dev.setFetchOperation("NOT_EXISTS_IN_CC_DEVICES");
				m_dev.addCriteria("OBJECT_ID", m_objectInfo.getAttributeAsInt("ID"));
				m_dev.setShowFilterEditor(true);
				m_dev.setSelectionType(SelectionStyle.SIMPLE);
				m_dev.setSelectionAppearance(SelectionAppearance.CHECKBOX);
				m_dev.setWidth(500);
				m_dev.setHeight(300);
				m_dev.setFieldStateId("GridConfigurationControlAddDevList");

				VLayout vl = new VLayout(Const.DEFAULT_PADDING);
				vl.setMembers(m_label, m_dev);
				return vl;
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setColWidths(200, "*");
				form.setWidth(500);
				form.setFields(
						new IntervalItem(ds.getField("GET_CONFIG_INTERVAL"), G.S.intervalGetConfig()),
						new IntegerItem(ds.getField("STORE_CONFIG_DAYS"), G.S.storeConfigDays()).range(1, Const.STORE_CONFIG_DAYS_MAX));
				setAllowMultiEdit(true);
			}

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				if (mode == Mode.Update) {
					m_label.hide();
					m_dev.hide();
				} else {
					m_label.show();
					m_label.setError(false);
					m_dev.show();
					m_dev.scrollBodyTo(0, 0);
					m_dev.reloadData();
				}
			}

			@Override
			protected boolean editWindowSaveValidate(Mode mode) {
				if (mode == Mode.Update)
					return super.editWindowSaveValidate(mode);
				else {
					m_label.setError(m_dev.getSelectedRecords().length == 0);
					return !m_label.getError() & super.editWindowSaveValidate(mode);
				}
			}

			@Override
			protected Record[] getAddRecords() {
				ListGridRecord[] selDev = m_dev.getSelectedRecords();
				Record[] recs = new Record[selDev.length];
				for (int i = 0; i < recs.length; i++) {
					recs[i] = new Record(getEditRecordValues().toMap());
					recs[i].setAttribute("DEVICE_ID", selDev[i].getAttribute("ID"));
					recs[i].setAttribute("OBJECT_ID", m_objectInfo.getAttribute("ID"));
				}
				return recs;
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("HOST").width(200),
						new ListGridField("DEVICE_NAME").width(130),
						new ListGridField("DEVICE_TYPE_NAME").width(130),
						new ListGridField("GET_CONFIG_INTERVAL").interval(),
						new ListGridField("STORE_CONFIG_DAYS").width(70),
						new ListGridField("HAS_UNCHECKED_CONFIG", G.TRUE_FALSE).width(80),
						new ListGridField("LAST_GET_CONFIG_DATE").date(),
						new ListGridField("LAST_GET_CONFIG_RESULT", G.GET_CONFIG_RESULTS).width(250),
						new ListGridField("COMMENT").width(200),
						new ListGridField("LOCATION").width(200));
			}

		};

		m_grid.addButton(img24("config_history"), G.S.configHistory(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showConfigHistory();
			}
		});
		if (!readOnly)
			m_grid.addButton(img24("accept_config_changes"), G.S.acceptChangesInConfigs(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					acceptChanges();
				}
			});
		m_grid.addButton(img24("config_query_history"), G.S.deviceQueryHistory(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showDeviceQueryHistory();
			}
		});
		m_grid.addButton(img24("find_in_configs"), G.S.findInConfigs(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				findInConfigs();
			}
		});
		m_grid.addButton(img24("show_last_config_from_db"), G.S.showLastConfigFromHistory(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showLastConfigFromHistory();
			}
		});
		m_grid.addButton(img24("request_and_show_config"), G.S.showConfigFromDevice(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showConfigFromDevice();
			}
		});
		if (!readOnly) {
			m_grid.addButton(img24("console"), G.S.connectToDevice(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					ListGridRecord rec = m_grid.getSelectedRecordIfOnlyOne();
					if (rec != null)
						G.startConsole(rec.getAttribute("HOST"),rec.getAttributeAsInt("ID"), "CC");
				}
			});
			m_executeScriptBtn = m_grid.addButton(img24("execute_script"), G.S.executeScript(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					ListGridRecord[] recs = m_grid.getSelectedRecords();
					if (recs.length == 0)
						G.dialogWarning(G.S.selectOneOrManyRowsInTable());
					else
						ScriptExec.showScripts(recs, m_objectInfo.getAttributeAsInt("ID"), ObjectType.CONFIG_CONTROL, m_executeScriptBtn);
				}
			});
		}
		m_grid.addButton(img24("save_list"), G.S.saveDeviceList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				m_grid.exportToExcel("devices.xls");
			}
		});
		// m_grid.addButton(Icons24.LOAD_LIST, G.S.loadDeviceList(), new ClickHandler() {
		// public void onClick(ClickEvent event) {
		// loadDevicesFromFile();
		// }
		// });
		m_grid.addRecordsCount();
		m_grid.setFieldNameForDeleteQuestion("HOST");
		m_grid.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttributeAsInt("ID"));
		m_grid.setFieldStateId("GridConfigurationControl");
		m_grid.setAutoFetchData(true);
		return m_grid;
	}

	private boolean isError(Record record) {
		return GetConfigResult.ERROR.toString().equals(record.getAttribute("RESULT"));
	}

	private void showDeviceQueryHistory() {

		final ListGridRecord device = m_grid.getSelectedRecordIfOnlyOne();
		if (device == null)
			return;

		ListGrid grid = new ListGrid(DS.CC_LOG, false, false, false, false, true, true) {

			{
				addButton(img24("save"), G.S.saveLog(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						ListGridRecord rec = getSelectedRecordIfOnlyOne();
						if (rec == null)
							return;
						if (isError(rec))
							G.download(DS.CC_LOG, "ERROR_LOG", new Criteria("ID", rec.getAttribute("ID")), "log.txt", Const.CONTENT_TYPE_TEXT_PLAIN);
						else
							G.dialogWarning(G.S.logsOnlyForErrors());
					}
				});
				addButton(img24("text_view"), G.S.showLog(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						ListGridRecord rec = getSelectedRecordIfOnlyOne();
						if (rec == null)
							return;
						if (isError(rec))
							G.fetch(DS.CC_LOG, null, "ERROR_LOG", null, new Criteria("ID", rec.getAttribute("ID")),
									new FetchCallback() {
										public void execute(Record[] records) {
											if (records.length == 0)
												G.dialogWarning(G.S.errorNoDataFound());
											else
												G.showText(G.S.log(), records[0].getAttribute("ERROR_LOG"));
										}
									});
						else
							G.dialogWarning(G.S.logsOnlyForErrors());
					}
				});
				setSelectionType(SelectionStyle.SINGLE);
				setWidth(400);
				setHeight(500);
				addCriteria("CC_DEVICE_ID", OperatorId.EQUALS, device.getAttributeAsInt("ID"));
				setOutputs(G.getAllFieldsExceptComma(DS.CC_LOG, "ERROR_LOG"));
				setSortDirection(SortDirection.DESCENDING);
				setSortField("LOG_DATE");
				setAutoFetchData(true);
			}

			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				if (getFieldName(colNum).equals("RESULT") && isError(record))
					return Const.CSS_RED_TEXT;
				return super.getCellCSSText(record, rowNum, colNum);
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("LOG_DATE", G.S.date()).date(),
						new ListGridField("RESULT", G.S.result(), G.GET_CONFIG_RESULTS).width("*"));
			}
		};

		G.showInWindow(G.S.deviceQueryHistory(), G.wrapToVLayout(grid));
	}

	private void showConfigHistory() {
		final ListGridRecord ccDev = m_grid.getSelectedRecordIfOnlyOne();
		if (ccDev == null)
			return;

		final Integer ccDeviceId = ccDev.getAttributeAsInt("ID");

		final ListGrid grid = new ListGrid(DS.CC_CONFIG_HISTORY, false, false, false, false, true, true) {
			{
				addButton(img24("save"), G.S.saveConfig(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						ListGridRecord rec = getSelectedRecordIfOnlyOne();
						if (rec != null)
							G.download(DS.CC_CONFIG_HISTORY, "CONFIG", new Criteria("ID", rec.getAttribute("ID")), "config.txt", Const.CONTENT_TYPE_TEXT_PLAIN);
					}
				});
				addButton(img24("text_view"), G.S.showConfig(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						ListGridRecord rec = getSelectedRecordIfOnlyOne();
						if (rec != null)
							G.fetch(DS.CC_CONFIG_HISTORY, "WITH_CONFIG", "CONFIG", null, new Criteria("ID", rec.getAttribute("ID")),
									new FetchCallback() {
										public void execute(Record[] records) {
											if (records.length == 0)
												G.dialogWarning(G.S.errorNoDataFound());
											else
												G.showText(G.S.configuration(), records[0].getAttribute("CONFIG"));
										}
									});
					}
				});
				addButton(img24("compare_configs"), G.S.showDiffsInConfigs(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						ListGridRecord[] recs = getSelectedRecords();
						if (recs.length != 2) {
							G.dialogWarning(G.S.selectTwoRowsInTable());
							return;
						}
						DSRequest req = new DSRequest();
						req.setOperationId("COMPARE");
						req.setSortBy(new SortSpecifier[] { new SortSpecifier("CONFIG_DATE", SortDirection.DESCENDING) });
						Criteria criteria = new Criteria();
						criteria.addCriteria("ID", new Integer[] { recs[0].getAttributeAsInt("ID"), recs[1].getAttributeAsInt("ID") });
						DS.CC_CONFIG_HISTORY.fetchData(criteria, new DSCallback() {
							public void execute(DSResponse response, Object rawData, DSRequest request) {
								String prevOper = null;
								final List<Integer> walk = new ArrayList<Integer>();
								int lineNum = -1;
								StringBuilder sb = new StringBuilder();
								sb.append("<div class=\"colortext\">");
								for (Record r : response.getData()) {
									for (String x : r.getAttribute("TEXT").replace("\r\n", "\n").split("\n")) {
										lineNum++;
										String oper = r.getAttribute("OPERATION");
										if (!oper.equals(prevOper)) {
											if (prevOper != null) {
												sb.append("</pre>");
												if (prevOper.equals("EQUAL"))
													walk.add(lineNum);
											}
											if (oper.equals("EQUAL"))
												sb.append("<pre>");
											else if (oper.equals("INSERT"))
												sb.append("<pre class=\"green\">");
											else if (oper.equals("DELETE"))
												sb.append("<pre class=\"red\">");
											prevOper = oper;
										}
										sb.append(x);
										sb.append("\n");
									}
								}
								if (lineNum >= 0)
									sb.append("</pre>");
								sb.append("</div>");

								final HTMLPane pane = new HTMLPane();
								pane.setContents(sb.toString());

								ToolStrip menu = new ToolStrip();
								menu.addMember(new ImgButton(img24("next_diff"), G.S.gotoNextChange(), new ClickHandler() {
									public void onClick(ClickEvent event) {
										int curPos = (int) Math.ceil(pane.getScrollTop() / 15f);
										for (int i = 0; i < walk.size(); i++) {
											if (walk.get(i) > curPos) {
												pane.scrollTo(0, walk.get(i) * 15);
												break;
											}
										}
									}
								}, 24));
								menu.addMember(new ImgButton(img24("prev_diff"), G.S.gotoPrevChange(), new ClickHandler() {
									public void onClick(ClickEvent event) {
										int curPos = (int) Math.ceil(pane.getScrollTop() / 15f);
										for (int i = walk.size() - 1; i >= 0; i--) {
											if (walk.get(i) < curPos) {
												pane.scrollTo(0, walk.get(i) * 15);
												break;
											}
										}
									}
								}, 24));
								menu.addMember(new ImgButton(img24("info"), G.S.help(), new ClickHandler() {
									public void onClick(ClickEvent event) {
										G.dialogSay(G.S.configCompareHelp());
									}
								}, 24));

								G.showInWindow(G.S.changes(), G.availWidth(900), G.availHeight(700), true, null, menu, pane);
							}
						}, req);
					}
				});
				if (!readOnly) {
					addButton(img24("accept_config_changes"), G.S.acceptChanges(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							ListGridRecord[] recs = getSelectedRecords();
							if (recs.length == 0) {
								G.dialogWarning(G.S.selectOneOrManyRowsInTable());
								return;
							}

							for (ListGridRecord rec : recs)
								if (Boolean.parseBoolean(rec.getAttribute("CHECKED"))) {
									G.dialogWarning(G.S.selectOnlyUncheckedConfigs());
									return;
								}

							RPCManager.startQueue();
							for (ListGridRecord rec : recs) {
								DSRequest prop = new DSRequest();
								prop.setOperationId("SET_CHECKED");
								updateData(Record.copyAttributes(rec, "ID"), null, prop);
							}
							RPCManager.sendQueue();
						}
					});
				}
				setWidth(600);
				setHeight(500);
				addCriteria("CC_DEVICE_ID", OperatorId.EQUALS, ccDeviceId);
				setOutputs(G.getAllFieldsExceptComma(DS.CC_CONFIG_HISTORY, "CONFIG"));
				setSortDirection(SortDirection.DESCENDING);
				setSortField("CONFIG_DATE");
				setAutoFetchData(true);
			}

			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				if (getFieldName(colNum).equals("CHECKED"))
					if (!Boolean.parseBoolean(record.getAttribute("CHECKED")))
						return Const.CSS_RED_TEXT;
				return super.getCellCSSText(record, rowNum, colNum);
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("CONFIG_DATE", G.S.date()).prompt(G.S.configDownloadDate()).date(),
						new ListGridField("CHECKED", G.S.checked(), G.TRUE_FALSE).width(80),
						new ListGridField("WHEN_CHECKED", G.S.whenChecked()).date(),
						new ListGridField("WHO_CHECKED", G.S.whoChecked()).width("*"));
			}
		};

		G.showInWindow(G.S.configHistory(), new CloseClickHandler() {
			public void onCloseClick(CloseClickEvent event) {
				G.findParentWindow(grid).destroy();
				refreshRow(ccDeviceId, ccDev.getAttribute("HOST"));
			}
		}, G.wrapToVLayout(grid));
	}

	private void refreshRow(int ccDeviceId, final String host) {
		Criteria crit = new Criteria();
		crit.addCriteria("ID", ccDeviceId);

		G.refreshRowInCache(DS.CC_DEVICES, null, m_grid.getOutputs(), crit,
				new RefreshRowInCacheCallback() {
					public void afterRefresh(RefreshRowResult result, Record record) {
						if (result.equals(RefreshRowResult.Refreshed)) {
							// after updating the data in the cache, the grid leaves focus on the updated row
							// m_grid.selectRecord(record);
						} else if (result.equals(RefreshRowResult.Deleted)) {
							G.dialogWarning(G.M.deviceWasRemovedByOtherUser(host));
						}
					}
				});
	}

	private void findInConfigs() {
		G.dialogAskForValue(G.S.enterFindString(), new ValueCallback() {
			public void execute(String value) {
				if (value == null || value.trim().isEmpty())
					return;

				AdvancedCriteria criteria = new AdvancedCriteria(OperatorId.AND);
				criteria.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttributeAsInt("ID"));
				criteria.addCriteria("CONFIG", OperatorId.ICONTAINS, value);

				G.waitDialogShow();
				G.fetch(DS.CC_DEVICES, "WITH_CONFIG", "ID,HOST,DEVICE_NAME,CONFIG", null, criteria, new FetchCallback() {
					public void execute(Record[] records) {
						G.waitDialogHide();
						if (records.length > 0)
							showFindResults(records, value);
						else
							G.dialogSay(G.S.notFound());
					}
				});
			}
		});
	}

	private void showFindResults(final Record[] records, final String findText) {
		final HTMLPane paneConfig = new HTMLPane();
		paneConfig.setCanSelectText(true);
		final HTMLPane paneFound = new HTMLPane();
		paneFound.setCanSelectText(true);

		final ListGrid devices = new ListGrid() {
			{
				setData(records);
				setShowResizeBar(true);
				setWidth(250);
				setSelectionType(SelectionStyle.SINGLE);
				addSelectionUpdatedHandler(new SelectionUpdatedHandler() {
					public void onSelectionUpdated(SelectionUpdatedEvent event) {
						Record rec = getSelectedRecord();
						if (rec == null) {
							paneConfig.setContents("");
							paneFound.setContents("");
						} else
							showFindResults(rec.getAttribute("CONFIG"), findText, paneConfig, paneFound);
					}
				});
			}

			@Override
			protected void gridInitFields() {
				setFields(new ListGridField("HOST", G.S.ip()),
						new ListGridField("DEVICE_NAME", G.S.name()).width("*"));
			}
		};

		VLayout vl = new VLayout();
		VLayout t = G.wrapToVLayout(0, 0, new Label(G.S.configuration()).padding(3).backgroundLightSilver().withBottomBorder(), paneConfig);
		t.setBorder("1px solid #aaaaaa");
		t.setShowResizeBar(true);
		vl.addMember(t);
		t = G.wrapToVLayout(0, 0, new Label(G.S.foundLines()).padding(3).backgroundLightSilver().withBottomBorder(), paneFound);
		t.setBorder("1px solid #aaaaaa");
		vl.addMember(t);

		HLayout hl = new HLayout();
		hl.addMembers(devices, vl);

		G.showInWindow(G.S.findResults(), G.availWidth(1000), G.availHeight(700), true, null, G.wrapToVLayout(hl));
	}

	private void showFindResults(String config, String findText, HTMLPane configPane, HTMLPane foundPane) {
		ColorText ctConfig = new ColorText(true);
		ColorText ctFound = new ColorText(true);
		String[] lines = config.replace("\r\n", "\n").split("\n");
		String findTextUp = findText.toUpperCase();
		String line;
		for (int i = 0; i < lines.length; i++) {
			line = lines[i];
			if (line.toUpperCase().contains(findTextUp)) {
				ctConfig.addLine(line, null, i + 1, findText);
				ctFound.addLine(line, null, i + 1, findText);
			} else
				ctConfig.addLine(line, null, i + 1);
		}
		configPane.scrollToTop();
		foundPane.scrollToTop();
		configPane.setContents(ctConfig.getHtml());
		foundPane.setContents(ctFound.getHtml());
	}

	private void showLastConfigFromHistory() {
		ListGridRecord rec = m_grid.getSelectedRecordIfOnlyOne();
		if (rec != null)
			G.fetch(DS.CC_DEVICES, "WITH_CONFIG", "CONFIG", null, new Criteria("ID", rec.getAttribute("ID")),
					new FetchCallback() {
						public void execute(Record[] records) {
							if (records.length == 0)
								G.dialogWarning(G.S.errorNoDataFound());
							else {
								String config = records[0].getAttribute("CONFIG");
								if (config != null)
									G.showText(G.S.configuration(), config);
								else
									G.dialogWarning(G.S.noConfigsInHistory());
							}
						}
					});

	}

	private void showConfigFromDevice() {
		ListGridRecord[] devices = m_grid.getSelectedRecords();
		if (devices.length == 0){
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}
		ScriptExec.executeScript("cc_get_config", devices, ObjectType.CONFIG_CONTROL,null);

	}

	private void acceptChanges() {
		// confirm changes to all configurations on selected devices
		final ListGridRecord[] records = m_grid.getSelectedRecords();
		if (records.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}
		G.dialogAsk(G.S.askConfirmAllConfigChanges(), new BooleanCallback() {
			public void execute(Boolean value) {
				if (value != null && value) {
					RPCManager.startQueue();
					final Integer[] ids = new Integer[records.length];
					int i = 0;
					for (Record rec : records) {
						Record r = new Record();
						r.setAttribute("CC_DEVICE_ID", rec.getAttribute("ID"));
						ids[i++] = rec.getAttributeAsInt("ID");
						DSRequest props = new DSRequest();
						props.setOperationId("SET_ALL_CHECKED_BY_CC_DEVICE_ID");
						DS.CC_CONFIG_HISTORY.updateData(r, null, props);
					}
					RPCManager.sendQueue(new RPCQueueCallback() {
						public void execute(RPCResponse... responses) {
							if (G.allResponseSuccess(responses)) {
								G.refreshRowsInCache(DS.CC_DEVICES, null, m_grid.getOutputs(), new AdvancedCriteria("ID", OperatorId.IN_SET, ids));
							}
						}
					});
				}
			}
		});
	}

	// private void loadDevicesFromFile() {
	// G.uploadData(G.S.loadDeviceList(), DS.OP_UPLOAD_CC_DEVICES, new Runnable() {
	// public void run() {
	// m_grid.invalidateCache();
	// }
	// }, new Object[] { "OBJECT_ID", m_objectInfo.getAttribute("ID") }, new Object[] {
	// "HOST", G.S.host(), 80,
	// "NAME", G.S.name(), 80,
	// "DEVICE_TYPE_NAME", G.S.deviceType(), 80,
	// "CONNECT_TYPE", G.S.connectionType(), 80,
	// "LOGIN", G.S.login(), 60,
	// "PWD", G.S.password(), 60,
	// "ENABLE_PWD", G.S.enablePassword(), 60,
	// "GET_CONFIG_INTERVAL", G.S.interval(), 70,
	// "STORE_CONFIG_DAYS", G.S.days(), 70,
	// "COMMENT", G.S.comment(), 80,
	// "LOCATION", G.S.location(), 80
	// });
	// }

}
