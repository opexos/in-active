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
import com.smartgwt.client.widgets.layout.VLayout;

public class PortsJournal extends AppTab {

	public PortsJournal() {
		super();
		setTitle(img16("changes_journal"), G.S.portsChangesJournal());
	}

	protected Canvas getContent() {

		ListGrid gr1 = new ListGrid(DS.H_PM_PORTS, true, false, false, false, true, true) {
			{
				setHeaderSpans(
						new HeaderSpan(G.S.device(), new String[] { "DEV_HOST", "DEV_NAME" }),
						new HeaderSpan(G.S.oldValues(), new String[] { "OLD_TELCO", "OLD_PATCH", "OLD_LOCATION", "OLD_COMMENT" }),
						new HeaderSpan(G.S.newValues(), new String[] { "NEW_TELCO", "NEW_PATCH", "NEW_LOCATION", "NEW_COMMENT" }));
				setFieldStateId("GridPortsJournal");
				setAutoFetchData(true);
				setShowResizeBar(true);
				setSortDirection(SortDirection.DESCENDING);
				setSortField("WHEN_MODIFY");
				addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						exportToExcel("journal.xls");
					}
				});
			}
			private final String[] compareFieldPairs = new String[] {
					"OLD_TELCO", "NEW_TELCO",
					"OLD_PATCH", "NEW_PATCH",
					"OLD_COMMENT", "NEW_COMMENT",
					"OLD_LOCATION", "NEW_LOCATION" };

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
						new ListGridField("DEV_HOST", G.S.ip()),
						new ListGridField("DEV_NAME", G.S.name()),
						new ListGridField("PORT", G.S.port()),
						new ListGridField("OLD_TELCO", G.S.telco()),
						new ListGridField("OLD_PATCH", G.S.patch()),
						new ListGridField("OLD_LOCATION", G.S.location()),
						new ListGridField("OLD_COMMENT", G.S.comment()),
						new ListGridField("NEW_TELCO", G.S.telco()),
						new ListGridField("NEW_PATCH", G.S.patch()),
						new ListGridField("NEW_LOCATION", G.S.location()),
						new ListGridField("NEW_COMMENT", G.S.comment()));
			}
		};

		ListGrid gr2 = new ListGrid(DS.H_PM_PORTS_CHANGES, true, false, false, false, true, true) {
			{
				setHeaderSpans(new HeaderSpan(G.S.device(), new String[] { "DEV_HOST", "DEV_NAME" }));
				setFieldStateId("GridPortsChangesJournal");
				setAutoFetchData(true);
				setSortDirection(SortDirection.DESCENDING);
				setSortField("WHEN_CHANGE");
				addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						exportToExcel("journal.xls");
					}
				});
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("WHO_CHANGE", G.S.who()),
						new ListGridField("WHEN_CHANGE", G.S.when()).date(),
						new ListGridField("DEV_HOST", G.S.ip()),
						new ListGridField("DEV_NAME", G.S.name()),
						new ListGridField("PORT", G.S.port()),
						new ListGridField("ACTION", G.S.action(), G.PORT_CHANGE_ACTIONS),
						new ListGridField("VAL", G.S.value()));
			}
		};

		VLayout layout = new VLayout();
		layout.addMember(gr1);
		layout.addMember(gr2);
		return layout;
	}

}
