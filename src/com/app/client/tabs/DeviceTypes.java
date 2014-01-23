package com.app.client.tabs;

import static com.app.client.G.img16;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextItem;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.form.DynamicForm;

public class DeviceTypes extends AppTab {

	public DeviceTypes() {
		super();
		setTitle(img16("device_types_title"), G.S.deviceTypes());
	}

	protected Canvas getContent() {
		return new ListGrid(DS.DEVICE_TYPES, true) {
			{
				setFieldStateId("GridDeviceTypes");
				setAutoFetchData(true);
			}

			@Override
			protected void editFormInit(DynamicForm form, DataSource ds) {
				// form.setColWidths(350, "*");
				form.setWrapItemTitles(false);
				form.setWidth(700);
				form.setFields(
						new TextItem(ds.getField("NAME")),
						new SelectItem(ds.getField("CONSOLE_AUTH"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 1))
								.allowEmptyValue(),
						new SelectItem(ds.getField("CONSOLE_LOG"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 1))
								.allowEmptyValue(),
						new SelectItem(ds.getField("CC_GET_CONFIG"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 1))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_VLAN_LIST"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 1))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_REFRESH_DATA"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 1))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_PORT_INFO"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 2))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_PORT_CHANGE_VLAN"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 2))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_PORT_ON"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 2))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_PORT_OFF"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 2))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_PORT_CHANGE_SPEED"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 2))
								.allowEmptyValue(),
						new SelectItem(ds.getField("PM_PORT_CHANGE_DUPLEX"), DS.SCRIPTS, "ID", "NAME")
								.criteria(new AdvancedCriteria("TYPE", OperatorId.EQUALS, 2))
								.allowEmptyValue());
			}

			@Override
			protected void gridInitFields() {
				setFields(
						new ListGridField("NAME").width(300),
						new ListGridField("CONSOLE_AUTH_NAME").width(200),
						new ListGridField("CONSOLE_LOG_NAME").width(200),
						new ListGridField("CC_GET_CONFIG_NAME").width(200),
						new ListGridField("PM_VLAN_LIST_NAME").width(200),
						new ListGridField("PM_REFRESH_DATA_NAME").width(200),
						new ListGridField("PM_PORT_INFO_NAME").width(200),
						new ListGridField("PM_PORT_CHANGE_VLAN_NAME").width(200),
						new ListGridField("PM_PORT_ON_NAME").width(200),
						new ListGridField("PM_PORT_OFF_NAME").width(200),
						new ListGridField("PM_PORT_CHANGE_SPEED_NAME").width(200),
						new ListGridField("PM_PORT_CHANGE_DUPLEX_NAME").width(200));
			}
		};
	}
}
