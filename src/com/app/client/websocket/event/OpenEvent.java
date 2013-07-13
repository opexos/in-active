package com.app.client.websocket.event;

import javax.annotation.Nonnull;

import com.app.client.websocket.WebSocket;
import com.app.client.websocket.event.OpenEvent.Handler;
import com.google.gwt.event.shared.EventHandler;
import com.google.gwt.event.shared.GwtEvent;

/**
 * Event fired when web socket successfully connects.
 */
public class OpenEvent
  extends WebSocketEvent<Handler>
{
  public interface Handler
    extends EventHandler
  {
    void onOpenEvent( @Nonnull OpenEvent event );
  }

  private static final GwtEvent.Type<Handler> TYPE = new Type<Handler>();

  public static GwtEvent.Type<Handler> getType()
  {
    return TYPE;
  }

  public OpenEvent( @Nonnull final WebSocket webSocket )
  {
    super( webSocket );
  }

  @Override
  public GwtEvent.Type<Handler> getAssociatedType()
  {
    return OpenEvent.getType();
  }

  @Override
  protected void dispatch( @Nonnull final Handler handler )
  {
    handler.onOpenEvent( this );
  }
}
