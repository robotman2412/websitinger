package net.scheffers.robot.backend.job;

import net.scheffers.robot.backend.ClientInfo;

public class Job implements UserOwnedObject {
	
	/** What type of action is asked of the CPU. */
	public JobType type;
	/** Used for jobs that simply submit a program. */
	public byte[] programData;
	/** Shows the milliseconds the job deserves to run, set to the promised time which was advertised when the job was made. */
	public long deservedMillis;
	/** Name of the job, specified by the user. Filtered to be up to 64 chars long and be HTML-safe. */
	public String jobName;
	/** Who has submitted this job. Updated if the job submitter reconnects. */
	public ClientInfo submitter;
	/** Used for removing a job from the queue. */
	public String pid;
	
	@Override
	public ClientInfo getUser() {
		return submitter;
	}
	
	@Override
	public void setUser(ClientInfo user) {
		submitter = user;
	}
	
}
