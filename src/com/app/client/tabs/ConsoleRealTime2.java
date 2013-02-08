package com.app.client.tabs;

import static com.app.client.G.img16;

import com.app.client.AppTab;
import com.app.client.websocket.WebSocket;
import com.app.client.websocket.WebSocketListenerAdapter;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.smartgwt.client.widgets.Canvas;

public class ConsoleRealTime2 extends AppTab {

	private WebSocket m_webSocket;
	private JavaScriptObject m_terminal;
	private String m_type;
	private int m_id;
	private Timer m_focus = new Timer() {
		public void run() {
			if (m_terminal != null)
				focusTerminal(m_terminal);
		}
	};
	private Timer m_fit = new Timer() {
		public void run() {
			if (m_terminal != null)
				fitTerminal(m_terminal);
		}
	};

	public ConsoleRealTime2(String title, String type, int id) {
		super();
		setTitle(img16("console"), title);
		m_type = type;
		m_id = id;
	}

	@Override
	protected void onShow() {
		super.onShow();
	}

	@Override
	protected void onClose() {
		super.onClose();
		if (m_webSocket.isConnected())
			m_webSocket.close();
		destroyTerminal(m_terminal);
	}

	@Override
	protected void onResize() {
		super.onResize();
		//fitTerminal(m_terminal);
		m_fit.schedule(100);
	}

	@Override
	protected void onSelect() {
		super.onSelect();
		m_focus.schedule(100);
		m_fit.schedule(100);
	}

	protected Canvas getContent() {
		return new Canvas() {
			{
				setWidth100();
				setHeight100();
				setCanSelectText(true);
			}

			@Override
			protected void onDraw() {
				super.onDraw();

				m_webSocket = WebSocket.newWebSocketIfSupported();
				m_webSocket.setListener(new WebSocketListenerAdapter() {
					@Override
					public void onMessage(final WebSocket webSocket, final String data) {
						toTerminal(m_terminal, data);
					}

					@Override
					public void onClose(WebSocket webSocket, boolean wasClean, int code, String reason) {
						// toTerminal(m_terminal, "\n\nConnection is closed");
					}
				});
				String url = Window.Location.getHref();
				url = url.substring(url.indexOf(':'), url.lastIndexOf('/'));
				url = "wss" + url + "/console/" + m_type + "/" + m_id;

				getContentElement().removeFromParent();
				m_terminal = makeTerminal(getOuterElement(), m_webSocket);
				m_webSocket.connect(url);
			}
		};
	}

	private native JavaScriptObject makeTerminal(Element el, WebSocket socket) /*-{
		var term = new $wnd.Terminal();
		term.open(el);
		term.fit();
		term
				.on(
						'data',
						function(data) {
							if (socket.@com.app.client.websocket.WebSocket::isConnected()())
								socket.@com.app.client.websocket.WebSocket::send(Ljava/lang/String;)( data );
						});
		return term;
	}-*/;

	private native void toTerminal(JavaScriptObject terminal, String data)/*-{
		terminal.write(data);
	}-*/;

	private native void destroyTerminal(JavaScriptObject terminal)/*-{
		terminal.destroy();
	}-*/;

	private native void focusTerminal(JavaScriptObject terminal)/*-{
		terminal.focus();
	}-*/;

	private native void fitTerminal(JavaScriptObject terminal)/*-{
		terminal.fit();
	}-*/;
}
