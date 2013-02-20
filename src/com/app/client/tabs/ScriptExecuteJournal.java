package com.app.client.tabs;

import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.G.FetchCallback;
import com.app.client.ScriptResultViewer;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.shared.Const;
import com.app.shared.Result;
import com.app.shared.ScriptExecuteResult;
import com.smartgwt.client.data.Criteria;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.types.SortDirection;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.grid.ListGridRecord;

public class ScriptExecuteJournal extends AppTab {

	public ScriptExecuteJournal() {
		super();
		setTitle(img16("changes_journal"), G.S.executedScriptsJournal());
	}

	protected Canvas getContent() {

		final ListGrid grid = new ListGrid(DS.SCRIPT_EXECUTE_LOG, true, false, false, false, true, true) {

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("WHO_EXECUTE", G.S.who()),
						new ListGridField("WHEN_EXECUTE", G.S.when()).date(),
						new ListGridField("DEV_HOST", G.S.ip()),
						new ListGridField("DEV_NAME", G.S.name()),
						new ListGridField("SCRIPT_NAME", G.S.scriptName()),
						new ListGridField("STATUS", G.S.status(), G.RESULT));
			}

			@Override
			protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
				if (getFieldName(colNum).equals("STATUS"))
					if (Result.ERROR.toString().equals(record.getAttribute("STATUS")))
						return Const.CSS_RED_TEXT;
				return super.getCellCSSText(record, rowNum, colNum);
			}
		};
		grid.setFieldStateId("GridScriptExecuteLog");
		grid.setAutoFetchData(true);
		grid.setSortDirection(SortDirection.DESCENDING);
		grid.setSortField("WHEN_EXECUTE");
		grid.addButton(img24("view_script_execute_result"), G.S.showAddInfo(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				ListGridRecord rec = grid.getSelectedRecordIfOnlyOne();
				if (rec == null)
					return;
				G.fetch(DS.SCRIPT_EXECUTE_LOG, "ALL", null, null, new Criteria("ID", rec.getAttribute("ID")),
						new FetchCallback() {
							public void execute(final Record[] records) {
								if (records.length == 0)
									G.dialogWarning(G.S.errorNoDataFound());
								else {
									new ScriptResultViewer(new ScriptExecuteResult(records[0].toMap()), null, records[0].getAttribute("SCRIPT_PARAMS")).show();
								}
							}
						});
			}
		});
		grid.addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				grid.exportToExcel("journal.xls");
			}
		});

		return grid;
	}

}
