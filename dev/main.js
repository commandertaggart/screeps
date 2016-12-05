
global.manager = {};
[ 'flag', 'population', 'task' ]
    .forEach(x => manager[x] = require('./manager.'+x));
global.role = {};
[ 'queue', 'worker' ]
    .forEach(x => manager[x] = require('./role.'+x));
global.task = {};
[ 'build', 'gather', 'queue', 'repair', 'store', 'upgrade' ]
    .forEach(x => manager[x] = require('./task.'+x));

module.exports.loop = function main_loop()
{
    var spawn = Game.spawns['Glikkerheim'];

    manager.flag.run();
    manager.population.run();
    manager.task.run();
}
