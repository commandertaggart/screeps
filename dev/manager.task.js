
var classes = {
	worker: require('class.worker')
}

// Worker jobs: gather, store, upgrade, build, repair
module.exports = {
	free: function manager_task_free(creep)
	{
		// unassign current job and task
		if (creep.memory.task)
		{ delete creep.memory[creep.memory.task]; }
		creep.memory.task = null;
	},

	run: function manager_task_run()
	{
		for (var c in Game.creeps)
		{
			var creep = Game.creeps[c];

			if (creep.memory.class in classes)
			{
				classes[creep.memory.class].run(creep);
			}
		}
	}
}
