package com.app.client.tabs;
import static com.app.client.G.img16;

import java.util.Map;

import com.app.client.AppTab;
import com.app.client.G;
import com.app.client.widgets.HButtons;
import com.app.client.widgets.ImgButton;
import com.app.client.widgets.Label;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.TextAreaItem;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.rpc.RPCCallback;
import com.smartgwt.client.rpc.RPCRequest;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.AutoFitEvent;
import com.smartgwt.client.types.Autofit;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.types.TitleOrientation;
import com.smartgwt.client.util.BooleanCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.VLayout;

public class Licenses extends AppTab {

	public Licenses() {
		super();
		setTitle(img16("licenses_title"), G.S.licenses());
	}

	private ListGrid m_lic;
	private ListGrid m_opt;
	private Label m_serverId;
	private Label m_client;

	protected Canvas getContent() {

		m_serverId = new Label();
		m_serverId.setCanSelectText(true);
		m_client = new Label();

		m_lic = new LicGrid() {
			{
				setFields(
						new ListGridField("MODULE", G.S.module(), "*"),
						new ListGridField("STATUS", G.S.licenseStatus(), "*"),
						new ListGridField("TOTAL", G.S.devicesOrPorts(), "*"),
						new ListGridField("USED", G.S.used(), "*")
				);
				hide();
			}
		};

		m_opt = new LicGrid() {
			{
				setFields(
						new ListGridField("OPTION", G.S.additionalOption(), "*"),
						new ListGridField("STATUS", G.S.status(), "*")
				);
				setHeight(65);
				hide();
			}
		};

		refresh();

		VLayout vl = new VLayout(20);
		//vl.settop
		vl.addMembers(m_serverId, m_client, m_lic, m_opt);
		return vl;
	}

	private class LicGrid extends ListGrid {
		public LicGrid() {
			super();
			setCanSort(false);
			setCanResizeFields(false);
			setSelectionType(SelectionStyle.NONE);
			setHeaderAutoFitEvent(AutoFitEvent.NONE);
			setAutoFitData(Autofit.BOTH);
			setCellHeight(40);

		}

		HLayout rollOverCanvas;
		Record rollOverRecord;

		@Override
		protected Canvas getRollOverCanvas(Integer rowNum, Integer colNum) {
			rollOverRecord = getRecord(rowNum);
			if (rollOverCanvas == null) {
				rollOverCanvas = new HLayout(3);
				rollOverCanvas.setSnapTo("R");
				rollOverCanvas.setWidth(50);
				rollOverCanvas.setHeight(22);

				rollOverCanvas.addMembers(
						new ImgButton(img16("enter_license"), G.S.enterActivationKey(), new ClickHandler() {
							public void onClick(ClickEvent event) {
								enterKey(rollOverRecord.getAttribute("CODE"));
							}
						}, 16),
						new ImgButton(img16("remove_license"), G.S.deleteActivationKey(), new ClickHandler() {
							public void onClick(ClickEvent event) {
								deleteKey(rollOverRecord.getAttribute("CODE"));
							}
						}, 16)
						);
			}
			return rollOverCanvas;
		}
	}

	private Record license(String code, String module, String status, int total, int used) {
		Record r = new Record();
		r.setAttribute("CODE", code);
		r.setAttribute("MODULE", module);
		r.setAttribute("STATUS", status);
		r.setAttribute("TOTAL", total);
		r.setAttribute("USED", "" + used + " (" + (used > total ? G.S.exceedance() : Math.round((used * 1.0 / total * 1.0) * 100.0) + "%") + ")");
		return r;
	}

	private Record option(String code, String option, String status) {
		Record r = new Record();
		r.setAttribute("CODE", code);
		r.setAttribute("OPTION", option);
		r.setAttribute("STATUS", status);
		return r;
	}

	private void refresh() {
		G.serverCall("getLicenseInfo", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				Map res = response.getDataAsMap();
				if ((Boolean) res.get("ADMIN")) {
					m_lic.setShowRollOverCanvas(true);
					m_lic.setShowRollOver(true);
					m_opt.setShowRollOverCanvas(true);
					m_opt.setShowRollOver(true);
				}
				m_serverId.setContents(G.S.serverIdentifier() + ": " + res.get("SERVER_ID"));
				String cli = (String) res.get("CLIENT");
				if (cli != null && !cli.isEmpty())
					m_client.setContents(G.S.client() + ": " + cli.toString());
				else
					m_client.setContents(" ");

				m_lic.setData(new Record[] {
						license("CC", G.textWithIcon16("configuration_control_title", G.S.configurationControl()),
								fmtLicStatus((String) res.get("CC_S"), (Integer) res.get("CC_E")), (Integer) res.get("CC_Q"), (Integer) res.get("CC_U")),
						license("DM", G.textWithIcon16("device_manage_title", G.S.deviceManage()),
								fmtLicStatus((String) res.get("DM_S"), (Integer) res.get("DM_E")), (Integer) res.get("DM_Q"), (Integer) res.get("DM_U")),
						license("PM", G.textWithIcon16("port_manage_title", G.S.portManage()),
								fmtLicStatus((String) res.get("PM_S"), (Integer) res.get("PM_E")), (Integer) res.get("PM_Q"), (Integer) res.get("PM_U"))
				});
				m_opt.setData(new Record[] {
						option("SP", G.textWithIcon16("tech_support", G.S.technicalSupport()),
								fmtOptStatus((Boolean) res.get("SP_S"), (String) res.get("SP_E")))
				});
				m_lic.show();
				m_opt.show();
			}
		}, new Object[] {});
	}

	private String fmtLicStatus(String status, Integer leftDays) {
		String res = "";
		if ("LICENSED".equals(status))
			res = G.textWithIcon16("licensed", G.S.licensed());
		else if ("UNLICENSED".equals(status))
			res = G.textWithIcon16("unlicensed", G.S.unlicensed());
		else if ("DEMO".equals(status))
			res = G.textWithIcon16("demo", G.S.demoMode());

		if (leftDays != null) {
			if (leftDays <= 30)
				res = res + "</br>" + G.getRedText(G.M.daysLeft(leftDays));
			else
				res = res + "</br>" + G.M.daysLeft(leftDays);
		}

		return res;
	}

	private String fmtOptStatus(Boolean available, String date) {
		return G.textWithIcon16(available ? "licensed" : "unlicensed", available ? G.M.availableTill(date) : G.S.unavailable());
	}

	private void enterKey(final String code) {
		final DynamicForm form = new DynamicForm();
		form.setWidth(500);
		form.setFields(new TextAreaItem("KEY", G.S.activationKey()).required(true));
		form.setTitleOrientation(TitleOrientation.TOP);
		form.setShowErrorStyle(false);
		form.setNumCols(1);
		HButtons btns = new HButtons(G.S.ok(), G.S.cancel()) {
			@Override
			protected void button1() {
				if (form.validate()) {
					G.serverCall("enterLicenseKey", new RPCCallback() {
						public void execute(RPCResponse response, Object rawData, RPCRequest request) {
							Map res = response.getDataAsMap();
							if ((Boolean) res.get("OK")) {
								G.dialogSay((String) res.get("MSG"));
								G.findParentWindow(form).destroy();
								refresh();
							}
							else
								G.dialogWarning((String) res.get("MSG"));
						}
					}, new Object[] { code, form.getValueAsString("KEY") });
				}
			}

			@Override
			protected void button2() {
				G.findParentWindow(this).destroy();
			}
		};
		G.showInWindow(G.S.activateApplication(), form, btns);
		form.focusInItem("KEY");
	}

	private void deleteKey(final String code) {
		G.dialogAsk(G.S.deleteActivationKeyQuestion(), new BooleanCallback() {
			public void execute(Boolean value) {
				if (value != null && value) {
					G.serverCall("deleteLicenseKey", new RPCCallback() {
						public void execute(RPCResponse response, Object rawData, RPCRequest request) {
							refresh();
						}
					}, new Object[] { code });
				}
			}
		});
	}
}
