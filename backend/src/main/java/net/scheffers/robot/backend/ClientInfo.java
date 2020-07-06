package net.scheffers.robot.backend;

import java.util.UUID;

public class ClientInfo {
    
    String sessionID;
    String googleUserID;
    boolean isGoogleUser;

    public ClientInfo() {
        sessionID = UUID.randomUUID().toString();
        isGoogleUser = false;
    }
    
}
