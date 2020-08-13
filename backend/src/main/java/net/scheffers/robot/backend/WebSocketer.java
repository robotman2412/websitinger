package net.scheffers.robot.backend;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import net.scheffers.robot.backend.io.StorageHandler;
import net.scheffers.robot.backend.job.JobHandshake;
import net.scheffers.robot.backend.user.ClientInfo;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.util.LinkedList;
import java.util.List;
import java.util.UUID;

public class WebSocketer extends WebSocketServer {
    
    List<JobHandshake> handshakes;
    
    public WebSocketer(int port) {
        super(new InetSocketAddress(port));
        handshakes = new LinkedList<>();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        ClientInfo info = new ClientInfo();
        info.isGoogleUser = false;
        info.sessionID = UUID.randomUUID().toString();
        info.ipAddress = conn.getRemoteSocketAddress().getHostString();
        info.rawPrivilege(PrivilegeLevel.Everyone);
        conn.setAttachment(info);
        StorageHandler.clientConnected(conn, info);
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        ClientInfo info = conn.getAttachment();
        ServerBackend.clientDisconnected(conn, info);
        StorageHandler.clientDisconnected(conn, info);
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
        // General status information: queue size, advertised CPU time, etc.
        if (decoded.has("get_status")) {
            ServerBackend.sendStatus(conn, info);
        }
        // Google login.
        if (decoded.has("id_token")) {
            ServerBackend.verifyTokenAsync(decoded.get("id_token").getAsString(), Exception::printStackTrace, (json) -> {
                info.isGoogleUser = true;
                info.googleUserID = json.get("user_id").getAsString();
                info.notaficationEmail = json.get("email").getAsString();
                info.googleEmail = json.get("email").getAsString();
                ServerBackend.clientGoogleAuth(conn, info);
            });
        }
        // Job submission.
        if (decoded.has("submit_job")) {
            System.out.println("Incoming job from client " + info.sessionID + ".");
            JobHandshake handshake = ServerBackend.newJobHandshake(conn, decoded.get("submit_job"));
            if (handshake != null) {
                handshakes.add(handshake);
                handshake.onCancelled(() -> {
                    handshakes.remove(handshake);
                });
                handshake.onError((err) -> {
                    handshakes.remove(handshake);
                });
                handshake.onSuccess(() -> {
                    handshakes.remove(handshake);
                });
            }
        }
        // More job submission stuff.
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
    public void onError(WebSocket conn, Exception e) {
        e.printStackTrace();
    }

    @Override
    public void onStart() {

    }
    
}
