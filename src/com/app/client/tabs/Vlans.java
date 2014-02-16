package com.app.client.tabs;
import static com.app.client.G.img16;
import static com.app.client.G.img24;

import java.util.ArrayList;
import java.util.List;

import com.app.client.AppTab;
import com.app.client.DS;
import com.app.client.G;
import com.app.client.G.FetchCallback;
import com.app.client.widgets.ImgButton;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.ToolStrip;
import com.app.shared.Const;
import com.app.shared.GS;
import com.app.shared.GS.NetInfo;
import com.smartgwt.client.data.AdvancedCriteria;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.types.ListGridComponent;
import com.smartgwt.client.types.OperatorId;
import com.smartgwt.client.types.SelectionStyle;
import com.smartgwt.client.types.TreeModelType;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.fields.events.ChangedEvent;
import com.smartgwt.client.widgets.form.fields.events.ChangedHandler;
import com.smartgwt.client.widgets.grid.ListGridRecord;
import com.smartgwt.client.widgets.grid.SortNormalizer;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickEvent;
import com.smartgwt.client.widgets.grid.events.RecordDoubleClickHandler;
import com.smartgwt.client.widgets.layout.VLayout;
import com.smartgwt.client.widgets.tree.Tree;
import com.smartgwt.client.widgets.tree.TreeGrid;
import com.smartgwt.client.widgets.tree.TreeGridField;
import com.smartgwt.client.widgets.tree.TreeNode;

public class Vlans extends AppTab {

	private TreeGrid m_grid;
	private SelectItem m_map;
	private ToolStrip m_toolstrip;

	public Vlans() {
		super();
		setTitle(img16("vlans_title"), G.S.vlanList());
	}

	static class NetNode extends TreeNode {
		private List<NetNode> childs = new ArrayList<NetNode>();

		public NetNode(Integer vlan, String net, String name, String description, String object, Integer usedHosts) {
			setAttribute("VLAN", vlan);
			setAttribute("NET", net);
			setAttribute("NAME", name);
			setAttribute("DESCRIPTION", description);
			setAttribute("OBJECT", object);
			setAttribute("USED_HOSTS", usedHosts);
			setAttribute("CHILDREN", childs.toArray());
			setIsFolder(false);
			String[] x = net!=null?net.split("/"):new String[]{"0"};
			setAttribute("NET_SORT", GS.ip2long(x[0], false));
			if (x.length > 1 && GS.isInteger(x[1])) {
				Integer hosts;
				int cidr = GS.getInt(x[1]);
				if (cidr <= 0 || cidr > 32)
					hosts = null;
				else if (cidr == 32 || cidr == 31)
					hosts = 1;
				else {
					int a = 30 - cidr;
					hosts = 2;
					while (a-- >= 0)
						hosts *= 2;
					hosts -= 2; 
				}
				setAttribute("TOTAL_HOSTS", hosts);
				setAttribute("FREE_HOSTS", "");
			}
		}

		public void add(NetNode node) {
			childs.add(node);
			setAttribute("CHILDREN", childs.toArray());
			setIsFolder(true);
		}

		public NetNode findChild(String net) {
			for (NetNode n : childs) {
				if (n.getAttribute("NET").equals(net))
					return n;
			}
			return null;
		}

	}

	private void addNode(NetNode parentNode, Integer vlan, String net, String name, String description, String object, Integer usedHosts, int ipNums,
			int ipNumsCurrent) {
		NetInfo inf = GS.parseNet(net);
		String folder = GS.getDottedString(inf.startIP.split("\\."), 0, ipNumsCurrent + 1);
		NetNode a = parentNode.findChild(folder);
		if (a == null) {
			a = new NetNode(null, folder, null, null, null, null);
			parentNode.add(a);
		}
		if (ipNums == ipNumsCurrent) {
			a.add(new NetNode(vlan, net, name, description, object, usedHosts));
		} else
			addNode(a, vlan, net, name, description, object, usedHosts, ipNums, ipNumsCurrent + 1);

	}

	protected Canvas getContent() {

		m_map = new SelectItem();
		m_map.setWidth(300);
		m_map.setTitle(G.S.map());
		m_map.setOptionDataSource(DS.MAPS);
		m_map.setDisplayField("NAME");
		m_map.setValueField("ID");
		m_map.setSortField("NAME");
		m_map.addChangedHandler(new ChangedHandler() {
			public void onChanged(ChangedEvent event) {
				G.fetch(DS.PM_VLANS, "IPAM", null, null, new AdvancedCriteria("MAP_ID", OperatorId.EQUALS, event.getValue().toString()), new FetchCallback() {
					public void execute(Record[] records) {

						NetNode root = new NetNode(null, "root", null, null, null, null);
						for (Record rec : records) {
							Integer vlan = rec.getAttributeAsInt("VLAN");
							String net = rec.getAttribute("NET");
							String descr = rec.getAttribute("DESCR");
							String name = rec.getAttribute("NAME");
							String object = rec.getAttribute("OBJECT");
							Integer usedHosts = rec.getAttributeAsInt("HOSTS_QTY");

							if (net == null || !GS.netIsCorrect(net)) {
								root.add(new NetNode(vlan, net, name, descr, object, usedHosts));
							} else {
								NetInfo inf = GS.parseNet(net);

								if (inf.maskLength <= 8) {
									root.add(new NetNode(vlan, net, name, descr, object, usedHosts));
								} else {
									int ipNums = 0;
									if (inf.maskLength > 8 && inf.maskLength <= 16)
										ipNums = 0;
									else if (inf.maskLength > 16 && inf.maskLength <= 24)
										ipNums = 1;
									else if (inf.maskLength > 24)
										ipNums = 2;
									addNode(root, vlan, net, name, descr, object, usedHosts, ipNums, 0);
								}
							}

						}

						Tree tr = new Tree();
						tr.setModelType(TreeModelType.CHILDREN);
						tr.setNameProperty("NET");
						tr.setChildrenProperty("CHILDREN");
						tr.setRoot(root);
						m_grid.setData(tr);
					}
				});
			}
		});

		DynamicForm form = new DynamicForm();
		form.setFields(m_map);

		m_grid = new TreeGrid() {
			{
				setAnimateFolders(false);
				setFields(
						new TreeGridField("NET",G.S.network()) {
					{
						setSortNormalizer(new SortNormalizer() {
							public Object normalize(ListGridRecord record, String fieldName) {
								return record.getAttributeAsFloat("NET_SORT");
							}
						});
					}
				},
						new TreeGridField("VLAN",G.S.vlan()),
						new TreeGridField("NAME",G.S.name()),
						new TreeGridField("DESCRIPTION",G.S.description()),
						new TreeGridField("OBJECT",G.S.object()),
						new TreeGridField("TOTAL_HOSTS",G.S.totalHosts()),
						new TreeGridField("USED_HOSTS",G.S.usedHosts()),
						new TreeGridField("FREE_HOSTS",G.S.freeHosts()));
				setShowRollOver(false);
				setSelectionType(SelectionStyle.SINGLE);
				setNodeIcon(img16("network"));
				setShowConnectors(true);
				setSortField("NET");
				m_toolstrip = new ToolStrip();
				setGridComponents(new Object[] {
						m_toolstrip,
						ListGridComponent.HEADER,
						ListGridComponent.FILTER_EDITOR,
						ListGridComponent.BODY,
						ListGridComponent.SUMMARY_ROW
				});
					addButton(img24("add"), G.S.addRecord(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							//addRecordClick();
						}
					});
					addButton(img24("update"), G.S.updateRecord(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							//updateRecordClick();
						}
					});
					addRecordDoubleClickHandler(new RecordDoubleClickHandler() {
						public void onRecordDoubleClick(RecordDoubleClickEvent event) {
							//updateRecordClick();
						}
					});
					addButton(img24("remove"), G.S.removeRecord(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							//removeRecordClick();
						}
					});
					addButton(img24("refresh"), G.S.refreshData(), new ClickHandler() {
						public void onClick(ClickEvent event) {
							//refreshDataClick();
						}
					});
			}
		};

		VLayout vl = new VLayout(Const.DEFAULT_PADDING);
		vl.addMembers(form, m_grid);

		return vl;
	}

	/*private boolean mapSelected() {
		if (m_map.getValue() == null) {
			G.dialogWarning(G.S.selectMap());
			return false;
		} else
			return true;
	}*/
	public ImgButton addButton(String icon, String prompt, ClickHandler clickHandler) {
		ImgButton btn = new ImgButton(icon, prompt, clickHandler, 24);
		m_toolstrip.addMember(btn);
		return btn;
	}

}
