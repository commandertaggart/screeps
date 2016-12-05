
// Worker jobs: gather, store, upgrade, build, repair
module.exports = {
	free: function manager_task_free(creep)
	{
		// unassign current task
		if (creep.memory.task)
		{ delete creep.memory[creep.memory.task]; }
		creep.memory.task = null;
	},

	run: function manager_task_run()
	{
		for (var c in Game.creeps)
		{
			var creep = Game.creeps[c];

			if (creep.memory.role in role)
			{
				role[creep.memory.role].run(creep);
			}
		}
	}
}
