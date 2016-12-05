
var manager = {
	task: require('./manager.task')
};

module.exports = {
	init: function task_repair_init(creep)
	{
		creep.memory.task = 'repair';

		var targets = (creep.room.memory.analysis || {dyingStructures:[]}).dyingStructures
			.map(function (id) { Game.getObjectById(id) });
		if(targets.length) {
			targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
			creep.memory.repair = {
				structure: targets[0].id,
				target: targets[0].pos
			};
			module.exports.run(creep);
		}
		else {
			manager.task.free(creep);
		}
	},
	run: function task_repair_run(creep)
	{
		var target = Game.getObjectById(creep.memory.repair.structure);
		if(creep.carry[RESOURCE_ENERGY] > 0 && target && (target.hits < target.hitsMax))
		{
			if (creep.repair(target) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(target);
			}
		}
		else {
			manager.task.free(creep);
		}
	}
}
