
module.exports = {
	init: function task_gather_init(creep, x, y)
	{
		if ('y' in x)
		{ y = x.y; x = x.x }

		var source = creep.room.lookForAt(LOOK_SOURCES, x, y);
		if (source.length > 0)
		{ source = source[0]; }
		else
		{ source = null; }

		if (source)
		{
			creep.memory.task = 'gather';
			creep.memory.gather = {
				pos: source.pos,
				source: source.id
			};
		}
		else
		{
			manager.task.free(creep);
		}
	},
	run: function task_gather_run(creep)
	{
		var g = creep.memory.gather;
		if (g)
		{
			var source = Game.getObjectById(g.source);
			if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
		}

		if (creep.carry.energy == creep.carryCapacity)
		{
			manager.task.free(creep);
			return;
		}
	}
}
