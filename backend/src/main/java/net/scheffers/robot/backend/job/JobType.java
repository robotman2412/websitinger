package net.scheffers.robot.backend.job;

public enum JobType {
	/**
	 * Run assembly program and end the job when halt is called or time runs out.
	 */
	ExecuteAsm,
	/**
	 * Run C / C++ program and end the job when program ends or time runs out.
	 */
	ExecuteC,
	/**
	 * Run python program and end the job when program ends or time runs out.
	 */
	ExecutePy,
	/**
	 * Shows a message and end the job after 15 seconds or when time runs out.
	 * If the message is too long, text compression will be used.
	 * If the message is still to long, an error program_too_long is reported to the job poster.
	 */
	ShowMessage;
	
	public static JobType get(String name) {
		for (JobType type : values()) {
			if (type.name().equalsIgnoreCase(name)) {
				return type;
			}
		}
		return null;
	}
	
}
