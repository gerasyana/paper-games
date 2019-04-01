const redisService = require('./redis');

class SocketClient {

    constructor(io) {
        this.io = io;
        this.rooms = [];
    }

    initConnection() {
        this.io.on('connection', async (client) => {
            const ioDetails = await this.getConnectionDetails();
            this.io.sockets.emit('userConnected', ioDetails);

            client.on('createRoom', async (data) => {
                client.join(data.room);
                await redisService.saveUserRoom(data);
                this.io.sockets.emit('roomCreated', { rooms: this.getRooms()});
            });

            client.on('disconnectUser', async (data) => {
                await redisService.clearUserRooms(data.userId);
                client.disconnect();
            });

            client.on('disconnect' , async() => {
                const ioDetails = await this.getConnectionDetails();
                this.io.sockets.emit('userDisconnected', ioDetails);
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
            .filter(room => room.indexOf('room-') > -1);
    }
}

module.exports = io => new SocketClient(io);