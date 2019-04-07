const redis = require('./redis');

class SocketClient {

    constructor(io) {
        this.io = io;
    }

    initConnection() {
        this.io.on('connection', async (client) => {

            client.on('setUserId', async (data) => {
                await redis.sockets.save(client.id, data.userId);
                const ioDetails = await this.getConnectionDetails();
                this.io.sockets.emit('userConnected', ioDetails);
            });

            client.on('disconnect', async () => {
                await redis.sockets.remove(client.id);
                const ioDetails = await this.getConnectionDetails();
                this.io.sockets.emit('userConnected', ioDetails);
            });

            client.on('createRoom', async (data) => {
                const { room, player1 } = data;

                client.join(room.name);
                await redis.rooms.save(room.name, {
                    ...room,
                    users: [player1]
                });

                this.io.sockets.to(client.id).emit('roomCreated', data);
                await this.notifyRoomsUpdate();
            });

            client.on('joinRoom', async (data) => {
                const { room, player2 } = data;
                const { name, gameId } = room;
                const [ player1 ] = room.users;
                const roomDetails = this.io.nsps['/'].adapter.rooms[name];
                
                if (roomDetails && roomDetails.length == 1) {
                    client.join(name);
                    
                    await redis.rooms.save(name, {
                        name,
                        gameId,
                        users : [player1, player2]
                    });

                    client.broadcast.to(name).emit('userJoined', { player2 });
                    this.io.sockets.to(client.id).emit('userJoined', {
                        name,
                        gameId,
                        player1,
                        player2
                    });
                }
            });

            client.on('leaveRoom', async (data) => {
                const { room } = data;

                client.leave(room);
                this.io.sockets.to(client.id).emit('closeGame');

                const clientIds = this.getRoomClientIds(room)
                if (clientIds) {
                    clientIds.forEach(clientId => {
                        this.io.sockets.connected[clientId].leave(room);
                        client.broadcast.to(clientId).emit('userLeftGame');
                    });
                }

                await redis.rooms.remove(room);
                await this.notifyRoomsUpdate();
            })
        });
    }

    async notifyRoomsUpdate() {
        const rooms = await this.getRooms();
        this.io.sockets.emit('roomsUpdated', { rooms });
    }

    async getConnectionDetails() {
        const usersOnline = await redis.sockets.getUsersOnlineCount();
        const rooms = await this.getRooms();
        return {
            usersOnline,
            rooms
        }
    }

    async getRooms() {
        const rooms = await redis.rooms.getAll();
        return rooms ? Object.values(rooms).map(room => JSON.parse(room)) : null;
    }

    getRoomClientIds(roomName) {
        const room = this.io.nsps['/'].adapter.rooms[roomName];
        return room ? Object.keys(room.sockets) : [];
    }
}

module.exports = io => new SocketClient(io);