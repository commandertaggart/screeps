
var task = {
	queue: require('task.queue'),
	gather: require('task.gather'),
	upgrade: require('task.upgrade'),
	store: require('task.store'),
	build: require('task.build'),
	repair: require('task.repair')
};

var manager = {
	flag: require('manager.flag')
};

module.exports = {
	body: function class_worker_body(spawner)
	{
		var room = spawner.room;
		var controller = room.controller;
		var clevel = controller?controller.level:1;
		// determine body based on room status.

		return [WORK,MOVE,CARRY];
	},
	spawn: function class_worker_spawn(spawner)
	{
		var body = module.exports.body(spawner);
		spawner.createCreep(body, { class: "worker"});
	},
	run: function class_worker_run(creep)
	{
		if (creep.memory.task)
		{
			if (creep.memory.task in task)
			{ task[creep.memory.task].run(creep); }
			else {
				console.log(creep.name, "has unknown task:", creep.memory.task);
			}
		}
		else {
			// pick a task
			if (creep.carry[RESOURCE_ENERGY] == 0)
			{
				task.queue.init(creep);
			}
			else
			{
				// have energy, give task
				/*
				task priority:
				1. minimum 1 harvester
				2. minimum 1 upgrader
				3. if repairs are warranted, half to repair.
				4. if construction sites, up to as many builders as constr. sites.
				5. split between harvest and upgrade
				*/

				var analysis = creep.room.memory.analysis;
				if (analysis.tasks.store > 0 || analysis.energyPct == 1)
				{ // at least one harvester, or energy full
					if (analysis.tasks.upgrade > 0 || !creep.room.controller)
					{ // at least one upgrader or no controller
						if (analysis.dyingStructures.length > 0 &&
							((analysis.tasks.repair * 2) < (analysis.mine - 2)))
						{ task.repair.init(creep); }
						else if (analysis.constructionSites > analysis.tasks.build)
						{ task.build.init(creep); }
						else if (analysis.tasks.store > analysis.tasks.upgrade)
						{ task.store.init(creep); }
						else
						{ task.updgrade.init(creep); }
					}
					else
					{ task.upgrade.init(creep); }
				}
				else
				{ task.store.init(creep); }
			}
		}
	}
}
