package net.scheffers.robot.backend;

import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import jutils.JUtils;
import net.scheffers.robot.backend.io.IOHandler;
import net.scheffers.robot.backend.io.StorageHandler;
import net.scheffers.robot.backend.itf.BackendInterface;
import net.scheffers.robot.backend.job.*;
import net.scheffers.robot.backend.user.ClientInfo;
import org.java_websocket.WebSocket;
import org.java_websocket.server.WebSocketServer;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class ServerBackend {
	
	public static String basePath;
	public static ExecutorService asyncExecutor;
	public static ExecutorService syncExecutorRev2;
	public static ExecutorService syncExecutorRev3;
	public static WebSocketServer webSocketer;
	
	public static UserQueue<Job> jobsRev2;
	public static UserQueue<Job> jobsRev3;
	public static UserQueue<Interaction> interactRev2;
	public static UserQueue<Interaction> interactRev3;
	
	public static PrivilegeLevel jobSubmitLevel = PrivilegeLevel.Donator;
	public static PrivilegeLevel interactLevel = PrivilegeLevel.LoggedIn;
	public static PrivilegeLevel jobSubmitPrivilegeLevel = PrivilegeLevel.Operator;
	public static PrivilegeLevel interactPrivilegeLevel = PrivilegeLevel.Operator;
	public static PrivilegeLevel adminActionsLevel = PrivilegeLevel.Operator;
	
	public static CPUStatus statusRev2;
	public static CPUStatus statusRev3;
	
	public static boolean hideUnauthorisedWarnings = false;
	
	public static void main(String[] args) {
		JUtils.getArgs(args);
		if (!JUtils.getArg("help").equals("null") || !JUtils.getArg("h").equals("null")) {
			System.out.println("Server backend options:\n" +
					"    SHORT               VERBOSE                   DESCRIPTION\n" +
					"    -wp port            -websocport port          Change the port for websockets." +
					"    -rp port            -remoteport port          Change the port for remote access, both for server and client." +
					"    -a hostname:port    -address hostname:port    Change the address of the remote backend to connect to.\n" +
					"    -r                  -remote                   Connect with an existing instance to see stdout and execute commands.\n" +
					"    -c \"command\"                                  Quickly send a command to the backend.\n" +
					"    -wd \"/path/\"        -workdir \"/path/\"         Set the working directory.\n\n" +
					"Defaults:\n" +
					"    SHORT               VERBOSE                   DESCRIPTION\n" +
					"    -wp 8512            -websocport 8512          The default websocket port is 8512.\n" +
					"    -rp 8511            -remoteport 8511          The default remote access port is 8511.\n" +
					"    -a 127.0.0.1:8511   -address 127.0.0.1:8511   The default remote backend is at localhost:8511.\n" +
					"    -wd \"$(pwd)\"        -workdir \"$(pwd)\"         The default working directory is the same as that of the shell (even for windows).\n\n" +
					"When connected to the backend, you can enter \"dis\" or \"disconnect\" to disconnect without stopping the backend."
			);
			return;
		}
		System.out.println("Backend starting...");
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
		System.out.println("Executors...");
		jobsRev2 = new UserQueue<>();
		jobsRev3 = new UserQueue<>();
		interactRev2 = new UserQueue<>();
		interactRev3 = new UserQueue<>();
		asyncExecutor = Executors.newFixedThreadPool(15);
		syncExecutorRev2 = Executors.newFixedThreadPool(1);
		syncExecutorRev3 = Executors.newFixedThreadPool(1);
		statusRev2 = new CPUStatus();
		statusRev2.isHardwareWorking = false;
		statusRev2.isSoftwareWorking = false;
		statusRev2.wasPlanned = true;
		statusRev2.reason = "CPU control is still being set up.";
		statusRev3 = new CPUStatus();
		statusRev3.isHardwareWorking = false;
		statusRev3.isSoftwareWorking = false;
		statusRev3.wasPlanned = true;
		statusRev3.reason = "Revision 3 is not built.";
		System.out.println("Services...");
		StorageHandler.start();
		BackendInterface.startServer();
		webSocketer = new WebSocketer(8512);
		webSocketer.start();
		IOHandler.start(8511);
		System.out.println("Done!");
		Thread.currentThread().setPriority(Thread.MIN_PRIORITY);
		Object lock = 0;
		List<JobHandshake> toRemove = new LinkedList<>();
		while (true) {
			toRemove.clear();
			synchronized (JobHandshake.runningJobs) {
				long timeout = System.currentTimeMillis() - 20000; //20 seconds
				for (JobHandshake handshake : JobHandshake.runningJobs) {
					if (timeout > handshake.getStartTime()) {
						handshake.cancelByTimeout();
						toRemove.add(handshake);
					}
				}
				JobHandshake.runningJobs.removeAll(toRemove);
			}
			try {
				synchronized (lock) {
					lock.wait(500);
				}
			} catch (InterruptedException e) {
				IOHandler.sendStop(1);
				break;
			}
		}
	}
	
	/**
	 * Returns the privilege level for <code>what</code>, or null if none exists.
	 * @param what What we want the privilege level of.
	 * @return The privilege level for <code>what</code>, or null if none exists.
	 */
	public static PrivilegeLevel getPrivilegeLevel(String what) {
		switch (what) {
			case ("post_job"):
				return jobSubmitLevel;
			case ("interact"):
				return interactLevel;
			case ("post_job_priority"):
				return jobSubmitPrivilegeLevel;
			case ("interact_priority"):
				return interactPrivilegeLevel;
			case ("admin_actions"):
				return adminActionsLevel;
		}
		return null;
	}
	
	/**
	 * Sets the privilege level for <code>what</code>.
	 * @param what What to set the privilege level for.
	 * @param level The privilege level to set.
	 * @return Whether or not the action was successful.
	 */
	public static boolean setPrivilegeLevel(String what, PrivilegeLevel level) {
		switch (what) {
			case ("post_job"):
				jobSubmitLevel = level;
				return true;
			case ("interact"):
				interactLevel = level;
				return true;
			case ("post_job_priority"):
				jobSubmitPrivilegeLevel = level;
				return true;
			case ("interact_priority"):
				interactPrivilegeLevel = level;
				return true;
			case ("admin_actions"):
				adminActionsLevel = level;
				return true;
		}
		return false;
	}
	
	public static void clientConnected(WebSocket conn, ClientInfo info) {
		interactRev2.userConnected(info);
		interactRev3.userConnected(info);
	}
	
	public static void clientDisconnected(WebSocket conn, ClientInfo info) {
		interactRev2.userDisconnected(info);
		interactRev3.userDisconnected(info);
	}
	
	public static void clientGoogleAuth(WebSocket conn, ClientInfo info) {
		jobsRev2.userConnected(info);
		jobsRev3.userConnected(info);
		interactRev2.userConnected(info);
		interactRev3.userConnected(info);
		info.rawPrivilege(PrivilegeLevel.LoggedIn);
		StorageHandler.clientLogin(conn, info);
		System.out.println("Client " + info.sessionID + " logged in with google as \"" + info + "\".");
	}
	
	//region tokens
	public static void verifyTokenAsync(String token, Consumer<Exception> onError, Consumer<JsonObject> onSuccess) {
		asyncExecutor.execute(() -> {
			try {
				onSuccess.accept(verifyToken(token));
			} catch (Exception e) {
				if (onError != null) onError.accept(e);
			}
		});
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
	//endregion tokens
	
	/**
	 * Initiates a new job handshake.
	 * @param conn The websocket connection which wants to submit a job.
	 * @param raw The initial message, decoded as JSON.
	 * @return The initiated job handshake, or null if there was a problem.
	 */
	public static JobHandshake newJobHandshake(WebSocket conn, JsonElement raw) {
		ClientInfo info = conn.getAttachment();
		//TODO: check for job limit
		//check authorisation
		if (info.getPrivilege().level < jobSubmitLevel.level) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"unauthorised\",\"error\":\"you are currently not authorsed to post a job\"}}");
			if (!hideUnauthorisedWarnings) {
				System.err.println("Client " + info + " gets unauthorised on job submission.");
			}
			return null;
		}
		//check JSON validity
		if (!raw.isJsonObject()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\",\"error\":\"json object required, with keys: type, cpu, name, respid\"}}");
			System.err.println("Client " + info + " gets error on job submission: json format invalid.");
			return null;
		}
		JsonObject json = raw.getAsJsonObject();
		if (!json.has("respid") || !json.get("respid").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\",\"error\":\"json object required, with keys: type, cpu, name, respid\"}}");
			System.err.println("Client " + info + " gets error on job submission: json format invalid.");
			return null;
		}
		//gets used only in the first confirmation messages
		String respid = json.get("respid").getAsString();
		if (!respid.matches("[a-zA-Z0-9_]{1,64}")) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_respid\",\"error\":\"respid does not match format: alphanumeric and underscore, 1 to 64 long\"}}");
			System.err.println("Client " + info + " gets error on job submission: respid format invalid.");
			return null;
		}
		//if we don't get to this point, the job poster cannot tell which job fails
		if (!json.has("type") || !json.get("type").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\"," +
					"\"error\":\"json object required, with keys: type, cpu, name, respid\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info + " gets error on job submission: json format invalid");
			return null;
		}
		if (!json.has("cpu") || !json.get("cpu").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\"," +
					"\"error\":\"json object required, with keys: type, cpu, name, respid\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info + " gets error on job submission: json format invalid.");
			return null;
		}
		if (!json.has("name") || !json.get("name").isJsonPrimitive()) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"invalid_json\"," +
					"\"error\":\"json object required, with keys: type, cpu, name, respid\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info + " gets error on job submission: json format invalid.");
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
			System.err.println("Client " + info + " gets error on job submission: unsupported CPU type.");
			return null;
		}
		else if (type == null) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"unsupported_job\"," +
					"\"error\":\"job type not supported, supported types: ExecuteAsm, ExecuteC, ExecutePy, ShowMessage\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info + " gets error on job submission: unsupported job type.");
			return null;
		}
		else if (cpu == CPUType.GR8CPURev2Breadboard && type == JobType.ExecuteC) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"cpu_unsupported_job\"," +
					"\"error\":\"job type ExecuteC not supported by CPU, supported types: ExecuteAsm, ShowMessage\",\"respid\":\"" + respid + "\"}}");
			System.err.println("Client " + info + " gets error on job submission: unsupported job type for CPU.");
			return null;
		}
		else if (cpu == CPUType.GR8CPURev2Breadboard && type == JobType.ExecutePy) {
			conn.send("{\"ack_job\":{\"action\":\"error\",\"errorcode\":\"cpu_unsupported_job\"," +
					"\"error\":\"job type ExecutePy not supported by CPU, supported types: ExecuteAsm, ShowMessage\",\"respid\":\"" + respid + "\"}");
			System.err.println("Client " + info + " gets error on job submission: unsupported job type for CPU.");
			return null;
		}
		//job submission is OK so far, we go to the next step
		String pid = UUID.randomUUID().toString();
		//this does should prompt sending the program
		conn.send("{\"ack_job\":{\"action\":\"ok\",\"pid\":\"" + pid + "\",\"respid\":\"" + respid + "\"}}");
		System.out.println("Client " + info + " gets job handshake " + pid + " initialised.");
		JobHandshake handshake = new JobHandshake(conn, info, cpu, type, name, pid, 300000);
		handshake.start(asyncExecutor);
		return handshake;
	}
	
	/**
	 * Recieves a new job that is ready to run.
	 * @param cpu The cpu for which the job is made.
	 * @param job The job to run.
	 * @param conn The websocket to send confirmation to.
	 */
	public static void newJobMade(CPUType cpu, Job job, WebSocket conn) {
		if (cpu == CPUType.GR8CPURev2Breadboard) {
			syncExecutorRev2.submit(() -> {
				if (jobsRev2.isEmpty()) {
					conn.send("{\"continue_job\":{\"action\":\"verify_run_now\",\"deserved_millis\":" + job.deservedMillis + ",\"pid\":\"" + job.pid + "\"}}");
					//TODO: run now
				}
				else
				{
					conn.send("{\"continue_job\":{\"action\":\"verify_in_queue\",\"deserved_millis\":" + job.deservedMillis + ",\"pid\":\"" + job.pid + "\"}}");
					jobsRev2.add(job);
				}
			});
		}
		else if (cpu == CPUType.GR8CPURev3Breadboard) {
			syncExecutorRev3.submit(() -> {
				if (jobsRev3.isEmpty()) {
					conn.send("{\"continue_job\":{\"action\":\"verify_run_now\",\"deserved_millis\":" + job.deservedMillis + ",\"pid\":\"" + job.pid + "\"}}");
					//TODO: run now
				}
				else
				{
					conn.send("{\"continue_job\":{\"action\":\"verify_in_queue\",\"deserved_millis\":" + job.deservedMillis + ",\"pid\":\"" + job.pid + "\"}}");
					jobsRev3.add(job);
				}
			});
		}
	}
	
	/**
	 * Sends a quick status update to the websocket connection.<br>
	 * This contains:
	 * <ul>
	 *     <li>The online status of both CPUs,</li>
	 *     <li>The CPU time gotten if a job is submitted now,</li>
	 *     <li>The size of each queue,</li>
	 *     <li>The actions which the user may perform.</li>
	 * </ul>
	 * @param conn The websocket connection to send to.
	 * @param info The client info associated with the websocket connection.
	 */
	public static void sendStatus(WebSocket conn, ClientInfo info) {
		JsonObject resp = new JsonObject();
		resp.add("status_r2", statusRev2.toJson());
		resp.add("status_r3", statusRev3.toJson());
		resp.addProperty("advertised_millis_r2", 0);
		resp.addProperty("advertised_millis_r3", 0);
		String sJobPrivilege = "disallowed";
		if (info.getPrivilege().level >= jobSubmitPrivilegeLevel.level) {
			sJobPrivilege = "priority";
		}
		else if (info.getPrivilege().level >= jobSubmitLevel.level) {
			sJobPrivilege = "normal";
		}
		String sInteractPrivilege = "disallowed";
		if (info.getPrivilege().level >= interactPrivilegeLevel.level) {
			sInteractPrivilege = "priority";
		}
		else if (info.getPrivilege().level >= interactLevel.level) {
			sInteractPrivilege = "normal";
		}
		resp.addProperty("your_job_privilege", sJobPrivilege);
		resp.addProperty("your_interact_privilege", sInteractPrivilege);
		JsonObject sizes = new JsonObject();
		sizes.addProperty("rev2_interact_normal", interactRev2.size());
		sizes.addProperty("rev3_interact_normal", interactRev3.size());
		sizes.addProperty("rev2_jobs_normal", jobsRev2.size());
		sizes.addProperty("rev3_jobs_normal", jobsRev3.size());
		resp.add("queue_sizes", sizes);
		conn.send(resp.toString());
	}
	
}
