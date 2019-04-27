package com.app.client.tabs;

import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.grid.HeaderSpan;

public class AllArchiveClients extends AppTab {

	private Record m_objectInfo;
	private ListGrid m_grid;

	public AllArchiveClients(Record objectInfo) {
		super();
		m_objectInfo = objectInfo;
		setTitle(img16("clients_history"), objectInfo.getAttribute("MAP_NAME") + " - " + objectInfo.getAttribute("NAME"));
	}

	protected Canvas getContent() {

		m_grid = new ListGrid(DS.PM_CLIENTS_ARC, true, false, false, false, true, true) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("DEV_HOST", 150),
						new ListGridField("DEV_NAME", 150),
						new ListGridField("DEV_LOCATION", 150),
						new ListGridField("DEV_COMMENT", 150),
						new ListGridField("PORT", 80),
						new ListGridField("TRUNK", 60).bool(),
						new ListGridField("TELCO", 50),
						new ListGridField("PATCH", 50),
						new ListGridField("LOCATION", 150),
						new ListGridField("COMMENT", 150),
						new ListGridField("IP", 100),
						new ListGridField("MAC", 120),
						new ListGridField("VLAN", 50),
						new ListGridField("NAME", 150),
						new ListGridField("VOICE", 60).bool(),
						new ListGridField("FIRST_DETECT").date(),
						new ListGridField("LAST_DETECT").date()
				);
			}
		};
		m_grid.setHeaderSpans(
				new HeaderSpan(G.S.device(), new String[] { "DEV_HOST", "DEV_NAME", "DEV_LOCATION", "DEV_COMMENT" })// ,
				);
		m_grid.addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				m_grid.exportToExcel("arc_clients.xls");
			}
		});
		m_grid.setFieldStateId("GridAllArchiveClients");
		m_grid.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttribute("ID"));
		m_grid.setAutoFetchData(true);

		return m_grid;
	}

}
