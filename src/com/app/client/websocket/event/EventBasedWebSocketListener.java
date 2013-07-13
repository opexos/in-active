package com.app.client.websocket.event;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import com.app.client.websocket.WebSocket;
import com.app.client.websocket.WebSocketListener;
import com.google.gwt.typedarrays.shared.ArrayBuffer;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.HandlerRegistration;
import com.google.web.bindery.event.shared.SimpleEventBus;

/**
 * An event based web socket listener.
 */
public class EventBasedWebSocketListener
  implements WebSocketListener
{
  @Nonnull
  private final EventBus _eventBus;

  /**
   * Construct the listener using a SimpleEventBus.
   */
  public EventBasedWebSocketListener()
  {
    this( new SimpleEventBus() );
  }

  /**
   * Construct the listener using specified EventBus.
   *
   * @param eventBus the event bus.
   */
  public EventBasedWebSocketListener( @Nonnull final EventBus eventBus )
  {
    _eventBus = eventBus;
  }

  /**
   * Add listener for open events.
   *
   * @param handler the event handler.
   * @return the HandlerRegistration that manages the listener.
   */
  @Nonnull
  public final HandlerRegistration addOpenHandler( @Nonnull final OpenEvent.Handler handler )
  {
    return _eventBus.addHandler( OpenEvent.getType(), handler );
  }

  /**
   * Add listener for close events.
   *
   * @param handler the event handler.
   * @return the HandlerRegistration that manages the listener.
   */
  @Nonnull
  public final HandlerRegistration addCloseHandler( @Nonnull final CloseEvent.Handler handler )
  {
    return _eventBus.addHandler( CloseEvent.getType(), handler );
  }

  /**
   * Add listener for message events.
   *
   * @param handler the event handler.
   * @return the HandlerRegistration that manages the listener.
   */
  @Nonnull
  public final HandlerRegistration addMessageHandler( @Nonnull final MessageEvent.Handler handler )
  {
    return _eventBus.addHandler( MessageEvent.getType(), handler );
  }

  /**
   * Add listener for error events.
   *
   * @param handler the event handler.
   * @return the HandlerRegistration that manages the listener.
   */
  @Nonnull
  public final HandlerRegistration addErrorHandler( @Nonnull final ErrorEvent.Handler handler )
  {
    return _eventBus.addHandler( ErrorEvent.getType(), handler );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final void onOpen( @Nonnull final WebSocket webSocket )
  {
    _eventBus.fireEventFromSource( new OpenEvent( webSocket ), webSocket );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final void onClose( @Nonnull final WebSocket webSocket,
                             final boolean wasClean,
                             final int code,
                             @Nullable final String reason )
  {
    _eventBus.fireEventFromSource( new CloseEvent( webSocket, wasClean, code, reason ), webSocket );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final void onMessage( @Nonnull final WebSocket webSocket, @Nonnull final String data )
  {
    _eventBus.fireEventFromSource( new MessageEvent( webSocket, data ), webSocket );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final void onMessage( @Nonnull final WebSocket webSocket, @Nonnull final ArrayBuffer data )
  {
    _eventBus.fireEventFromSource( new MessageEvent( webSocket, data ), webSocket );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final void onError( @Nonnull final WebSocket webSocket )
  {
    _eventBus.fireEventFromSource( new ErrorEvent( webSocket ), webSocket );
  }
}
