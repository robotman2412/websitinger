package net.scheffers.robot.backend;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jutils.JUtils;
import net.scheffers.robot.backend.job.*;
import org.java_websocket.WebSocket;
import org.java_websocket.server.WebSocketServer;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class ServerBackend {
	
	public static String basePath;
	public static ExecutorService asyncExecutor;
	public static WebSocketServer webSocketer;
	
	public static UserQueue<Job> jobsRev2;
	public static UserQueue<Job> jobsRev3;
	public static UserQueue<Interaction> interactRev2;
	public static UserQueue<Interaction> interactRev3;
	
	public static PrivilegeLevel jobSubmitPrivilege;
	public static PrivilegeLevel interactPrivilege;
	
	public static void main(String[] args) {
		JUtils.getArgs(args);
		if (!JUtils.getArg("workdir").equals("null")) {
			basePath = JUtils.getArg("workdir");
		}
		else
		{
			basePath = System.getProperty("user.dir");
		}
		if (!basePath.matches("[\\\\/]$")) {
			basePath += "/";
		}
		asyncExecutor = Executors.newFixedThreadPool(15);
		webSocketer = new WebSocketer();
	}
	
	public static void verifyTokenAsync(String token, Consumer<Exception> onError, Consumer<JsonObject> onSuccess) {
		asyncExecutor.execute(() -> {
			try {
				onSuccess.accept(verifyToken(token));
			} catch (Exception e) {
				if (onError != null) onError.accept(e);
			}
		});
	}
	
	public static void onGoogleAuth(WebSocket conn, ClientInfo info) {
		jobsRev2.userConnected(info);
		jobsRev3.userConnected(info);
		interactRev2.userConnected(info);
		interactRev3.userConnected(info);
	}
	
	public static JsonObject verifyToken(String token) throws Exception {
		HttpsURLConnection connection = (HttpsURLConnection) new URL("https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=" + token).openConnection();
		String resp = getResponseBody(connection);
		JsonObject obj = JsonParser.parseString(resp).getAsJsonObject();
		if (obj.has("error")) {
			throw new Exception("Token validation error.");
		}
		try {
			if (!obj.get("issued_to").getAsString().equals("207658472325-t0sr7q2b6l5uqkqem1ncfdhplkrrd0pd.apps.googleusercontent.com")) {
				throw new Exception("Token validation error.");
			}
			if (!obj.get("email_verified").getAsBoolean()) {
				throw new Exception("Token validation error.");
			}
			if (!obj.get("issuer").getAsString().equals("accounts.google.com")) {
				throw new Exception("Token validation error.");
			}
			if (obj.get("expires_in").getAsInt() < 10) {
				throw new Exception("Token validation error.");
			}
			if (!obj.has("user_id")) {
				throw new Exception("Token validation error.");
			}
		} catch (Exception e) {
			throw new Exception("Token validation error.", e);
		}
		return obj;
	}
	
	public static String getResponseBody(HttpsURLConnection con) throws Exception {
		if (con != null) {
			try {
				StringBuilder out = new StringBuilder();
				BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
				String input;
				while ((input = br.readLine()) != null) {
					out.append(input).append("\n");
				}
				br.close();
				return out.toString();
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		throw new NullPointerException("Connection input is null!");
	}
	
	public static JobHandshake incomingJob(WebSocket conn, JsonElement raw) {
		//check client privileges
		ClientInfo info = conn.getAttachment();
		//TODO: check for job limit
		if (info.privilege.level < jobSubmitPrivilege.level) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"unauthorised\",\"error\":\"you are currently not authorsed to post a job\"}}");
			System.err.println("Client " + info.sessionID + " gets unauthorised on job submission.");
			return null;
		}
		//check JSON validity
		if (!raw.isJsonObject()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\",\"error\":\"json object required, with keys: type, cpu, name, respid\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: json format invalid.");
			return null;
		}
		JsonObject json = raw.getAsJsonObject();
		if (!json.has("respid") || !json.get("respid").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\",\"error\":\"json object required, with keys: type, cpu, name, respid\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: json format invalid.");
			return null;
		}
		//gets used only in the first confirmation messages
		String respid = json.get("respid").getAsString();
		if (!respid.matches("[a-zA-Z0-9_]{1,64}")) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_respid\",\"error\":\"respid does not match format: alphanumeric and underscore, 1 to 64 long\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: respid format invalid.");
			return null;
		}
		//if we don't get to this point, the job poster cannot tell which job fails
		if (!json.has("type") || !json.get("type").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\"," +
					"\"error\":\"json object required, with keys: type, cpu, name, respid\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: json format invalid");
			return null;
		}
		if (!json.has("cpu") || !json.get("cpu").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\"," +
					"\"error\":\"json object required, with keys: type, cpu, name, respid\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: json format invalid.");
			return null;
		}
		if (!json.has("name") || !json.get("name").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\"," +
					"\"error\":\"json object required, with keys: type, cpu, name, respid\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: json format invalid.");
			return null;
		}
		String sType = json.get("type").getAsString();
		String sCpu = json.get("cpu").getAsString();
		//we'll accept any name, but we will make it follow a set format
		String name = json.get("name").getAsString();
		//make it not too long
		if (name.length() > 32) {
			name = name.subSequence(0, 32) + "...";
		}
		//escape HTML stuffs
		name = name.replaceAll("&", "&and;");
		name = name.replaceAll("<", "&lt;");
		name = name.replaceAll(">", "&gt;");
		//escape non-ascii stuff
		name = name.replaceAll("\\t", " ");
		name = name.replaceAll("[^a-zA-Z0-9!@#$%^&*()\\-=_+\\[\\]{};:\'\",./<>? ]", "_");
		CPUType cpu = CPUType.get(sCpu);
		JobType type = JobType.get(sType);
		//check job and CPU types
		if (cpu == null) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"unsupported_cpu\"," +
					"\"error\":\"CPU type not supported, supported types: GR8CPURev2Breadboard, GR8CPURev3Breadboard\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: unsupported CPU type.");
			return null;
		}
		else if (type == null) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"unsupported_job\"," +
					"\"error\":\"job type not supported, supported types: ExecuteAsm, ExecuteC, ExecutePy, ShowMessage\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: unsupported job type.");
			return null;
		}
		else if (cpu == CPUType.GR8CPURev2Breadboard && type == JobType.ExecuteC) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"cpu_unsupported_job\"," +
					"\"error\":\"job type ExecuteC not supported by CPU, supported types: ExecuteAsm, ShowMessage\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: unsupported job type for CPU.");
			return null;
		}
		else if (cpu == CPUType.GR8CPURev2Breadboard && type == JobType.ExecutePy) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"cpu_unsupported_job\"," +
					"\"error\":\"job type ExecutePy not supported by CPU, supported types: ExecuteAsm, ShowMessage\",\"respid\":\"" + respid + "\"}");
			System.err.println("Client " + info.sessionID + " gets error on job submission: unsupported job type for CPU.");
			return null;
		}
		//job submission is OK so far, we go to the next step
		String pid = UUID.randomUUID().toString();
		//this does should prompt sending the program
		conn.send("{\"ack_job\":{\"action\":\"ok\",\"pid\":\"" + pid + "\",\"respid\":\"" + respid + "\"}}");
		System.out.println("Client " + info.sessionID + " gets job handshake " + pid + " initialised.");
		JobHandshake handshake = new JobHandshake(conn, info.sessionID, cpu, type, name, pid);
		handshake.start(asyncExecutor);
		return handshake;
	}
	
}
