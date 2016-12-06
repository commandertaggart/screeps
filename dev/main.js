
global.manager = {
    flag: require('./manager.flag'),
    population: require('./manager.population'),
    task: require('./manager.task')
};

global.role = {
    worker: require('./role.worker'),
    queue: require('./role.queue')
};

global.task = {
    build: require('./task.build'),
    gather: require('./task.gather'),
    queue: require('./task.queue'),
    repair: require('./task.repair'),
    store: require('./task.store'),
    upgrade: require('./task.upgrade'),
};

module.exports.loop = function main_loop()
{
    var spawn = Game.spawns['Glikkerheim'];

    manager.flag.run();
    manager.population.run();
    manager.task.run();
}
