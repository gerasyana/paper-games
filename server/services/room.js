const { rooms } = require('./redis');
const { getPlayerDetailsById } = require('./user');

class RoomService {

    async saveRoom(data) {
        const { name, gameId, playerId } = data;
        const player1 = await getPlayerDetailsById(playerId);
        const room = {
            name,
            gameId,
            players: [player1]
        };
        await rooms.save(name, room);
        return room;
    }

    async removePlayer(name, playerId) {
        const room = await rooms.get(name);
        let roomUpdated = {
            ...room
        };

        if (room.players) {
            const players = room.players .filter((player) => player.id !== playerId);
            roomUpdated.players = players;
        }
        await rooms.save(name, roomUpdated);
        return roomUpdated;
    }

    async updateRoom(data) {
        const { name, playerId } = data;
        const room = await rooms.get(name);
        const player2 = await getPlayerDetailsById(playerId);
        const roomUpdated = {
            ...room,
            players: [...room.players, player2]
        };
        await rooms.save(name, roomUpdated);
        return roomUpdated;
    }

    async getRooms() {
        const data = await rooms.getAll();

        if (!data) {
            return [];
        }

        return Object.values(data).map((room) => JSON.parse(room));
    }
}

module.exports = new RoomService();