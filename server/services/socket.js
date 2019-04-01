const redisService = require('./redis');

class SocketClient {

    constructor(io) {
        this.io = io;
        this.rooms = [];
    }

    initConnection() {
        this.io.on('connection', async (client) => {
            const usersOnline = await this.getConnectionDetails();
            this.io.sockets.emit('userConnected', usersOnline);

            client.on('createRoom', (data) => {
                const room = `room-${data.room}`;
                client.join(room);
                this.io.sockets.emit('roomCreated', { rooms: this.getRooms() });
            });

            client.on('disconnect', async () => {
                const data = await this.getConnectionDetails();
                this.io.sockets.emit('userDisconnected', data);
            })
        });
    }

    async getConnectionDetails() {
        const usersOnline = await redisService.getOnlineUsersCount();
        return {
            usersOnline,
            rooms: this.getRooms()
        }
    }

    getRooms() {
        return Object.keys(this.io.nsps['/'].adapter.rooms)
            .filter(room => room.indexOf('room') > -1);
    }
}

module.exports = io => new SocketClient(io);