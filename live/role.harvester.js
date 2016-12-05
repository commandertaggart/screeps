roleHarvester = {
    max: 4,
    body: [WORK,MOVE,CARRY],
    tempAs: 'upgrader',

    hasWork: function harvester_hasWork(creep)
    {
        return creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
        }).length > 0;
    },
    spawn: function harvester_spawn(spawner, name) {
        if (spawner.createCreep(roleHarvester.body, name, {role: 'harvester'}) == OK)
            console.log("Spawning harvester...");
    },
    run: function harvester_run(creep, which, cycle) {

        if(creep.memory.delivering && creep.carry.energy == 0) {
            creep.memory.delivering = false;
            creep.say('harvesting');
            if (cycle) cycle();
	    }
	    if(!creep.memory.delivering && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.delivering = true;
	        creep.say('delivering');
	    }

	    if(creep.memory.delivering) {
            var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                            structure.energy < structure.energyCapacity;
                    }
            });
            if(targets.length > 0) {
                targets.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
                var target = targets[0];
                //var target = targets[which % targets.length];
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
//	        var source = sources[1];
            var source = sources[(which-1) % sources.length];
//	        var source = travel.closestSource(creep)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
}

module.exports = roleHarvester;
