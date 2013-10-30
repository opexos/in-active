package com.app.client.tabs;
import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.smartgwt.client.types.SortDirection;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;

public class DeviceConfiguringJournal extends AppTab {

	public DeviceConfiguringJournal() {
		super();
		setTitle(img16("changes_journal"), G.S.consoleWorkJournal());
	}

	protected Canvas getContent() {
		final ListGrid grid = new ListGrid(DS.CONSOLE_LOG, true, false, false, false, true, true) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("DEVICE_HOST", G.S.ip()),
						new ListGridField("DEVICE_NAME", G.S.name()),
						new ListGridField("WHO_SENT", G.S.who()),
						new ListGridField("WHEN_SENT", G.S.when()).date(),
						new ListGridField("COMMAND", G.S.command()));
			}
		};
		grid.setFieldStateId("GridDeviceConfiguringJournal");
		grid.setAutoFetchData(true);
		grid.setSortDirection(SortDirection.DESCENDING);
		grid.setSortField("WHEN_SENT");		
		grid.addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				grid.exportToExcel("journal.xls");
			}
		});

		return grid;
	}

}
