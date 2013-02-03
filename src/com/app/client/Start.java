package com.app.client;

import java.util.Iterator;
import java.util.Map;

import com.app.client.tabs.DeviceConfiguringJournal;
import com.app.client.tabs.DeviceTypes;
import com.app.client.tabs.Devices;
import com.app.client.tabs.DevicesJournal;
import com.app.client.tabs.Dict;
import com.app.client.tabs.Images;
import com.app.client.tabs.Licenses;
import com.app.client.tabs.MapsAndObjects;
import com.app.client.tabs.MapsJournal;
import com.app.client.tabs.ObjectsJournal;
import com.app.client.tabs.PortsJournal;
import com.app.client.tabs.ScriptExecuteJournal;
import com.app.client.tabs.Scripts;
import com.app.client.tabs.UserRoles;
import com.app.client.tabs.Users;
import com.app.client.widgets.CheckboxItem;
import com.app.client.widgets.HButtons;
import com.app.client.widgets.IntegerItem;
import com.app.client.widgets.Menu;
import com.app.client.widgets.MenuItem;
import com.app.client.widgets.PasswordItem;
import com.app.client.widgets.SelectItem;
import com.app.client.widgets.TextItem;
import com.app.shared.ObjectType;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.NativeEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.logical.shared.ResizeEvent;
import com.google.gwt.event.logical.shared.ResizeHandler;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.Event.NativePreviewEvent;
import com.google.gwt.user.client.Event.NativePreviewHandler;
import com.smartgwt.client.bean.BeanFactory;
import com.smartgwt.client.core.KeyIdentifier;
import com.smartgwt.client.data.DSRequest;
import com.smartgwt.client.data.DSResponse;
import com.smartgwt.client.data.DataSource;
import com.smartgwt.client.data.DataSourceField;
import com.smartgwt.client.data.Record;
import com.smartgwt.client.rpc.DMI;
import com.smartgwt.client.rpc.HandleErrorCallback;
import com.smartgwt.client.rpc.LoginRequiredCallback;
import com.smartgwt.client.rpc.RPCCallback;
import com.smartgwt.client.rpc.RPCManager;
import com.smartgwt.client.rpc.RPCRequest;
import com.smartgwt.client.rpc.RPCResponse;
import com.smartgwt.client.types.ImageStyle;
import com.smartgwt.client.types.Positioning;
import com.smartgwt.client.types.State;
import com.smartgwt.client.types.VerticalAlignment;
import com.smartgwt.client.util.DateUtil;
import com.smartgwt.client.util.Page;
import com.smartgwt.client.util.PageKeyHandler;
import com.smartgwt.client.util.SC;
import com.smartgwt.client.util.ValueCallback;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.DateRangeDialog;
import com.smartgwt.client.widgets.Img;
import com.smartgwt.client.widgets.ImgButton;
import com.smartgwt.client.widgets.Window;
import com.smartgwt.client.widgets.events.ClickEvent;
import com.smartgwt.client.widgets.events.ClickHandler;
import com.smartgwt.client.widgets.events.MouseMoveEvent;
import com.smartgwt.client.widgets.events.MouseMoveHandler;
import com.smartgwt.client.widgets.form.DynamicForm;
import com.smartgwt.client.widgets.form.FormItemIfFunction;
import com.smartgwt.client.widgets.form.fields.FormItem;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.LayoutSpacer;
import com.smartgwt.client.widgets.layout.VLayout;
import com.smartgwt.client.widgets.menu.events.ItemClickEvent;
import com.smartgwt.client.widgets.menu.events.ItemClickHandler;
import com.smartgwt.client.widgets.menu.events.MenuItemClickEvent;
import com.smartgwt.client.widgets.tab.Tab;
import com.smartgwt.client.widgets.tab.TabSet;
import com.smartgwt.client.widgets.tab.events.CloseClickHandler;
import com.smartgwt.client.widgets.tab.events.TabCloseClickEvent;
import com.smartgwt.client.widgets.tab.events.TabSelectedEvent;
import com.smartgwt.client.widgets.tab.events.TabSelectedHandler;

public class Start implements EntryPoint {

	private Menu m_adminMenu;
	private Menu m_journalsMenu;
	private int m_mouseX, m_mouseY;

	public interface MyMetaFactory extends BeanFactory.MetaFactory {
		BeanFactory<SelectItem> a();
	}

	public void onModuleLoad() {
		initRPCErrorHandler();
		setupRelogin();
		G.serverCall("getStartupInfo", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				Map res = response.getDataAsMap();
				init((Boolean) res.get("ADMIN"), (Boolean) res.get("CONFIG_DEVICES"), (Boolean) res.get("JOURNALS"));
				// new Licenses().show();
			}
		}, new Object[] {});
	}

	private void init(final boolean admin, final boolean configDevices, final boolean journals) {
		DateUtil.setShortDatetimeDisplayFormatter(DateUtil.TOEUROPEANSHORTDATETIME);
		DateUtil.setShortDateDisplayFormatter(DateUtil.TOEUROPEANSHORTDATE);
		DateUtil.setDateInputFormat("DMY");
		DateUtil.setDefaultDateSeparator(".");
		GWT.create(MyMetaFactory.class);
		initDataSources();

		// when resizing the browser window, call an event for all bookmarks
		com.google.gwt.user.client.Window.addResizeHandler(new ResizeHandler() {
			public void onResize(ResizeEvent event) {
				if (G.TABSET != null) {
					for (Tab t : G.TABSET.getTabs())
						if (t instanceof AppTab)
							((AppTab) t).onResize();
				}
			}
		});

		// default values for classes
		boolean shadow = false;

		Window w = new Window();
		w.setShowShadow(shadow);
		w.setShowModalMask(false);
		Window.setDefaultProperties(w);

		DateRangeDialog d = new DateRangeDialog();
		d.setShowShadow(shadow);
		d.setShowModalMask(false);
		DateRangeDialog.setDefaultProperties(d);

		Menu m = new Menu();
		m.setShowShadow(shadow);
		Menu.setDefaultProperties(m);

		if (!GWT.isProdMode()) {
			Page.registerKey(
					new KeyIdentifier() {
						{
							setCtrlKey(true);
							setAltKey(true);
							setKeyName("D");
						}
					},
					new PageKeyHandler() {
						public void execute(String keyName) {
							SC.showConsole();
						}
					});
		}

		Event.addNativePreviewHandler(new NativePreviewHandler() {
			@Override
			public void onPreviewNativeEvent(NativePreviewEvent event) {
				NativeEvent ne = event.getNativeEvent();

				// we block backspace in controls other than the text editor (so that there is no transition to the previous page)
				if (ne.getKeyCode() == KeyCodes.KEY_BACKSPACE) {
					if (ne.getEventTarget() != null) {
						Element el = Element.as(ne.getEventTarget());
						if (el.getTagName().equalsIgnoreCase("input") ||
								el.getTagName().equalsIgnoreCase("textarea") ||
								"true".equals(el.getAttribute("contentEditable")) ||
								"console".equals(el.getClassName())) {
							// Backspace allowed
							;
						} else {
							ne.stopPropagation();
							ne.preventDefault();
						}
					}
				}
			}
		});

		// tabs
		// FileLoader.cacheImg(skinImgDir, baseImageURL);
		G.TABSET = new TabSet() {
			{
				setHeight100();
				setCanFocus(false);
				setCanCloseTabs(true);
				setShowTabPicker(false);
				// setShowTabScroller(false);
				// setUseSimpleTabs(true);
				// setCloseTabIconSize(10);
				setDestroyPanes(true);
				setVisible(false); // Изначально делаем невидимой
				addCloseClickHandler(new CloseClickHandler() {
					public void onCloseClick(TabCloseClickEvent event) {
						Tab t = event.getTab();
						if (t instanceof AppTab)
							((AppTab) t).onClose();
						if (getTabs().length == 1) // close last tab
							setVisible(false);
					}
				});
				addTabSelectedHandler(new TabSelectedHandler() {
					public void onTabSelected(TabSelectedEvent event) {
						Tab t = event.getTab();
						if (t instanceof AppTab)
							((AppTab) t).onSelect();
					}
				});
			}
		};

		// creating main menu

		// submenu "administrating"
		if (admin || configDevices) {
			m_adminMenu = new Menu() {
				{
					if (admin) {
						/*if (demo) {
							m_activateMenuItem = new MenuItem(G.S.activateApplication(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
								public void onClick(MenuItemClickEvent event) {
									activateApp();
								}
							});
							addItem(m_activateMenuItem);
						}*/
						addItem(new MenuItem(G.S.users(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new Users().show();
							}
						}));
						addItem(new MenuItem(G.S.usersRoles(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new UserRoles().show();
							}
						}));
						addItem(new MenuItem(G.S.mapsAndObjects(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new MapsAndObjects().show();
							}
						}));
						/*addItem(new MenuItem(G.S.vlanList(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new Vlans().show();
							}
						}));*/
						addItem(new MenuItem(G.S.scripts(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new Scripts().show();
							}
						}));
						addItem(new MenuItem(G.S.deviceTypes(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new DeviceTypes().show();
							}
						}));
						addItem(new MenuItem(G.S.dictionaries(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new Dict().show();
							}
						}));
					}
					addItem(new MenuItem(G.S.devices(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
						public void onClick(MenuItemClickEvent event) {
							new Devices().show();
						}
					}));
					if (admin) {
						addItem(new MenuItem(G.S.licenses(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new Licenses().show();
							}
						}));
						addItem(new MenuItem(G.S.smtpServerSettings(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								smtpSettings();
							}
						}));
						addItem(new MenuItem(G.S.images(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
							public void onClick(MenuItemClickEvent event) {
								new Images().show();
							}
						}));
					}
				}
			};

		}

		// submenu "changes journal"
		if (admin || journals) {
			m_journalsMenu = new Menu(
					new MenuItem(G.S.consoleWorkJournal(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
						public void onClick(MenuItemClickEvent event) {
							new DeviceConfiguringJournal().show();
						}
					}),
					new MenuItem(G.S.mapsChangesJournal(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
						public void onClick(MenuItemClickEvent event) {
							new MapsJournal().show();
						}
					}),
					new MenuItem(G.S.objectsChangesJournal(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
						public void onClick(MenuItemClickEvent event) {
							new ObjectsJournal().show();
						}
					}),
					new MenuItem(G.S.portsChangesJournal(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
						public void onClick(MenuItemClickEvent event) {
							new PortsJournal().show();
						}
					}),
					new MenuItem(G.S.devicesChangesJournal(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
						public void onClick(MenuItemClickEvent event) {
							new DevicesJournal().show();
						}
					}),
					new MenuItem(G.S.executedScriptsJournal(), new com.smartgwt.client.widgets.menu.events.ClickHandler() {
						public void onClick(MenuItemClickEvent event) {
							new ScriptExecuteJournal().show();
						}
					}));
		}

		// layout of main window
		// mainMenu.setPadding(50);
		// final Label title =new Label("IN Active").sizePixels(30).color("white");
		final Img logo = new Img("[SKIN]logo4.png", (int) (239f * 0.6f), (int) (67f * 0.6f));
		logo.setImageType(ImageStyle.STRETCH);

		ImgButton mapsObj = new ImgButton() {
			{
				setNoDoubleClicks(true);
				setShowRollOver(true);
				setShowDown(false);
				setCanFocus(false);
				setSize(48);
				setSrc("[SKIN]48x48/maps_obj.png");
				addClickHandler(new ClickHandler() {
					public void onClick(ClickEvent event) {
						G.fetch(DS.OBJECTS, "WITH_ACCESS", "ID,NAME,TYPE,MAP_NAME", "MAP_NAME,NAME", null, new G.FetchCallback() {
							public void execute(Record[] records) {
								if (records.length == 0) {
									G.dialogWarning(G.S.noObjects());
									return;
								}
								Menu menu = new Menu();

								MenuItem mi_map = null;
								for (Record o : records) {
									String mapName = o.getAttribute("MAP_NAME");
									String objName = o.getAttribute("NAME");
									String objType = o.getAttribute("TYPE");

									if (mi_map == null || !mapName.equals(mi_map.getTitle())) {
										mi_map = new MenuItem(mapName);
										Menu m = new Menu();
										m.addItemClickHandler(new ItemClickHandler() {
											public void onItemClick(ItemClickEvent event) {
												G.openObject(event.getItem().getAttributeAsInt("ID"));
											}
										});
										mi_map.setSubmenu(m);
										menu.addItem(mi_map);
									}

									String icon = null;
									if (objType.equals(ObjectType.CONFIG_CONTROL.toString()))
										icon = "configuration_control_title";
									else if (objType.equals(ObjectType.PORT_MANAGE.toString()))
										icon = "port_manage_title";
									else if (objType.equals(ObjectType.DEVICE_MANAGE.toString()))
										icon = "device_manage_title";
									MenuItem mi_object = new MenuItem(G.textWithIcon16(icon, objName));
									Record.copyAttributesInto(mi_object, o, "ID");

									menu.getSubmenu(mi_map).addItem(mi_object);
								}
								menu.setLeft(getAbsoluteLeft());
								menu.setTop(getAbsoluteTop() + getVisibleHeight());
								menu.show();
								// после отображения меню теряется подсветка, из-за маски нажатия
								if (m_mouseX >= getAbsoluteLeft() && m_mouseX <= getAbsoluteLeft() + 48 &&
										m_mouseY >= getAbsoluteTop() && m_mouseY <= getAbsoluteTop() + 48)
									setState(State.STATE_OVER);
							}
						});
					}
				});
			}
		};

		ImgButton settings = new ImgButton() {
			{
				setNoDoubleClicks(true);
				setShowRollOver(true);
				setShowDown(false);
				setCanFocus(false);
				setSize(48);
				setSrc("[SKIN]48x48/settings.png");
				addClickHandler(new ClickHandler() {
					public void onClick(ClickEvent event) {
						m_adminMenu.setLeft(getAbsoluteLeft());
						m_adminMenu.setTop(getAbsoluteTop() + getVisibleHeight());
						m_adminMenu.show();
						// after the menu is displayed, the backlight is lost, due to the click mask
						if (m_mouseX >= getAbsoluteLeft() && m_mouseX <= getAbsoluteLeft() + 48 &&
								m_mouseY >= getAbsoluteTop() && m_mouseY <= getAbsoluteTop() + 48)
							setState(State.STATE_OVER);
					}
				});
			}
		};

		ImgButton hist = new ImgButton() {
			{
				setNoDoubleClicks(true);
				setShowRollOver(true);
				setShowDown(false);
				setCanFocus(false);
				setSize(48);
				setSrc("[SKIN]48x48/history.png");
				addClickHandler(new ClickHandler() {
					public void onClick(ClickEvent event) {
						m_journalsMenu.setLeft(getAbsoluteLeft());
						m_journalsMenu.setTop(getAbsoluteTop() + getVisibleHeight());
						m_journalsMenu.show();
						// after the menu is displayed, the backlight is lost, due to the click mask
						if (m_mouseX >= getAbsoluteLeft() && m_mouseX <= getAbsoluteLeft() + 48 &&
								m_mouseY >= getAbsoluteTop() && m_mouseY <= getAbsoluteTop() + 48)
							setState(State.STATE_OVER);
					}
				});
			}
		};

		ImgButton about = new ImgButton() {
			{
				setNoDoubleClicks(true);
				setShowRollOver(true);
				setShowDown(false);
				setCanFocus(false);
				setSize(48);
				setSrc("[SKIN]48x48/question.png");
				addClickHandler(new ClickHandler() {
					public void onClick(ClickEvent event) {
						about();
					}
				});
			}
		};

		ImgButton exit = new ImgButton() {
			{
				setNoDoubleClicks(true);
				setShowRollOver(true);
				setShowDown(false);
				setCanFocus(false);
				setSize(48);
				setSrc("[SKIN]48x48/exit.png");
				addClickHandler(new ClickHandler() {
					public void onClick(ClickEvent event) {
						G.logout();
					}
				});
			}
		};

		Canvas c = new Canvas();
		c.setWidth100();
		c.setHeight(60);
		c.setStyleName("topBackground");
		c.setPosition(Positioning.ABSOLUTE);
		c.setLeft(0);
		c.setTop(0);
		c.draw();

		HLayout top = new HLayout();
		top.setHeight(60);
		top.setWidth100();
		top.setDefaultLayoutAlign(VerticalAlignment.CENTER);
		top.addMembers(logo, new LayoutSpacer("50px", null), mapsObj);
		if (m_adminMenu != null)
			top.addMember(settings);
		if (m_journalsMenu != null)
			top.addMember(hist);
		top.addMembers(new LayoutSpacer(), about, exit);

		VLayout vl = new VLayout(10);
		vl.setWidth100();
		vl.setHeight100();
		vl.addMembers(top, G.TABSET);

		HLayout all = new HLayout();
		all.setWidth100();
		all.setHeight100();
		all.addMembers(new LayoutSpacer("10px", null), vl, new LayoutSpacer("10px", null));
		all.addMouseMoveHandler(new MouseMoveHandler() {
			public void onMouseMove(MouseMoveEvent event) {
				m_mouseX = event.getX();
				m_mouseY = event.getY();
			}
		});
		all.draw();

	}

	private void initRPCErrorHandler() {
		RPCManager.setHandleErrorCallback(new HandleErrorCallback() {
			public void handleError(DSResponse response, DSRequest request) {
				// a status of -10 is returned for requests from the queue that have 
				// successfully completed no error message in these responses
				if (response.getStatus() == RPCResponse.STATUS_TRANSACTION_FAILED)
					return;
				G.waitDialogHide();
				String errMsg = response.getDataAsString();
				if (errMsg != null && errMsg.contains("AUTH_ERROR")) {
					G.showLogin();
					// G.logout();
					return;
				}
				SC.logWarn("Receive error from server: " + errMsg);
				String m = null;
				if (errMsg != null)
					m = G.getErrMsg(errMsg);
				else {
					Map err = response.getErrors();
					if (err != null) {
						Iterator it = err.values().iterator();
						while (it.hasNext()) {
							String s = it.next().toString();
							if (s != null && s.contains("Field is required")) {
								m = G.S.errorNotNullConstraint();
								break;
							}
						}
					}
				}
				G.dialogWarning(m == null ? G.S.errorServerRequest() : m);
			}
		});
	}

	private void setupRelogin() {
		RPCManager.setLoginRequiredCallback(new LoginRequiredCallback() {
			public void loginRequired(int transactionNum, RPCRequest request, RPCResponse response) {
				G.showLogin();
			}
		});

	}

	private void initDataSourceTitles(DataSource dataSource, Object... fieldsTitles) {
		for (int i = 0; i < fieldsTitles.length; i += 2) {
			DataSourceField field = dataSource.getField(fieldsTitles[i].toString());
			if (field != null)
				field.setTitle(fieldsTitles[i + 1].toString());
		}
	}

	private void initDataSourceTitlesPrompts(DataSource dataSource, Object... fieldsTitlesPrompts) {
		for (int i = 0; i < fieldsTitlesPrompts.length; i += 3) {
			DataSourceField field = dataSource.getField(fieldsTitlesPrompts[i].toString());
			if (field != null) {
				field.setTitle(fieldsTitlesPrompts[i + 1].toString());
				if (fieldsTitlesPrompts[i + 2] != null)
					field.setPrompt(fieldsTitlesPrompts[i + 2].toString());
			}
		}
	}

	private void initDataSources() {

		initDataSourceTitles(DS.USERS,
				"NAME", G.S.userName(),
				"LOGIN", G.S.login(),
				"PWD", G.S.password(),
				"ADMIN", G.S.systemAdministrator(),
				"LOCKED", G.S.locked(),
				"JOURNALS", G.S.journalsAccess(),
				"COMMENT", G.S.comment(),
				"EMAIL", G.S.email());

		initDataSourceTitles(DS.PM_PATCH,
				"PM_PATCH_ID", G.S.patch(),
				"PATCH", G.S.patch(),
				"LOCATION", G.S.location());

		initDataSourceTitles(DS.SCRIPTS,
				"NAME", G.S.name(),
				"TYPE", G.S.purpose(),
				"SCRIPT", G.S.script());

		initDataSourceTitles(DS.DEVICE_TYPES,
				"NAME", G.S.device(),
				"CC_GET_CONFIG", G.S.scriptForGetConfig(),
				"CC_GET_CONFIG_NAME", G.S.scriptForGetConfig(),
				"CONSOLE_AUTH", G.S.scriptForConsoleAuth(),
				"CONSOLE_AUTH_NAME", G.S.scriptForConsoleAuth(),
				"CONSOLE_LOG", G.S.scriptForConsoleLog(),
				"CONSOLE_LOG_NAME", G.S.scriptForConsoleLog(),
				"PM_PORT_INFO", G.S.scriptPortInfo(),
				"PM_PORT_INFO_NAME", G.S.scriptPortInfo(),
				"PM_VLAN_LIST", G.S.scriptVlanList(),
				"PM_VLAN_LIST_NAME", G.S.scriptVlanList(),
				"PM_REFRESH_DATA", G.S.scriptRefreshData(),
				"PM_REFRESH_DATA_NAME", G.S.scriptRefreshData(),
				"PM_PORT_ON", G.S.scriptPortOn(),
				"PM_PORT_ON_NAME", G.S.scriptPortOn(),
				"PM_PORT_OFF", G.S.scriptPortOff(),
				"PM_PORT_OFF_NAME", G.S.scriptPortOff(),
				"PM_PORT_CHANGE_SPEED", G.S.scriptPortChangeSpeed(),
				"PM_PORT_CHANGE_SPEED_NAME", G.S.scriptPortChangeSpeed(),
				"PM_PORT_CHANGE_DUPLEX", G.S.scriptPortChangeDuplex(),
				"PM_PORT_CHANGE_DUPLEX_NAME", G.S.scriptPortChangeDuplex(),
				"PM_PORT_CHANGE_VLAN", G.S.scriptPortChangeVLAN(),
				"PM_PORT_CHANGE_VLAN_NAME", G.S.scriptPortChangeVLAN());

		initDataSourceTitles(DS.PM_PORT_CLIENTS,
				"DEV_HOST", G.S.ip(),
				"DEV_NAME", G.S.name(),
				"DEV_COMMENT", G.S.comment(),
				"DEV_LOCATION", G.S.location(),
				"PORT", G.S.port(),
				"FIRST_DETECT", G.S.firstDateOfClientDetect(),
				"LAST_DETECT", G.S.lastDateOfClientDetect(),
				"IP", G.S.ip(),
				"MAC", G.S.mac(),
				"VLAN", G.S.vlan(),
				"NAME", G.S.networkName(),
				"VOICE", G.S.voice(),
				"TRUNK", G.S.trunk(),
				"TELCO", G.S.telco(),
				"PATCH", G.S.patch(),
				"LOCATION", G.S.location(),
				"COMMENT", G.S.comment());

		initDataSourceTitles(DS.PM_CLIENTS_ARC,
				"DEV_HOST", G.S.ip(),
				"DEV_NAME", G.S.name(),
				"DEV_COMMENT", G.S.comment(),
				"DEV_LOCATION", G.S.location(),
				"PORT", G.S.port(),
				"FIRST_DETECT", G.S.firstDateOfClientDetect(),
				"LAST_DETECT", G.S.lastDateOfClientDetect(),
				"IP", G.S.ip(),
				"MAC", G.S.mac(),
				"VLAN", G.S.vlan(),
				"NAME", G.S.networkName(),
				"VOICE", G.S.voice(),
				"TRUNK", G.S.trunk(),
				"TELCO", G.S.telco(),
				"PATCH", G.S.patch(),
				"LOCATION", G.S.location(),
				"COMMENT", G.S.comment());

		initDataSourceTitles(DS.DEVICES,
				"NAME", G.S.name(),
				"LOCATION", G.S.location(),
				"COMMENT", G.S.comment(),
				"DEVICE_TYPE_ID", G.S.deviceType(),
				"DEVICE_TYPE_NAME", G.S.deviceType(),
				"HOST", G.S.ip(),
				"CONSOLE_PORT", G.S.consolePort(),
				"LOGIN", G.S.login(),
				"PWD", G.S.password(),
				"ENABLE_PWD", G.S.enablePassword(),
				"CONNECT_TYPE", G.S.connectionType(),
				"SNMP_PORT", G.S.snmpPort(),
				"SNMP_VERSION", G.S.snmpVersion(),
				"READ_COMMUNITY", G.S.readCommunity(),
				"WRITE_COMMUNITY", G.S.writeCommunity(),
				"SNMP_USER", G.S.snmpUserName(),
				"SNMP_AUTH_PROT", G.S.snmpAuthenticationProtocol(),
				"SNMP_AUTH_PWD", G.S.snmpAuthenticationPassword(),
				"SNMP_PRIV_PROT", G.S.snmpPrivacyProtocol(),
				"SNMP_PRIV_PWD", G.S.snmpPrivacyPassword());

		initDataSourceTitles(DS.MAPS,
				"NAME", G.S.name(),
				"COMMENT", G.S.comment());

		initDataSourceTitles(DS.OBJECTS,
				"NAME", G.S.name(),
				"COMMENT", G.S.comment(),
				"TYPE", G.S.objectType());

		initDataSourceTitlesPrompts(DS.CC_DEVICES,
				"HOST", G.S.ip(), null,
				"DEVICE_NAME", G.S.name(), null,
				"DEVICE_TYPE_NAME", G.S.deviceType(), null,
				"GET_CONFIG_INTERVAL", G.S.interval(), G.S.intervalGetConfig(),
				"STORE_CONFIG_DAYS", G.S.days(), G.S.storeConfigDays(),
				"HAS_UNCHECKED_CONFIG", G.S.changes(), G.S.hasUncheckedChangesInConfig(),
				"LAST_GET_CONFIG_DATE", G.S.date(), G.S.dateOfLastConfigDownload(),
				"LAST_GET_CONFIG_RESULT", G.S.result(), G.S.resultOfLastConfigDownload(),
				"COMMENT", G.S.comment(), null,
				"LOCATION", G.S.location(), null);

		initDataSourceTitlesPrompts(DS.PM_DEVICES,
				"HOST", G.S.ip(), null,
				"DEVICE_NAME", G.S.name(), null,
				"DEVICE_TYPE_NAME", G.S.deviceType(), null,
				"COMMENT", G.S.comment(), null,
				"LOCATION", G.S.location(), null,
				"REFRESH_INTERVAL", G.S.interval(), G.S.intervalRefreshData(),
				"ARCHIVE_DAYS", G.S.days(), G.S.hintPMDeviceArchiveDays(),
				"LAST_REFRESH_DATE", G.S.date(), G.S.dateOfLastRefresh(),
				"LAST_REFRESH_RESULT", G.S.result(), G.S.resultOfLastRefresh(),
				"PORT_QTY", G.S.portQty(), null);

		initDataSourceTitles(DS.PM_VLANS,
				"VLAN", G.S.vlan(),
				"NAME", G.S.name(),
				"NET", G.S.network(),
				"VOICE", G.S.voice(),
				"DESCR", G.S.description(),
				"CLIENTS_QTY", G.S.clientsQty(),
				"LAST_DETECT", G.S.lastDetectDate());

		initDataSourceTitles(DS.DM_FIELDS,
				"MAP_NAME", G.S.map(),
				"OBJECT_NAME", G.S.object());

		initDataSourceTitles(DS.DM_DEVICES,
				"HOST", G.S.ip(),
				"DEVICE_NAME", G.S.name(),
				"DEVICE_TYPE_NAME", G.S.deviceType(),
				"LOCATION", G.S.location(),
				"COMMENT", G.S.comment());

		initDataSourceTitles(DS.DICT,
				"NAME", G.S.name(),
				"COMMENT", G.S.comment());

		initDataSourceTitles(DS.DICT_VALUES,
				"VAL", G.S.value());

		initDataSourceTitles(DS.ROLES,
				"NAME", G.S.name(),
				"COMMENT", G.S.comment());

		initDataSourceTitles(DS.ROLE_OBJECTS,
				"OBJECT_ID", G.S.object(),
				"OBJECT_NAME", G.S.object(),
				"MAP_NAME", G.S.map(),
				"MODE", G.S.accessType());

		initDataSourceTitles(DS.ROLE_NEW_CLIENT_NOTICE,
				"OBJECT_ID", G.S.object(),
				"OBJECT_NAME", G.S.object(),
				"MAP_NAME", G.S.map());

		initDataSourceTitles(DS.ROLE_CONF_DEVICES,
				"MAP_ID", G.S.map(),
				"MAP_NAME", G.S.map());

		initDataSourceTitles(DS.USER_ROLES,
				"USER_ID", G.S.user(),
				"USER_NAME", G.S.user(),
				"ROLE_ID", G.S.role(),
				"ROLE_NAME", G.S.role());

		initDataSourceTitles(DS.IMAGES,
				"FILENAME", G.S.fileName(),
				"COMMENT", G.S.comment(),
				"IMAGE", G.S.image());
	}

	/*private void activateApp() {
		DMI.call("app", "DMI", "getServerId", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				final DynamicForm form = new DynamicForm();
				form.setValue("ID", response.getDataAsString());
				form.setWidth(500);
				form.setFields(new TextItem("ID", G.S.identifier()).canEdit(false), new TextAreaItem("KEY", G.S.activationKey()).required(true));
				form.setTitleOrientation(TitleOrientation.TOP);
				form.setShowErrorStyle(false);
				form.setNumCols(1);
				HButtons btns = new HButtons(G.S.ok(), G.S.cancel()) {
					@Override
					protected void button1() {
						if (form.validate()) {
							DMI.call("app", "DMI", "activateApp", new RPCCallback() {
								public void execute(RPCResponse response, Object rawData, RPCRequest request) {
									Map res = response.getDataAsMap();
									if ((Boolean) res.get("OK")) {
										G.dialogSay((String) res.get("MSG"));
										m_adminMenu.removeItem(m_activateMenuItem);
										m_demoLabel.destroy();
										G.findParentWindow(form).destroy();
									}
									else
										G.dialogWarning((String) res.get("MSG"));
								}
							}, new Object[] { form.getValueAsString("KEY") });
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
		}, new Object[] {});
	
	}*/

	private void about() {
		// DMI.call("app", "DMI", "getLimitsInfo", new RPCCallback() {
		// public void execute(RPCResponse response, Object rawData, RPCRequest request) {
		/*VLayout nameAndVersion = new VLayout();
		nameAndVersion.addMember(new Label("IN Active").bold().sizePercent(200).noWrap());
		nameAndVersion.addMember(new Label(G.M.versionIs(Const.APP_VERSION)).color("grey").noWrap());
		nameAndVersion.setLayoutAlign(VerticalAlignment.CENTER);*/

		/*HLayout logo = new HLayout();
		logo.addMember(new Img("logo3.png"));
		//logo.addMember(nameAndVersion);
		logo.setAutoWidth();
		logo.setAutoHeight();
		logo.setLayoutAlign(Alignment.CENTER);*/

		Img logo = new Img("[SKIN]logo3.png", 450, 128);
		logo.setImageType(ImageStyle.CENTER);

		VLayout vl = new VLayout(10);
		vl.setPadding(10);
		vl.setWidth(450);
		vl.addMember(logo);
		// vl.addMember(new Label(G.M.versionIs(Const.APP_VERSION)).color("grey").noWrap());
		// vl.addMember(new Label(G.S.contacts()));
		// vl.addMember(new Label(response.getDataAsString()));
		// vl.addMember(new Label(G.S.copyright()).align(Alignment.CENTER).sizePercent(80).color("grey"));
		G.showInWindow(G.S.aboutProgram(), vl);
		// }
		// }, new Object[] {});
	}

	private void smtpSettings() {
		DMI.call("app", "RPC", "getSmtpSettings", new RPCCallback() {
			public void execute(RPCResponse response, Object rawData, RPCRequest request) {
				Map settings = response.getDataAsMap();
				if (settings.containsKey("SMTP_AUTH"))
					settings.put("SMTP_AUTH", Boolean.parseBoolean(settings.get("SMTP_AUTH").toString()));

				final DynamicForm form = new DynamicForm();
				form.setWidth(500);
				form.setHiliteRequiredFields(false);

				FormItemIfFunction authChk = new FormItemIfFunction() {
					public boolean execute(FormItem item, Object value, DynamicForm form) {
						Object val = form.getValue("SMTP_AUTH");
						return val == null ? false : (boolean) val;
					}
				};

				form.setFields(
						new TextItem("SMTP_ADR", G.S.host()).required(true),
						new IntegerItem("SMTP_PORT", G.S.port()).required(true).range(1, 65535),
						new SelectItem("SMTP_SECURE", G.S.connectionSecure(), G.SMTP_CON_SECURE).required(true),
						new TextItem("SMTP_SENDER", G.S.senderAdress()).required(true),
						new CheckboxItem("SMTP_AUTH", G.S.authenticationRequired()).defaultValue(false).redrawOnChange(),
						new PasswordItem("SMTP_PWD", G.S.password()).required(true).showIf(authChk));
				form.setValues(settings);

				HButtons btns = new HButtons(G.S.check(), G.S.save(), G.S.cancel()) {
					{
						setIcons(G.img16("mail"));
					}

					@Override
					protected void button1() {
						if (form.validate(false)) {
							G.dialogAskForValue(G.S.enterEmailForTest(), new ValueCallback() {
								public void execute(String value) {
									if (value == null || value.trim().isEmpty())
										return;
									G.waitDialogShow();
									DMI.call("app", "RPC", "testSmtpSettings", new RPCCallback() {
										public void execute(RPCResponse response, Object rawData, RPCRequest request) {
											G.waitDialogHide();
											Map m = response.getDataAsMap();
											if ((boolean) m.get("OK"))
												G.dialogSay(G.S.testLetterSuccessfulSent());
											else
												G.showText(G.getRedText(G.S.testLetterDoesntSent()), m.get("MSG").toString());
										}
									}, new Object[] { value, "Test letter", "Body of test letter", form.getValues() });
								}
							});
						}
					}

					@Override
					protected void button2() {
						if (form.validate(false)) {
							DMI.call("app", "RPC", "saveSmtpSettings", new RPCCallback() {
								public void execute(RPCResponse response, Object rawData, RPCRequest request) {
									G.findParentWindow(form).destroy();
								}
							}, new Object[] { form.getValues() });
						}
					};

					@Override
					protected void button3() {
						G.findParentWindow(this).destroy();
					}
				};
				G.showInWindow(G.S.smtpServerSettings(), form, btns);
			}
		}, new Object[] {});

	}
}
