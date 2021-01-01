package net.scheffers.robot.backend.itf;

import java.net.ServerSocket;

public class BackendInterface {
	
	public static ServerSocket backendItfServer;
	public static volatile boolean cont;
	
	public static void startServer() {
		new Thread(BackendInterface::serverRun).start();
	}
	
	public static void serverRun() {
		cont = true;
		while (cont) {
			
		}
	}
	
	public static void endServer() {
		cont = false;
	}
	
}
