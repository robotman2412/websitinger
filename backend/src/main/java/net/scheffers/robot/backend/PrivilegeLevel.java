package net.scheffers.robot.backend;

import net.scheffers.robot.backend.job.JobType;

public enum PrivilegeLevel {
	/** Every guest. */
	Everyone(0),
	/** Every guest signed in with google. */
	LoggedIn(10),
	/** Has donated. */
	Donator(20),
	/** Has been assigned the role of operator. */
	Operator(30),
	/** Has been assigned the role of administrator. */
	Admin(40),
	/** The owner and close friends. */
	Owner(50);
	
	public final int level;
	
	PrivilegeLevel(int level) {
		this.level = level;
	}
	
	public static PrivilegeLevel get(String name) {
		for (PrivilegeLevel type : values()) {
			if (type.name().equalsIgnoreCase(name)) {
				return type;
			}
		}
		return null;
	}
	
	
}
