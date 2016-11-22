
var manager = {
	task: require('manager.task')
};

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
		if (creep.room.controller)
		{
			if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
			else {
				manager.task.free(creep);
			}
		}
		else {
			manager.task.free(creep);
		}
	}
}
