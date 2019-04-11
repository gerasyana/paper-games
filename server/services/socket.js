const redis = require('./redis');
const roomService = require('./room');
const GameFactory = require('./games/gameFactory');

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

            this.handleRoomEvents(client);
            this.handleGameEvents(client);
        });
    }

    handleRoomEvents(client) {
        client.on('createRoom', async (data) => {
            const { name } = data;
            client.join(name);

            const room = await roomService.saveRoom(data);
            client.emit('player1Joined', room);
            await this.notifyRoomsUpdate();
        });

        client.on('joinRoom', async (data) => {
            const { name } = data;
            const roomDetails = this.io.nsps['/'].adapter.rooms[name];

            if (roomDetails && roomDetails.length == 1) {
                client.join(name);
                const room = await roomService.updateRoom(data);

                client.broadcast.to(name).emit('player2Joined', room.players);
                client.emit('player1Joined', room);
                await this.notifyRoomsUpdate();
            }
        });

        client.on('leaveRoom', async (data) => {
            const { name } = data;

            client.leave(name);
            client.emit('closeRoom');

            this.getRoomClientIds(name).forEach(clientId => {
                this.io.sockets.connected[clientId].leave(name);
                client.broadcast.to(clientId).emit('playerLeftRoom');
            });
            
            await redis.rooms.remove(name);
            await this.notifyRoomsUpdate();
        })
    }

    handleGameEvents(client) {
        client.on('playerMadeMove', async (data) => {
            const { room } = data;
            const playerId = await redis.sockets.getUserId(client.id);

            const gameService = new GameFactory(playerId, data);
            await gameService.processPlayerMove();
            this.io.sockets.to(room.name).emit('updateGameBoard', gameService.getUpdatedGameBoard());

            if (gameService.gameIsOver) {
                //TODO : notification on UI that user gen scores for finished game
            }
        });
    }

    async notifyRoomsUpdate() {
        const rooms = await roomService.getRooms();
        this.io.sockets.emit('roomsUpdated', rooms);
    }

    async getConnectionDetails() {
        const usersOnline = await redis.sockets.getUsersOnlineCount();
        const rooms = await roomService.getRooms();
        return {
            usersOnline,
            rooms
        }
    }

    getRoomClientIds(roomName) {
        const room = this.io.nsps['/'].adapter.rooms[roomName];
        return room ? Object.keys(room.sockets) : [];
    }
}

module.exports = io => new SocketClient(io);