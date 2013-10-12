package com.app.client.tabs;
import static com.app.client.G.img16;
import static com.app.client.G.img24;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextAreaItem;
import com.app.client.widgets.TextItem;
import com.app.shared.ObjectType;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.SortSpecifier;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.grid.ListGridRecord;

public class UserRoles extends AppTab {

	private ListGrid m_gridRoles;

	public UserRoles() {
		super();
		setTitle(img16("user_roles_title"), G.S.usersRoles());
	}

	protected Canvas getContent() {
		m_gridRoles = new ListGrid(DS.ROLES, true) {
			{
				setFieldStateId("GridRoles");
				setAutoFetchData(true);
				setSortField("NAME");
				addButton(img24("set_role_to_users"), G.S.setRoleToUsers(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						users();
					}
				});
				addButton(img24("role_objects_access"), G.S.objectsAccess(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						objectAccess();
					}
				});
				addButton(img24("role_config_devices_in_maps"), G.S.deviceConfigInMaps(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						mapDeviceSettings();
					}
				});
				addButton(img24("role_notice_about_new_clients"), G.S.noticeAboutNewClients(), new ClickHandler() {
					public void onClick(ClickEvent event) {
						newClientNotice();
					}
				});

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

		return m_gridRoles;
	}

	private void users() {
		final ListGridRecord role = m_gridRoles.getSelectedRecordIfOnlyOne(G.S.selectOneRoleInList());
		if (role == null)
			return;
		ListGrid grid = new ListGrid(DS.USER_ROLES, false, true, false, true, true, false) {
			{
				addCriteria("ROLE_ID", OperatorId.EQUALS, role.getAttributeAsInt("ID"));
				// setSortDirection(SortDirection.ASCENDING);
				setSortField("USER_NAME");
				setAutoFetchData(true);
			}

			@Override
			protected void gridInitFields() {
				setFields(new ListGridField("USER_NAME").width("*"));
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(new SelectItem(ds.getField("USER_ID"), DS.USERS, "ID", "NAME"));
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				super.addRecordClick("ROLE_ID", role.getAttribute("ID"));
			}
		};

		G.showInWindow(G.S.users(), 400, 400, true, null, grid);
	}

	private void objectAccess() {
		final ListGridRecord role = m_gridRoles.getSelectedRecordIfOnlyOne(G.S.selectOneRoleInList());
		if (role == null)
			return;
		ListGrid grid = new ListGrid(DS.ROLE_OBJECTS, false, true, true, true, true, false) {
			{
				setSort(SortSpecifier.convertToArray("MAP_NAME,OBJECT_NAME"));
				addCriteria("ROLE_ID", OperatorId.EQUALS, role.getAttributeAsInt("ID"));
				setAutoFetchData(true);
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(
						new SelectItem(ds.getField("OBJECT_ID")) {
							{
								setOptionDataSource(DS.OBJECTS);
								setValueField("ID");
								setDisplayField("MAP_WITH_OBJECT");
								setPickListFields(new ListGridField("MAP_NAME", G.S.map(), 300),
										new ListGridField("NAME", G.S.object(), 300));
								setPickListWidth(600);
								setPickListProperties(new com.smartgwt.client.widgets.grid.ListGrid() {
									{
										setShowHeaderContextMenu(false);
										setSort(SortSpecifier.convertToArray("MAP_NAME,NAME"));
									}
								});
							}
						},
						new SelectItem(ds.getField("MODE"), G.OBJECT_ACCESS_MODE));
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				super.addRecordClick("ROLE_ID", role.getAttribute("ID"));
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("MAP_NAME").width("*"),
						new ListGridField("OBJECT_NAME").width("*"),
						new ListGridField("MODE", G.OBJECT_ACCESS_MODE).width(150));
			}

			@Override
			protected void editWindowBeforeShow(Mode mode, ListGridRecord[] editRecords, Object[] addValues) {
				super.editWindowBeforeShow(mode, editRecords, addValues);
				getEditWindowForm().getField("OBJECT_ID").setDisabled(mode.equals(Mode.Update));
			}

		};
		G.showInWindow(G.S.objectsAccess(), 700, 400, true, null, grid);
	}

	private void mapDeviceSettings() {
		final ListGridRecord role = m_gridRoles.getSelectedRecordIfOnlyOne(G.S.selectOneRoleInList());
		if (role == null)
			return;
		ListGrid grid = new ListGrid(DS.ROLE_CONF_DEVICES, false, true, false, true, true, false) {
			{
				setSortField("MAP_NAME");
				addCriteria("ROLE_ID", OperatorId.EQUALS, role.getAttributeAsInt("ID"));
				setAutoFetchData(true);
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(new SelectItem(ds.getField("MAP_ID"), DS.MAPS, "ID", "NAME"));
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				super.addRecordClick("ROLE_ID", role.getAttribute("ID"));
			}

			@Override
			protected void gridInitFields() {
				setFields(new ListGridField("MAP_NAME").width("*"));
			}
		};
		G.showInWindow(G.S.deviceConfigInMaps(), 400, 400, true, null, grid);
	}

	private void newClientNotice() {
		final ListGridRecord role = m_gridRoles.getSelectedRecordIfOnlyOne(G.S.selectOneRoleInList());
		if (role == null)
			return;
		ListGrid grid = new ListGrid(DS.ROLE_NEW_CLIENT_NOTICE, false, true, false, true, true, false) {
			{
				setSort(SortSpecifier.convertToArray("MAP_NAME,OBJECT_NAME"));
				addCriteria("ROLE_ID", OperatorId.EQUALS, role.getAttributeAsInt("ID"));
				setAutoFetchData(true);
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				form.setFields(new SelectItem(ds.getField("OBJECT_ID")) {
					{
						setOptionDataSource(DS.OBJECTS);
						setValueField("ID");
						setDisplayField("MAP_WITH_OBJECT");
						setOptionCriteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, ObjectType.PORT_MANAGE.toString()));
						setPickListFields(new ListGridField("MAP_NAME", G.S.map(), 300),
								new ListGridField("NAME", G.S.object(), 300));
						setPickListWidth(600);
						setPickListProperties(new com.smartgwt.client.widgets.grid.ListGrid() {
							{
								setShowHeaderContextMenu(false);
								setSort(SortSpecifier.convertToArray("MAP_NAME,NAME"));
							}
						});
					}
				});
			}

			@Override
			protected void addRecordClick(Object... addValues) {
				super.addRecordClick("ROLE_ID", role.getAttribute("ID"));
			}

			@Override
			protected void gridInitFields() {
				setFields(new ListGridField("MAP_NAME").width("*"),
						new ListGridField("OBJECT_NAME").width("*"));
			}
		};
		G.showInWindow(G.S.noticeAboutNewClients(), 600, 400, true, null, grid);
	}

}
