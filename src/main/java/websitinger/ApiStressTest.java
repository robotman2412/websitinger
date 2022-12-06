package websitinger;

import javax.net.ssl.*;
import java.io.*;
import java.net.*;
import java.util.*;

public class ApiStressTest {

    static String requestUri = "https://valthe.scheffers.net/testing/gamemch/";
    static int reqPerSec = 50;

    public static void main(String[] args) {
        while (true) {
            long delay = 1000 / reqPerSec;
            apiCallHiscore();
            try {
                Thread.sleep(delay);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            }
        }
    }

    public static String urlencode(Object raw0) {
        // Valid in URL.
        String valid = "qwertyuiopasdfghjklzxcvbnm1234567890_QWERTYUIOPASDFGHJKLZXCVBNM";
        StringBuilder out = new StringBuilder();
        for (char c : (raw0+"").toCharArray()) {
            if (!valid.contains("" + c)) {
                // Replace invalid with hex codes.
                out.append(String.format("%%%02x", (int) c));
            } else {
                // Simple append.
                out.append(c);
            }
        }
        // Back to a normal string.
        return out.toString();
    }

    public static boolean makeApiCall(Map<String, Object> params) throws IOException {
        // Build request URI.
        String uri = requestUri;
        if (params.size() > 0) {
            // Find parameters.
            String[] keys = params.keySet().toArray(new String[0]);
            // First parameter.
            uri += '?' + urlencode(keys[0]) + '=' + urlencode(params.get(keys[0]));
            // Other parameters.
            for (int i = 1; i < keys.length; i++) {
                uri += '&' + urlencode(keys[i]) + '=' + urlencode(params.get(keys[i]));
            }
        }

        HttpsURLConnection conn = (HttpsURLConnection) new URL(uri).openConnection();
        conn.getResponseMessage();
        return true;
    }

    public static boolean apiCallRegister() {
        String id = "id"+new Random().nextInt(1<<30);
        Map<String, Object> params = new HashMap<>();
        params.put("id", id);
        params.put("register", "TheNickName");
        try {
            return makeApiCall(params);
        } catch (IOException e) {
            return false;
        }
    }

    public static boolean apiCallHiscore() {
        Map<String, Object> params = new HashMap<>();
        params.put("info", "hiscore");
        try {
            return makeApiCall(params);
        } catch (IOException e) {
            return false;
        }
    }

}
