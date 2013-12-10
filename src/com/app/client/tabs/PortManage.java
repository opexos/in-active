package com.app.client.tabs;

import static com.app.client.G.img16;
import static com.app.client.G.img24;

import java.util.HashMap;
import java.util.Map;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.G.FetchCallback;
import com.app.client.ScriptExec;
import com.app.client.widgets.FormFieldTitle;
import com.app.client.widgets.HButtons;
import com.app.client.widgets.Hint;
import com.app.client.widgets.ImgButton;
import com.app.client.widgets.IntegerItem;
import com.app.client.widgets.IntervalItem;
import com.app.client.widgets.Label;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextAreaItem;
import com.app.client.widgets.TextItem;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.ObjectType;
import com.app.shared.Result;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.Criteria;
import com.smartgwt.client.data.Criterion;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.SortSpecifier;
import com.smartgwt.client.rpc.RPCManager;
import com.smartgwt.client.types.ListGridComponent;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SelectionAppearance;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.types.SortDirection;
import com.smartgwt.client.util.BooleanCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.events.CloseClickEvent;
import com.smartgwt.client.widgets.events.CloseClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.grid.CellFormatter;
import com.smartgwt.client.widgets.grid.HeaderSpan;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.VLayout;

public class PortManage extends AppTab {

	private Record m_objectInfo;
	private ListGrid m_gridDevice;
	private ListGrid m_gridPort;
	private boolean readOnly;
	private ImgButton m_executeScriptBtnDev;
	private ImgButton m_executeScriptBtnPort;

	public PortManage(Record objectInfo) {
		super();
		m_objectInfo = objectInfo;
		readOnly = "READ_ONLY".equals(objectInfo.getAttribute("ACCESS"));
		setTitle(img16("port_manage_title"), objectInfo.getAttribute("MAP_NAME") + " - " + objectInfo.getAttribute("NAME"));
	}

	protected Canvas getContent() {
		m_gridDevice = gridDevice();

		m_gridPort = gridPort();
		// m_gridPort.setHeight("*");

		VLayout layDev = new VLayout();
		layDev.addMember(new Label(G.S.devices()).gridTitle());
		layDev.addMember(m_gridDevice);
		layDev.setShowResizeBar(true);
		layDev.setHeight("30%");

		VLayout layout = new VLayout();
		layout.addMember(layDev);
		layout.addMember(new Label(G.S.ports()).gridTitle());
		layout.addMember(m_gridPort);

		return layout;
	}

	private ListGrid gridDevice() {
		final ListGrid grid = new ListGrid(DS.PM_DEVICES, true, !readOnly, !readOnly, !readOnly, true, true) {
			ListGrid m_dev;
			FormFieldTitle m_label;

			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				if (getFieldName(colNum).equals("LAST_REFRESH_RESULT") &&
						Result.ERROR.toString().equals(record.getAttribute("LAST_REFRESH_RESULT")))
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
				m_dev.setFetchOperation("NOT_EXISTS_IN_PM_DEVICES");
				m_dev.addCriteria("OBJECT_ID", m_objectInfo.getAttributeAsInt("ID"));
				m_dev.setShowFilterEditor(true);
				m_dev.setSelectionType(SelectionStyle.SIMPLE);
				m_dev.setSelectionAppearance(SelectionAppearance.CHECKBOX);
				m_dev.setWidth(500);
				m_dev.setHeight(300);
				m_dev.setFieldStateId("GridPortManageAddDevList");

				VLayout vl = new VLayout(Const.DEFAULT_PADDING);
				vl.setMembers(m_label, m_dev);
				return vl;
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setColWidths(200, "*");
				form.setWidth(500);
				form.setFields(
						new IntervalItem(ds.getField("REFRESH_INTERVAL")),
						new IntegerItem(ds.getField("ARCHIVE_DAYS")).range(1, Const.ARCHIVE_DAYS_MAX).icons(new Hint(G.S.hintPMDeviceArchiveDays())));
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
			protected void afterRemove(Record[] records) {
				// обновляем список портов
				m_gridPort.invalidateCache();
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("HOST").width(200),
						new ListGridField("DEVICE_NAME").width(130),
						new ListGridField("DEVICE_TYPE_NAME").width(130),
						new ListGridField("REFRESH_INTERVAL").interval(),
						new ListGridField("ARCHIVE_DAYS").width(100),
						new ListGridField("LAST_REFRESH_DATE").date(),
						new ListGridField("LAST_REFRESH_RESULT", G.RESULT).width(80),
						new ListGridField("PORT_QTY").width(100),
						new ListGridField("COMMENT").width(200),
						new ListGridField("LOCATION").width(200));
			}

		};

		grid.setFieldNameForDeleteQuestion("HOST");
		grid.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttributeAsInt("ID"));

		if (!readOnly) {
			/*grid.addButton(img24("pm_import_ports"), G.S.importPortsFromDevice(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					importPortsFromDevice(grid);
				}
			});*/
			grid.addButton(img24("pm_update_device_data"), G.S.refreshDevice(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					refreshDevice(grid);
				}
			});
		}
		grid.addButton(img24("pm_device_query_history"), G.S.deviceQueryHistory(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showDeviceQueryHistory(grid);
			}
		});
		grid.addButton(img24("pm_show_device_vlans"), G.S.showDeviceVlans(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showDeviceVlans(grid);
			}
		});
		grid.addButton(img24("pm_show_object_vlans"), G.S.showObjectVlans(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showObjectVlans(null);
			}
		});
		grid.addButton(img24("pm_show_object_clients"), G.S.showAllClientsByObject(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				new AllClients(m_objectInfo).show();
			}
		});
		grid.addButton(img24("pm_show_object_clients_arc"), G.S.showAllArchiveClientsByObject(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				new AllArchiveClients(m_objectInfo).show();
			}
		});
		if (!readOnly) {
			grid.addButton(img24("console"), G.S.connectToDevice(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					final ListGridRecord rec = grid.getSelectedRecordIfOnlyOne();
					if (rec != null)
						G.startConsole(rec.getAttribute("HOST"), rec.getAttributeAsInt("ID"), "PM");
				}
			});
			m_executeScriptBtnDev = grid.addButton(img24("execute_script"), G.S.executeScript(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					ListGridRecord[] recs = grid.getSelectedRecords();
					if (recs.length == 0)
						G.dialogWarning(G.S.selectOneOrManyRowsInTable());
					else
						ScriptExec.showScripts(recs, m_objectInfo.getAttributeAsInt("ID"), ObjectType.PORT_MANAGE, m_executeScriptBtnDev);
				}
			});
		}
		grid.addButton(img24("save_list"), G.S.saveDeviceList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				grid.exportToExcel("devices.xls");
			}
		});
		// grid.addButton(Icons24.LOAD_LIST, G.S.loadDeviceList(), new ClickHandler() {
		// public void onClick(ClickEvent event) {
		// loadDevicesFromFile();
		// }
		// });
		grid.addRecordsCount();
		grid.setFieldStateId("GridPortManageDevices");
		grid.setAutoFetchData(true);
		return grid;
	}

	private ListGrid gridPort() {
		final ListGrid grid = new ListGrid(DS.PM_PORTS, true, !readOnly, !readOnly, !readOnly, true, true) {
			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				String field = getFieldName(colNum);

				boolean clientsCol = field.equals("IP") || field.equals("MAC") || field.equals("NETWORK_NAME");
				boolean voiceCol = field.equals("VOICE_IP") || field.equals("VOICE_MAC");
				boolean statusCol = field.equals("STATUS");

				if (clientsCol || voiceCol || statusCol) {
					int clientsQty = GS.getInt(record.getAttribute("CLIENTS_QTY"));
					int voiceQty = GS.getInt(record.getAttribute("VOICE_QTY"));

					if (clientsCol) {
						if (record.getAttributeAsBoolean("NEIGHBOR"))
							return isSelected(record) ? Const.CSS_ORANGE_BACKGROUND_SELECTED : Const.CSS_ORANGE_BACKGROUND;
						else if (clientsQty > 1)
							return isSelected(record) ? Const.CSS_PURPLE_BACKGROUND_SELECTED : Const.CSS_PURPLE_BACKGROUND;
					} else if (voiceCol) {
						if (voiceQty > 1)
							return isSelected(record) ? Const.CSS_PURPLE_BACKGROUND_SELECTED : Const.CSS_PURPLE_BACKGROUND;
					} else if (statusCol) {
						return isSelected(record) ?record.getAttribute("STATUS_CSS_SELECTED"):record.getAttribute("STATUS_CSS");
						//Integer adminStatus = GS.getInteger(record.getAttribute("ADMIN_STATUS"));
						//if (adminStatus != null) {
						//	if (adminStatus == Const.ADMIN_STATUS_DOWN || (adminStatus == Const.ADMIN_STATUS_UP && clientsQty == 0 && voiceQty == 0))
							//	return isSelected(record) ? Const.CSS_RED_BACKGROUND_SELECTED : Const.CSS_RED_BACKGROUND;
							//if (adminStatus == Const.ADMIN_STATUS_UP && clientsQty + voiceQty > 0)
							//	return isSelected(record) ? Const.CSS_GREEN_BACKGROUND_SELECTED : Const.CSS_GREEN_BACKGROUND;
						//}
					}
				}

				return super.getCellCSSText(record, rowNum, colNum);
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {

				SelectItem patch = new SelectItem() {
					{
						com.smartgwt.client.widgets.grid.ListGrid pickListProperties = new com.smartgwt.client.widgets.grid.ListGrid();
						pickListProperties.setShowFilterEditor(true);
						pickListProperties.setShowHeaderContextMenu(false);
						pickListProperties.setGridComponents(new Object[] {
								ListGridComponent.HEADER, ListGridComponent.FILTER_EDITOR, ListGridComponent.BODY });
						setPickListProperties(pickListProperties);
						setName("PM_PATCH_ID");
						setTitle(G.S.patch());
						setOptionDataSource(DS.PM_PATCH);
						setOptionCriteria(new Criterion("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttributeAsInt("ID")));
						setDisplayField("PATCH");
						setValueField("ID");
						setPickListWidth(400);
						setPickListFields(new ListGridField("PATCH").width(100), new ListGridField("LOCATION").width("*"));
						setAllowEmptyValue(true);
						setPickListSort(SortSpecifier.convertToArray("PATCH"));
					}
				};

				form.setFields(
						new TextItem(ds.getField("PORT"), G.S.port()),
						new TextItem(ds.getField("TELCO"), G.S.telco()),
						patch,
						new TextAreaItem(ds.getField("COMMENT"), G.S.comment()));
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				ListGridRecord rec = m_gridDevice.getSelectedRecordIfOnlyOne(G.S.selectOneDeviceForPortAdd());
				if (rec != null)
					super.addRecordClick("PM_DEVICE_ID", rec.getAttribute("ID"));
			}

			@Override
			protected void gridInitFields() {
				CellFormatter clientsFormat = new CellFormatter() {
					public String format(Object value, ListGridRecord record, int rowNum, int colNum) {
						Integer qty = record.getAttributeAsInt("CLIENTS_QTY");
						if (qty == null)
							return null;
						if (qty > 1)
							return getFieldName(colNum).equals("IP") ? G.M.clientsQty(qty) : null;
						else
							return value == null ? null : value.toString();
					}
				};
				CellFormatter voiceFormat = new CellFormatter() {
					public String format(Object value, ListGridRecord record, int rowNum, int colNum) {
						Integer qty = record.getAttributeAsInt("VOICE_QTY");
						if (qty == null)
							return null;
						if (qty > 1)
							return getFieldName(colNum).equals("VOICE_IP") ? G.M.clientsQty(qty) : null;
						else
							return value == null ? null : value.toString();
					}
				};

				setFields(
						new ListGridField("HOST", G.S.ip()).width(150),
						new ListGridField("DEVICE_NAME", G.S.name()).width(150),
						new ListGridField("PORT", G.S.port()).width(70),
						new ListGridField("VLAN", G.S.vlan()).width(40),
						new ListGridField("NET", G.S.network()).width(100),
						new ListGridField("TRUNK", G.S.trunk(), G.TRUE_FALSE).width(50),
						new ListGridField("OFFLINE", G.S.offline(), G.TRUE_FALSE).dayHourMinute("OFFLINE_LENGTH"),
						new ListGridField("STATUS", G.S.status()) {
							{
								width(80);
								setOptionDataSource(DS.PM_PORT_STATUS);
								setValueField("ID");
								setDisplayField("STATUS");	
								setFilterOnKeypress(true);
							}
						},
						new ListGridField("TELCO", G.S.telco()).width(50),
						new ListGridField("PATCH", G.S.patch()).width(50),
						new ListGridField("LOCATION", G.S.location()).width(150),
						new ListGridField("IP", G.S.ip()).width(100).cellFormatter(clientsFormat),
						new ListGridField("MAC", G.S.mac()).width(120).cellFormatter(clientsFormat),
						new ListGridField("NETWORK_NAME", G.S.networkName()).width(130).cellFormatter(clientsFormat),
						new ListGridField("VOICE_IP", G.S.ip()).width(100).cellFormatter(voiceFormat),
						new ListGridField("VOICE_MAC", G.S.mac()).width(120).cellFormatter(voiceFormat),
						new ListGridField("COMMENT", G.S.comment()).width(200));
			}

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				getEditWindowForm().getField("PORT").setDisabled(mode.equals(Mode.Update));
			}

		};

		grid.setHeaderSpans(
				new HeaderSpan(G.S.device(), new String[] { "HOST", "DEVICE_NAME" }),
				new HeaderSpan(G.S.clients(), new String[] { "IP", "MAC", "NETWORK_NAME" }),
				new HeaderSpan(G.S.voice(), new String[] { "VOICE_IP", "VOICE_MAC" }));
		grid.setFieldNameForDeleteQuestion("PORT");
		grid.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttributeAsInt("ID"));
		grid.addButton(img24("pm_show_clients"), G.S.showClients(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showClients(grid);
			}
		});
		// grid.addButton("clients_history.png", G.S.showClientsHistory(), new ClickHandler() {
		// public void onClick(ClickEvent event) {
		// showClients(grid, true);
		// }
		// });
		grid.addButton(img24("pm_show_port_info"), G.S.showPortInfo(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				showPortInfo(grid);
			}
		});
		// grid.addButton(Icons24.FIND_HISTORY, G.S.findInHistoryOfAllPorts(), new ClickHandler() {
		// public void onClick(ClickEvent event) {
		// findInHistoryOfAllPorts();
		// }
		// });
		if (!readOnly) {
			grid.addButton(img24("pm_change_vlan"), G.S.changeVlan(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					changeVlan(grid);
				}
			});
			grid.addButton(img24("pm_admin_status_up"), G.S.turnOnPort(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					changeAdminStatus(grid, Const.ADMIN_STATUS_UP);
				}
			});
			grid.addButton(img24("pm_admin_status_down"), G.S.turnOffPort(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					changeAdminStatus(grid, Const.ADMIN_STATUS_DOWN);
				}
			});
			grid.addButton(img24("pm_change_port_speed"), G.S.changePortSpeed(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					changePortSpeed();
				}
			});
			grid.addButton(img24("pm_change_duplex"), G.S.changePortDuplexMode(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					changePortDuplex();
				}
			});
			m_executeScriptBtnPort = grid.addButton(img24("execute_script"), G.S.executeScript(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					ListGridRecord[] recs = grid.getSelectedRecords();
					if (recs.length == 0)
						G.dialogWarning(G.S.selectOneOrManyRowsInTable());
					else
						ScriptExec.showScripts(recs, m_objectInfo.getAttributeAsInt("ID"), ObjectType.PORT_MANAGE, m_executeScriptBtnPort);
				}
			});
		}
		grid.addButton(img24("pm_find_device_by_port"), G.S.findDevice(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				ListGridRecord dev = grid.getSelectedRecordIfOnlyOne();
				if (dev != null) {
					AdvancedCriteria cr = new AdvancedCriteria();
					cr.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttributeAsInt("ID"));
					cr.addCriteria("HOST", OperatorId.ICONTAINS_PATTERN, dev.getAttributeAsString("HOST"));
					m_gridDevice.fetchData(cr);
				}
			}
		});
		grid.addButton(img24("save_list"), G.S.savePortList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				grid.exportToExcel("ports.xls", new String[] { "HOST", "DEVICE_NAME", "PORT", "TELCO", "PATCH", "LOCATION", "COMMENT" });
			}
		});
		if (!readOnly) {
			grid.addButton(img24("load_list"), G.S.loadPortList(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					loadPortsFromFile();
				}
			});
		}
		grid.addRecordsCount();
		grid.setFieldStateId("GridPortManagePorts");
		grid.setAutoFetchData(true);
		return grid;
	}

	/*private void importPortsFromDevice(final ListGrid grid) {
		ListGridRecord rec = grid.getSelectedRecordIfOnlyOne();
		if (rec == null)
			return;
		G.waitDialogShow();
		final Integer deviceId = rec.getAttributeAsInt("ID");
		ServerCall.getPortsByDeviceId(deviceId, new RecordsCallback() {
			public void execute(RecordList ports) {
				G.waitDialogHide();
	
				final ListGrid gr = new ListGrid() {
					@Override
					protected void gridInitFields() {
						setFields(
								new ListGridField("PORT", G.S.port()).width(200),
								new ListGridField("EXIST", G.S.alreadyAdded(), G.TRUE_FALSE).width("*"));
					}
				};
				gr.setWidth(400);
				gr.setHeight(500);
				gr.setSelectionType(SelectionStyle.SIMPLE);
				gr.setSelectionAppearance(SelectionAppearance.CHECKBOX);
				for (int i = 0; i < ports.getLength(); i++) {
					Record rec = ports.get(i);
					rec.setAttribute("ENABLED", !rec.getAttributeAsBoolean("EXIST"));
				}
				gr.setData(ports);
				gr.setRecordEnabledProperty("ENABLED");
				gr.setShowHeaderContextMenu(false);
	
				HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
					@Override
					protected void button1() {
						RPCManager.startQueue();
						for (ListGridRecord rec : gr.getSelectedRecords()) {
							rec.setAttribute("PM_DEVICE_ID", deviceId);
							DS.PM_PORTS.addData(rec);
						}
						final HButtons self = this;
						RPCManager.sendQueue(new RPCQueueCallback() {
							public void execute(RPCResponse... responses) {
								if (G.allResponseSuccess(responses)) {
									G.findParentWindow(self).destroy();
									G.refreshRowsInCache(DS.PM_DEVICES, null, grid.getOutputs(), new Criteria("ID", deviceId.toString()));
								}
							}
						});
					}
	
					@Override
					protected void button2() {
						G.findParentWindow(this).destroy();
					}
				};
	
				G.showInWindow(G.S.importPortsFromDevice(), G.wrapToVLayout(gr, btns));
			};
		});
	}*/

	private void showClients(ListGrid grid) {
		ListGridRecord record = grid.getSelectedRecordIfOnlyOne();
		if (record == null)
			return;
		final Integer portId = record.getAttributeAsInt("ID");

		final ListGrid gr = new ListGrid(DS.PM_PORT_CLIENTS, true, false, false, false, true, true) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("FIRST_DETECT").date(),
						new ListGridField("LAST_DETECT").date(),
						new ListGridField("IP", 100),
						new ListGridField("MAC", 120),
						new ListGridField("VLAN", 40),
						new ListGridField("NAME").width("*"),
						new ListGridField("VOICE", 60).bool());
			}
		};
		gr.setShowHeaderContextMenu(false);
		gr.addCriteria("PM_PORT_ID", OperatorId.EQUALS, portId);
		if (!readOnly) {
			gr.addButton(img24("pm_move_client_to_archive"), G.S.moveToArchive(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					RPCManager.startQueue();
					for (ListGridRecord rec : gr.getSelectedRecords()) {
						Record r = Record.copyAttributes(rec, "ID");
						r.setAttribute("ARCHIVE", true);
						gr.updateData(r);
					}
					RPCManager.sendQueue();
				}
			});
		}
		gr.setAutoFetchData(true);
		gr.setMargin(Const.DEFAULT_PADDING);

		G.showInWindow(G.S.clients(), G.availWidth(800), G.availHeight(600), true, new CloseClickHandler() {
			public void onCloseClick(CloseClickEvent event) {
				G.findParentWindow(gr).destroy();
				G.refreshRowsInCache(DS.PM_PORTS, null, null, new Criteria("ID", portId.toString()));
			}
		}, gr);
	}

	private void refreshDevice(final ListGrid grid) {
		ListGridRecord[] devices = grid.getSelectedRecords();
		if (devices.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}
		ScriptExec.executeScript("pm_refresh_data", devices, ObjectType.PORT_MANAGE, null);

		/*ListGridRecord record = grid.getSelectedRecordIfOnlyOne();
		if (record == null)
			return;
		G.waitDialogShow();
		final Integer deviceId = record.getAttributeAsInt("ID");
		ServerCall.updateDeviceInfoByDeviceId(deviceId, new OperationCallback() {
			public void execute(boolean ok, String msg) {
				G.waitDialogHide();
				G.refreshRowsInCache(DS.PM_DEVICES, null, grid.getOutputs(), new Criteria("ID", deviceId.toString()));
				if (ok) {
					// G.refreshRowsInCache(DS.DS_PM_PORTS, null, null, new Criteria("PM_DEVICE_ID", deviceId.toString()));
					m_gridPort.invalidateCache();
					G.dialogSay(G.S.refreshDeviceOk());
				} else {
					msg = G.getErrMsg(msg);
					G.dialogWarning(msg != null ? msg : G.S.refreshDeviceError());
				}
			}
		});*/

	}

	private boolean isError(Record record) {
		return Result.ERROR.toString().equals(record.getAttribute("RESULT"));
	}

	private void showDeviceQueryHistory(ListGrid deviceGrid) {

		ListGridRecord device = deviceGrid.getSelectedRecordIfOnlyOne();
		if (device == null)
			return;

		final ListGrid grid = new ListGrid(DS.PM_LOG, false, false, false, false, true, true) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("LOG_DATE", G.S.date()).date(),
						new ListGridField("RESULT", G.S.result(), G.RESULT).width("*"));
			}

			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				if (getFieldName(colNum).equals("RESULT") && isError(record))
					return Const.CSS_RED_TEXT;
				return super.getCellCSSText(record, rowNum, colNum);
			}
		};
		grid.addButton(img24("save"), G.S.saveLog(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				ListGridRecord rec = grid.getSelectedRecordIfOnlyOne();
				if (rec == null)
					return;
				if (isError(rec))
					G.download(DS.PM_LOG, "ERROR_LOG", new Criteria("ID", rec.getAttribute("ID")), "log.txt", Const.CONTENT_TYPE_TEXT_PLAIN);
				else
					G.dialogWarning(G.S.logsOnlyForErrors());
			}
		});

		grid.addButton(img24("text_view"), G.S.showLog(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				ListGridRecord rec = grid.getSelectedRecordIfOnlyOne();
				if (rec == null)
					return;
				if (isError(rec))
					G.fetch(DS.PM_LOG, null, "ERROR_LOG", null, new Criteria("ID", rec.getAttribute("ID")),
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
		grid.setSelectionType(SelectionStyle.SINGLE);
		grid.setWidth(300);
		grid.setHeight(500);
		grid.addCriteria("PM_DEVICE_ID", OperatorId.EQUALS, device.getAttributeAsInt("ID"));
		grid.setOutputs(G.getAllFieldsExceptComma(DS.PM_LOG, "ERROR_LOG"));
		grid.setSortDirection(SortDirection.DESCENDING);
		grid.setSortField("LOG_DATE");
		grid.setAutoFetchData(true);
		grid.setMargin(Const.DEFAULT_PADDING);

		G.showInWindow(G.S.deviceQueryHistory(), grid);
	}

	private void showDeviceVlans(ListGrid grid) {
		ListGridRecord[] devices = grid.getSelectedRecords();
		if (devices.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}
		ScriptExec.executeScript("pm_vlan_list", devices, ObjectType.PORT_MANAGE, null);

		/*ListGridRecord record = grid.getSelectedRecordIfOnlyOne();
		if (record == null)
			return;
		G.waitDialogShow();
		ServerCall.getVlansByDeviceId(record.getAttributeAsInt("DEVICE_ID"), new RecordsCallback() {
			public void execute(RecordList recs) {
				G.waitDialogHide();
				final ListGrid gr = new ListGrid() {
					@Override
					protected void gridInitFields() {
						setFields(
								new ListGridField("VLAN", G.S.vlan()).width(100),
								new ListGridField("NAME", G.S.name()).width("*"),
								new ListGridField("NET", G.S.network()).width("*")
						// new ListGridField("IP", G.S.ip()).width(100),
						// new ListGridField("MASK", G.S.subnetMask()).width(120),
						// new ListGridField("PREFIX", G.S.prefixLength()).width(120)
						);
					}
				};
				gr.setWidth(550);
				gr.setHeight(500);
				gr.setData(recs);
				gr.setSortField("VLAN");
				gr.setShowHeaderContextMenu(false);
				gr.setMargin(Const.DEFAULT_PADDING);
				G.showInWindow(G.S.vlanList(), gr);
			}
		});*/

	}

	private void changeVlan(ListGrid grid) {
		final ListGridRecord[] records = grid.getSelectedRecords();
		if (records.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}

		showObjectVlans(new SelectRecordCallback() {
			public void execute(Record vlan) {
				Map params = new HashMap();
				params.put("vlan", vlan.getAttributeAsInt("VLAN"));

				ScriptExec.executeScript("pm_port_change_vlan", records, ObjectType.PORT_MANAGE, params);
				// G.waitDialogShow();
				// setVlan(records, 0, record.getAttributeAsInt("VLAN"));
			}
		});
	}

	// private void setVlan(final ListGridRecord[] ports, final int idx, final int vlan) {
	// if (idx == ports.length) {
	// G.waitDialogHide();
	// showResults(G.S.changeVlan(), ports, true);
	// } else {
	// G.waitDialogSetInfo((idx + 1) + " / " + ports.length);
	// ServerCall.setPortVlanByPortId(ports[idx].getAttributeAsInt("ID"), vlan, new OperationCallback() {
	// public void execute(boolean ok, String msg) {
	// msg = ok ? G.S.ok() : G.getErrMsg(msg);
	// if (msg == null)
	// msg = G.S.errorServerRequest();
	// ports[idx].setAttribute("RESULT", msg);
	// ports[idx].setAttribute("ERROR", !ok);
	// setVlan(ports, idx + 1, vlan);
	// }
	// });
	// }
	//
	// }

	public interface SelectRecordCallback {
		public void execute(Record record);
	}

	private void showObjectVlans(final SelectRecordCallback callback) {
		boolean canEdit = false;// callback == null && !readOnly;
		final ListGrid gr = new ListGrid(DS.PM_VLANS, true, canEdit, canEdit, canEdit, true, true) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("VLAN").width(100),
						new ListGridField("NAME").width(200),
						new ListGridField("NET").width(120),
						new ListGridField("VOICE").bool().width(60),
						new ListGridField("DESCR").width("*"),
						new ListGridField("CLIENTS_QTY").width(100),
						new ListGridField("LAST_DETECT").date());
			}

			/*@Override
			protected void initEditRecordForm(DynamicForm form, DataSource ds) {
				form.setFields(
						new IntegerItem(ds.getField("VLAN")).range(1, 10000),
						new TextItem(ds.getField("NAME")),
						new NetItem(ds.getField("NET")),
						new CheckboxItem(ds.getField("VOICE")),
						new TextAreaItem(ds.getField("DESCR")));
			}
			
			@Override
			protected void addRecordClick(Object... addValues) {
				super.addRecordClick(
						"OBJECT_ID", m_objectInfo.getAttribute("ID"),
						"VOICE", false);
			}*/
		};
		gr.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttribute("ID"));
		gr.addCriteria("LAST_DETECT", OperatorId.NOT_NULL);
		gr.setSortField("VLAN");
		gr.setSelectionType(callback == null ? SelectionStyle.MULTIPLE : SelectionStyle.SINGLE);
		gr.setAutoFetchData(true);
		gr.addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				gr.exportToExcel("vlan.xls");
			}
		});
		/*		if (canEdit) {
					gr.addButton("phone.png", G.S.voiceToggle(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							ListGridRecord rec = gr.getSelectedRecordIfOnlyOne();
							if (rec == null)
								return;
							// копируем строку, чтобы в update было только изменение поля voice
							Record vlan = Record.copyAttributes(rec, "ID", "VLAN");
							vlan.setAttribute("VOICE", !rec.getAttributeAsBoolean("VOICE"));
							gr.updateData(vlan);
						}
					});
					gr.addButton("load_list.png", G.S.loadList(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							G.uploadData(G.S.loadList(), "UPLOAD_VLANS",
									new Runnable() {
								public void run() {
									gr.invalidateCache();
								}
							},
									new Object[] { "OBJECT_ID", m_objectInfo.getAttribute("ID") },
									new Object[] {
											DS.PM_VLANS.getField("VLAN"), 80,
											DS.PM_VLANS.getField("NAME"), 200,
											DS.PM_VLANS.getField("NET"), 130,
											DS.PM_VLANS.getField("VOICE"), 80,
											DS.PM_VLANS.getField("DESCR"), 200
									});
						}
					});
				}*/

		if (callback == null) {
			gr.setMargin(Const.DEFAULT_PADDING);
			G.showInWindow(G.S.vlanList(), G.availWidth(900), G.availHeight(500), true, new CloseClickHandler() {
				public void onCloseClick(CloseClickEvent event) {
					G.findParentWindow(gr).destroy();
					m_gridPort.invalidateCache();
				}
			}, gr);
		} else {
			HButtons btns = new HButtons((Integer) null, G.S.ok(), G.S.cancel()) {
				@Override
				protected void button1() {
					Record rec = gr.getSelectedRecordIfOnlyOne();
					if (rec == null)
						return;
					G.findParentWindow(this).destroy();
					callback.execute(rec);
				}

				@Override
				protected void button2() {
					G.findParentWindow(this).destroy();
				}
			};

			G.showInWindow(G.S.vlanList(), G.availWidth(900), G.availHeight(500), true, null, G.wrapToVLayout(gr, btns));
		}
	}

	private void loadPortsFromFile() {
		G.uploadData(G.S.loadPortList(), "UPLOAD_PORTS", new Runnable() {
			public void run() {
				m_gridPort.invalidateCache();
			}
		}, new Object[] { "OBJECT_ID", m_objectInfo.getAttribute("ID") }, new Object[] {
				"HOST", G.S.ip(), 150,
				"NAME", G.S.name(), 150,
				"PORT", G.S.port(), 70,
				"TELCO", G.S.telco(), 70,
				"PATCH", G.S.patch(), 70,
				"COMMENT", G.S.comment(), 100
		});
	}

	// private void loadDevicesFromFile() {
	// G.uploadData(G.S.loadDeviceList(), DS.OP_UPLOAD_PM_DEVICES, new Runnable() {
	// public void run() {
	// m_gridDevice.invalidateCache();
	// }
	// }, new Object[] { "OBJECT_ID", m_objectInfo.getAttribute("ID") }, new Object[] {
	// "HOST", G.S.host(), 80,
	// "NAME", G.S.name(), 80,
	// "SNMP_VERSION", G.S.snmpVersion(), 80,
	// "READ_COMMUNITY", G.S.readCommunity(), 70,
	// "WRITE_COMMUNITY", G.S.writeCommunity(), 70,
	// "DEVICE_TYPE_NAME", G.S.deviceType(), 80,
	// "REFRESH_INTERVAL", G.S.interval(), 60,
	// "ARCHIVE_DAYS", G.S.days(), 40,
	// "COMMENT", G.S.comment(), 80,
	// "LOCATION", G.S.location(), 80
	// });
	// }

	private void changeAdminStatus(ListGrid grid, final int status) {
		final ListGridRecord[] records = grid.getSelectedRecords();
		if (records.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}

		G.dialogAsk(status == Const.ADMIN_STATUS_UP ? G.S.askTurnOnPort() : G.S.askTurnOffPort(), new BooleanCallback() {
			public void execute(Boolean value) {
				if (value != null && value) {
					ScriptExec.executeScript(status == Const.ADMIN_STATUS_UP ? "pm_port_on" : "pm_port_off", records, ObjectType.PORT_MANAGE, null);
				}
			}
		});
	}

	// private void setAdminStatus(final ListGridRecord[] ports, final int idx, final int status) {
	// if (idx == ports.length) {
	// G.waitDialogHide();
	// showResults(status == Const.ADMIN_STATUS_UP ? G.S.turnOnPort() : G.S.turnOffPort(), ports, true);
	// } else {
	// G.waitDialogSetInfo((idx + 1) + " / " + ports.length);
	// ServerCall.setPortAdminStatusByPortId(ports[idx].getAttributeAsInt("ID"), status, new OperationCallback() {
	// public void execute(boolean ok, String msg) {
	// msg = ok ? G.S.ok() : G.getErrMsg(msg);
	// if (msg == null)
	// msg = G.S.errorServerRequest();
	// ports[idx].setAttribute("RESULT", msg);
	// ports[idx].setAttribute("ERROR", !ok);
	// setAdminStatus(ports, idx + 1, status);
	// }
	// });
	// }
	// }

	// private void showResults(String title, final ListGridRecord[] rows, final boolean refreshAfterClose) {
	// final ListGrid gr = new ListGrid() {
	// @Override
	// protected void gridInitFields() {
	// setFields(
	// new ListGridField("HOST", G.S.ip()).width(150),
	// new ListGridField("NAME", G.S.name()).width(150),
	// new ListGridField("PORT", G.S.port()).width(70),
	// new ListGridField("RESULT", G.S.result()).width("*"));
	// }
	//
	// @Override
	// protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
	// if (getFieldName(colNum).equals("RESULT")) {
	// Boolean error = record.getAttributeAsBoolean("ERROR");
	// if (error != null && error)
	// return Const.CSS_RED_TEXT;
	// }
	// return super.getCellCSSText(record, rowNum, colNum);
	// }
	// };
	// gr.setWidth(800);
	// gr.setHeight(500);
	// gr.setShowHeaderContextMenu(false);
	// gr.setData(rows);
	// G.showInWindow(title, new CloseClickHandler() {
	// public void onCloseClick(CloseClickEvent event) {
	// G.findParentWindow(gr).destroy();
	// if (refreshAfterClose) {
	// Integer[] ids = new Integer[rows.length];
	// for (int i = 0; i < ids.length; i++)
	// ids[i] = rows[i].getAttributeAsInt("ID");
	// AdvancedCriteria cr = new AdvancedCriteria("ID", OperatorId.IN_SET, ids);
	// G.refreshRowsInCache(DS.PM_PORTS, null, null, cr);
	// }
	// }
	// }, gr);
	// }

	// private void findInHistoryOfAllPorts() {
	// final ListGrid gr = new ListGrid(DataSource.get(DS.DS_PM_PORT_CLIENTS), false, true, false, false, false, true);
	// gr.setShowHeaderContextMenu(false);
	// gr.setFields(
	// new ListGridField("HOST", G.S.host()).width(150),
	// new ListGridField("DEVICE_NAME", G.S.name()).width(150),
	// new ListGridField("PORT", G.S.port()).width(70),
	// new ListGridField("FIRST_DETECT", G.S.firstDateOfClientDetect()).date().prompt(G.S.firstDateOfClientDetect()),
	// new ListGridField("LAST_DETECT", G.S.lastDateOfClientDetect()).date().prompt(G.S.lastDateOfClientDetect()),
	// new ListGridField("IP", G.S.ip()).width(100),
	// new ListGridField("MAC", G.S.mac()).width(120),
	// new ListGridField("VLAN", G.S.vlan()).width(40),
	// new ListGridField("NAME", G.S.networkName()).width("*"),
	// new ListGridField("VOICE", G.S.voice()).bool().width(60)
	// );
	// gr.addCriteria(DS.PM_OBJECT_ID, OperatorId.EQUALS, m_objectInfo.getAttribute("ID"));
	// gr.addCriteria("ARCHIVE", OperatorId.EQUALS, true);
	// gr.setHeaderSpans(new HeaderSpan(G.S.device(), new String[] { "HOST", "DEVICE_NAME" }));
	// gr.setHeaderHeight(40);
	// gr.fetchData();
	// G.showInWindow(G.S.clients(), 1100, 700, true, null, gr);
	// }

	private void showPortInfo(ListGrid grid) {
		ListGridRecord[] ports = grid.getSelectedRecords();
		if (ports.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}
		ScriptExec.executeScript("pm_port_info", ports, ObjectType.PORT_MANAGE, null);

		// G.waitDialogShow();
		// G.serverCall("executeScriptPM",
		// new RPCCallback() {
		// public void execute(RPCResponse response, Object rawData, RPCRequest request) {
		// G.waitDialogHide();
		// new ScriptResultViewer(response).show();
		// }
		// },
		// new Object[] {"pm_port_info", record.getAttributeAsInt("PM_DEVICE_ID"), null});

		// .grid.///

		/*
		Map m = new LinkedHashMap();
		
		DetailViewerField[] fields = new DetailViewerField[info.size()];
		Iterator it = info.keySet().iterator();
		int idx = 0;
		while (it.hasNext()) {
			Object key = it.next();
			fields[idx] = new DetailViewerField("F" + idx, key.toString());
			m.put("F" + idx, info.get(key.toString()));
			idx++;
		}
		
		DetailViewer dv = new DetailViewer();
		dv.setFields(fields);
		dv.setData(new Record[] { new Record(m) });
		dv.setCanSelectText(true);
		
		G.showInWindow(G.S.portInfo(), dv);*/

	}

	private void changePortSpeed() {
		final ListGridRecord[] records = m_gridPort.getSelectedRecords();
		if (records.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}
		ScriptExec.executeScript("pm_port_change_speed", records, ObjectType.PORT_MANAGE, null);

		// final RadioGroupItem rg = new RadioGroupItem();
		// rg.setShowTitle(false);
		// rg.setValueMap(Const.PORT_SPEED);
		// rg.setRequired(true);
		//
		// final DynamicForm form = new DynamicForm();
		// form.setNumCols(1);
		// form.setFields(rg);
		// form.setTitleWidth(30);
		// form.setWidth(200);
		// form.setShowErrorStyle(false);
		//
		// final HButtons btns = new HButtons(G.S.ok(), G.S.cancel()) {
		// @Override
		// protected void button1() {
		// if (form.validate()) {
		// String sp = rg.getValueAsString();
		// G.findParentWindow(this).destroy();
		// G.waitDialogShow();
		// setPortSpeed(records, 0, sp);
		// }
		// }
		//
		// @Override
		// protected void button2() {
		// G.findParentWindow(this).destroy();
		// }
		// };
		//
		// G.showInWindow(G.S.changePortSpeed(), form, btns);
	}

	// private void setPortSpeed(final ListGridRecord[] ports, final int idx, final String speed) {
	// if (idx == ports.length) {
	// G.waitDialogHide();
	// showResults(G.S.changePortSpeed(), ports, false);
	// } else {
	// G.waitDialogSetInfo((idx + 1) + " / " + ports.length);
	// ServerCall.setPortSpeedByPortId(ports[idx].getAttributeAsInt("ID"), speed, new OperationCallback() {
	// public void execute(boolean ok, String msg) {
	// msg = ok ? G.S.ok() : G.getErrMsg(msg);
	// if (msg == null)
	// msg = G.S.errorServerRequest();
	// ports[idx].setAttribute("RESULT", msg);
	// ports[idx].setAttribute("ERROR", !ok);
	// setPortSpeed(ports, idx + 1, speed);
	// }
	// });
	// }
	// }

	private void changePortDuplex() {
		final ListGridRecord[] records = m_gridPort.getSelectedRecords();
		if (records.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}
		ScriptExec.executeScript("pm_port_change_duplex", records, ObjectType.PORT_MANAGE, null);

		// final RadioGroupItem rg = new RadioGroupItem();
		// rg.setShowTitle(false);
		// rg.setValueMap(Const.PORT_DUPLEX);
		// rg.setRequired(true);
		//
		// final DynamicForm form = new DynamicForm();
		// form.setNumCols(1);
		// form.setFields(rg);
		// form.setTitleWidth(30);
		// form.setWidth(200);
		// form.setShowErrorStyle(false);
		//
		// final HButtons btns = new HButtons(G.S.ok(), G.S.cancel()) {
		// @Override
		// protected void button1() {
		// if (form.validate()) {
		// String sp = rg.getValueAsString();
		// G.findParentWindow(this).destroy();
		// G.waitDialogShow();
		// setPortDuplex(records, 0, sp);
		// }
		// }
		//
		// @Override
		// protected void button2() {
		// G.findParentWindow(this).destroy();
		// }
		// };
		//
		// G.showInWindow(G.S.changePortDuplexMode(), form, btns);
	}

	// private void setPortDuplex(final ListGridRecord[] ports, final int idx, final String duplex) {
	// if (idx == ports.length) {
	// G.waitDialogHide();
	// showResults(G.S.changePortDuplexMode(), ports, false);
	// } else {
	// G.waitDialogSetInfo((idx + 1) + " / " + ports.length);
	// ServerCall.setPortDuplexByPortId(ports[idx].getAttributeAsInt("ID"), duplex, new OperationCallback() {
	// public void execute(boolean ok, String msg) {
	// msg = ok ? G.S.ok() : G.getErrMsg(msg);
	// if (msg == null)
	// msg = G.S.errorServerRequest();
	// ports[idx].setAttribute("RESULT", msg);
	// ports[idx].setAttribute("ERROR", !ok);
	// setPortDuplex(ports, idx + 1, duplex);
	// }
	// });
	// }
	// }
}
