package com.app.client.tabs;
import static com.app.client.G.img16;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.Label;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.TextAreaItem;
import com.app.client.widgets.TextItem;
import com.google.gwt.user.client.Timer;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.VLayout;

public class Dict extends AppTab {

	private ListGrid m_gridDict;
	private ListGrid m_gridValues;
	private Timer m_timer;
	private Label m_label;
	private Record m_currentDict;

	public Dict() {
		super();
		setTitle(img16("dictionary_title"), G.S.dictionaries());
	}
	
	protected Canvas getContent() {
		m_label = new Label(G.M.valuesOfDict("")).gridTitle();

		initDict();
		initValues();

		m_timer = new Timer() {
			public void run() {
				ListGridRecord[] recs = m_gridDict.getSelectedRecords();

				if (recs.length == 1) {
					if (!G.isEqual(recs[0], m_currentDict, "ID", "NAME")) {
						m_currentDict = recs[0];
						m_label.setContents(G.M.valuesOfDict(m_currentDict.getAttribute("NAME")));
						m_gridValues.fetchData(new AdvancedCriteria("DICT_ID", OperatorId.EQUALS, m_currentDict.getAttribute("ID")));
					}
				}
				else {
					if (m_currentDict != null) {
						m_gridValues.setData(new RecordList());
						m_label.setContents(G.M.valuesOfDict(""));
						m_currentDict = null;
					}
				}
			}
		};
		m_timer.scheduleRepeating(200);

		VLayout l1 = new VLayout();
		l1.addMember(new Label(G.S.dictionaries()).gridTitle());
		l1.addMember(m_gridDict);
		l1.setShowResizeBar(true);

		VLayout l2 = new VLayout();
		l2.addMember(m_label);
		l2.addMember(m_gridValues);

		HLayout layout = new HLayout();
		layout.addMembers(l1, l2);

		return layout;
	}

	@Override
	protected void onClose() {
		super.onClose();
		if (m_timer != null)
			m_timer.cancel();
	}

	private void initValues() {
		m_gridValues = new ListGrid(DS.DICT_VALUES, true) {
			{
				setFieldStateId("GridDictValues");
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(new TextItem(ds.getField("VAL")));
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				ListGridRecord rec = m_gridDict.getSelectedRecordIfOnlyOne(G.S.selectOneDictionaryInList());
				if (rec != null)
					super.addRecordClick("DICT_ID", rec.getAttribute("ID"));
			}

			@Override
			protected void gridInitFields() {
				setFields(new ListGridField("VAL").width(300));
			}
		};
	}

	private void initDict() {
		m_gridDict = new ListGrid(DS.DICT, true) {
			{
				setAllowMultiEdit(true);
				setMultiEditFields("COMMENT");
				setFieldStateId("GridDict");
				setAutoFetchData(true);
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(
						new TextItem(ds.getField("NAME")),
						new TextAreaItem(ds.getField("COMMENT")));
			}

			@Override
			protected void gridInitFields() {
				setFields(new ListGridField("NAME").width(300),
						new ListGridField("COMMENT").width(300));
			}

		};
	}

}
