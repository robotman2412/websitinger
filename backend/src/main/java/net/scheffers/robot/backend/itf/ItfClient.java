package net.scheffers.robot.backend.itf;

import jutils.JUtils;
import jutils.database.BytePool;
import jutils.database.DataPacker;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.Socket;

public class ItfClient {
	
	public Socket soc;
	public BytePool pool;
	public int expectedLength;
	public InputStream in;
	public OutputStream out;
	
	public ItfClient(Socket socket) throws IOException {
		soc = socket;
		pool = new BytePool();
		expectedLength = 0;
		in = soc.getInputStream();
		out = soc.getOutputStream();
	}
	
	public void loop() throws IOException {
		if (expectedLength == 0) {
			if (in.available() >= 4) {
				byte[] buf = new byte[4];
				in.read(buf, 0, 4);
				expectedLength = JUtils.bytesToInt(buf);
			}
		}
		else if (in.available() > 0) {
			int readable = Math.min(expectedLength - pool.bufferUsedLength, in.available());
			byte[] buf = new byte[readable];
			in.read(buf, 0, readable);
			pool.addBytes(buf);
			if (pool.bufferUsedLength >= expectedLength) {
				handleRaw(pool.copyToArray());
			}
		}
	}
	
	protected void handleRaw(byte[] raw) {
		DataPacker data = new DataPacker(raw);
		String op = data.readString();
	}
	
}
