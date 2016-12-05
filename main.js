
var dev = false;

if (dev)
{
	module.exports = require("./dev/main");
}
else {
	module.exports = require("./live/main");
}
