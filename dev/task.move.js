
var manager = {
	task: require('./manager.task')
};

module.exports = {
	init: function task_move_init(creep, position, tolerance)
	{
		position = new RoomPosition(
			position.x || creep.pos.x,
			position.y || creep.pos.y,
			position.roomName || creep.pos.roomName
		);
		creep.memory.move = {
			target: position,
			tolerance: tolerance || 0
		}
		creep.memory.task = 'move';
	},
	run: function task_move_run(creep)
	{
		if (creep.pos.getRangeTo(creep.memory.move.target) <= creep.memory.move.range)
		{
			manager.task.free(creep);
		}
	}
}
