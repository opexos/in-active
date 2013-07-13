package com.app.client.websocket;


import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.typedarrays.shared.ArrayBuffer;
import com.google.gwt.typedarrays.shared.ArrayBufferView;

/**
 * The browser-based WebSocket implementation.
 */
final class Html5WebSocket
  extends WebSocket
{
  public static native boolean isSupported() /*-{
    return !!$wnd.WebSocket || !!$wnd.MozWebSocket;
  }-*/;

  private WebSocketImpl _webSocket;

  static class Factory
    implements WebSocket.Factory
  {
    @Override
    public WebSocket newWebSocket()
    {
      return new Html5WebSocket();
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void close()
    throws IllegalStateException
  {
    checkConnected();
    _webSocket.close();
    socketClosed();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void close( final short code, @Nullable final String reason )
    throws IllegalStateException
  {
    checkConnected();
    _webSocket.close( code, reason );
    socketClosed();
  }

  private void socketClosed()
  {
    _webSocket = null;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void connect( @Nonnull final String server, @Nonnull final String... protocols )
    throws IllegalStateException
  {
    if ( null != _webSocket )
    {
      throw new IllegalStateException( "WebSocket already connected" );
    }
    _webSocket = WebSocketImpl.create( this, server, protocols );
    setBinaryType( BinaryType.ARRAYBUFFER );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public boolean isConnected()
    throws IllegalStateException
  {
    return null != _webSocket;
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final int getBufferedAmount()
    throws IllegalStateException
  {
    checkConnected();
    return _webSocket.getBufferedAmount();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public String getProtocol()
    throws IllegalStateException
  {
    checkConnected();
    return _webSocket.getProtocol();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public String getURL()
    throws IllegalStateException
  {
    checkConnected();
    return _webSocket.getURL();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public String getExtensions()
    throws IllegalStateException
  {
    checkConnected();
    return _webSocket.getExtensions();
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final void send( @Nonnull String data )
    throws IllegalStateException
  {
    checkConnected();
    _webSocket.send( data );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void send( @Nonnull final ArrayBufferView data )
    throws IllegalStateException
  {
    checkConnected();
    _webSocket.send( data );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void send( @Nonnull final ArrayBuffer data )
    throws IllegalStateException
  {
    checkConnected();
    _webSocket.send( data );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public final ReadyState getReadyState()
  {
    if ( null == _webSocket )
    {
      return ReadyState.CLOSED;
    }
    else
    {
      return ReadyState.values()[ _webSocket.getReadyState() ];
    }
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public void setBinaryType( @Nonnull final BinaryType binaryType )
    throws IllegalStateException
  {
    checkConnected();
    _webSocket.setBinaryType( binaryType.name().toLowerCase() );
  }

  /**
   * {@inheritDoc}
   */
  @Override
  public BinaryType getBinaryType()
    throws IllegalStateException
  {
    checkConnected();
    return BinaryType.valueOf( _webSocket.getBinaryType().toUpperCase() );
  }

  /**
   * Make sure the implementation is present and if not raise an IllegalStateException.
   */
  private void checkConnected()
    throws IllegalStateException
  {
    if ( null == _webSocket )
    {
      throw new IllegalStateException( "WebSocket not connected" );
    }
  }

  /**
   * The underlying WebSocket implementation.
   */
  private final static class WebSocketImpl
    extends JavaScriptObject
  {
    static native WebSocketImpl create( WebSocket client, String server, String... protocols )
    /*-{
      var ws = (!!$wnd.WebSocket) ? new $wnd.WebSocket( server, protocols ) : $wnd.MozWebSocket( server, protocols );
      ws.onopen = $entry( function ()
                          {
                            client.@com.app.client.websocket.WebSocket::onOpen()();
                          } );
      ws.onerror = $entry( function ()
                           {
                             client.@com.app.client.websocket.WebSocket::onError()();
                           } );
      ws.onmessage = $entry( function ( response )
                             {
                               if ( typeof(response.data) == 'string' )
                               {
                                 client.@com.app.client.websocket.WebSocket::onMessage(Ljava/lang/String;)( response.data );
                               }
                               else
                               {
                                 client.@com.app.client.websocket.WebSocket::onMessage(Lcom/google/gwt/typedarrays/shared/ArrayBuffer;)( response.data );
                               }
                             } );
      ws.onclose = $entry( function ( event )
                           {
                             client.@com.app.client.websocket.WebSocket::onClose(ZILjava/lang/String;)( event.wasClean,
                                                                                                                      event.code,
                                                                                                                      event.reason );
                             client.@com.app.client.websocket.Html5WebSocket::socketClosed()();
                           } );
      return ws;
    }-*/;

    protected WebSocketImpl()
    {
    }

    native int getBufferedAmount() /*-{
      return this.bufferedAmount;
    }-*/;

    native int getReadyState() /*-{
      return this.readyState;
    }-*/;

    native void close() /*-{
      this.close();
    }-*/;

    native void close( int code, String reason ) /*-{
      this.close( code, reason );
    }-*/;

    native void send( String data ) /*-{
      this.send( data );
    }-*/;

    native void send( ArrayBuffer data ) /*-{
      this.send( data );
    }-*/;

    native void send( ArrayBufferView data ) /*-{
      this.send( data );
    }-*/;

    native String getBinaryType()  /*-{
      return this.binaryType;
    }-*/;

    native void setBinaryType( String binaryType )  /*-{
      this.binaryType = binaryType;
    }-*/;

    native String getURL() /*-{
      return this.url;
    }-*/;

    native String getExtensions()  /*-{
      return this.extensions;
    }-*/;

    native String getProtocol()  /*-{
      return this.protocol;
    }-*/;
  }
}
