package com.app.client.tabs;
import static com.app.client.G.img16;

import com.app.client.AppTab;
import com.app.client.ConsoleTab;
import com.app.client.G;
import com.app.client.ServerCall;
import com.app.shared.ConsoleOutputFormatter;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.core.client.Scheduler.ScheduledCommand;
import com.google.gwt.dom.client.Element;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.EventListener;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.ui.TextArea;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.HTMLPane;
import com.smartgwt.client.widgets.layout.HLayout;

public class ConsoleRealTime extends AppTab implements ConsoleTab {

	private HTMLPane m_pane;
	//private HTMLPane m_pane2;
	private TextArea m_pane2;
	private Timer m_focus = new Timer() {
		public void run() {
			m_pane.focus();
		}
	};
	private Timer m_processPastePane = new Timer() {
		public void run() {
			// G.placeCaretAtEnd(m_pane.getContentElement());
			// m_pane.scrollToBottom();
			// m_focus.schedule(100);
			m_pane.focus();
			//Element e = m_pane2.getContentElement();
			//String pastedText = e.getInnerHTML();
			//e.setInnerHTML("");
			//ServerCall.sendToConsole(getConsoleId(), pastedText.replace("<br>", "\r").replace("<br/>", "\r").replace("<br />", "\r"), null);
			String pastedText = m_pane2.getText();
			m_pane2.setText("");
			m_pane2.setEnabled(false);
			ServerCall.sendToConsole(getConsoleId(), pastedText.replace("\r\n", "\r").replace("\n", "\r"), null);
		}
	};

	private ScheduledCommand m_scrollBottom = new ScheduledCommand() {
		public void execute() {
			m_pane.scrollToBottom();
		}
	};

	private ConsoleOutputFormatter m_con = new ConsoleOutputFormatter(false);

	public ConsoleRealTime(String title, String consoleId) {
		super();
		setID(consoleId);
		setTitle(img16("console"), title);
	}

	private String getConsoleId() {
		return getID();
	}

	@Override
	protected void onShow() {
		super.onShow();
		G.listenConsoleData(false);
		m_focus.schedule(100);
	}

	@Override
	protected void onClose() {
		super.onClose();
		ServerCall.closeConsole(getID());
	}

	@Override
	protected void onSelect() {
		super.onSelect();
		m_focus.schedule(100);
	}

	protected Canvas getContent() {
		m_pane = new HTMLPane() {
			{
				setStyleName("console");
				setCanSelectText(true);
				setCanFocus(true);
			}

			@Override
			protected void onDraw() {
				super.onDraw();
				final Element el = getContentElement();
				// el.setAttribute("contentEditable", "true");
				Event.sinkEvents(el, Event.ONKEYDOWN | Event.ONKEYPRESS);
				Event.setEventListener(el, new EventListener() {
					public void onBrowserEvent(Event event) {
						switch (event.getTypeInt()) {
						/*case Event.ONPASTE:
							m_pane2.focus();
							Scheduler.get().scheduleDeferred(m_processPastePane);
							break;*/
						case Event.ONKEYDOWN:
							int keyCode = event.getKeyCode();
							if (((event.getCtrlKey() || event.getMetaKey()) && keyCode == KeyCodes.KEY_V) ||
									(event.getShiftKey() && keyCode == KeyCodes.KEY_INSERT)) {
								m_pane2.setEnabled(true);
								m_pane2.setFocus(true);
								m_processPastePane.schedule(100);
							}
							else {
								String cmd = null;
								switch (keyCode) {
								case KeyCodes.KEY_UP:
									cmd = (char) KeyCodes.KEY_ESCAPE + "[A";
									break;
								case KeyCodes.KEY_DOWN:
									cmd = (char) KeyCodes.KEY_ESCAPE + "[B";
									break;
								case KeyCodes.KEY_LEFT:
									cmd = (char) KeyCodes.KEY_ESCAPE + "[D";
									break;
								case KeyCodes.KEY_RIGHT:
									cmd = (char) KeyCodes.KEY_ESCAPE + "[C";
									break;
								case KeyCodes.KEY_TAB:
								case KeyCodes.KEY_ENTER:
								case KeyCodes.KEY_BACKSPACE:
									cmd = new String(new int[] { keyCode }, 0, 1);
									break;
								case KeyCodes.KEY_DELETE:
									cmd = (char) KeyCodes.KEY_ESCAPE + "[C" + (char) KeyCodes.KEY_BACKSPACE;
									break;
								}
								if (cmd != null) {
									stop(event);
									ServerCall.sendToConsole(getConsoleId(), cmd, null);
								}
							}
							break;
						case Event.ONKEYPRESS:
							int charCode = event.getCharCode();
							if (charCode >= 32 && !event.getCtrlKey() && !event.getAltKey() && !event.getMetaKey()) {
								stop(event);
								ServerCall.sendToConsole(getConsoleId(), "" + (char) charCode, null);
							}
							break;
						}
					}
				});
			}
		};
		/*m_pane2 = new HTMLPane() {
			{
				setCanFocus(true);
				setHeight(100);
				// setOpacity(0);
			}

			@Override
			protected void onDraw() {
				super.onDraw();
				Element el = getContentElement();
				el.setAttribute("contentEditable", "true");
				el.setInnerHTML("");
			}
		};*/
		m_pane2 = new TextArea();
		m_pane2.setEnabled(false);
		m_pane2.setWidth("1px");
		m_pane2.getElement().getStyle().setProperty("resize", "none");
		m_pane2.getElement().getStyle().setOpacity(0.01);

		HLayout vl = new HLayout();
		vl.addMember(m_pane);
		vl.addMember(m_pane2);
		return vl;
	}

	private void stop(Event event) {
		event.stopPropagation();
		event.preventDefault();
	}

	public void processData(String data) {
		m_con.put(data);
		m_pane.setContents(m_con.getTextWithCursor());
		Scheduler.get().scheduleDeferred(m_scrollBottom);
	}

}
