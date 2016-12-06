
var config = {
	minWorkers: 2,
	gatherScale: 3
}

module.exports = {
	frequency: 20, // one room per tick, no room more often than once per this many ticks.
	run: function manager_population_run()
	{
		var oneRoom = false;
		for (var r in Game.rooms)
		{
			var room = Game.rooms[r];
			if (room && room.controller && room.controller.my)
			{
				var p = room.memory.population = room.memory.population || { cooldown: 0 };

				if (p.cooldown > 0)
				{ --p.cooldown }
				else {
					if (oneRoom)
					{ p.cooldown = 0; }
					else {
						p.cooldown = module.exports.frequency;
						module.exports.per(room);
						oneRoom = true;
					}
				}
			}
		}
	},
	per: function manager_population_per(room)
	{ console.log("population analysis for room " + room.name);
		var cpu = Game.cpu.getUsed();

		// analyze population and determine needs
		var analysis = {
			hostiles: [],
			mine: 0,
			tasks: {
				idle: 0
			},
			roles: {
				worker: 0
			},
			energyPct: -1,
			sources: room.find(FIND_SOURCES).length,
			constructionSites: 0,
			construction: 0,
			gatherSlots: 0,
			dyingCreeps: [],
			dyingStructures: [],
			enemyStructures: []
		};

		var tH = 0, cH = 0;
		room.find(FIND_CREEPS).forEach(creep => {
			if (creep.my)
			{
				++analysis.mine;
				if (creep.memory.task)
				{
					++analysis.tasks[creep.memory.task];
				}
				else {
					++analysis.tasks.idle;
				}

				if (creep.memory.role)
				{
					var c = creep.memory.role;
					++analysis.roles[c];
				}
				else {
					// ignore this one, it's a one-off
					--analysis.mine;
				}

				if ((creep.hits * 2) < creep.hitsMax)
				{ analysis.dyingCreeps.push(creep.id); }
			}
			else {
				analysis.hostiles.push(creep.id);
			}
		});

		if (room.energyCapacityAvailable > 0)
		{ analysis.energyPct = room.energyAvailable / room.energyCapacityAvailable }

		analysis.creepHealthPct = (tH > 0)?(cH / tH):1;

		room.find(FIND_CONSTRUCTION_SITES).forEach(site => {
			++analysis.cronstructionSites;
			analysis.construction += site.progressTotal - site.progress;
		});

		room.find(FIND_STRUCTURES).forEach(structure => {
			if (structure.my)
			{
				switch (structure.structureType)
				{
					case STRUCTURE_SPAWN:
						var flag = Game.flags['queue-' + structure.pos.x + '-' + structure.pos.y];
						if (flag)
						{
							analysis.gatherSlots += flag.memory.queue.slots;
						}
						if (structure.hits < structure.hitsMax)
						{ analysis.dyingStructures.push(structure.id); }
						break;
					case STRUCTURE_WALL:
					case STRUCTURE_EXTENSION:
					case STRUCTURE_CONTROLLER:
						if (structure.hits < structure.hitsMax)
						{ analysis.dyingStructures.push(structure.id); }
						break;
					default:
						if ((structure.hits * 2) < structure.hitsMax)
						{ analysis.dyingStructures.push(structure.id); }
						break;
				}
			}
			else {
				analysis.enemyStructures.push(structure.id);
			}
		})

		room.memory.analysis = analysis;

		var spawners = room.find(FIND_MY_SPAWNS);
		var spawnQueue = room.memory.spawnQueue = room.memory.spawnQueue || [];

		spawnQueue.forEach(function (q) {
			++analysis.roles[q.memory.role];
		});

		// spawn any needed creeps.
		while (analysis.roles.worker < config.minWorkers)
		{
			console.log("queueing spawn for emergency worker");
			spawnQueue.push(role.worker.spawnData(null, 'emergency'));
		}

		if (spawnQueue.length == 0) // nothing else going on, see if we want to add one
		{
			var cap = analysis.gatherSlots * config.gatherScale;
			spawners.forEach(function (sp)
			{
    			if (analysis.roles.worker == cap - 1)
    			{
    				console.log(sp.name + ": queueing spawn for new worker.");
    				spawnQueue.push(role.worker.spawnData(sp, 'maintain'));
    				++analysis.roles.worker;
    			}
    			else if (analysis.roles.worker < cap)
    			{
    				console.log(sp.name + ": queueing spawn for next worker.");
    				spawnQueue.push(role.worker.spawnData(sp, 'build'));
    				++analysis.roles.worker;
    			}
				else {
					console.log(sp.name + ": population full, leaving spawner idle.");
				}
			});
		}

		console.log("spawn queue has " + spawnQueue.length + " entries.");
		spawners.forEach(function (sp) {
			if (!sp.spawning && spawnQueue.length > 0)
			{
				var pattern = spawnQueue[0];
				var name = role.worker.name();
				if (sp.canCreateCreep(pattern.body, name))
				{
					console.log("spawning", pattern.memory.role, name, pattern.body);
					spawnQueue.shift();
					sp.createCreep(pattern.body, name, pattern.memory);
				}
			}
		});

		console.log("population analysis done. Cost: " + (Game.cpu.getUsed() - cpu));
	},
	bodyCost: function manager_population_bodyCost(body)
	{
		var cost = 0;
		body.forEach(function (bit) { cost += BODYPART_COST[bit]; });
		return cost;
	}
}
