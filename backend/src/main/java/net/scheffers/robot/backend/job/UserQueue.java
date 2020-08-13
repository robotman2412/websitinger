package net.scheffers.robot.backend.job;

import net.scheffers.robot.backend.user.ClientInfo;

import java.util.LinkedList;
import java.util.List;

public class UserQueue<Data extends UserOwnedObject> {
	
	LinkedList<Data> list;
	
	public UserQueue() {
		list = new LinkedList<>();
	}
	
	/**
	 * Checks for the objects previously owned by the user and sets their user if matched.
	 * @param info the user that just connected
	 * @return the objects that the user owns in this queue 
	 */
	public List<Data> userConnected(ClientInfo info) {
		List<Data> owned = new LinkedList<>();
		for (Data data : list) {
			if (data.isOwnedByUser(info)) {
				owned.add(data);
				data.setUser(info);
			}
		}
		return owned;
	}
	
	/**
	 * Removes all objects the user has in case that the user is not authenticated with google.
	 * Not required to be called.
	 * @param info the user that just disconnected
	 * @return the objects just removed, or an empty array if none removed, or null if the user was logged in with google
	 */
	public List<Data> userDisconnected(ClientInfo info) {
		if (info.isGoogleUser) {
			return null;
		}
		List<Data> toRemove = new LinkedList<>();
		for (Data data : list) {
			if (data.isOwnedByUser(info)) {
				toRemove.add(data);
			}
		}
		list.removeAll(toRemove);
		return toRemove;
	}
	
	/**
	 * Gets the first next owned object in the queue without notifying it or modifying the queue.
	 * @return the first object, or null if there is none
	 */
	public Data peek() {
		return list.size() > 0 ? list.getFirst() : null;
	}
	
	/**
	 * Adds an owned object to the end of the queue.
	 * @param add the object to add
	 */
	public void add(Data add) {
		list.add(add);
	}
	
	/**
	 * Removes the first next owned object, but does not notify it.
	 * @return the first inline that has been removed
	 */
	public Data pop() {
		if (list.size() < 1) {
			return null;
		}
		else
		{
			Data ret = list.getFirst();
			list.removeFirst();
			return ret;
		}
	}
	
	public boolean isEmpty() {
		return list.isEmpty();
	}
	
	public int size() {
		return list.size();
	}
	
}
