package websitinger;

import com.jcraft.jsch.*;

import java.io.File;
import java.io.FileInputStream;
import java.util.Properties;

public class UploadTest {
	
	public static void main(String[] args) throws Exception {
		JSch ssh = new JSch();
		Session session = ssh.getSession("pi", "robot.scheffers.net", 2224);
		session.setPassword("---");
		Properties config = new Properties();
		config.put("StrictHostKeyChecking", "no");
		session.setConfig(config);
		session.connect();
		ChannelSftp sftp = (ChannelSftp) session.openChannel("sftp");
		sftp.connect();
		sftp.cd("/home/pi/");
		File toUpload = new File("D:\\!intellij\\websitinger\\src\\websitinger\\a.txt");
		sftp.put(new FileInputStream(toUpload), "a.txt");
		sftp.exit();
		session.disconnect();
	}
	
}
