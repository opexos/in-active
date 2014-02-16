package com.app.client.tabs;

import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.FileItemValidator;
import com.app.client.widgets.FileItemValidator.FileType;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.TextAreaItem;
import com.app.client.widgets.TextItem;
import com.app.shared.GS;
import com.google.gwt.user.client.Timer;
import com.smartgwt.client.data.DSCallback;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DSResponse;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.types.Visibility;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.HTMLPane;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.ButtonItem;
import com.smartgwt.client.widgets.form.fields.FileItem;
import com.smartgwt.client.widgets.form.fields.SpacerItem;
import com.smartgwt.client.widgets.form.fields.events.ChangedEvent;
import com.smartgwt.client.widgets.form.fields.events.ChangedHandler;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.VLayout;

public class Images extends AppTab {

	private ListGrid m_grid;
	private HTMLPane m_preview;
	private Timer m_timer;
	private Record m_currentImage;

	public Images() {
		super();
		setTitle(img16("images_title"), G.S.images());
	}
	

	protected Canvas getContent() {
		m_grid = new ListGrid(DS.IMAGES, true) {
			{
				setFieldNameForDeleteQuestion("FILENAME");
				setFieldStateId("GridImages");
				setAutoFetchData(true);
				addButton(img24("view_image"), G.S.showImage(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						if (m_preview.getVisibility() == Visibility.HIDDEN) {
							m_preview.setVisibility(Visibility.INHERIT);
							setShowResizeBar(true);
							m_preview.setHeight("50%");
							m_grid.setHeight("50%");
						} else {
							m_preview.setVisibility(Visibility.HIDDEN);
							setShowResizeBar(false);
							m_grid.setHeight("100%");
						}
					}
				});
			}

			FileItem m_fileItem;
			ButtonItem m_btnItem;
			SpacerItem m_spaceItem;

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				m_fileItem.setVisible(mode.equals(Mode.Add));
				m_btnItem.setVisible(mode.equals(Mode.Update));
				m_spaceItem.setVisible(mode.equals(Mode.Update));
			}

			@Override
			protected void editWindowSaveClick() {

				if (getEditWindowForm().validate()) {
					getEditWindowForm().saveData(new DSCallback() {
						@Override
						public void execute(DSResponse dsResponse, Object data, DSRequest dsRequest) {
							if (dsResponse.getStatus() == 0) {
								m_currentImage = null;
								focusRecord(dsResponse.getData()[0]);
								getEditWindow().hide();
							}
						}
					});
				}
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setDataSource(DS.IMAGES);
				m_fileItem = new FileItem("IMAGE", ds.getField("IMAGE").getTitle()) {
					{
						setMultiple(false);
						setAccept("image/gif,image/jpeg,image/png,image/svg+xml");
						setValidators(new FileItemValidator(FileType.Image));
						addChangedHandler(new ChangedHandler() {
							public void onChanged(ChangedEvent event) {
								if (GS.isEmpty(form.getValueAsString("FILENAME"))) {
									String filename = form.getValueAsString("IMAGE");
									filename = filename.substring(filename.lastIndexOf("\\") + 1);
									form.setValue("FILENAME", filename);
								}
							}
						});
					}
				};
				m_btnItem = new ButtonItem() {
					{
						setTitle(G.S.changeImage());
						setStartRow(false);
						setIcon(img16("change_image"));
						addClickHandler(new com.smartgwt.client.widgets.form.fields.events.ClickHandler() {
							public void onClick(com.smartgwt.client.widgets.form.fields.events.ClickEvent event) {
								m_fileItem.setVisible(true);
								m_spaceItem.setVisible(false);
								m_btnItem.setVisible(false);
								form.markForRedraw();
							}
						});
					}
				};
				m_spaceItem = new SpacerItem();

				form.setFields(
						m_fileItem,
						m_spaceItem,
						m_btnItem,
						new TextItem(ds.getField("FILENAME")) {
							{
								setValidators(new FileItemValidator(FileType.Image));
							}
						},
						new TextAreaItem(ds.getField("COMMENT")));
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("FILENAME").width(200),
						new ListGridField("COMMENT").width(400));
			}
		};

		m_preview = new HTMLPane();
		m_preview.setVisibility(Visibility.HIDDEN);
		m_preview.setStyleName("listGrid"); // draw border same color
		VLayout vl = new VLayout();
		vl.addMembers(m_grid, m_preview);
		return vl;
	}

	@Override
	protected void onShow() {
		super.onShow();
		m_timer = new Timer() {
			public void run() {
				ListGridRecord[] recs = m_grid.getSelectedRecords();

				if (recs.length == 1) {
					if (!G.isEqual(recs[0], m_currentImage, "FILENAME")) {
						m_currentImage = recs[0];
						m_preview.setContents("<img src=\"images/" + m_currentImage.getAttribute("FILENAME") + "?" + GS.generateRandomString(32) + "\">");
					}
				} else {
					if (m_currentImage != null) {
						m_preview.setContents("<br>");
						m_currentImage = null;
					}
				}
			}
		};
		m_timer.scheduleRepeating(200);
	}

	@Override
	protected void onClose() {
		super.onClose();
		if (m_timer != null)
			m_timer.cancel();
	}

}
