package net.scheffers.robot.backend;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import org.java_websocket.WebSocket;
import org.java_websocket.server.WebSocketServer;

import javax.net.ssl.HttpsURLConnection;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.function.Consumer;

public class ServerBackend {

    public static Executor asyncTokenExecutor;
    public static WebSocketServer webSocketer;
    
    public static void main(String[] args) {
        asyncTokenExecutor = Executors.newFixedThreadPool(5);
        webSocketer = new WebSocketer();
    }

    public static void verifyTokenAsync(String token, Consumer<Exception> onError, Consumer<JsonObject> onSuccess) {
        asyncTokenExecutor.execute(() -> {
            try {
                onSuccess.accept(verifyToken(token));
            } catch (Exception e) {
                if (onError != null) onError.accept(e);
            }
        });
    }
    
    public static void onGoogleAuth(WebSocket conn, ClientInfo info) {
        
    }
    
    public static JsonObject verifyToken(String token) throws Exception {
        HttpsURLConnection connection = (HttpsURLConnection) new URL("https://www.googleapis.com/oauth2/v1/tokeninfo?id_token=" + token).openConnection();
        String resp = getResponseBody(connection);
        JsonObject obj = JsonParser.parseString(resp).getAsJsonObject();
        if (obj.has("error")) {
            throw new Exception("Token validation error.");
        }
        try {
            if (!obj.get("issued_to").getAsString().equals("207658472325-t0sr7q2b6l5uqkqem1ncfdhplkrrd0pd.apps.googleusercontent.com")) {
                throw new Exception("Token validation error.");
            }
            if (!obj.get("email_verified").getAsBoolean()) {
                throw new Exception("Token validation error.");
            }
            if (!obj.get("issuer").getAsString().equals("accounts.google.com")) {
                throw new Exception("Token validation error.");
            }
            if (obj.get("expires_in").getAsInt() < 10) {
                throw new Exception("Token validation error.");
            }
            if (!obj.has("user_id")) {
                throw new Exception("Token validation error.");
            }
        } catch (Exception e) {
            throw new Exception("Token validation error.", e);
        }
        return obj;
    }

    public static String getResponseBody(HttpsURLConnection con) throws Exception {
        if (con != null) {
            try {
                StringBuilder out = new StringBuilder();
                BufferedReader br = new BufferedReader(new InputStreamReader(con.getInputStream()));
                String input;
                while ((input = br.readLine()) != null) {
                    out.append(input).append("\n");
                }
                br.close();
                return out.toString();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        throw new NullPointerException("Connection input is null!");
    }

}
