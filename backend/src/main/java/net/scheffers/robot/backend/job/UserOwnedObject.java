package net.scheffers.robot.backend.job;

import net.scheffers.robot.backend.ClientInfo;

public interface UserOwnedObject {
	
	ClientInfo getUser();
	
	void setUser(ClientInfo user);
	
	default boolean notifyUser() {
		return false;
	}
	
	default boolean isOwnedByUser(ClientInfo user) {
		ClientInfo myUser = getUser();
		if (user == null || myUser == null) {
			return false;
		}
		else if (user == myUser) {
			return true;
		}
		else if (user.isGoogleUser && myUser.isGoogleUser) {
			return myUser.googleUserID.equals(user.googleUserID);
		}
		else
		{
			return user.ipAddress.equals(myUser.ipAddress);
		}
	}
	
}
