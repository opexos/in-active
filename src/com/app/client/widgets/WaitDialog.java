package com.app.client.widgets;

import com.app.client.G;
import com.smartgwt.client.types.Alignment;
import com.smartgwt.client.types.ClickMaskMode;
import com.smartgwt.client.widgets.Canvas;
import com.smartgwt.client.widgets.Img;
import com.smartgwt.client.widgets.layout.HLayout;
import com.smartgwt.client.widgets.layout.VLayout;

public class WaitDialog {

	private Canvas m_canvas;
	// private HandlerRegistration m_keyHandler;
	private String m_clickMask;
	private Label m_info = new Label().noWrap();

	public WaitDialog() {

		VLayout l = new VLayout(20);
		l.setPadding(20);
		//l.setBorder("1px solid #888888");
		l.setBackgroundColor("white");
		l.setDefaultLayoutAlign(Alignment.CENTER);
		l.setAutoWidth();
		l.setAutoHeight();
		l.addMember(new Img("[SKIN]loading.gif", 24, 24));
		l.addMember(new Label(G.S.pleaseWait()).noWrap());
		l.addMember(m_info);
		l.setShowShadow(true);
		l.setShadowSoftness(10);
		l.setShadowOffset(0);

		HLayout h = new HLayout();
		h.setDefaultLayoutAlign(Alignment.CENTER);
		h.setAlign(Alignment.CENTER);
		h.setWidth100();
		h.setHeight100();
		h.addMember(l);		

		m_canvas = h;
	}

	public void show() {
		m_canvas.show();
		m_canvas.bringToFront();
		// m_canvas.setCanFocus(true);
		// m_canvas.focus();
		if (m_clickMask == null)
			m_clickMask = m_canvas.showClickMask(null, ClickMaskMode.HARD, null);
		/*if (m_keyHandler == null) 
			m_keyHandler = Event.addNativePreviewHandler(new NativePreviewHandler() {
				public void onPreviewNativeEvent(NativePreviewEvent event) {
					if ((event.getTypeInt() & Event.KEYEVENTS) > 0)
						event.cancel();
				}
			});*/
	}

	public void hide() {
		m_canvas.hide();
		if (m_clickMask != null) {
			m_canvas.hideClickMask(m_clickMask);
			m_clickMask = null;
		}
		/*if (m_keyHandler != null) {
			m_keyHandler.removeHandler();
			m_keyHandler = null;
		}*/
	}
	
	public void setInfo(String text){
		m_info.setVisible(true);
		m_info.setContents(text);
	}
	
	public void clearInfo(){
		m_info.setVisible(false);
	}

}
