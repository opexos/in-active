package com.app.client.websocket.event;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import com.app.client.websocket.WebSocket;
import com.app.client.websocket.event.CloseEvent.Handler;
import com.google.gwt.event.shared.EventHandler;

/**
 * Event fired when the web socket is closed.
 */
public class CloseEvent
  extends WebSocketEvent<Handler>
{
  public static final int CLOSE_NORMAL = 1000;
  public static final int CLOSE_GOING_AWAY = 1001;
  public static final int CLOSE_PROTOCOL_ERROR = 1002;
  public static final int CLOSE_UNSUPPORTED = 1003;
  public static final int CLOSE_NO_STATUS = 1005;
  public static final int CLOSE_ABNORMAL = 1006;
  public static final int CLOSE_INCONSISTENT_DATA = 1007;
  public static final int CLOSE_VIOLATES_POLICY = 1008;
  public static final int CLOSE_TOO_LARGE = 1009;
  public static final int CLOSE_EXTENSION_UNAVAILABLE = 1010;
  public static final int CLOSE_UNEXPECTED_CONDITION = 1011;

  public interface Handler
    extends EventHandler
  {
    void onCloseEvent( @Nonnull CloseEvent event );
  }

  private static final Type<Handler> TYPE = new Type<Handler>();

  public static Type<Handler> getType()
  {
    return TYPE;
  }

  private final boolean _wasClean;
  private final int _code;
  private final String _reason;

  public CloseEvent( @Nonnull final WebSocket webSocket,
                     final boolean wasClean,
                     final int code,
                     @Nullable final String reason )
  {
    super( webSocket );
    _wasClean = wasClean;
    _code = code;
    _reason = reason;
  }

  public boolean wasClean()
  {
    return _wasClean;
  }

  public int getCode()
  {
    return _code;
  }

  @Nullable
  public String getReason()
  {
    return _reason;
  }

  @Override
  public Type<Handler> getAssociatedType()
  {
    return CloseEvent.getType();
  }

  @Override
  protected void dispatch( @Nonnull final Handler handler )
  {
    handler.onCloseEvent( this );
  }
}
