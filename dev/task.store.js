
var manager = {
	task: require('./manager.task')
};

module.exports = {
	init: function task_store_init(creep)
	{
		// store energy in nearest storage location that has room
		creep.memory.task = 'store';

		var targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
						structure.energy < structure.energyCapacity;
				}
		});

		targets.sort((a,b) => { creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b); });

		creep.memory.store = {
			id: targets[0].id,
			target: targets[0].pos
		};

		module.exports.run(creep);
	},
	run: function task_store_run(creep)
	{
		var target = Game.getObjectById(creep.memory.store.id);

		if (target && (target.energy < target.energyCapacity))
		{
			var result = creep.transfer(target, RESOURCE_ENERGY);
			if (result == ERR_NOT_IN_RANGE)
			{ creep.moveTo(target); }
			else if (result != OK) //ERR_NOT_ENOUGH_ENERGY || result == ERR_FULL)
			{ manager.task.free(creep); }
		}
		else
		{ manager.task.free(creep); }
	}
}
