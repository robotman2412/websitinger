package net.scheffers.robot.backend;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

public class WebSocketer extends WebSocketServer {
    
    public WebSocketer() {
        
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        conn.setAttachment(new ClientInfo());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        ClientInfo info = conn.getAttachment(); 
        JsonObject decoded;
        try {
            decoded = JsonParser.parseString(message).getAsJsonObject();
        } catch (Exception e) {
            e.printStackTrace();
            return;
        }
        if (decoded.has("id_token")) {
            ServerBackend.verifyTokenAsync(decoded.get("id_token").getAsString(), Exception::printStackTrace, (json) -> {
                info.isGoogleUser = true;
                info.googleUserID = json.get("user_id").getAsString();
                ServerBackend.onGoogleAuth(conn, info);
            });
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {

    }

    @Override
    public void onStart() {

    }
    
}
