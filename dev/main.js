
var manager = {
    room: require('./manager.flag'),
    population: require('./manager.population'),
    task: require('./manager.task')
};

module.exports.loop = function main_loop()
{
    var spawn = Game.spawns['Glikkerheim'];

    manager.room.run();
    manager.population.run();
    manager.task.run();
}
