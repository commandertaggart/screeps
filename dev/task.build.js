
module.exports = {
	init: function task_build_init(creep)
	{
		creep.memory.task = 'build';

		var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if(targets.length) {
			targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
			creep.memory.build = {
				site: targets[0].id,
				target: targets[0].pos
			};
			module.exports.run(creep);
		}
		else {
			manager.task.free(creep);
		}
	},
	run: function task_build_run(creep)
	{
		var target = Game.constructionSites[creep.memory.build.site];
		if(creep.carry[RESOURCE_ENERGY] > 0 && target)
		{
			if (creep.build(target) == ERR_NOT_IN_RANGE)
			{
				creep.moveTo(target);
			}
		}
		else {
			manager.task.free(creep);
		}
	}
}
