
/* This role is for flags to serve as rallying points for limited-access
structures, particularly energy sources.  These are manually created with
names indicating the target structure.  They will scan the area around
the structure to determine how many creeps are able to access it at one
time, then only allow that many creeps to approach of those that are rallied
at this flag. */

var manager = {
	task: require('manager.task')
};

var task = {
	gather: require('task.gather')
};

module.exports = {
	init: function role_queue_init(flag)
	{
		var room = flag.room;
		// name format: 'queue-{x}-{y}'
		var match = flag.name.match(/^queue-(\d+)-(\d+)$/i);
		if (match)
		{
			var q = flag.memory.queue = {
				target: { x: match[1], y: match[2] },
				slots: 0,
				range: 2,
				waiting: [],
				test: {
					top: match[2] - 2,
					left: match[1] - 2,
				 	bottom: match[2] + 2,
					right: match[1] + 2
				}
			};

			[
				{ x: q.target.x-1, y: q.target.y-1 },
				{ x: q.target.x,   y: q.target.y-1 },
				{ x: q.target.x+1, y: q.target.y-1 },
				{ x: q.target.x-1, y: q.target.y },
				{ x: q.target.x+1, y: q.target.y },
				{ x: q.target.x-1, y: q.target.y+1 },
				{ x: q.target.x  , y: q.target.y+1 },
				{ x: q.target.x+1, y: q.target.y+1 }
			].forEach(p => {
				q.slots += (room.lookForAt(LOOK_TERRAIN, p.x, p.y) == 'wall')?0:1;
			});

			q.test.top = Math.min(flag.pos.y+q.range, q.test.top);
			q.test.left = Math.min(flag.pos.x+q.range, q.test.left);
			q.test.bottom = Math.max(flag.pos.y-q.range, q.test.bottom);
			q.test.right = Math.max(flag.pos.x-q.range, q.test.right);
		}
	},
	run: function role_queue_run(flag)
	{
		var q = flag.memory.queue;
		if (q && q.waiting && q.waiting.length > 0)
		{
			var creeps = room.lookForAtArea(LOOK_CREEP, q.test.top, q.test.left, q.test.bottom, q.test.right, true);
			creeps = creeps.filter(c => (c.memory.role == "worker" && c.memory.task == "gather"));

			var allow = q.slots - creeps.length;
			while (allow > 0 && q.waiting.length > 0)
			{
				var nextCreep = Game.getObjectById(q.waiting.shift());
				if (nextCreep)
				{
					manager.task.free(nextCreep);
					task.gather.init(nextCreep, q.target);
					--allow;
				}
			}
		}
		else
		{ module.exports.init(flag); }
	}
}
