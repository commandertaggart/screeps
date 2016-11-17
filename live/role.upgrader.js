var travel = require('utils.travel');

var roleUpgrader = {
    max: 1,
    body: [WORK,MOVE,CARRY],
    tempAs: null,

    hasWork: function (creep) { return true; },
    spawn: function upgrader_spawn(spawner, name) {
        if (spawner.createCreep(roleUpgrader.body, name, {role: 'upgrader'}) == OK)
            console.log("Spawning upgrader...");
    },
    run: function upgrader_run(creep, which, cycle) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('harvesting');
            if (cycle) cycle();
	    }
	    if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.upgrading = true;
	        creep.say('upgrading');
	    }

	    if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
	        var source = travel.closestSource(creep)
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
	}
};

module.exports = roleUpgrader;
