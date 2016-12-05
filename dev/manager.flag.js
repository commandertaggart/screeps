
role = {
	queue: require('./role.queue')
}

module.exports = {
	run: function manager_flag_run()
	{
		// check flags for task assignment
		var flags = Game.flags;

		for (var f in flags)
		{
			if (f.startsWith('queue'))
			{ role.queue.run(flags[f]); }
		}
	},
	flagForSource: function manager_flag_flagForSource(source)
	{
		var flagName = 'queue-' + source.pos.x + '-' + source.pos.y;
		return Game.flags[flagName];
	}
}
