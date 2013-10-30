package com.app.client.tabs;
import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.shared.Const;
import com.smartgwt.client.types.SortDirection;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.grid.HeaderSpan;
import com.smartgwt.client.widgets.grid.ListGridRecord;

public class DevicesJournal extends AppTab {

	public DevicesJournal() {
		super();
		setTitle(img16("changes_journal"), G.S.devicesChangesJournal());
	}

	protected Canvas getContent() {

		final ListGrid grid = new ListGrid(DS.H_DEVICES, true, false, false, false, true, true) {
			private final String[] compareFieldPairs = new String[] {
					"OLD_NAME", "NEW_NAME",
					"OLD_LOCATION", "NEW_LOCATION",
					"OLD_COMMENT", "NEW_COMMENT",
					"OLD_DEVICE_TYPE", "NEW_DEVICE_TYPE",
					"OLD_HOST", "NEW_HOST",
					"OLD_LOGIN", "NEW_LOGIN",
					"OLD_PWD", "NEW_PWD",
					"OLD_ENABLE_PWD", "NEW_ENABLE_PWD",
					"OLD_CONNECT_TYPE", "NEW_CONNECT_TYPE",
					"OLD_CONSOLE_PORT", "NEW_CONSOLE_PORT",
					"OLD_SNMP_VERSION", "NEW_SNMP_VERSION",
					"OLD_SNMP_PORT", "NEW_SNMP_PORT",
					"OLD_READ_COMMUNITY", "NEW_READ_COMMUNITY",
					"OLD_WRITE_COMMUNITY", "NEW_WRITE_COMMUNITY",
					"OLD_SNMP_USER", "NEW_SNMP_USER",
					"OLD_SNMP_AUTH_PROT", "NEW_SNMP_AUTH_PROT",
					"OLD_SNMP_AUTH_PWD", "NEW_SNMP_AUTH_PWD",
					"OLD_SNMP_PRIV_PROT", "NEW_SNMP_PRIV_PROT",
					"OLD_SNMP_PRIV_PWD", "NEW_SNMP_PRIV_PWD"
			};

			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				if ("U".equals(record.getAttribute("ACTION")) &&
						G.markDiffValues(getFieldName(colNum), compareFieldPairs, record))
					return isSelected(record) ? Const.CSS_ORANGE_BACKGROUND_SELECTED : Const.CSS_ORANGE_BACKGROUND;
				return super.getCellCSSText(record, rowNum, colNum);
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("WHO_MODIFY", G.S.who()),
						new ListGridField("WHEN_MODIFY", G.S.when()).date(),
						new ListGridField("ACTION", G.S.action(), G.MODIFY_ACTIONS),
						new ListGridField("ID", G.S.code()),
						new ListGridField("MAP", G.S.map()),
						new ListGridField("OLD_NAME", G.S.name()),
						new ListGridField("OLD_LOCATION", G.S.location()),
						new ListGridField("OLD_COMMENT", G.S.comment()),
						new ListGridField("OLD_DEVICE_TYPE", G.S.deviceType()),
						new ListGridField("OLD_HOST", G.S.ip()),
						new ListGridField("OLD_CONNECT_TYPE", G.S.connectionType()).selectItem(G.CONNECT_TYPES),
						new ListGridField("OLD_CONSOLE_PORT", G.S.consolePort()),
						new ListGridField("OLD_LOGIN", G.S.login()).noFilter(),
						new ListGridField("OLD_PWD", G.S.password()).noFilter(),
						new ListGridField("OLD_ENABLE_PWD", G.S.enablePassword()).noFilter(),
						new ListGridField("OLD_SNMP_PORT", G.S.snmpPort()),
						new ListGridField("OLD_SNMP_VERSION", G.S.snmpVersion()),
						new ListGridField("OLD_READ_COMMUNITY", G.S.readCommunity()).noFilter(),
						new ListGridField("OLD_WRITE_COMMUNITY", G.S.writeCommunity()).noFilter(),
						new ListGridField("OLD_SNMP_USER", "SNMP " + G.S.snmpUserName()).noFilter(),
						new ListGridField("OLD_SNMP_AUTH_PROT", "SNMP " + G.S.snmpAuthenticationProtocol()),
						new ListGridField("OLD_SNMP_AUTH_PWD", "SNMP " + G.S.snmpAuthenticationPassword()).noFilter(),
						new ListGridField("OLD_SNMP_PRIV_PROT", "SNMP " + G.S.snmpPrivacyProtocol()),
						new ListGridField("OLD_SNMP_PRIV_PWD", "SNMP " + G.S.snmpPrivacyPassword()).noFilter(),
						new ListGridField("NEW_NAME", G.S.name()),
						new ListGridField("NEW_LOCATION", G.S.location()),
						new ListGridField("NEW_COMMENT", G.S.comment()),
						new ListGridField("NEW_DEVICE_TYPE", G.S.deviceType()),
						new ListGridField("NEW_HOST", G.S.ip()),
						new ListGridField("NEW_CONNECT_TYPE", G.S.connectionType()).selectItem(G.CONNECT_TYPES),
						new ListGridField("NEW_CONSOLE_PORT", G.S.consolePort()),
						new ListGridField("NEW_LOGIN", G.S.login()).noFilter(),
						new ListGridField("NEW_PWD", G.S.password()).noFilter(),
						new ListGridField("NEW_ENABLE_PWD", G.S.enablePassword()).noFilter(),
						new ListGridField("NEW_SNMP_PORT", G.S.snmpPort()),
						new ListGridField("NEW_SNMP_VERSION", G.S.snmpVersion()),
						new ListGridField("NEW_READ_COMMUNITY", G.S.readCommunity()).noFilter(),
						new ListGridField("NEW_WRITE_COMMUNITY", G.S.writeCommunity()).noFilter(),
						new ListGridField("NEW_SNMP_USER", "SNMP " + G.S.snmpUserName()).noFilter(),
						new ListGridField("NEW_SNMP_AUTH_PROT", "SNMP " + G.S.snmpAuthenticationProtocol()),
						new ListGridField("NEW_SNMP_AUTH_PWD", "SNMP " + G.S.snmpAuthenticationPassword()).noFilter(),
						new ListGridField("NEW_SNMP_PRIV_PROT", "SNMP " + G.S.snmpPrivacyProtocol()),
						new ListGridField("NEW_SNMP_PRIV_PWD", "SNMP " + G.S.snmpPrivacyPassword()).noFilter());

			}
		};
		grid.setHeaderSpans(
				new HeaderSpan(G.S.oldValues(), new String[] { "OLD_NAME", "OLD_LOCATION", "OLD_COMMENT", "OLD_DEVICE_TYPE", "OLD_HOST", "OLD_LOGIN",
						"OLD_PWD", "OLD_ENABLE_PWD",
						"OLD_CONNECT_TYPE", "OLD_CONSOLE_PORT", "OLD_SNMP_VERSION", "OLD_SNMP_PORT", "OLD_READ_COMMUNITY", "OLD_WRITE_COMMUNITY",
						"OLD_SNMP_USER", "OLD_SNMP_AUTH_PROT", "OLD_SNMP_AUTH_PWD", "OLD_SNMP_PRIV_PROT", "OLD_SNMP_PRIV_PWD" }),
				new HeaderSpan(G.S.newValues(), new String[] { "NEW_NAME", "NEW_LOCATION", "NEW_COMMENT", "NEW_DEVICE_TYPE", "NEW_HOST", "NEW_LOGIN",
						"NEW_PWD", "NEW_ENABLE_PWD",
						"NEW_CONNECT_TYPE", "NEW_CONSOLE_PORT", "NEW_SNMP_VERSION", "NEW_SNMP_PORT", "NEW_READ_COMMUNITY", "NEW_WRITE_COMMUNITY",
						"NEW_SNMP_USER", "NEW_SNMP_AUTH_PROT", "NEW_SNMP_AUTH_PWD", "NEW_SNMP_PRIV_PROT", "NEW_SNMP_PRIV_PWD" }));
		grid.setFieldStateId("GridDevicesJournal");
		grid.setAutoFetchData(true);
		grid.setSortDirection(SortDirection.DESCENDING);
		grid.setSortField("WHEN_MODIFY");
		grid.addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				grid.exportToExcel("journal.xls");
			}
		});

		return grid;
	}
}
