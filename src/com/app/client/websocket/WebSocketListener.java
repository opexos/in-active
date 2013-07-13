package com.app.client.websocket;

import com.google.gwt.typedarrays.shared.ArrayBuffer;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Interface for receiving WebSocket events.
 */
public interface WebSocketListener
{
  /**
   * Fire a Connected event.
   */
  void onOpen( @Nonnull WebSocket webSocket );

  /**
   * Fire a Close event.
   */
  void onClose( @Nonnull WebSocket webSocket, boolean wasClean, int code, @Nullable String reason );

  /**
   * Fire a Message event.
   */
  void onMessage( @Nonnull WebSocket webSocket, @Nonnull String data );

  /**
   * Fire a Message event.
   */
  void onMessage( @Nonnull WebSocket webSocket, @Nonnull ArrayBuffer data );

  /**
   * Fire an Error event.
   */
  void onError( @Nonnull WebSocket webSocket );
}
