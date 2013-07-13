package com.app.client.websocket;

import com.google.gwt.core.shared.GWT;
import com.google.gwt.typedarrays.shared.ArrayBuffer;
import com.google.gwt.typedarrays.shared.ArrayBufferView;
import javax.annotation.Nonnull;
import javax.annotation.Nullable;

/**
 * The WebSocket class.
 */
public abstract class WebSocket
{
  /**
   * The factory used for creating WebSocket instances.
   */
  public interface Factory
  {
    WebSocket newWebSocket();
  }

  /**
   * The states of the WebSocket.
   */
  public enum ReadyState
  {
    CONNECTING, OPEN, CLOSING, CLOSED
  }

  /**
   * The types of data the WebSocket can receive.
   */
  public enum BinaryType
  {
    BLOB, ARRAYBUFFER
  }

  private static SupportDetector g_supportDetector;
  private static Factory g_factory;
  @Nonnull
  private WebSocketListener _listener = NullWebSocketListener.LISTENER;

  /**
   * Create a WebSocket if supported by the platform.
   *
   * This method will use the registered factory to create the WebSocket instance.
   *
   * @return a WebSocket instance, if supported by the platform, null otherwise.
   */
  public static WebSocket newWebSocketIfSupported()
  {
    if ( null == g_factory && GWT.isClient() && getSupportDetector().isSupported() )
    {
      register( getSupportDetector().newFactory() );
      return g_factory.newWebSocket();
    }
    return ( null != g_factory ) ? g_factory.newWebSocket() : null;
  }

  /**
   * @return true if newWebSocketIfSupported() will return a non-null value, false otherwise.
   */
  public static boolean isSupported()
  {
    return ( null != g_factory ) || GWT.isClient() && getSupportDetector().isSupported();
  }

  /**
   * Register a factory to be used to construct WebSocket instances.
   * This is not usually used as the built in browser based factory will
   * be detected and used if available. The register method is typically used
   * by test frameworks.
   *
   * @param factory the factory to register.
   */
  public static void register( @Nonnull final Factory factory )
  {
    g_factory = factory;
  }

  /**
   * Deregister factory if the specified factory is the registered factory.
   *
   * @param factory the factory to deregister.
   * @return true if able to deregister, false otherwise.
   */
  public static boolean deregister( @Nonnull final Factory factory )
  {
    if ( g_factory != factory )
    {
      return false;
    }
    else
    {
      g_factory = null;
      return true;
    }
  }

  /**
   * Connect the WebSocket to the specified url, passing specified protocols.
   *
   * @param url the url to open.
   * @throws IllegalStateException if the WebSocket is already open.
   */
  public abstract void connect( @Nonnull String url, @Nonnull String... protocols )
    throws IllegalStateException;

  /**
   * Close the WebSocket and stop receiving MessageEvents.
   *
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract void close()
    throws IllegalStateException;

  /**
   * Close the WebSocket with specified code and stop receiving MessageEvents.
   *
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public final void close( short code )
    throws IllegalStateException
  {
    close( code, null );
  }

  /**
   * Close the WebSocket with specified code and reason, and stop receiving MessageEvents.
   *
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract void close( short code, @Nullable String reason )
    throws IllegalStateException;

  /**
   * @return true if the WebSocket is connected, false otherwise.
   */
  public abstract boolean isConnected();

  /**
   * Send some string data across the WebSocket.
   *
   * @param data the data to send.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract void send( @Nonnull String data )
    throws IllegalStateException;

  /**
   * Send some ArrayBuffer data across the WebSocket.
   *
   * @param data the data to send.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract void send( @Nonnull ArrayBuffer data )
    throws IllegalStateException;

  /**
   * Send some ArrayBufferView data across the WebSocket.
   *
   * @param data the data to send.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract void send( @Nonnull ArrayBufferView data )
    throws IllegalStateException;

  /**
   * Return the amount buffered on underlying WebSocket.
   *
   * @return the amount buffered on underlying WebSocket.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract int getBufferedAmount()
    throws IllegalStateException;

  /**
   * Return the protocol used by the underlying WebSocket.
   *
   * @return the protocol used by the underlying WebSocket.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract String getProtocol()
    throws IllegalStateException;

  /**
   * Return the url that the underlying WebSOcket is connected to.
   *
   * @return the url that the underlying WebSOcket is connected to.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract String getURL()
    throws IllegalStateException;

  /**
   * Return the extensions that the underlying WebSocket is connected using.
   *
   * @return the extensions that the underlying WebSocket is connected using.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract String getExtensions()
    throws IllegalStateException;

  /**
   * Return the state of the WebSocket.
   *
   * @return the state of the WebSocket.
   */
  public abstract ReadyState getReadyState();

  /**
   * Set the type of the binary messages that the WebSocket will receive.
   * Note: At this stage only ARRAYBUFFER is supported.
   *
   * @param binaryType the type of the binary messages that the WebSocket will receive.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract void setBinaryType( @Nonnull BinaryType binaryType )
    throws IllegalStateException;

  /**
   * Return the type of the binary messages that the WebSocket will receive.
   *
   * @return the type of the binary messages that the WebSocket will receive.
   * @throws IllegalStateException if the WebSocket is not open.
   */
  public abstract BinaryType getBinaryType()
    throws IllegalStateException;

  /**
   * Return the listener associated with the WebSocket.
   *
   * @return the listener associated with the WebSocket.
   */
  @Nonnull
  public final WebSocketListener getListener()
  {
    return _listener;
  }

  /**
   * Set the listener to receive messages from the WebSocket.
   *
   * @param listener the listener to receive messages from the WebSocket.
   */
  public final void setListener( @Nullable final WebSocketListener listener )
  {
    _listener = null == listener ? NullWebSocketListener.LISTENER : listener;
  }

  /**
   * Fire a Connected event.
   */
  protected final void onOpen()
  {
    getListener().onOpen( this );
  }

  /**
   * Fire a Close event.
   */
  protected final void onClose( final boolean wasClean,
                                final int code,
                                @Nullable final String reason )
  {
    getListener().onClose( this, wasClean, code, reason );
  }

  /**
   * Fire a Message event.
   */
  protected final void onMessage( final String data )
  {
    getListener().onMessage( this, data );
  }

  /**
   * Fire a Message event.
   */
  protected final void onMessage( final ArrayBuffer data )
  {
    getListener().onMessage( this, data );
  }

  /**
   * Fire an Error event.
   */
  protected final void onError()
  {
    getListener().onError( this );
  }

  /**
   * Detector for browser support.
   */
  private static class SupportDetector
  {
    public boolean isSupported()
    {
      return Html5WebSocket.isSupported();
    }

    public Factory newFactory()
    {
      return new Html5WebSocket.Factory();
    }
  }

  /**
   * Detector for browsers without WebSocket support.
   */
  @SuppressWarnings( "unused" )
  private static class NoSupportDetector
    extends SupportDetector
  {
    @Override
    public boolean isSupported()
    {
      return false;
    }

    @Override
    public Factory newFactory()
    {
      return null;
    }
  }

  private static SupportDetector getSupportDetector()
  {
    if ( null == g_supportDetector )
    {
      g_supportDetector = com.google.gwt.core.shared.GWT.create( SupportDetector.class );
    }
    return g_supportDetector;
  }
}
