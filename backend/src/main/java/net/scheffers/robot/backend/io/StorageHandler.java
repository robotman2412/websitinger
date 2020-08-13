package net.scheffers.robot.backend.io;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jutils.IOUtils;
import net.scheffers.robot.backend.PrivilegeLevel;
import net.scheffers.robot.backend.ServerBackend;
import net.scheffers.robot.backend.user.ClientInfo;
import org.java_websocket.WebSocket;

import java.io.File;
import java.io.IOException;
import java.util.HashSet;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

public class StorageHandler {
	
	public static Set<ClientInfo> unsavedClients;
	public static boolean levelsUnsaved;
	public static Timer saveTimer;
	
	public static void start() {
		unsavedClients = new HashSet<>();
		saveTimer = new Timer("storage save timer");
		saveTimer.scheduleAtFixedRate(new TimerTask() {
			@Override
			public void run() {
				saveAll();
			}
		}, 30000, 60000);
	}
	
	public static void stop() {
		saveTimer.cancel();
		saveAll();
	}
	
	public static synchronized void saveAll() {
		unsavedClients.forEach(StorageHandler::saveClientInfo);
		unsavedClients.clear();
		if (levelsUnsaved) {
			saveLevels();
		}
	}
	
	public static void clientConnected(WebSocket conn, ClientInfo info) {
		
	}
	
	public static void clientDisconnected(WebSocket conn, ClientInfo info) {
		saveClientInfo(info);
		unsavedClients.remove(info);
	}
	
	public static void clientLogin(WebSocket conn, ClientInfo info) {
		loadClientInfo(info);
	}
	
	public static void loadClientInfo(ClientInfo info) {
		File inFile = new File(ServerBackend.basePath + "clients/" + info.googleUserID + ".json");
		if (!inFile.exists()) {
			return;
		}
		JsonObject in;
		try {
			in = (JsonObject) JsonParser.parseString(new String(IOUtils.readBytes(inFile)));
		} catch (IOException e) {
			e.printStackTrace();
			return;
		}
		PrivilegeLevel privilege = PrivilegeLevel.get(in.get("privilege").getAsString());
		if (privilege != null) {
			info.rawPrivilege(privilege);
		}
	}
	
	@SuppressWarnings("ResultOfMethodCallIgnored")
	public static boolean saveClientInfo(ClientInfo info) {
		File outFile = new File(ServerBackend.basePath + "clients/" + info.googleUserID + ".json");
		if (info.getPrivilege().level <= PrivilegeLevel.LoggedIn.level) {
			if (outFile.exists()) {
				outFile.delete(); // Delete the saved client info if already there to save on space.
			}
			return true;
		}
		JsonObject out = new JsonObject();
		out.addProperty("privilege", info.getPrivilege().name());
		try {
			IOUtils.saveBytes(outFile, out.toString().getBytes());
			return true;
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
	public static void saveLevels() {
		File outFile = new File(ServerBackend.basePath + "levels.json");
		JsonObject out = new JsonObject();
		out.addProperty("post_job", ServerBackend.getPrivilegeLevel("post_job").name());
		out.addProperty("interact", ServerBackend.getPrivilegeLevel("post_job").name());
		out.addProperty("post_job_priority", ServerBackend.getPrivilegeLevel("post_job").name());
		out.addProperty("interact_priority", ServerBackend.getPrivilegeLevel("post_job").name());
		out.addProperty("admin_actions", ServerBackend.getPrivilegeLevel("post_job").name());
		try {
			IOUtils.saveBytes(outFile, out.toString().getBytes());
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
}
