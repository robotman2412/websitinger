package net.scheffers.robot.backend;

public enum CPUType {
	GR8CPURev2Breadboard,
	GR8CPURev3Breadboard;
	
	public static CPUType get(String name) {
		for (CPUType type : values()) {
			if (type.name().equalsIgnoreCase(name)) {
				return type;
			}
		}
		return null;
	}
}
