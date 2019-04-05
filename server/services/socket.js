const redisService = require('./redis');
const { getUsersByIdsMap } = require('./user');

class SocketClient {

    constructor(io) {
        this.io = io;
    }

    initConnection() {
        this.io.on('connection', async (client) => {

            client.on('setUserId', async (data) => {
                await redisService.saveUserConnection(client.id, data.userId);
                const ioDetails = await this.getConnectionDetails();
                this.io.sockets.emit('userConnected', ioDetails);
            });

            client.on('disconnect', async () => {
                await redisService.removeUserConnection(client.id);
                //TODO: remove rooms info
                const ioDetails = await this.getConnectionDetails();
                this.io.sockets.emit('userDisconnected', ioDetails);
            });

            client.on('createRoom', async (data) => {
                const { room } = data;

                client.join(room.name);
                await redisService.saveRoom(room);

                this.io.sockets.to(client.id).emit('roomCreated', data);
                await this.notifyRoomsUpdate();
            });

            client.on('joinRoom', async (data) => {
                const { room, player2 } = data;
                const { name, gameId } = room;
                const roomDetails = this.io.nsps['/'].adapter.rooms[name];

                if (roomDetails && roomDetails.length == 1) {
                    client.join(name);

                    client.broadcast.to(room.name).emit('userJoined', { player2 });
                    this.io.sockets.to(client.id).emit('userJoined', {
                        name,
                        gameId,
                        player2,
                        player1: room.users[0]
                    });
                }
                else {
                    // client.emit('joinRoomError', { message: 'Sorry, The room is full!' });
                }
            });
        });
    }

    async notifyRoomsUpdate() {
        const rooms = await this.getRooms();
        this.io.sockets.emit('roomsUpdated', { rooms });
    }

    async getConnectionDetails() {
        const usersOnline = await redisService.getOnlineUsersCount();
        const rooms = await this.getRooms();
        return {
            usersOnline,
            rooms
        }
    }

    async getRooms() {
        const rooms = await redisService.getRooms();
        const clients = await redisService.getOnlineUsers();

        if (!rooms || !clients) {
            return [];
        }
        const usersMap = await getUsersByIdsMap([...new Set(Object.values(clients))]); //TODO : CACHE

        return Object.keys(rooms).map(name => {
            const clientIds = this.getRoomClientIds(name);
            const users = clientIds.map(clientId => usersMap[clients[clientId]]);
            return {
                name,
                users,
                gameId: rooms[name],
                free: clientIds.length === 1
            };
        });
    }

    getRoomClientIds(roomName) {
        const room = this.io.nsps['/'].adapter.rooms[roomName];
        return room ? Object.keys(room.sockets) : [];
    }
}

module.exports = io => new SocketClient(io);