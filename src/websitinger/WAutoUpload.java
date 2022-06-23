package websitinger;

import com.jcraft.jsch.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;

public class WAutoUpload {
	
	public static Map<String, String> extensionAliasses = new HashMap<>();
	public static Map<String, String> localToSiteDirs = new HashMap<>();
	public static Map<String, Long> lastChangeMap = new HashMap<>();
	public static JSch ssh;
	
	public static void main(String[] args) throws JSchException {
		extensionAliasses.put("php.html", "php");
		localToSiteDirs.put("/media/julian/get me data/intellij/websitinger/website/", "/var/www/html/");
		localToSiteDirs.put("/media/julian/get me data/intellij/websitinger/test/", "/var/www/test/");
		localToSiteDirs.put("/media/julian/get me data/intellij/websitinger/scripts/", "/home/pi/scripts/");
		
		ssh = new JSch();
		String passwd;
		while (true) {
			System.out.print("Enter SSH password: ");
			passwd = readPasswd();
			Session session = ssh.getSession("pi", "robot.scheffers.net", 2224);
			session.setPassword(passwd);
			Properties config = new Properties();
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			session.connect(5000);
			if (!session.isConnected()) {
				System.out.println("Connection failed.");
			}
			else
			{
				session.disconnect();
				break;
			}
		}
		
		for (Map.Entry<String, String> dirPair : localToSiteDirs.entrySet()) {
			File file = new File(dirPair.getKey());
			if (file.exists()) {
				checkUpload(file, dirPair.getValue(), passwd, ssh, true, true);
			}
		}
		
		Object lock = 1;
		while (true) {
			try {
				synchronized (lock) {
					lock.wait(100);
				}
			} catch (InterruptedException e) {
				return;
			}
			for (Map.Entry<String, String> dirPair : localToSiteDirs.entrySet()) {
				File file = new File(dirPair.getKey());
				if (file.exists()) {
					checkUpload(file, dirPair.getValue(), passwd, ssh, true, false);
				}
			}
		}
	}
	
	private static void checkUpload(File file, String remoteDir, String passwd, JSch ssh, boolean ignoreDir, boolean dryRun) {
		if (file.getAbsolutePath().endsWith("~")) {
			return; //ignore file because of reasons
		}
		if (file.isDirectory()) {
			if (ignoreDir) {
				for (File sub : file.listFiles()) {
					checkUpload(sub, remoteDir, passwd, ssh, false, dryRun);
				}
			}
			else
			{
				for (File sub : file.listFiles()) {
					checkUpload(sub, remoteDir + file.getName() + "/", passwd, ssh, false, dryRun);
				}
			}
		}
		else
		{
			if (lastChangeMap.containsKey(file.getAbsolutePath())) {
				long lastChange = lastChangeMap.get(file.getAbsolutePath());
				if (lastChange < file.lastModified()) {
					if (dryRun) {
						lastChangeMap.put(file.getAbsolutePath(), file.lastModified());
					}
					else if (fupload(file, remoteDir, passwd, ssh)) {
						lastChangeMap.put(file.getAbsolutePath(), file.lastModified());
					}
				}
			}
			else
			{
				if (dryRun) {
					lastChangeMap.put(file.getAbsolutePath(), file.lastModified());
				}
				else if (fupload(file, remoteDir, passwd, ssh)) {
					lastChangeMap.put(file.getAbsolutePath(), file.lastModified());
				}
			}
		}
	}
	
	public static String readPasswd() {
		try {
			byte[] buf = new byte[512];
			int read = 0;
			while (true) {
				System.out.print(' ');
				int in = System.in.read();
				if (in == '\b') {
					read --;
					if (read < 0) {
						read = 0;
					}
				}
				else
				{
					System.out.print("\b\b");
				}
				if (in == '\r' || in == '\n') {
					break;
				}
				buf[read] = (byte) in;
				read ++;
				if (read >= buf.length) {
					byte[] newBuf = new byte[buf.length + 512];
					System.arraycopy(buf, 0, newBuf, 0, buf.length);
					buf = newBuf;
				}
			}
			byte[] raw = new byte[read];
			System.arraycopy(buf,0, raw, 0, read);
			String s = new String(raw);
			if (s.endsWith("\r\n")) {
				return s.substring(0, s.length() - 2);
			}
			else if (s.endsWith("\n")) {
				return s.substring(0, s.length() - 1);
			}
			return s;
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}
	
	public static boolean fupload(File upload, String remoteDir, String passwd, JSch ssh) {
		String outName = upload.getName();
		if (outName.matches("^.*?\\.(jpg|jpeg)$")) {
//			try {
//				Process p = Runtime.getRuntime().exec(new String[] {"bash"});
//				InputStream stdout = p.getInputStream();
//				InputStream stderr = p.getErrorStream();
//				OutputStream os = p.getOutputStream();
//				os.write("/usr/bin/exiftool -gps:all= '".getBytes(StandardCharsets.UTF_8));
//				os.write(upload.getAbsolutePath().replace("'", "'\"''\"'").getBytes(StandardCharsets.UTF_8));
//				os.write("' ; rm '".getBytes(StandardCharsets.UTF_8));
//				os.write(upload.getAbsolutePath().replace("'", "'\"''\"'").getBytes(StandardCharsets.UTF_8));
//				os.write("_original' ; exit\n".getBytes(StandardCharsets.UTF_8));
//				os.flush();
//				while (p.isAlive()) {
//					if (stderr.available() > 0) {
//						byte[] fuck = new byte[stderr.available()];
//						stderr.read(fuck);
//						System.err.write(fuck);
//						System.err.flush();
//					}
//					if (stdout.available() > 0) {
//						byte[] fuck = new byte[stdout.available()];
//						stdout.read(fuck);
//						System.out.write(fuck);
//						System.out.flush();
//					}
//				}
//				p.waitFor(2000, TimeUnit.MILLISECONDS);
//			} catch (IOException | InterruptedException e) {
//				e.printStackTrace();
//				return false;
//			}
		}
		for (Map.Entry<String, String> alias : extensionAliasses.entrySet()) {
			if (outName.endsWith(alias.getKey())) {
				outName = outName.substring(0, outName.length() - alias.getKey().length()) + alias.getValue();
				break;
			}
		}
		System.out.println("Uploading " + upload.getAbsolutePath() + "\nTo " + remoteDir + outName);
//		if (true) {
//			return true;
//		}
		try {
			Session session = ssh.getSession("pi", "robot.scheffers.net", 2224);
			session.setPassword(passwd);
			Properties config = new Properties();
			config.put("StrictHostKeyChecking", "no");
			session.setConfig(config);
			session.connect(5000);
			if (session.isConnected()) {
				ChannelSftp sftp = (ChannelSftp) session.openChannel("sftp");
				sftp.connect(5000);
				FileInputStream in = new FileInputStream(upload);
				try {
					sftp.cd(remoteDir);
					sftp.put(in, outName, ChannelSftp.OVERWRITE);
				} catch (SftpException e) {
					sftp.mkdir(remoteDir);
					sftp.cd(remoteDir);
					sftp.put(in, outName, ChannelSftp.OVERWRITE);
				}
				in.close();
				session.disconnect();
				return true;
			}
			else
			{
				return false;
			}
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
	}
	
}
