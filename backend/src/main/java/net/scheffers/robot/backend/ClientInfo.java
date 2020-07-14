package net.scheffers.robot.backend;

import java.util.UUID;

public class ClientInfo {
    
    public String sessionID;
    public String googleUserID;
    public String notaficationEmail;
    public String ipAddress;
    public boolean isGoogleUser;
	public PrivilegeLevel privilege;
	
	public ClientInfo() {
        sessionID = UUID.randomUUID().toString();
        isGoogleUser = false;
    }
    
}
