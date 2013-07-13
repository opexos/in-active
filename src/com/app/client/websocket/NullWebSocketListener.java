package com.app.client.websocket;

/**
 * Null listener so as to avoid the need to null value.
 */
final class NullWebSocketListener
  extends WebSocketListenerAdapter
{
  static final NullWebSocketListener LISTENER = new NullWebSocketListener();

  private NullWebSocketListener()
  {
  }
}
