package com.app.client.tabs;

import static com.app.client.G.img16;
import static com.app.client.G.img24;

import java.util.ArrayList;
import java.util.List;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.G.FetchCallback;
import com.app.client.ScriptExec;
import com.app.client.widgets.CheckboxItem;
import com.app.client.widgets.DateTimeItem;
import com.app.client.widgets.FormFieldTitle;
import com.app.client.widgets.IPItem;
import com.app.client.widgets.ImgButton;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextAreaItem;
import com.app.shared.Const;
import com.app.shared.ObjectType;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.Overflow;
import com.smartgwt.client.types.SelectionAppearance;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.types.VerticalAlignment;
import com.smartgwt.client.util.ValueCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.grid.HoverCustomizer;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.VLayout;

public class DeviceManage extends AppTab {

	private Record m_objectInfo;
	private Record m_fields;
	private ImgButton m_executeScriptBtn;
	private ListGrid m_grid;
	private List<com.smartgwt.client.widgets.grid.ListGridField> m_gridFields = new ArrayList<com.smartgwt.client.widgets.grid.ListGridField>();
	private boolean readOnly;

	
	public DeviceManage(Record objectInfo, Record fields) {
		super();
		m_objectInfo = objectInfo;
		readOnly = "READ_ONLY".equals(objectInfo.getAttribute("ACCESS"));
		m_fields = fields;
		setTitle(img16("device_manage_title"), objectInfo.getAttribute("MAP_NAME") + " - " + objectInfo.getAttribute("NAME"));
	}

	protected Canvas getContent() {
		final List<FormItem> formFields = new ArrayList<FormItem>();
		m_gridFields.add(new ListGridField("HOST"));
		m_gridFields.add(new ListGridField("DEVICE_NAME"));
		m_gridFields.add(new ListGridField("DEVICE_TYPE_NAME"));
		m_gridFields.add(new ListGridField("LOCATION"));
		m_gridFields.add(new ListGridField("COMMENT"));

		if (m_fields != null) {
			for (int i = 1; i <= 20; i++) {
				String field = "TEXT" + i;
				String title = m_fields.getAttribute(field);
				if (title != null && !title.trim().isEmpty()) {
					TextAreaItem ta = new TextAreaItem(field, title).length(DS.DM_DEVICES.getField(field).getLength()).canEditInForm().height(16).noWrap();
					ta.setIconVAlign(VerticalAlignment.CENTER);
					ta.setTextBoxStyle("textItemOF");

					formFields.add(ta);
					m_gridFields.add(new ListGridField(field, title));
				}
			}
			for (int i = 1; i <= 20; i++) {
				String field = "IP" + i;
				String title = m_fields.getAttribute(field);
				if (title != null && !title.trim().isEmpty()) {
					formFields.add(new IPItem(field, title));
					m_gridFields.add(new ListGridField(field, title));
				}
			}
			for (int i = 1; i <= 20; i++) {
				String field = "DATE" + i;
				String title = m_fields.getAttribute(field);
				if (title != null && !title.trim().isEmpty()) {
					formFields.add(new DateTimeItem(field, title));
					m_gridFields.add(new ListGridField(field, title).date());
				}
			}
			for (int i = 1; i <= 20; i++) {
				String field = "BOOL" + i;
				String title = m_fields.getAttribute(field);
				if (title != null && !title.trim().isEmpty()) {
					formFields.add(new CheckboxItem(field, title) {
						{
							setDefaultValue(Boolean.FALSE);
						}
					});
					formFields.add(new CheckboxItem(field + "_", title).allowEmptyValue(true));
					m_gridFields.add(new ListGridField(field, title).bool());
				}
			}
			for (int i = 1; i <= 20; i++) {
				String title = m_fields.getAttribute("DICT" + i);
				Integer dictId = m_fields.getAttributeAsInt("DICT_ID" + i);
				if (title != null && !title.trim().isEmpty() && dictId != null) {
					formFields.add(new SelectItem("DICT_VAL_ID" + i, title, DS.DICT_VALUES, "ID", "VAL")
							.criteria(new AdvancedCriteria("DICT_ID", OperatorId.EQUALS, dictId))
							.allowEmptyValue());
					m_gridFields.add(new ListGridField("DICT" + i, title));
				}
			}
		}

		m_grid = new ListGrid(DS.DM_DEVICES, true, !readOnly, !readOnly, !readOnly, true, true) {
			StringBuilder sb = new StringBuilder();

			{
				if (!readOnly) {
					addButton(img24("console"), G.S.connectToDevice(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							ListGridRecord rec = getSelectedRecordIfOnlyOne();
							if (rec != null)
								G.startConsole(rec.getAttribute("HOST"),rec.getAttributeAsInt("ID"), "DM");
						}
					});
					m_executeScriptBtn = addButton(img24("execute_script"), G.S.executeScript(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							ListGridRecord[] recs = getSelectedRecords();
							if (recs.length == 0)
								G.dialogWarning(G.S.selectOneOrManyRowsInTable());
							else
								ScriptExec.showScripts(recs, m_objectInfo.getAttributeAsInt("ID"), ObjectType.DEVICE_MANAGE, m_executeScriptBtn);
						}
					});
				}
				addButton(img24("find_device"), G.S.findDevices(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						checkFields(new Runnable() {
							public void run() {
								G.dialogAskForValue(G.S.enterFindString(), new ValueCallback() {
									public void execute(String value) {
										if (value != null && !value.trim().isEmpty()) {
											AdvancedCriteria criteria = new AdvancedCriteria();
											criteria.addCriteria("OBJECT_ID", OperatorId.EQUALS, m_objectInfo.getAttribute("ID"));
											criteria.addCriteria("X", "%" + value.toLowerCase() + "%");
											DSRequest prop = new DSRequest();
											prop.setOperationId("FIND");
											m_grid.fetchData(criteria, null, prop);
										}
									}
								});
							}
						});
					}
				});
				addButton(img24("save_list"), G.S.saveDeviceList(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						checkFields(new Runnable() {
							public void run() {
								exportToExcel("devices.xls");
							}
						});
					}
				});
				if (!readOnly)
					addButton(img24("load_list"), G.S.loadDeviceList(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							checkFields(new Runnable() {
								public void run() {
									importFromExcel();
								}
							});
						}
					});
				setFieldStateId("GridDeviceManage" + getObjectId());
				setAllowMultiEdit(true);
				addRecordsCount();
				setFieldNameForDeleteQuestion("HOST");
				addCriteria("OBJECT_ID", OperatorId.EQUALS, getObjectId());
				setAutoFetchData(true);
				// setWrapCells(true);
				// setFixedRecordHeights(false);
				setShowHover(true);
				setCanHover(true);
				setHoverWidth(400);
				setHoverCustomizer(new HoverCustomizer() {
					public String hoverHTML(Object value, ListGridRecord record, int rowNum, int colNum) {
						if (value != null && cellValueIsClipped(rowNum, colNum)) {
							sb.setLength(0);
							String[] lines = value.toString().split("\n");
							for (int i = 0; i < lines.length; i++) {
								sb.append(lines[i]);
								sb.append("<br/>");
								if (i == 20 && lines.length > i + 1) {
									sb.append("<b>Текст обрезан. Имеются еще строки, которые не отображены.</b>");
									break;
								}
							}
							return sb.toString();
						} else
							return null;
					}
				});
			}

			ListGrid m_dev;
			FormFieldTitle m_label;

			@Override
			protected void beforeSave(Mode mode, Record record) {
				super.beforeSave(mode, record);
				for (String attr : record.getAttributes()) {
					if (attr.startsWith("BOOL") && attr.endsWith("_")) {
						record.setAttribute(attr.substring(0, attr.length() - 1), record.getAttribute(attr));
					}
				}
			}

			@Override
			protected Canvas editWindowTop() {
				m_label = new FormFieldTitle(G.S.devicesToAdd());
				m_label.setRequired(true);
				m_label.setErrorMessage(G.S.selectDevicesToAdd());

				m_dev = new ListGrid() {
					{
						setDataSource(DS.DEVICES);
						setFetchOperation("NOT_EXISTS_IN_DM_DEVICES");
						addCriteria("OBJECT_ID", getObjectId());
						setShowFilterEditor(true);
						setSelectionType(SelectionStyle.SIMPLE);
						setSelectionAppearance(SelectionAppearance.CHECKBOX);
						setHeight(300);
						setFieldStateId("GridDeviceManageAddDevList");
					}

					@Override
					protected void gridInitFields() {
						setFields(new ListGridField("HOST"),
								new ListGridField("NAME"),
								new ListGridField("DEVICE_TYPE_NAME"),
								new ListGridField("LOCATION"),
								new ListGridField("COMMENT").width(300));
					}
				};

				VLayout vl = new VLayout(Const.DEFAULT_PADDING);
				vl.setMembers(m_label, m_dev);
				return vl;
			}

			@Override
			protected void editFormInit(final DynamicForm form, DataSource ds) {
				form.setNumCols(4);
				form.setColWidths(150, "*", 150, "*");
				form.setFields(formFields.toArray(new FormItem[0]));
				
				/*form.doOnRender(new Function() {
					@Override
					public void execute() {
						Element dom = form.getContentElement();
						for (FormItem fi : form.getFields())
							if (fi.getName().startsWith("TEXT"))
								G.hideOverflow(dom, fi.getName());
					}
				});
								form.addDrawHandler(new DrawHandler() {
									@Override
									public void onDraw(DrawEvent event) {
									}
								});*/

			}

			@Override
			protected void gridInitFields() {
				setFields(m_gridFields.toArray(new ListGridField[0]));
			}

			void tuneBool(boolean allowEmpty) {
				DynamicForm form = getEditWindowForm();
				for (FormItem fi : form.getFields()) {
					if (fi.getName().startsWith("BOOL")) {
						CheckboxItem ch = (CheckboxItem) fi;
						if (ch.getAllowEmptyValue().equals(allowEmpty))
							ch.show();
						else
							ch.hide();
					}
				}
			}

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				int availWidth = G.availWidth(900);
				DynamicForm form = getEditWindowForm();
				m_dev.setWidth(availWidth);
				form.setWidth(availWidth);
				int availHeight = G.availHeight(800) - (mode == Mode.Update ? 0 : m_dev.getHeight() + m_label.getHeight() + Const.DEFAULT_PADDING) - 50 ;
				if (availHeight <= 0)
					availHeight = 100;
				int fieldsCnt = form.getFields().length;
				int maxFields = fieldsCnt > 0 ? (availHeight / form.getFields()[0].getHeight() * 2) : 0;
				if (form.getFields().length > maxFields) {
					form.setHeight(availHeight);
					form.setOverflow(Overflow.AUTO);
				} else {
					form.setHeight100();
					form.setOverflow(Overflow.VISIBLE);
				}

				if (mode == Mode.Update) {
					tuneBool(editRecords.length > 1);
					m_label.hide();
					m_dev.hide();
				} else {
					tuneBool(false);
					m_label.show();
					m_label.setError(false);
					m_dev.show();
					m_dev.scrollBodyTo(0, 0);
					m_dev.reloadData();
				}
			}
			

			@Override
			protected boolean editWindowSaveValidate(Mode mode) {
				if (mode == Mode.Update)
					return super.editWindowSaveValidate(mode);
				else {
					m_label.setError(m_dev.getSelectedRecords().length == 0);
					return !m_label.getError() & super.editWindowSaveValidate(mode);
				}
			}

			@Override
			protected Record[] getAddRecords() {
				ListGridRecord[] selDev = m_dev.getSelectedRecords();
				Record[] recs = new Record[selDev.length];
				for (int i = 0; i < recs.length; i++) {
					recs[i] = new Record(getEditRecordValues().toMap());
					recs[i].setAttribute("DEVICE_ID", selDev[i].getAttribute("ID"));
					recs[i].setAttribute("OBJECT_ID", getObjectId());
				}
				return recs;
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				checkFields(new Runnable() {
					public void run() {
						addClick();
					}
				});
			}

			void addClick() {
				super.addRecordClick();
			}

			@Override
			protected void updateRecordClick(Object... addValues) {
				checkFields(new Runnable() {
					public void run() {
						updateClick();
					}
				});
			}

			void updateClick() {
				if (formFields.size() == 0)
					G.dialogWarning(G.S.objectHasNoFields());
				else
					super.updateRecordClick();
			}

			@Override
			protected void editWindowSaveClick() {
				checkFields(new Runnable() {
					public void run() {
						saveClick();
					}
				});
			}

			void saveClick() {
				super.editWindowSaveClick();
			}

			@Override
			protected void refreshDataClick() {
				checkFields(new Runnable() {
					public void run() {
						refreshClick();
					}
				});
			}

			void refreshClick() {
				super.refreshDataClick();
			}

		};
		return m_grid;
	}

	private void checkFields(final Runnable run) {
		G.fetch(DS.DM_FIELDS, null, null, null, new AdvancedCriteria("OBJECT_ID", OperatorId.EQUALS, getObjectId()), new FetchCallback() {
			public void execute(Record[] records) {
				final String[] fields = G.getAllFieldsExcept(DS.DM_FIELDS, "MAP_NAME", "OBJECT_NAME");
				if (G.isEqual(records.length > 0 ? records[0] : null, m_fields, fields))
					run.run();
				else
					G.dialogWarning(G.S.fieldsChanged());
			}
		});
	}

	private Integer getObjectId() {
		return m_objectInfo.getAttributeAsInt("ID");
	}

	

	private void importFromExcel() {
		List fields = new ArrayList();
		fields.add("HOST");
		fields.add(DS.DM_DEVICES.getField("HOST").getTitle());
		fields.add(100);
		fields.add("DEVICE_NAME");
		fields.add(DS.DM_DEVICES.getField("DEVICE_NAME").getTitle());
		fields.add(100);

		for (com.smartgwt.client.widgets.grid.ListGridField f : m_gridFields) {
			String name = f.getName();
			String title = f.getTitle();
			if (name.startsWith("TEXT") || name.startsWith("IP") || name.startsWith("DATE") || name.startsWith("BOOL") || name.startsWith("DICT")) {
				fields.add(name);
				fields.add(title);
				fields.add(100);
			}
		}

		G.uploadData(G.S.loadDeviceList(), "UPLOAD_DM_DEVICES",
				new Runnable() {
					public void run() {
						m_grid.invalidateCache();
					}
				},
				new Object[] { "OBJECT_ID", getObjectId() },
				fields.toArray());
	}

}
