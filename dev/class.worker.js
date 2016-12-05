
module.exports = {
	name: function class_worker_name()
	{
		var num = 0;
		while (("worker-" + num) in Game.creeps)
		{ ++num; }
		return "worker-" + num;
	},
	body: function class_worker_body(spawner, need)
	{
		var manager = {
			population: require('./manager.population')
		};

		if (need == 'emergency')
		{ return [WORK, MOVE, CARRY]; }

		var room = spawner.room;
		//var controller = room.controller;
		//var clevel = controller?controller.level:1;
		//var analysis = room.memory.analysis || {};
		var ecap = room.energyCapacityAvailable;
		var ecur = room.energyAvailable;

		var prio = [CARRY, MOVE, WORK];
		var body = [WORK, MOVE, CARRY];
		var cost = manager.population.bodyCost(body);
		var next = prio[body.length % 3];

		if (need == 'build')
		{
			while (cost + BODYPART_COST[next] < ecur)
			{
				body.append(next);
				next = prio[body.length % 3];
			}
		}
		else if (need == 'maintain')
		{
			while (cost + BODYPART_COST[next] < ecap)
			{
				body.append(next);
				next = prio[body.length % 3];
			}
		}

		body.sort();

		return body;
	},
	spawnData: function class_worker_spawnData(spawner, need)
	{
		var body = module.exports.body(spawner, need);
		return {
			body: body,
			memory: { class: "worker" }
		};
	},
	run: function class_worker_run(creep)
	{
		var task = {
			queue: require('./task.queue'),
			gather: require('./task.gather'),
			upgrade: require('./task.upgrade'),
			store: require('./task.store'),
			build: require('./task.build'),
			repair: require('./task.repair')
		};

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
