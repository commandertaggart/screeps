var travel = require('utils.travel');

var roleBuilder = {
    max: 2,
    body: [WORK,WORK,MOVE,MOVE,CARRY,CARRY],
    tempAs: 'harvester',

    hasWork: function builder_hasWork(creep) {
        return creep.room.find(FIND_CONSTRUCTION_SITES).length > 0;
    },
    spawn: function builder_spawn(spawner, name) {
        if (spawner.createCreep(roleBuilder.body, name, {role: 'builder'}) == OK)
            console.log("Spawning builder...");
    },
    run: function builder_run(creep, which, cycle) {

	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('harvesting');
            if (cycle) { cycle(); }
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('building');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                targets.sort((a, b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            }
	    }
	    else {
			var sources = creep.room.find(FIND_SOURCES);
	        var source = sources[1];
//            var source = sources[which % sources.length];
//	        var source = travel.closestSource(creep)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
	    }
	}
};

module.exports = roleBuilder;
