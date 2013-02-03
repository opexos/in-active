package com.app.server;

import java.io.InputStream;
import java.io.OutputStream;

public interface DeviceConnection {

	public InputStream getOut();

	public OutputStream getIn();

	public void close();

}
