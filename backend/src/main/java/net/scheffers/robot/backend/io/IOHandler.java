package net.scheffers.robot.backend.io;

import jutils.JUtils;
import jutils.Table;
import net.scheffers.robot.backend.PrivilegeLevel;
import net.scheffers.robot.backend.ServerBackend;
import net.scheffers.robot.backend.user.ClientInfo;
import org.java_websocket.WebSocket;

public class IOHandler {
	
	public static boolean cont;
	public static int rconPort;
	
	public static void start(int rconPort) {
		IOHandler.rconPort = rconPort;
		new Thread(IOHandler::loop).start();
	}
	
	protected static void loop() {
		cont = true;
		while (cont) {
			try {
				String in = JUtils.awaitLine("backend> ");
				accept(in.trim());
			} catch (Exception e) {
				e.printStackTrace();
				cont = false;
				sendStop(1);
				return;
			}
		}
		cont = false;
		sendStop(0);
	}
	
	public static void sendStop(int numErrors) {
		cont = false;
		if (numErrors < 0) {
			numErrors = 1;
		}
		// Filled with try/catch because we can't afford to have this method NOT work.
		if (numErrors > 0) {
			System.err.println("\n\nBackend exiting due to error...");
		}
		else
		{
			System.out.println("\n\nBackend exiting normally...");
		}
		try {
			ServerBackend.webSocketer.stop(2000);
		} catch (InterruptedException e) {
			e.printStackTrace();
			numErrors ++;
		}
		try {
			ServerBackend.asyncExecutor.shutdown();
		} catch (Exception e) {
			e.printStackTrace();
			numErrors ++;
		}
		try {
			ServerBackend.syncExecutorRev2.shutdown();
		} catch (Exception e) {
			e.printStackTrace();
			numErrors ++;
		}
		try {
			ServerBackend.syncExecutorRev3.shutdown();
		} catch (Exception e) {
			e.printStackTrace();
			numErrors ++;
		}
		try {
			Thread.sleep(1000);
		} catch (InterruptedException e) {
			e.printStackTrace();
			numErrors ++;
		}
		try {
			ServerBackend.asyncExecutor.shutdownNow();
		} catch (Exception e) {
			e.printStackTrace();
			numErrors ++;
		}
		try {
			ServerBackend.syncExecutorRev2.shutdownNow();
		} catch (Exception e) {
			e.printStackTrace();
			numErrors ++;
		}
		try {
			ServerBackend.syncExecutorRev3.shutdownNow();
		} catch (Exception e) {
			e.printStackTrace();
			numErrors ++;
		}
		Thread stopper = null;
		try {
			stopper = new Thread(StorageHandler::stop);
			stopper.start();
			stopper.join(5000);
		} catch (Exception e) {
			e.printStackTrace();
			numErrors ++;
			if (stopper != null) {
				stopper.interrupt();
			}
		}
		// Everything stopped, exit now.
		if (numErrors > 0) {
			System.err.println("\n\nBackend exiting with " + numErrors + " error" + (numErrors != 1 ? "s" : "") + ".");
			System.exit(1);
		}
		else
		{
			System.out.println("\n\nBackend exiting without errors.");
			System.exit(0);
		}
	}
	
	public static void accept(String in) {
		String[] split = JUtils.splitRespectStrings(in, ' ');
		if (split.length == 1) {
			dispatchCommand(split[0]);
		}
		else
		{
			String[] args = new String[split.length - 1];
			System.arraycopy(split, 1, args, 0, args.length);
			dispatchCommand(split[0], args);
		}
	}
	
	public static void dispatchCommand(String command, String... arguments) {
		if (arguments == null) {
			arguments = new String[0];
		}
		command = command.toLowerCase();
		if (command.length() == 0) {
			return;
		}
		if (command.equalsIgnoreCase("exit") || command.equalsIgnoreCase("stop")) {
			if (arguments.length > 0) {
				System.out.println("Arguments ignored.");
			}
			sendStop(0);
		}
		else if (command.equals("getlevel")) {
			dispatchCmd_getLevel(arguments);
		}
		else if (command.equals("setlevel")) {
			if (arguments.length != 2) {
				System.out.println("\"" + command + "\" expected: [what] [level]\n" +
						"what: post_job OR interact OR post_job_priority OR interact_priority OR admin_actions\n" +
						"level: Everyone OR LoggedIn OR Donator OR Operator OR Admin OR Owner"
				);
			}
			else
			{
				dispatchCmd_setLevel(arguments[0], arguments[1]);
			}
		}
		else if (command.equals("getprivilege")) {
			if (arguments.length != 1) {
				System.out.println("\"" + command + "\" expected: [user]\n" +
						"user: google account email of a google user"
				);
			}
			else
			{
				dispatchCmd_getPrivilege(arguments[0]);
			}
		}
		else if (command.equals("setprivilege")) {
			if (arguments.length != 2) {
				System.out.println("\"" + command + "\" expected: [user] [level]\n" +
						"user: google account email of a google user\n" +
						"level: Everyone OR LoggedIn OR Donator OR Operator OR Admin OR Owner"
				);
			}
			else
			{
				dispatchCmd_setPrivilege(arguments[0], arguments[1]);
			}
		}
		else if (command.equals("help")) {
			dispatchCmd_help();
		}
		else
		{
			System.out.println("No such command.");
			dispatchCmd_help();
		}
	}
	
	//region commands
	
	public static void dispatchCmd_help() {
		System.out.println("Available commands:\n" +
				"getlevel (what...) - Get the privilege level for privileged actions.\n" +
				"setlevel [what] [level] - Set the privilege level for privileged actions.\n" +
				"getprivilege [email] - Get the privilege of the specified user by email.\n" +
				"setprivilege [email] [level] - Set the privilege of the specified user by email.\n" +
				"stop, exit - Stop the backend."
		);
	}
	
	public static void dispatchCmd_getLevel(String... forWhat) {
		if (forWhat.length == 0) {
			forWhat = new String[] {
					"post_job",
					"interact",
					"post_job_priority",
					"interact_priority",
					"admin_actions"
			};
		}
		Table table = new Table();
		table.add("WHAT", "LEVEL", "NAME");
		for (String what : forWhat) {
			PrivilegeLevel level = ServerBackend.getPrivilegeLevel(what.toLowerCase());
			if (level == null) {
				table.add(what, "", "No such privileged action.");
			}
			else
			{
				table.add(what, level.level, level.name());
			}
		}
		table.print(3);
	}
	
	public static void dispatchCmd_setLevel(String what, String sLevel) {
		PrivilegeLevel level = PrivilegeLevel.get(sLevel);
		if (level == null) {
			System.out.println("No such privilege level \"" + sLevel + "\"\navailable: Everyone, LoggedIn, Donator, Operator, Admin, Owner");
			return;
		}
		if (ServerBackend.setPrivilegeLevel(what.toLowerCase(), level)) {
			System.out.println("Set privilege level for \"" + what + "\" to: " + level.name());
			StorageHandler.levelsUnsaved = true;
		}
		else
		{
			System.out.println("No such privileged action \"" + what + "\".");
		}
	}
	
	public static void dispatchCmd_getPrivilege(String email) {
		ClientInfo info = null;
		for (WebSocket soc : ServerBackend.webSocketer.getConnections()) {
			ClientInfo c = soc.getAttachment();
			if (c.isGoogleUser && c.googleEmail.equals(email)) {
				info = c;
				break;
			}
		}
		//TODO: LUT for email to google ID and then loading from the storage
		if (info == null) {
			System.out.println("No such user \"" + email + "\", you can assume LoggedIn.");
		}
		else
		{
			System.out.println("User \"" + info.googleEmail + "\" has privilege level: " + info.getPrivilege().name());
		}
	}
	
	public static void dispatchCmd_setPrivilege(String email, String sLevel) {
		PrivilegeLevel level = PrivilegeLevel.get(sLevel);
		if (level == null) {
			System.out.println("No such privilege level \"" + sLevel + "\"\navailable: Everyone, LoggedIn, Donator, Operator, Admin, Owner");
			return;
		}
		ClientInfo info = null;
		for (WebSocket soc : ServerBackend.webSocketer.getConnections()) {
			ClientInfo c = soc.getAttachment();
			if (c.isGoogleUser && c.googleEmail.equals(email)) {
				info = c;
				break;
			}
		}
		//TODO: LUT for email to google ID and then loading from the storage
		if (info == null) {
			System.out.println("No such user \"" + email + "\", you can assume LoggedIn.");
		}
		else
		{
			System.out.println("Set privilege level for user \"" + info.googleEmail + "\" to: " + level.name());
			info.setPrivilege(level);
		}
	}
	
	//endregion commands
	
}
