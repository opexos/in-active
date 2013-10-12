package com.app.client.widgets;
import static com.app.client.G.img24;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.app.client.DS;
import com.app.client.G;
import com.app.shared.Const;
import com.app.shared.GS;
import com.google.gwt.core.client.JavaScriptObject;
import com.smartgwt.client.core.Function;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.Criterion;
import com.smartgwt.client.data.DSCallback;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.data.ResultSet;
import com.smartgwt.client.data.events.DataChangedEvent;
import com.smartgwt.client.data.events.DataChangedHandler;
import com.smartgwt.client.rpc.RPCManager;
import com.smartgwt.client.rpc.RPCQueueCallback;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.DSOperationType;
import com.smartgwt.client.types.ExportFormat;
import com.smartgwt.client.types.ListGridComponent;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.util.BooleanCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.grid.HeaderSpan;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.grid.events.DataArrivedEvent;
import com.smartgwt.client.widgets.grid.events.DataArrivedHandler;
import com.smartgwt.client.widgets.grid.events.FieldStateChangedEvent;
import com.smartgwt.client.widgets.grid.events.FieldStateChangedHandler;
import com.smartgwt.client.widgets.grid.events.FilterEditorSubmitEvent;
import com.smartgwt.client.widgets.grid.events.FilterEditorSubmitHandler;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickEvent;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickHandler;
import com.smartgwt.client.widgets.layout.VLayout;

public class ListGrid extends com.smartgwt.client.widgets.grid.ListGrid {

	private AdvancedCriteria m_criteria;
	private DSRequest m_requestProps;
	private DSCallback m_fetchCallback;
	private ToolStrip m_toolstrip;
	private Window m_editWindow;
	private String m_fieldNameForDeleteQuestion;
	private boolean m_changeHandlerAdded = false;
	private DynamicForm m_form;
	private ListGridRecord[] m_oldRecords;
	private Mode m_editWindowMode;
	private boolean m_allowMultiEdit = false;
	private boolean m_autoFetchData = false;
	private String[] m_multiEditFields;
	private String m_fieldStateId;
	private String m_savedFieldState;
	private Label m_recordCountLabel;
	private VLayout m_editWindowLayout;

	public enum Mode {
		Add, Update
	};

	public ListGrid() {
		super();
		setAlternateRecordStyles(false);
		setShowRollOver(false);
		setShowHeaderContextMenu(false);
		super.setAutoFetchData(false);
		setGridComponents(new Object[] {
				ListGridComponent.HEADER,
				ListGridComponent.FILTER_EDITOR,
				ListGridComponent.BODY,
				ListGridComponent.SUMMARY_ROW
		});
		addDataArrivedHandler(new DataArrivedHandler() {
			public void onDataArrived(DataArrivedEvent event) {
				final ResultSet rs = getResultSet();
				recordsChanged(rs);
				if (!m_changeHandlerAdded) {
					rs.addDataChangedHandler(new DataChangedHandler() {
						public void onDataChanged(DataChangedEvent event) {
							recordsChanged(rs);
						}
					});
					m_changeHandlerAdded = true;
				}
			}
		});
		addFilterEditorSubmitHandler(new FilterEditorSubmitHandler() {
			public void onFilterEditorSubmit(FilterEditorSubmitEvent event) {
				event.cancel();
				/*AdvancedCriteria criteria = null;
				Criteria filter = getFilterEditorCriteria();
				if (filter != null) {
					criteria = filter.asAdvancedCriteria();
					if (m_criteria != null) {
						for (Criterion cr : m_criteria.getCriteria())
							for (Criterion cr2 : criteria.getCriteria())
								if (cr2.getFieldName().equals(cr.getFieldName()) && getField(cr.getFieldName()) == null) {
									cr2.setOperator(cr.getOperator());
									cr2.setAttribute("value", cr.getAttributeAsObject("value"));
								}
					}
				}
				filterData(criteria, m_fetchCallback, m_requestProps);*/
				filterData(getFilterEditorCriteria(), m_fetchCallback, m_requestProps);
			}
		});
		addFieldStateChangedHandler(new FieldStateChangedHandler() {
			public void onFieldStateChanged(FieldStateChangedEvent event) {
				if (m_fieldStateId != null) {
					String state = getFieldState();
					if (!state.equals("[]")/*при отрисовке грида с изначальной сортировкой, событие сортировки срабатывает раньше, 
											чем подгрузка записанных полей из базы, поэтому проверяем на пустое значение*/
							&& !state.equals("[{name:\"noname\"}]")
							&& !state.equals(m_savedFieldState)) {
						Record rec = new Record();
						rec.setAttribute("NAME", m_fieldStateId);
						rec.setAttribute("VAL", state);
						DS.USER_VARIABLES.addData(rec);
						m_savedFieldState = state; // запоминаем состояние
					}
				}
			}
		});
		/*addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
			public void onRecordDoubleClick(RecordDoubleClickEvent event) {
				ListGridRecord[] records = ListGrid.this.getSelectedRecords();
				if (records.length != 1)
					return;
				com.smartgwt.client.widgets.grid.ListGridField[] gridFields = ListGrid.this.getFields();
				DetailViewerField[] fields = new DetailViewerField[gridFields.length];
				for (int i = 0; i < fields.length; i++)
					fields[i] = new DetailViewerField(gridFields[i].getName(), gridFields[i].getTitle());
				DetailViewer dv = new DetailViewer();
				dv.setCanSelectText(true);
				dv.setFields(fields);
				dv.setData(records);
				G.showInWindow(G.S.viewRecord(), 500, 500, true, null, dv);
			}
		});*/
	}

	@Override
	protected void onInit_ListGrid() {
		super.onInit_ListGrid();
		if (m_fieldStateId != null) {
			setFields(new ListGridField("noname", " ").width(1));
			setShowEmptyMessage(false); 
			G.fetch(DS.USER_VARIABLES, null, "VAL", null, new AdvancedCriteria("NAME", OperatorId.EQUALS, m_fieldStateId), new G.FetchCallback() {
				public void execute(Record[] records) {
					gridInitFields();
					if (records.length == 1)
						setFieldState(records[0].getAttribute("VAL"));
					m_savedFieldState = getFieldState(); 
					if (m_autoFetchData)
						fetchData();
					setShowEmptyMessage(true); 
				}
			});
		} else {
			gridInitFields();
			if (m_autoFetchData)
				fetchData();
		}
	}

	@Override
	public void setAutoFetchData(Boolean autoFetchData) throws IllegalStateException {
		m_autoFetchData = autoFetchData;
	}

	protected void gridInitFields() {
	};

	public ListGrid(final DataSource dataSource,
			boolean showFilter,
			boolean add,
			boolean update,
			boolean remove,
			boolean refresh,
			boolean selection) {
		this();
		setDataSource(dataSource);
		setShowFilterEditor(showFilter);
		setAllowFilterExpressions(showFilter); 
												
		editWindowInitInternal();

		if (add)
			addButton(img24("add"), G.S.addRecord(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					addRecordClick();
				}
			});
		if (update) {
			addButton(img24("update"), G.S.updateRecord(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					updateRecordClick();
				}
			});
			addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
				public void onRecordDoubleClick(RecordDoubleClickEvent event) {
					updateRecordClick();
				}
			});
		}
		if (remove)
			addButton(img24("remove"), G.S.removeRecord(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					removeRecordClick();
				}
			});
		if (refresh)
			addButton(img24("refresh"), G.S.refreshData(), new ClickHandler() {
				public void onClick(ClickEvent event) {
					refreshDataClick();
				}
			});
		if (selection) {
			final ImgButton btn = addButton(img24("text_selection"), G.S.toggleTextSelection(), null);
			btn.addClickHandler(new ClickHandler() {
				public void onClick(ClickEvent event) {
					Boolean s = btn.getSelected();
					Boolean val = s == null ? true : !s;
					btn.setSelected(val);
					setCanDragSelectText(val ? true : null);
				}
			});
		}
	}

	public ListGrid(final DataSource dataSource, boolean showFilter) {
		this(dataSource, showFilter, true, true, true, true, true);
	}

	public native void setCanDragSelectText(Boolean value)/*-{
		var self = this.@com.smartgwt.client.widgets.BaseWidget::getOrCreateJsObj()();
		var body = self.body;
		if (body == null)
			return;
		self.canDragSelectText = value;
		body.canSelectText = value;
	}-*/;

	public void setAllowMultiEdit(boolean value) {
		m_allowMultiEdit = value;
	}

	public boolean getAllowMultiEdit() {
		return m_allowMultiEdit;
	}

	protected void recordsChanged(ResultSet rs) {
		if (m_recordCountLabel != null)
			m_recordCountLabel.setContents(rs.lengthIsKnown() ? G.M.recordsQty(rs.getLength()) : "");
		if (rs.getLength() > 0 && getSelectedRecords().length == 0 &&
				(SelectionStyle.SINGLE.equals(getSelectionType()) || SelectionStyle.MULTIPLE.equals(getSelectionType())))
			selectSingleRecord(0);
	}

	public void setMultiEditFields(String... multiEditFields) {
		m_multiEditFields = multiEditFields;
	}

	public void setFieldStateId(String fieldStateId) {
		m_fieldStateId = fieldStateId;
	}

	protected void editWindowInit(Window w) {
	}
	
	protected void editWindowAfterDraw(Window w){
		
	}

	private void editWindowInitInternal() {
		m_editWindow = new Window("", false, true);
		editWindowInit(m_editWindow);

		HButtons btns = new HButtons((Integer) null, G.S.save(), G.S.cancel()) {
			@Override
			protected void button1() {
				editWindowSaveClick();
			}

			@Override
			protected void button2() {
				editWindowCancelClick();
			}
		};
		btns.addMembers(editWindowAdditionalButtons());

		m_editWindowLayout = new VLayout(Const.DEFAULT_PADDING);
		m_editWindowLayout.setPadding(Const.DEFAULT_PADDING);
		Canvas canv = editWindowTop();
		if (canv != null)
			m_editWindowLayout.addMember(canv);
		m_editWindowLayout.addMember(editWindowBody());
		canv = editWindowBottom();
		if (canv != null)
			m_editWindowLayout.addMember(canv);
		m_editWindowLayout.addMember(btns);
		m_editWindowLayout.setWidth100();
		m_editWindowLayout.setHeight100();
		// vl.setBorder("1px solid blue");

		m_editWindow.addItem(m_editWindowLayout);
		m_editWindow.hide();
		m_editWindow.draw();
		editWindowAfterDraw(m_editWindow);
	}

	public VLayout getEditWindowLayout() {
		return m_editWindowLayout;
	}

	protected Canvas[] editWindowAdditionalButtons() {
		return new Canvas[0];
	}

	public DynamicForm getEditWindowForm() {
		return m_form;
	}

	public Window getEditWindow() {
		return m_editWindow;
	}

	protected Canvas editWindowTop() {
		return null;
	}

	protected Canvas editWindowBottom() {
		return null;
	}

	private Canvas editWindowBody() {
		m_form = new DynamicForm();
		m_form.setAutoFocus(true);
		m_form.setShowErrorStyle(false);
		// m_form.setTitleOrientation(TitleOrientation.TOP);
		// m_form.setNumCols(1);
		// m_form.setTitleWidth(300);
		m_form.setColWidths(150, "*");
		m_form.setWidth(500);
		// m_form.setCellBorder(1);
		// m_form.setWrapItemTitles(false);
		editFormInit(m_form, getDataSource());

		return m_form;
	}

	public void setFieldNameForDeleteQuestion(String fieldNameForDeleteQuestion) {
		m_fieldNameForDeleteQuestion = fieldNameForDeleteQuestion;
	}

	protected boolean editWindowSaveValidate(Mode mode) {
		return m_form.validate();
	}

	protected void editWindowCancelClick() {
		m_editWindow.hide();
		editWindowAfterHide(m_editWindowMode);
	}

	protected void editWindowSaveClick() {
		if (!editWindowSaveValidate(m_editWindowMode))
			return;
		if (m_editWindowMode == Mode.Add) {
			final Record[] records = getAddRecords();
			RPCManager.startQueue();
			try {
				for (int i = 0; i < records.length; i++) {
					beforeSave(m_editWindowMode, records[i]);
					getDataSource().addData(records[i]);
				}
				RPCManager.sendQueue(new RPCQueueCallback() {
					public void execute(RPCResponse... responses) {
						if (G.allResponseSuccess(responses)) {
							m_editWindow.hide();
							editWindowAfterHide(m_editWindowMode);
							focusRecord(new RecordList(responses[responses.length - 1].getDataAsObject()).get(0));
							afterAdd(records);
						}
					}
				});
			} catch (RuntimeException e) {
				RPCManager.cancelQueue();
				throw e;
			}
		} else if (m_editWindowMode == Mode.Update) {
			RPCManager.startQueue();
			try {
				String[] pkFields = getDataSource().getPrimaryKeyFieldNames();
				for (Record oldRec : m_oldRecords) {
					Record rec = new Record(getEditRecordChangedValues()); 
					Record.copyAttributesInto(rec, oldRec, pkFields);
					beforeSave(m_editWindowMode, rec);
					// DSRequest prop = new DSRequest();
					// prop.setOldValues(oldRec);
					getDataSource().updateData(rec);
				}
				RPCManager.sendQueue(new RPCQueueCallback() {
					public void execute(RPCResponse... responses) {
						if (G.allResponseSuccess(responses)) {
							m_editWindow.hide();
							editWindowAfterHide(m_editWindowMode);
							Record[] newRecords = new Record[responses.length];
							for (int i = 0; i < responses.length; i++) {
								JavaScriptObject data = responses[i].getDataAsObject();
								if (data == null) {
									G.dialogWarning(responses.length == 1 ? G.S.errorNoDataFound() : G.S.errorUpdateFailedForSomeRecords());
									G.removeRowFromCache(getDataSource(), m_oldRecords[i]); 
									newRecords[i] = null;
								} else {
									newRecords[i] = new RecordList(data).get(0);
								}
							}
							afterUpdate(m_oldRecords, newRecords);
						}
					}
				});
			} catch (RuntimeException e) {
				RPCManager.cancelQueue();
				throw e;
			}
		}
	}

	public void focusRecord(Record rec) {
		int idx = getRecordIndex(rec);
		if (idx == -1)
			return;
		selectSingleRecord(idx);
		Integer[] range = getVisibleRows();
		if (idx < range[0] || idx > range[1]) {
			scrollToRow(idx);
			markForRedraw();
		}
	}

	protected Record getEditRecordValues() {
		return m_form.getValuesAsRecord();
	}

	protected Map getEditRecordChangedValues() {
		Map result = m_form.getChangedValues();
		for (FormItem fi : m_form.getFields()) {
			if (fi instanceof CanClear && ((CanClear) fi).getClearIcon().getPressed()) {
				result.put(fi.getName(), fi instanceof CheckboxItem ? false : null);
			}
		}
		return result;
	}

	protected Record[] getAddRecords() {
		return new Record[] { m_form.getValuesAsRecord() };
	}

	private void setAddValues(Object... addValues) {
		if (addValues.length == 1 && addValues[0] instanceof Record) {
			Record r = (Record) addValues[0];
			for (String atr : r.getAttributes())
				m_form.setValue(atr, r.getAttribute(atr));
		} else {
			for (int i = 0; i < addValues.length; i += 2) {
				if (addValues[i + 1] instanceof Boolean)
					m_form.setValue(addValues[i].toString(), (Boolean) addValues[i + 1]);
				else
					m_form.setValue(addValues[i].toString(), addValues[i + 1] == null ? null : addValues[i + 1].toString());
			}
		}
	}

	protected void editFormInit(DynamicForm form, DataSource ds) {
	}

	protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
		m_form.clearValues();

		for (FormItem itm : m_form.getFields()) {
			// itm.show();
			itm.setDisabled(false);
			if (itm instanceof CanClear) {
				((CanClear) itm).getClearIcon().hide();
				((CanClear) itm).getClearIcon().setPressed(false);
			}
			DataSourceField field = getDataSource().getField(itm.getName());
			if (field != null)
				itm.setRequired(field.getRequired());
		}

		if (mode == Mode.Update) {
			if (editRecords.length == 1)
				m_form.setValues(editRecords[0].toMap());
			else {
				for (FormItem itm : m_form.getFields()) {
					if (m_multiEditFields != null && !GS.contains(itm.getName(), m_multiEditFields))
						itm.setDisabled(true);
					else if (itm instanceof CanClear)
						((CanClear) itm).getClearIcon().show(itm.getRequired());
					itm.setRequired(false);
				}
			}
		}
		setAddValues(addValues);
	}

	protected void editWindowAfterShow(Mode mode) {
	}

	protected void editWindowAfterHide(Mode mode) {
	}

	protected void beforeSave(Mode mode, Record record) {
	}

	protected void afterAdd(Record[] records) {
	}

	protected void afterUpdate(Record[] oldRecords, Record[] newRecords) {
	}

	protected void afterRemove(Record[] records) {
	}

	protected void addRecordClick(Object... addValues) {
		m_editWindow.setTitle(G.S.adding());
		m_editWindowMode = Mode.Add;
		editWindowBeforeShow(m_editWindowMode, null, addValues);
		m_editWindow.show();
		editWindowAfterShow(m_editWindowMode);
	}

	protected void updateRecordClick(Object... addValues) {
		ListGridRecord[] records = getSelectedRecords();
		if (records.length == 0) {
			G.dialogWarning(getAllowMultiEdit() ? G.S.selectOneOrManyRowsInTable() : G.S.selectOneRowInTable());
			return;
		}
		if (!getAllowMultiEdit() && records.length > 1) {
			G.dialogWarning(G.S.selectOneRowInTable());
			return;
		}
		m_editWindow.setTitle(G.S.editing() + (records.length > 1 ? G.getRedText(" (" + G.S.groupOfRecords() + ")") : ""));
		m_oldRecords = records;
		m_editWindowMode = Mode.Update;
		editWindowBeforeShow(m_editWindowMode, records, addValues);
		m_editWindow.show();
		editWindowAfterShow(m_editWindowMode);
	}

	protected void removeRecordClick() {
		final ListGridRecord[] selectedRecords = getSelectedRecords();
		if (selectedRecords.length == 0) {
			G.dialogWarning(G.S.selectOneOrManyRowsInTable());
			return;
		}

		String question = G.S.removeRecordsQuestion();
		if (m_fieldNameForDeleteQuestion != null) {
			question += "<br>";
			int i;
			for (i = 0; i < selectedRecords.length && i < 10; i++)
				question += "<br>" + selectedRecords[i].getAttribute(m_fieldNameForDeleteQuestion);
			i = selectedRecords.length - i;
			if (i > 0)
				question += "<br>... " + G.M.more(i);
		}

		G.dialogAsk(question, new BooleanCallback() {
			public void execute(Boolean value) {
				if (value) {
					RPCManager.startQueue();
					for (Record rec : selectedRecords) {
						DSRequest prop = new DSRequest();
						prop.setOldValues(rec);
						prop.setWillHandleError(true);
						getDataSource().removeData(rec, null, prop);
					}
					RPCManager.sendQueue(new RPCQueueCallback() {
						public void execute(RPCResponse... responses) {
							if (G.allResponseSuccess(responses))
								afterRemove(selectedRecords);
							else
								G.dialogWarning(G.getErrorsFromResponses(responses));
						};
					});
				}
			}
		});
	}

	protected void refreshDataClick() {
		invalidateCache();
	}

	public void addCriteria(String field, OperatorId op, Integer value) {
		createCriteria();
		m_criteria.addCriteria(field, op, value);
	}

	public void addCriteria(String field, Integer value) {
		createCriteria();
		m_criteria.addCriteria(field, value);
	}

	public void addCriteria(String field, OperatorId op, String value) {
		createCriteria();
		m_criteria.addCriteria(field, op, value);
	}

	public void addCriteria(String field, String value) {
		createCriteria();
		m_criteria.addCriteria(field, value);
	}

	public void addCriteria(Criterion c) {
		createCriteria();
		m_criteria.addCriteria(c);
	}

	public void addCriteria(String field, OperatorId op, Boolean value) {
		createCriteria();
		m_criteria.addCriteria(field, op, value);
	}

	public void addCriteria(String field, OperatorId op) {
		createCriteria();
		m_criteria.addCriteria(field, op, (String) null);
	}

	public void reloadData(){
		if (willFetchData(m_criteria))
			fetchData();
		else
			invalidateCache();	
	}

	public void setOutputs(String outputs) {
		createRequest();
		m_requestProps.setOutputs(outputs);
	}

	public String getOutputs() {
		return m_requestProps == null ? null : m_requestProps.getOutputs();
	}

	@Override
	public void setFetchOperation(String fetchOperation) {
		createRequest();
		m_requestProps.setOperationId(fetchOperation);
	}

	private void createRequest() {
		if (m_requestProps == null) {
			m_requestProps = new DSRequest();
			m_requestProps.setOperationType(DSOperationType.FETCH);
		}
	}

	private void createCriteria() {
		if (m_criteria == null)
			m_criteria = new AdvancedCriteria(OperatorId.AND);
	}

	private void setFetchCallback(DSCallback callback) {
		m_fetchCallback = callback;
	}

	@Override
	public void fetchData() {
		// JavaScriptObject jso = JSOHelper.createObject();
		// JSOHelper.addProperties(jso, m_criteria.getJsObj());
		super.fetchData(m_criteria, m_fetchCallback, m_requestProps);
	}

	public ListGridRecord getSelectedRecordIfOnlyOne(String message) {
		ListGridRecord[] records = getSelectedRecords();
		if (records != null && records.length == 1)
			return records[0];
		else {
			if (message != null)
				G.dialogWarning(message);
			return null;
		}
	}

	public ListGridRecord getSelectedRecordIfOnlyOne() {
		return getSelectedRecordIfOnlyOne(G.S.selectOneRowInTable());
	}

	private void createToolStrip() {
		if (m_toolstrip == null) {
			m_toolstrip = new ToolStrip();
			setGridComponents(new Object[] {
					m_toolstrip,
					ListGridComponent.HEADER,
					ListGridComponent.FILTER_EDITOR,
					ListGridComponent.BODY,
					ListGridComponent.SUMMARY_ROW
			});
		}
	}

	public ImgButton addButton(String icon, String prompt, ClickHandler clickHandler) {
		createToolStrip();
		ImgButton btn = new ImgButton(icon, prompt, clickHandler, 24);
		m_toolstrip.addMember(btn);
		return btn;
	}

	public void addRecordsCount() {
		createToolStrip();
		m_recordCountLabel = new Label();
		m_toolstrip.addFill();
		m_toolstrip.addMember(m_recordCountLabel);
	}

	// public void addSaveGridView() {
	// addButton(Icons24.TABLE_OK, G.S.saveViewSettings(), new ClickHandler() {
	// public void onClick(ClickEvent event) {
	// // String s =
	// }
	// });
	// }

	public void exportToExcel(final String filename, final String[] fields) {
		G.checkSession(new Function() {
			public void execute() {
				DSRequest props = new DSRequest();
				props.setExportAs(ExportFormat.XLS);
				props.setExportFilename(filename);
				props.setExportFields(fields);
				props.setExportShowHeaderSpanTitles(false);
				exportData(props);
			}
		});
	}

	public void exportToExcel(String filename) {
		List<String> fields = new ArrayList<String>();
		for (com.smartgwt.client.widgets.grid.ListGridField f : getFields())
			fields.add(f.getName());
		exportToExcel(filename, fields.toArray(new String[0]));
	}

	@Override
	public void setHeaderSpans(HeaderSpan... headerSpans) throws IllegalStateException {
		setHeaderHeight(44);
		super.setHeaderSpans(headerSpans);
	}

	public Mode getEditWindowMode() {
		return m_editWindowMode;
	}

	/*public int getColumnsWidth(int autoWidthPixelSize) {
		int result = 0;
		for (com.smartgwt.client.widgets.grid.ListGridField f : getFields()) {
			String w = f.getWidth();
			if (w.equals("*"))
				result += autoWidthPixelSize;
			else
				result += GS.getInt(w);
		}
		return result;
	}
	
	public int getColumnsWidth() {
		return getColumnsWidth(200);
	}*/
}
