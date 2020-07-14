package net.scheffers.robot.backend.job;

import net.scheffers.robot.backend.ClientInfo;

public class Interaction implements UserOwnedObject {
	
	/** The email to notify, or null if not desired or applicable. */
	public String notaficationEmail;
	/** The user that wishes to interact. */
	public ClientInfo user;
	
	@Override
	public ClientInfo getUser() {
		return user;
	}
	
	@Override
	public void setUser(ClientInfo user) {
		this.user = user;
	}
	
	@Override
	public boolean notifyUser() {
		//TODO: send notafication e-mail
		return false;
	}
	
}
