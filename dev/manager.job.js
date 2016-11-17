
module.exports = {
	free: function manager_job_free(creep)
	{
		// unassign current job and task
		creep.memory.task = null;
		creep.memory.job = null;

		if (creep.memory.devoted)
		{
			// analyze if this job is done, otherwise give me that job
		}
		else
		{
			// find job by priority and proximity and give me that job
		}
	}
}
