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

public class ObjectsJournal extends AppTab {

	public ObjectsJournal() {
		super();
		setTitle(img16("changes_journal"), G.S.objectsChangesJournal());
	}

	protected Canvas getContent() {

		final ListGrid grid = new ListGrid(DS.H_OBJECTS, true, false, false, false, true, true) {
			private final String[] compareFieldPairs = new String[] { "OLD_NAME", "NEW_NAME", "OLD_COMMENT", "NEW_COMMENT", "OLD_MAP_NAME", "NEW_MAP_NAME" };

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
						new ListGridField("OLD_MAP_NAME", G.S.map()),
						new ListGridField("OLD_NAME", G.S.name()),
						new ListGridField("OLD_COMMENT", G.S.comment()),
						new ListGridField("NEW_MAP_NAME", G.S.map()),
						new ListGridField("NEW_NAME", G.S.name()),
						new ListGridField("NEW_COMMENT", G.S.comment()));
			}
		};
		grid.setHeaderSpans(
				new HeaderSpan(G.S.oldValues(), new String[] { "OLD_MAP_NAME", "OLD_NAME", "OLD_COMMENT" }),
				new HeaderSpan(G.S.newValues(), new String[] { "NEW_MAP_NAME", "NEW_NAME", "NEW_COMMENT" }));
		grid.setFieldStateId("GridObjectsJournal");
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
