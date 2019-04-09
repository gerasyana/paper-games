const { rooms } = require('./redis');
const { getUsernameById } = require('./user');

saveRoom = async (data) => {
    const { name, gameId, playerId } = data;
    const player1 = await getUsernameById(playerId);
    const room = {
        name,
        gameId,
        player1
    }
    await rooms.save(name, room);
    return room;
}

updateRoom = async (data) => {
    const { name, playerId } = data;
    const room = await rooms.get(name);
    const player2 = await getUsernameById(playerId);
    const roomUpdated = {
        ...room,
        player2
    }
    await rooms.save(name, roomUpdated);
    return roomUpdated;
}

getRooms = async () => {
    const data = await rooms.getAll();

    if (!data) {
        return [];
    }

    return Object.values(data).map(room => {
        const roomParsed = JSON.parse(room);
        const users = [];

        if (roomParsed.player1) {
            users.push(roomParsed.player1)
        }

        if (roomParsed.player2) {
            users.push(roomParsed.player2)
        }
        return {
            name: roomParsed.name,
            gameId: roomParsed.gameId,
            users
        }
    });
}

module.exports = {
    saveRoom,
    updateRoom,
    getRooms
}