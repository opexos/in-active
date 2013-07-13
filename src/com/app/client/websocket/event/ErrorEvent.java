package com.app.client.websocket.event;

import javax.annotation.Nonnull;

import com.app.client.websocket.WebSocket;
import com.app.client.websocket.event.ErrorEvent.Handler;
import com.google.gwt.event.shared.EventHandler;

/**
 * Event fired when there is an error with the web socket.
 */
public class ErrorEvent
  extends WebSocketEvent<Handler>
{
  public interface Handler
    extends EventHandler
  {
    void onErrorEvent( @Nonnull ErrorEvent event );
  }

  private static final Type<Handler> TYPE = new Type<Handler>();

  public static Type<Handler> getType()
  {
    return TYPE;
  }

  public ErrorEvent( @Nonnull final WebSocket webSocket )
  {
    super( webSocket );
  }

  @Override
  public Type<Handler> getAssociatedType()
  {
    return ErrorEvent.getType();
  }

  @Override
  protected void dispatch( @Nonnull final Handler handler )
  {
    handler.onErrorEvent( this );
  }
}
