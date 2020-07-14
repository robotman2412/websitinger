package net.scheffers.robot.backend;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import net.scheffers.robot.backend.job.JobHandshake;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

public class WebSocketer extends WebSocketServer {
    
    List<JobHandshake> handshakes;
    
    public WebSocketer() {
        handshakes = new LinkedList<>();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        ClientInfo info = new ClientInfo();
        info.isGoogleUser = false;
        info.sessionID = UUID.randomUUID().toString();
        info.ipAddress = conn.getRemoteSocketAddress().getHostString();
        conn.setAttachment(info);
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
                info.notaficationEmail = json.get("user_email").getAsString();
                ServerBackend.onGoogleAuth(conn, info);
            });
        }
        if (decoded.has("submit_job")) {
            JobHandshake handshake = ServerBackend.incomingJob(conn, decoded.get("submit_job"));
            if (handshake != null) {
                handshakes.add(handshake);
            }
        }
        if (decoded.has("continue_job") &&  decoded.get("continue_job").isJsonObject()) {
            JsonObject cont = decoded.get("continue_job").getAsJsonObject();
            if (cont.has("pid") && cont.get("pid").isJsonPrimitive()) {
                String pid = cont.get("pid").getAsString();
                for (JobHandshake handshake : handshakes) {
                    if (pid.equals(handshake.getPid())) {
                        handshake.onMessage(cont);
                        break;
                    }
                }
            }
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) {

    }

    @Override
    public void onStart() {

    }
    
}
