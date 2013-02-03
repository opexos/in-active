package com.app.client.tabs;
import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.HeaderItem;
import com.app.client.widgets.IntegerItem;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextAreaItem;
import com.app.client.widgets.TextItem;
import com.app.shared.Const;
import com.app.shared.GS;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.form.fields.events.ChangedEvent;
import com.smartgwt.client.widgets.form.fields.events.ChangedHandler;
import com.smartgwt.client.widgets.grid.HeaderSpan;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.VLayout;

public class Devices extends AppTab {

	private ListGrid m_grid;
	private SelectItem m_map;

	public Devices() {
		super();
		setTitle(img16("devices_title"), G.S.devices());
	}

	protected Canvas getContent() {

		m_map = new SelectItem();
		m_map.setWidth(300);
		m_map.setTitle(G.S.map());
		m_map.setOptionDataSource(DS.MAPS);
		m_map.setOptionOperationId("CONFIG_DEVICES");
		m_map.setDisplayField("NAME");
		m_map.setValueField("ID");
		m_map.setSortField("NAME");
		m_map.addChangedHandler(new ChangedHandler() {
			public void onChanged(ChangedEvent event) {
				m_grid.filterData(new AdvancedCriteria("MAP_ID", OperatorId.EQUALS, event.getValue().toString()));
			}
		});

		DynamicForm form = new DynamicForm();
		form.setFields(m_map);

		m_grid = new ListGrid(DS.DEVICES, true) {

			@Override
			protected void beforeSave(Mode mode, Record record) {
				super.beforeSave(mode, record);
				if (GS.contains("SNMP_VERSION", record.getAttributes())) {
					String snmpVer = record.getAttributeAsString("SNMP_VERSION");
					if (snmpVer == null || snmpVer.isEmpty()) {
						record.setAttribute("READ_COMMUNITY", "");
						record.setAttribute("WRITE_COMMUNITY", "");
						record.setAttribute("SNMP_USER", "");
						record.setAttribute("SNMP_AUTH_PROT", "");
						record.setAttribute("SNMP_AUTH_PWD", "");
						record.setAttribute("SNMP_PRIV_PROT", "");
						record.setAttribute("SNMP_PRIV_PWD", "");
					}
					else if (snmpVer != null && (snmpVer.equals("1") || snmpVer.equals("2"))) {
						record.setAttribute("SNMP_USER", "");
						record.setAttribute("SNMP_AUTH_PROT", "");
						record.setAttribute("SNMP_AUTH_PWD", "");
						record.setAttribute("SNMP_PRIV_PROT", "");
						record.setAttribute("SNMP_PRIV_PWD", "");
					}
					else if (snmpVer != null && snmpVer.equals("3")) {
						record.setAttribute("READ_COMMUNITY", "");
						record.setAttribute("WRITE_COMMUNITY", "");
					}
				}
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {

				FormItemIfFunction snmpv12 = new FormItemIfFunction() {
					@Override
					public boolean execute(FormItem item, Object value, DynamicForm form) {
						return "1".equals(form.getValueAsString("SNMP_VERSION")) || "2".equals(form.getValueAsString("SNMP_VERSION"));
					}
				};

				FormItemIfFunction snmpv3 = new FormItemIfFunction() {
					@Override
					public boolean execute(FormItem item, Object value, DynamicForm form) {
						return "3".equals(form.getValueAsString("SNMP_VERSION"));
					}
				};

				form.setFields(
						new TextItem(ds.getField("NAME")),
						new TextItem(ds.getField("LOCATION")),
						new TextAreaItem(ds.getField("COMMENT")),
						new SelectItem(ds.getField("DEVICE_TYPE_ID"), DS.DEVICE_TYPES, "ID", "NAME"),
						new TextItem(ds.getField("HOST")),
						new HeaderItem("h1", G.S.console()),
						new SelectItem(ds.getField("CONNECT_TYPE"), G.CONNECT_TYPES),
						new IntegerItem(ds.getField("CONSOLE_PORT")).range(1, 65535),
						new TextItem(ds.getField("LOGIN")),
						new TextItem(ds.getField("PWD")),
						new TextItem(ds.getField("ENABLE_PWD")),
						new HeaderItem("h2", G.S.snmp()),
						new IntegerItem(ds.getField("SNMP_PORT")).range(1, 65535),
						new SelectItem(ds.getField("SNMP_VERSION"), new String[] { "1", "2", "3" }).redrawOnChange(),
						new TextItem(ds.getField("READ_COMMUNITY")).showIf(snmpv12),
						new TextItem(ds.getField("WRITE_COMMUNITY")).showIf(snmpv12),
						new TextItem(ds.getField("SNMP_USER")).showIf(snmpv3),
						new SelectItem(ds.getField("SNMP_AUTH_PROT"), Const.SNMP_AUTH_PROT).showIf(snmpv3),
						new TextItem(ds.getField("SNMP_AUTH_PWD")).showIf(snmpv3),
						new SelectItem(ds.getField("SNMP_PRIV_PROT"), Const.SNMP_PRIV_PROT).showIf(snmpv3),
						new TextItem(ds.getField("SNMP_PRIV_PWD")).showIf(snmpv3)
						);
				setAllowMultiEdit(true);
				setMultiEditFields("h1", "h2", "LOCATION", "COMMENT", "DEVICE_TYPE_ID", "CONNECT_TYPE", "CONSOLE_PORT", "LOGIN", "PWD", "ENABLE_PWD",
						"SNMP_PORT", "SNMP_VERSION", "READ_COMMUNITY", "WRITE_COMMUNITY",
						"SNMP_USER", "SNMP_AUTH_PROT", "SNMP_AUTH_PWD", "SNMP_PRIV_PROT", "SNMP_PRIV_PWD");
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				if (mapSelected())
					super.addRecordClick("MAP_ID", m_map.getValue());
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("NAME"),
						new ListGridField("LOCATION"),
						new ListGridField("COMMENT"),
						new ListGridField("DEVICE_TYPE_NAME"),
						new ListGridField("HOST"),
						new ListGridField("CONNECT_TYPE").selectItem(G.CONNECT_TYPES),
						new ListGridField("CONSOLE_PORT"),
						new ListGridField("LOGIN").noFilter(),
						new ListGridField("PWD").noFilter(),
						new ListGridField("ENABLE_PWD").noFilter(),
						new ListGridField("SNMP_PORT"),
						new ListGridField("SNMP_VERSION"),
						new ListGridField("READ_COMMUNITY").noFilter(),
						new ListGridField("WRITE_COMMUNITY").noFilter(),
						new ListGridField("SNMP_USER").noFilter(),
						new ListGridField("SNMP_AUTH_PROT").selectItem(Const.SNMP_AUTH_PROT),
						new ListGridField("SNMP_AUTH_PWD").noFilter(),
						new ListGridField("SNMP_PRIV_PROT").selectItem(Const.SNMP_PRIV_PROT),
						new ListGridField("SNMP_PRIV_PWD").noFilter()
				);
			}

		};
		m_grid.setFieldNameForDeleteQuestion("NAME");

		m_grid.setHeaderSpans(
				new HeaderSpan(G.S.console(), new String[] { "CONNECT_TYPE", "CONSOLE_PORT", "LOGIN", "PWD", "ENABLE_PWD" }),
				new HeaderSpan(G.S.snmp(), new String[] { "SNMP_PORT", "SNMP_VERSION", "READ_COMMUNITY", "WRITE_COMMUNITY",
						"SNMP_USER", "SNMP_AUTH_PROT", "SNMP_AUTH_PWD", "SNMP_PRIV_PROT", "SNMP_PRIV_PWD" })
				);
		m_grid.addButton(img24("console"), G.S.connectToDevice(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				final ListGridRecord rec = m_grid.getSelectedRecordIfOnlyOne();
				if (rec != null)
					G.startConsole(rec.getAttribute("HOST"),rec.getAttributeAsInt("ID"), "DEV");
			}
		});
		m_grid.addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				if (mapSelected())
					m_grid.exportToExcel("devices.xls");
			}
		});
		m_grid.addButton(img24("load_list"), G.S.loadDeviceList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				if (mapSelected())
					G.uploadData(G.S.loadDeviceList(), "UPLOAD_DEVICES",
							new Runnable() {
								public void run() {
									m_grid.invalidateCache();
								}
							},
							new Object[] { "MAP_ID", m_map.getValue() },
							new Object[] {
									DS.DEVICES.getField("NAME"), 80,
									DS.DEVICES.getField("LOCATION"), 80,
									DS.DEVICES.getField("COMMENT"), 80,
									DS.DEVICES.getField("DEVICE_TYPE_NAME"), 80,
									DS.DEVICES.getField("HOST"), 80,
									DS.DEVICES.getField("CONSOLE_PORT"), 80,
									DS.DEVICES.getField("CONNECT_TYPE"), 80,
									DS.DEVICES.getField("LOGIN"), 80,
									DS.DEVICES.getField("PWD"), 80,
									DS.DEVICES.getField("ENABLE_PWD"), 80,
									DS.DEVICES.getField("SNMP_PORT"), 80,
									DS.DEVICES.getField("SNMP_VERSION"), 80,
									DS.DEVICES.getField("READ_COMMUNITY"), 80,
									DS.DEVICES.getField("WRITE_COMMUNITY"), 80,
									DS.DEVICES.getField("SNMP_USER"), 80,
									DS.DEVICES.getField("SNMP_AUTH_PROT"), 80,
									DS.DEVICES.getField("SNMP_AUTH_PWD"), 80,
									DS.DEVICES.getField("SNMP_PRIV_PROT"), 80,
									DS.DEVICES.getField("SNMP_PRIV_PWD"), 80
							});
			}
		});
		m_grid.addRecordsCount();
		m_grid.setFieldStateId("GridDevices");

		VLayout vl = new VLayout(Const.DEFAULT_PADDING);
		vl.addMembers(form, m_grid);

		return vl;
	}

	private boolean mapSelected() {
		if (m_map.getValue() == null) {
			G.dialogWarning(G.S.selectMap());
			return false;
		}
		else
			return true;
	}

}
