roleHarvester = {
    max: 2,
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
                if(creep.transfer(targets[which % targets.length], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[which % targets.length]);
                }
            }
        }
        else {
            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[which % sources.length]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[which % sources.length]);
            }
        }
    }
}

module.exports = roleHarvester;
