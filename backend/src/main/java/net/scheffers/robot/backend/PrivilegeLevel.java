package net.scheffers.robot.backend;

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
}
