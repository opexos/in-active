package com.app.client.tabs;
import static com.app.client.G.img16;
import static com.app.client.G.img24;

import java.util.LinkedHashMap;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.HButtons;
import com.app.client.widgets.Label;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.RequiredIfOtherHaveValueValidator;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextAreaItem;
import com.app.client.widgets.TextItem;
import com.app.shared.ObjectType;
import com.google.gwt.user.client.Timer;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.DSCallback;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DSResponse;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.data.SortSpecifier;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.ValuesManager;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.VLayout;
import com.smartgwt.client.widgets.tab.Tab;
import com.smartgwt.client.widgets.tab.TabSet;

public class MapsAndObjects extends AppTab {

	private ListGrid m_gridMaps;
	private ListGrid m_gridObjects;
	private Timer m_timer;
	private Label m_objectLabel;
	private Record m_currentMap;

	public MapsAndObjects() {
		super();
		setTitle(img16("maps_and_objects_title"), G.S.mapsAndObjects());
	}

	protected Canvas getContent() {
		m_objectLabel = new Label(G.M.objectsOfMap("")).gridTitle();

		initMaps();
		initObjects();

		m_timer = new Timer() {
			public void run() {
				ListGridRecord[] recs = m_gridMaps.getSelectedRecords();

				if (recs.length == 1) {
					if (!G.isEqual(recs[0], m_currentMap, "ID", "NAME")) {
						m_currentMap = recs[0];
						m_objectLabel.setContents(G.M.objectsOfMap(m_currentMap.getAttribute("NAME")));
						m_gridObjects.fetchData(new AdvancedCriteria("MAP_ID", OperatorId.EQUALS, m_currentMap.getAttribute("ID")));
					}
				} else {
					if (m_currentMap != null) {
						m_gridObjects.setData(new RecordList());
						m_objectLabel.setContents(G.M.objectsOfMap(""));
						m_currentMap = null;
					}
				}
			}
		};
		m_timer.scheduleRepeating(200);

		VLayout layout = new VLayout();
		layout.addMember(new Label(G.S.maps()).gridTitle());
		layout.addMember(m_gridMaps);
		layout.addMember(m_objectLabel);
		layout.addMember(m_gridObjects);

		return layout;
	}

	@Override
	protected void onClose() {
		super.onClose();
		if (m_timer != null)
			m_timer.cancel();
	}

	private void initObjects() {
		m_gridObjects = new ListGrid(DS.OBJECTS, true) {
			{
				addButton(img24("device_management_edit_fields_list"), G.S.editFieldsList(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						editFieldList();
					}
				});
				addButton(img24("edit_patch_list"), G.S.editPatchList(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						editPatchList();
					}
				});
				addButton(img24("goto_object"), G.S.goToObject(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						ListGridRecord rec = getSelectedRecordIfOnlyOne();
						if (rec != null)
							G.openObject(rec.getAttributeAsInt("ID"));
					}
				});
				setAllowMultiEdit(true);
				setMultiEditFields("COMMENT");
				setFieldStateId("GridObjects");
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(
						new TextItem(ds.getField("NAME")),
						new SelectItem(ds.getField("TYPE"), G.OBJECT_TYPES),
						new TextAreaItem(ds.getField("COMMENT")));
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				ListGridRecord rec = m_gridMaps.getSelectedRecordIfOnlyOne(G.S.selectOneMapInMapList());
				if (rec != null)
					super.addRecordClick("MAP_ID", rec.getAttribute("ID"));
			}

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				getEditWindowForm().getField("TYPE").setDisabled(mode.equals(Mode.Update));
			}

			@Override
			protected void gridInitFields() {
				setFields(new ListGridField("NAME").width(300),
						new ListGridField("TYPE", G.OBJECT_TYPES).width(200),
						new ListGridField("COMMENT").width(400));
			}
		};
	}

	private void initMaps() {
		m_gridMaps = new ListGrid(DS.MAPS, true) {
			{
				setShowResizeBar(true);
				setAllowMultiEdit(true);
				setMultiEditFields("COMMENT");
				setFieldStateId("GridMaps");
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
						new ListGridField("COMMENT").width(400));
			}

		};
	}

	private void editFieldList() {
		ListGridRecord rec = m_gridObjects.getSelectedRecordIfOnlyOne();
		if (rec == null)
			return;

		if (!rec.getAttribute("TYPE").equals(ObjectType.DEVICE_MANAGE.toString())) {
			G.dialogWarning(G.M.actionAvailableOnlyForObjectsWithType(G.OBJECT_TYPES.get(ObjectType.DEVICE_MANAGE.toString())));
			return;
		}

		final int objectId = rec.getAttributeAsInt("ID");

		G.fetch(DS.DICT, null, null, "NAME", null, new G.FetchCallback() {
			public void execute(Record[] records) {
				final LinkedHashMap dicts = new LinkedHashMap();
				for (Record rec : records)
					dicts.put(rec.getAttribute("ID"), rec.getAttribute("NAME"));

				G.fetch(DS.DM_FIELDS, null, null, null, new AdvancedCriteria("OBJECT_ID", OperatorId.EQUALS, objectId), new G.FetchCallback() {
					public void execute(Record[] records) {

						final DynamicForm fText = new DynamicForm();
						fText.setNumCols(2);
						fText.setColWidths(40, "*");
						FormItem[] textItems = new FormItem[20];
						for (int i = 0; i < 20; i++)
							textItems[i] = new TextItem(DS.DM_FIELDS.getField("TEXT" + (i + 1)), "" + (i + 1));
						fText.setFields(textItems);

						final DynamicForm fBool = new DynamicForm();
						fBool.setNumCols(2);
						fBool.setColWidths(40, "*");
						FormItem[] boolItems = new FormItem[20];
						for (int i = 0; i < 20; i++)
							boolItems[i] = new TextItem(DS.DM_FIELDS.getField("BOOL" + (i + 1)), "" + (i + 1));
						fBool.setFields(boolItems);

						final DynamicForm fIP = new DynamicForm();
						fIP.setNumCols(2);
						fIP.setColWidths(40, "*");
						FormItem[] ipItems = new FormItem[20];
						for (int i = 0; i < 20; i++)
							ipItems[i] = new TextItem(DS.DM_FIELDS.getField("IP" + (i + 1)), "" + (i + 1));
						fIP.setFields(ipItems);

						final DynamicForm fDate = new DynamicForm();
						fDate.setNumCols(2);
						fDate.setColWidths(40, "*");
						FormItem[] dateItems = new FormItem[20];
						for (int i = 0; i < 20; i++)
							dateItems[i] = new TextItem(DS.DM_FIELDS.getField("DATE" + (i + 1)), "" + (i + 1));
						fDate.setFields(dateItems);

						final DynamicForm fDict = new DynamicForm();
						fDict.setNumCols(3);
						fDict.setColWidths(40, "*", "*");
						FormItem[] dictItems = new FormItem[40];
						for (int i = 0; i < 20; i++) {
							FormItem f1 = new TextItem(DS.DM_FIELDS.getField("DICT" + (i + 1)), "" + (i + 1));
							FormItem f2 = new SelectItem(DS.DM_FIELDS.getField("DICT_ID" + (i + 1)), dicts).noTitle();
							f1.setValidators(new RequiredIfOtherHaveValueValidator(f2));
							f2.setValidators(new RequiredIfOtherHaveValueValidator(f1));
							dictItems[i * 2] = f1;
							dictItems[i * 2 + 1] = f2;
						}
						fDict.setFields(dictItems);

						final ValuesManager man = new ValuesManager();
						man.addMember(fText);
						man.addMember(fBool);
						man.addMember(fIP);
						man.addMember(fDate);
						man.addMember(fDict);
						if (records.length > 0)
							man.setValues(records[0].toMap());

						final TabSet tabs = new TabSet();
						tabs.setWidth(500);
						tabs.setHeight(580);
						tabs.setTabs(
								new Tab(G.S.text()) {
							{
								setPane(fText);
							}
						},
								new Tab(G.S.checkbox()) {
							{
								setPane(fBool);
							}
						},
								new Tab(G.S.ip()) {
							{
								setPane(fIP);
							}
						},
								new Tab(G.S.date()) {
							{
								setPane(fDate);
							}
						},
								new Tab(G.S.dictionary()) {
							{
								setPane(fDict);
							}
						});

						final HButtons btns = new HButtons(G.S.save(), G.S.cancel(), G.S.copy()) {
							@Override
							protected void button1() {
								if (!man.validate())
									return;

								final Record newValues = new Record(man.getValues());
								newValues.setAttribute("OBJECT_ID", objectId);

								DS.DM_FIELDS.updateData(newValues, new DSCallback() {
									public void execute(DSResponse dsResponse, Object data, DSRequest dsRequest) {
										if (dsResponse.getDataAsObject() != null)
											G.findParentWindow(tabs).destroy();
										else
											DS.DM_FIELDS.addData(newValues, new DSCallback() {
												public void execute(DSResponse dsResponse, Object data, DSRequest dsRequest) {
													G.findParentWindow(tabs).destroy();
												}
											});
									}
								});
							}

							@Override
							protected void button2() {
								G.findParentWindow(this).destroy();
							}

							@Override
							protected void button3() {
								final ListGrid grid = new ListGrid(DS.DM_FIELDS, true, false, false, false, false, false) {
									{
										setWidth(400);
										setHeight(400);
										setSelectionType(SelectionStyle.SINGLE);
										setSort(SortSpecifier.convertToArray("MAP_NAME,OBJECT_NAME"));
										setAutoFetchData(true);
									}

									@Override
									protected void gridInitFields() {
										setFields(new ListGridField("MAP_NAME").width("*"),
												new ListGridField("OBJECT_NAME").width("*"));
									}
								};
								HButtons copyBtns = new HButtons(G.S.ok(), G.S.cancel()) {
									@Override
									protected void button1() {
										ListGridRecord rec = grid.getSelectedRecordIfOnlyOne();
										if (rec == null)
											return;
										for (DynamicForm f : man.getMembers())
											for (FormItem fi : f.getFields())
												fi.setValue(rec.getAttribute(fi.getName()));
										G.findParentWindow(this).destroy();
									}

									@Override
									protected void button2() {
										G.findParentWindow(this).destroy();
									}
								};
								G.showInWindow(G.S.copyFieldsFromOtherObject(), grid, copyBtns);
							}
						};

						G.showInWindow(G.S.fieldsList(), tabs, btns);
					}
				});
			}
		});

	}

	private void editPatchList() {
		ListGridRecord rec = m_gridObjects.getSelectedRecordIfOnlyOne();
		if (rec == null)
			return;

		if (!rec.getAttribute("TYPE").equals(ObjectType.PORT_MANAGE.toString())) {
			G.dialogWarning(G.M.actionAvailableOnlyForObjectsWithType(G.OBJECT_TYPES.get(ObjectType.PORT_MANAGE.toString())));
			return;
		}

		final int objectId = rec.getAttributeAsInt("ID");

		final ListGrid gr = new ListGrid(DS.PM_PATCH, true, true, true, true, true, true) {
			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("PATCH").width(100),
						new ListGridField("LOCATION").width("*"));
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(
						new TextItem(ds.getField("PATCH")),
						new TextItem(ds.getField("LOCATION")));
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				super.addRecordClick("OBJECT_ID", objectId);
			}
		};
		gr.addCriteria("OBJECT_ID", OperatorId.EQUALS, objectId);
		gr.setSortField("PATCH");
		gr.setAutoFetchData(true);
		gr.addButton(img24("save_list"), G.S.saveList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				gr.exportToExcel("patch.xls");
			}
		});
		gr.addButton(img24("load_list"), G.S.loadList(), new ClickHandler() {
			public void onClick(ClickEvent event) {
				G.uploadData(G.S.loadList(), "UPLOAD_PM_PATCH",
						new Runnable() {
					public void run() {
						gr.invalidateCache();
					}
				},
						new Object[] { "OBJECT_ID", objectId },
						new Object[] {
								DS.PM_PATCH.getField("PATCH"), 100,
								DS.PM_PATCH.getField("LOCATION"), 400
						});
			}
		});

		G.showInWindow(G.S.patchList(), 500, 500, true, null, gr);

	}
}
