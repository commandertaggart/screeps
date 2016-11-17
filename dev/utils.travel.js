
module.exports = {
    closestSource: function closestSource(creep)
    {
        var sources = creep.room.find(FIND_SOURCES);
        if (sources.length == 0) return null;

        sources.sort((a,b) => creep.pos.getRangeTo(a) - creep.pos.getRangeTo(b));
        return sources[0];
    },
    nextRoom: function nextRoom(creep, direction)
    {
        var name = creep.pos.roomName;
        var div = name.search(/N|S/);
        //console.log("Starting room: " + name, name.search(/N|S/i));
        var lat = name.substr(1, div-1);
        var lon = name.substr(div+1);

        if (name.charAt(0) == 'W')
        { lat = -lat; }
        if (name.charAt(div) == 'S')
        { lon = -lon; }

        console.log("Room at " + lat + ", " + lon);

        direction = direction.charAt().toLowerCase();
        switch (direction)
        {
            case 'n': ++lon; break;
            case 'e': ++lat; break;
            case 's': --lon; break;
            case 'w': --lat; break;
        }

        if (lat == 0)
        { lat = (direction=='e')?1:-1; }
        if (lon == 0)
        { lat = (direction=='n')?1:-1; }

        var target = (lat>0?("E"+lat):"W"+(-lat)) + (lon>0?("N"+lon):"S"+(-lon));
        console.log("going to room", target);

        if (target in Game.rooms)
        {
            target = Game.rooms[target].controller;
            console.log(target);
            if (target)
            {
                creep.memory.moveTarget = target.pos;
            }
        }
    },
    setMoveTo: function setMoveTo(creep, x, y)
    {
        creep.memory.moveTarget = new RoomPosition(x, y, creep.roomName);
    },
    handleTravel: function handleTravel(creep)
    {
        if ('moveTarget' in creep.memory)
        {
            if (creep.pos.getRangeTo(creep.memory.moveTarget) < 0.9)
            {
                delete creep.memory.moveTarget;
                return false;
            }
            creep.moveTo(creep.memory.moveTarget);
            return true;
        }
        return false;
    }
};
