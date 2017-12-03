package com.app.client;

import java.util.Map;

import com.app.client.widgets.HButtons;
import com.app.client.widgets.HTMLPane;
import com.app.client.widgets.IButton;
import com.app.client.widgets.Label;
import com.app.client.widgets.ListGrid;
import com.app.client.widgets.ListGridField;
import com.app.client.widgets.Window;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.ScriptExecuteResult;
import com.app.shared.ScriptExecuteStatus;
import com.smartgwt.client.data.RecordList;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.util.StringUtil;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.layout.VLayout;

public class ScriptResultViewer extends Window {

	private ListGrid m_grid;
	private HTMLPane m_resPane;
	private HTMLPane m_logPane;
	private HTMLPane m_conPane;
	private HTMLPane m_parPane;

	public ScriptResultViewer(RPCResponse response) {
		this(response.getDataAsMap());
	}

	public ScriptResultViewer(Map result) {
		this(new ScriptExecuteResult(result));
	}

	public ScriptResultViewer(ScriptExecuteResult result) {
		this(result, null, null);
	}

	public ScriptResultViewer(ScriptExecuteResult result, RecordList values, String scriptParams) {
		super(G.S.scriptExecutionResult(), true, true);
		setCanDragResize(true);
		destroyOnClose();

		// looking for window display options in a result
		int winWidth = 1200, winHeight = 800;
		StringBuilder res = new StringBuilder();
		for (String line : result.result.split("\n")) {

			if (line.startsWith("windowWidth")) {
				try {
					winWidth = GS.getInteger(line.split("=")[1].trim());
				} catch (Exception e) {
				}
				continue;
			}

			if (line.startsWith("windowHeight")) {
				try {
					winHeight = GS.getInteger(line.split("=")[1].trim());
				} catch (Exception e) {
				}
				continue;
			}

			if (line.startsWith("windowTitle")) {
				try {
					setTitle(line.split("=")[1].trim());
				} catch (Exception e) {
				}
				continue;
			}

			res.append(line);
			res.append("\n");
		}
		resizeTo(G.availWidth(winWidth), G.availHeight(winHeight));

		m_resPane = new HTMLPane("<pre>" + (res.toString().trim().isEmpty() ? G.S.noScriptResult() : res.toString()) + "</pre>");
		m_logPane = new HTMLPane("<pre>" + (GS.isEmpty(result.log) ? G.S.noScriptLog() : StringUtil.asHTML(result.log)) + "</pre>");
		m_conPane = new HTMLPane("<pre>" + (GS.isEmpty(result.console) ? G.S.scriptDoesntUseConsole() : StringUtil.asHTML(result.console)) + "</pre>");

		HButtons btns = new HButtons((Integer) null, G.S.result(), G.S.log(), G.S.console()) {
			protected void button1() {
				hideAll();
				m_resPane.show();
			};

			protected void button2() {
				hideAll();
				m_logPane.show();
			};

			protected void button3() {
				hideAll();
				m_conPane.show();
			};
		};

		VLayout vl = G.wrapToVLayout(result.status.equals(ScriptExecuteStatus.OK) ? new Label(G.S.scriptExecutedWithoutErrors()).color("green")
				: new Label(G.S.scriptExecutedWithErrors()).color("red"),
				btns, m_resPane, m_logPane, m_conPane);

		if (values != null) {

			m_grid = new ListGrid() {
				{
					setData(values);
					setSelectionType(SelectionStyle.SINGLE);					
				}

				@Override
				protected String getCellCSSText(ListGridRecord record, int rowNum, int colNum) {
					if (!GS.isEqual(record.getAttribute("OLD"), record.getAttribute("NEW")))
						return isSelected(record) ? Const.CSS_ORANGE_BACKGROUND_SELECTED : Const.CSS_ORANGE_BACKGROUND;
					return super.getCellCSSText(record, rowNum, colNum);
				}

				@Override
				protected void gridInitFields() {
					setFields(new ListGridField("TITLE", G.S.field()).width("*"),
							new ListGridField("OLD", G.S.oldValues()).width("*"),
							new ListGridField("NEW", G.S.newValues()).width("*"));
				}
			};

			vl.addMember(m_grid);
			
			btns.addMember(new IButton(G.S.compareOldAndNewDeviceValues()) {
				@Override
				public void onClick() {
					hideAll();
					m_grid.show();
				}
			});
		}
		
		if (scriptParams!=null){
			m_parPane = new HTMLPane("<pre>" + StringUtil.asHTML(scriptParams) + "</pre>");
			vl.addMember(m_parPane);
			btns.addMember(new IButton(G.S.parameters()) {
				@Override
				public void onClick() {
					hideAll();
					m_parPane.show();
				}
			});
		}
		
		addItem(vl);
		hideAll();
		m_resPane.show();
	}

	private void hideAll() {
		m_resPane.hide();
		m_logPane.hide();
		m_conPane.hide();
		if (m_grid != null)
			m_grid.hide();
		if (m_parPane != null)
			m_parPane.hide();
	}

}