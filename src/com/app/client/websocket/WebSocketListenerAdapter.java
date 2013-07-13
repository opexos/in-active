package com.app.client.websocket;

import com.google.gwt.typedarrays.shared.ArrayBuffer;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * Adapter listener to make sub-classing easier.
 */
public abstract class WebSocketListenerAdapter
  implements WebSocketListener
{
  /**
   * {@inheritDoc}
   */
  @Override
  public void onOpen( @Nonnull final WebSocket webSocket )
  {
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void onClose( @Nonnull final WebSocket webSocket,
                       final boolean wasClean,
                       final int code,
                       @Nullable final String reason )
  {
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void onMessage( @Nonnull final WebSocket webSocket, @Nonnull final String data )
  {
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void onMessage( @Nonnull final WebSocket webSocket, @Nonnull final ArrayBuffer data )
  {
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void onError( @Nonnull final WebSocket webSocket )
  {
  }
}
