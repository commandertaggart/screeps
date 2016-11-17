var roles = {
    harvester: require('role.harvester'),
    upgrader: require('role.upgrader'),
    builder: require('role.builder')
};
var utils = {
    travel: require('utils.travel')
};

module.exports.loop = function main_loop()
{
    var spawn = Game.spawns['Glikkerheim'];
    var counts = {};
    for (var role in roles)
    { counts[role] = 0; }
    for(var name in Memory.creeps) {
        var creep = Game.creeps[name];
        if(!creep) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
            continue;
        }

        if (utils.travel.handleTravel(creep))
        { continue; }

        var role = creep.memory.role;

        if (role in roles)
        {
            ++counts[role];
            if (creep.memory.temp && creep.memory.temp in roles)
            {
                roles[creep.memory.temp].run(creep, counts[role], function ()
                {
                    delete creep.memory.temp;
                    console.log(creep.name, "done temping.");
                });
            }
            else
            {
                if (roles[role].hasWork(creep))
                { roles[role].run(creep, counts[role]); }
                else if (roles[role].tempAs in roles)
                {
                    console.log(creep.name + " (" + role + ") temping as " + roles[role].tempAs);
                    creep.memory.temp = roles[role].tempAs;
                    roles[role].run(creep, counts[role]);
                }
            }
        }
    }

    var countOutput = [];
    for (var role in counts)
    {
        countOutput.push(role + ": " + counts[role] + "/" + roles[role].max);
        if (counts[role] < roles[role].max && spawn.canCreateCreep())
        {
            console.log("Need more " + role);
            var index = 0;
            var result = 0;
            var build = true;
            while (result = spawn.canCreateCreep(roles[role].body, role + index))
            {
                if (result == -6)
                { build = false; break; }
                else if (result == -3)
                { ++index; }
            }
            if (build)
            { roles[role].spawn(spawn, role + index); }
        }
    }
    console.log(countOutput.join(", "));
}
