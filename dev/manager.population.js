
var classes = {
	worker: require('class.worker')
}

module.exports = {
	frequency: 20, // one room per tick, no room more often than once per this many ticks.
	run: manager_population_run()
	{
		var oneRoom = false;
		for (var r in Game.rooms)
		{
			var room = Game.rooms[r];
			if (room && room.controller && room.controller.my)
			{
				var p = room.memory.population = room.memory.population || {};

				if (p.cooldown > 0)
				{ --p.cooldown }
				else {
					if (oneRoom)
					{ p.cooldown = 0; }
					else {
						module.exports.per(room);
						p.cooldown = module.exports.frequency;
					}
				}
			}
		}
	},
	per: manager_population_per(room)
	{
		// analyze population and determine needs
		var analysis = {
			hostiles: [],
			mine: 0,
			tasks: {
				idle: 0
			},
			classes: {
			},
			energyPct: -1,
			sources: room.find(FIND_SOURCES).length,
			constructionSites: 0,
			construction: 0,
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
					++analysis.task.idle;
				}

				if (creep.memory.class)
				{
					++analysis.classes[creep.memory.class];
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
				if ((structure.hits * 2) < structure.hitsMax)
				{ analysis.dyingStructures.push(structure.id); }
			}
			else {
				analysis.enemyStructures.push(structure.id);
			}
		})

		room.memory.analysis = analysis;

		var spawners = room.find(FIND_MY_SPAWNS);
		// spawn any needed creeps.
		if (analysis.mine == 0 || analysis.classes.worker == undefined)
		{
			// emergency spawn workers
			spawners.forEach(sp => classes.worker.spawn(sp));
			return;
		}
	}
}
