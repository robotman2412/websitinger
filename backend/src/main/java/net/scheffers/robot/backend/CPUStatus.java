package net.scheffers.robot.backend;

import com.google.gson.JsonObject;

public class CPUStatus {
	
	public boolean isOnline;
	public boolean isHardwareWorking;
	public boolean isSoftwareWorking;
	public boolean wasPlanned;
	
	public String reason;
	
	public CPUStatus() {
		isOnline = false;
		isHardwareWorking = true;
		isSoftwareWorking = true;
		wasPlanned = false;
		reason = "Unknown.";
	}
	
	public JsonObject toJson() {
		JsonObject out = new JsonObject();
		out.addProperty("online", isOnline);
		out.addProperty("hardware_working", isHardwareWorking);
		out.addProperty("software_working", isSoftwareWorking);
		out.addProperty("planned", wasPlanned);
		out.addProperty("reason", reason);
		return out;
	}
	
}
