package net.scheffers.robot.backend.job;

import com.google.gson.JsonObject;
import net.scheffers.robot.backend.CPUType;
import org.java_websocket.WebSocket;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Future;
import java.util.function.Consumer;

public class JobHandshake {
	
	protected CPUType cpu;
	protected JobType type;
	protected String name;
	protected String pid;
	protected ExecutorService executor;
	protected String clientId;
	protected State state;
	protected List<String> requestedFiles;
	protected Map<String, String> recievedFiles;
	protected WebSocket conn;
	protected Future<?> currentTask;
	
	public JobHandshake(WebSocket conn, String clientId, CPUType cpu, JobType type, String name, String pid) {
		this.cpu = cpu;
		this.type = type;
		this.name = name;
		this.pid = pid;
		this.clientId = clientId;
		this.conn = conn;
		recievedFiles = new HashMap<>();
		requestedFiles = new LinkedList<>();
		state = State.WAITING_PROGRAM;
	}
	
	public void start(ExecutorService executor) {
		if (executor != null) {
			this.executor = executor;
			state = State.WAITING_PROGRAM;
		}
	}
	
	public void onMessage(JsonObject json) {
		if (executor == null) {
			System.err.println("Uninitialised job handshake received message.");
			return;
		}
		else if (state == State.ERRORED || state == State.CANCELLED || state == State.SUCCESS) {
			System.err.println("Closed job handshake received message.");
			return;
		}
		if (!json.has("action") || !json.get("action").isJsonPrimitive()) {
			sendError("invalid_json", "invalid json, required keys: action");
			state = State.ERRORED;
			reportError(new RuntimeException("invalid json format"));
			return;
		}
		Action action = Action.get(json.get("action").getAsString());
		if (action == null) {
			sendError("unsupported_action", "unsupported action, supported: cancel, verify, supply_program, supply_import");
			state = State.ERRORED;
			reportError(new RuntimeException("unsupported action " + json.get("action").getAsString()));
			return;
		}
		if (action == Action.CANCEL) {
			conn.send("{\"continue_job\":{\"action\":\"cancel\",\"pid\":\"" + pid + "\"}}");
			state = State.CANCELLED;
			reportCancelled();
		}
		if (state == State.WAITING_PROGRAM) {
			if (action != Action.SUPPLY_PROGRAM) {
				sendError("unexpected_action", "expected supply_program");
				state = State.ERRORED;
				reportError(new RuntimeException("unexpected action " + json.get("action").getAsString() + ", expected supply_program"));
				return;
			}
			else if (!json.has("program") || !json.get("program").isJsonPrimitive()) {
				sendError("invalid_json", "invalid json, required keys: action \"supply_program\", program");
				state = State.ERRORED;
				reportError(new RuntimeException("invalid json format"));
				return;
			}
			String program = json.get("program").getAsString();
			if (program.length() > 65536) {
				sendError("source_too_big", "source code is too big, may be 65536 big");
				state = State.ERRORED;
				reportError(new RuntimeException("source code of program is too big, " + program.length() + " / 65536"));
				return;
			}
			state = State.COMPILING;
			currentTask = executor.submit(() -> {
				startCompilation(program);
			});
		}
	}
	
	protected void sendError(String code, String message) {
		conn.send("{\"continue_job\":{\"action\":\"error\",\"errorcode\":\"" + code + "\",\"error\":\"" + message + "\",\"pid\":\"" + pid + "\"}}");
	}
	
	protected void startCompilation(String source) {
		try {
			switch (type) {
				case ExecuteAsm:
					startAsmCompilation(source);
					break;
				case ExecuteC:
					startCCompilation(source);
					break;
				case ExecutePy:
					startPyCompilation(source);
					break;
				case ShowMessage:
					startMsgCompilation(source);
					break;
			}
		} catch (Throwable err) {
			reportError(err);
		}
	}
	
	/**
	 * Working order (small enough):
	 * 0. replace tab with proper indentation
	 * 1. continue with too big instead of message stub if needed
	 * 2. package into message stub program
	 * 
	 * Working order (too big):
	 * 2. apply the best possible compression algorithm for the file
	 * 3. generate appropriate decompression program
	 */
	protected void startMsgCompilation(String source) {
		
	}
	
	/**
	 * Working order:
	 * 0. create working dir for compilation
	 * 1. scan source for imports
	 * 2. request those imports
	 * 3. repeat scanning until no new imports are found
	 * 4. copy library files to working dir
	 * 5. use compiler toolchains to compile with timeout of 10 sec
	 */
	protected void startCCompilation(String source) {
		
	}
	
	/**
	 * Working order:
	 * 0. scan source for imports
	 * 1. request those imports
	 * 2. repeat scanning until no new imports are found
	 * 3. minimise all files
	 * 4. package into python stub program
	 */
	protected void startPyCompilation(String source) {
		
	}
	
	/**
	 * Working order:
	 * 0. start pass 0 on source
	 * 1. supply lib/ imports with the appropriate library files
	 * 2. supply assembler with requested custom import files
	 * 3. run pass 1 and 2
	 */
	protected void startAsmCompilation(String source) {
		
	}
	
	//region events
	public void reportError(Throwable error) {
		System.err.println("Job handshake " + pid + " aborted: " + error.getMessage());
		
	}
	public void reportSuccess(JobHandshakeSuccess success) {
		System.err.println("job handshake " + pid + " success");
		
	}
	public void reportCancelled() {
		System.out.println("job handshake " + pid + " cancelled by peer");
	}
	
	public void onError(Consumer<Throwable> onError) {
		
	}
	
	public void onSuccess(Consumer<JobHandshakeSuccess> onSuccess) {
		
	}
	
	public void onCancelled(Runnable onCancelled) {
		
	}
	//endregion events
	
	//region getters
	public String getPid() {
		return pid;
	}
	
	public CPUType getCpu() {
		return cpu;
	}
	
	public String getName() {
		return name;
	}
	
	public JobType getType() {
		return type;
	}
	
	public String getClientId() {
		return clientId;
	}
	//endregion getters
	
	public enum State {
		WAITING_PROGRAM,
		WAITING_VERIFY,
		COMPILING,
		COMPILING_WAITING_IMPORT,
		CANCELLED,
		ERRORED,
		SUCCESS
	}
	
	public enum Action {
		SUPPLY_PROGRAM,
		SUPPLY_IMPORT,
		VERIFY,
		CANCEL;
		
		public static Action get(String name) {
			for (Action action : values()) {
				if (action.name().equalsIgnoreCase(name)) {
					return action;
				}
			}
			return null;
		}
	}
	
}
