package net.scheffers.robot.backend.user;

import net.scheffers.robot.backend.PrivilegeLevel;
import net.scheffers.robot.backend.io.StorageHandler;

import java.util.UUID;

public class ClientInfo {
    
    public String sessionID;
	public String googleUserID;
	public String googleEmail;
    public String notaficationEmail;
    public String ipAddress;
    public boolean isGoogleUser;
	protected PrivilegeLevel privilege;
	
	public ClientInfo() {
        sessionID = UUID.randomUUID().toString();
        isGoogleUser = false;
    }
	
	@Override
	public String toString() {
		if (isGoogleUser) {
			return googleEmail;
		}
		return sessionID;
	}
	
	public PrivilegeLevel getPrivilege() {
		return privilege;
	}
	
	public void rawPrivilege(PrivilegeLevel privilege) {
		this.privilege = privilege;
	}
	
	public void setPrivilege(PrivilegeLevel privilege) {
		if (privilege != this.privilege) {
			this.privilege = privilege;
			StorageHandler.unsavedClients.add(this);
		}
	}
	
	@Override
	public int hashCode() {
		return sessionID.hashCode();
	}
	
}
