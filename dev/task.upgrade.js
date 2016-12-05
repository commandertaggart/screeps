
module.exports = {
	init: function task_upgrade_init(creep)
	{
		creep.memory.task = 'upgrade';
		creep.memory.upgrade = {
			target: creep.room.controller.pos
		};
		module.exports.run(creep);
	},
	run: function task_upgrade_run(creep)
	{
		var manager = {
			task: require('./manager.task')
		};

		if (creep.room.controller)
		{
			var result = creep.upgradeController(creep.room.controller);
			if (result == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
			else if (result != OK) //ERR_NOT_ENOUGH_ENERGY)
			{ manager.task.free(creep); }
		}
		else
		{ manager.task.free(creep); }
	}
}
