package com.app.client.websocket.event;

import javax.annotation.Nonnull;

import com.app.client.websocket.WebSocket;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;

/**
 * Base class of all events originating from web socket.
 */
public abstract class WebSocketEvent<H extends EventHandler>
  extends GwtEvent<H>
{
  private final WebSocket _webSocket;

  protected WebSocketEvent( @Nonnull final WebSocket webSocket )
  {
    _webSocket = webSocket;
  }

  @Nonnull
  public final WebSocket getWebSocket()
  {
    return _webSocket;
  }
}
