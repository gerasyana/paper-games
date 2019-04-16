const redis = require('./redis');
const roomService = require('./room');
const { geUserTotalPoints } = require('./game');
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

            client.on('disconnecting', async () => {
                const rooms = Object.keys(client.rooms).filter(room => room !== client.id);

                rooms.forEach(async (name) => {
                    await this.notifyRoomClientIds(client, name);
                });
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

        client.on('reinitRoom', async (data) => {
            const { name } = data;
            client.join(name);

            const room = await roomService.saveRoom(data);
            client.emit('player1Joined', room);
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

            await this.notifyRoomClientIds(client, name);
            await this.notifyRoomsUpdate();
        })
    }

    async notifyRoomClientIds(client, name) {
        const clientIds = this.getRoomClientIds(name).filter(clientId => clientId !== client.id);
        
        if (clientIds.length === 0) {
            await redis.rooms.remove(name);
        } else {
            const playerId = await redis.sockets.getUserId(client.id);
            const room = await roomService.removePlayer(name, playerId);
            clientIds.forEach(clientId => {
                client.broadcast.to(clientId).emit('playerLeftRoom', room);
            });
        }
    }

    handleGameEvents(client) {
        client.on('playerMadeMove', async (data) => {
            const { room } = data;
            const playerId = await redis.sockets.getUserId(client.id);

            const gameService = new GameFactory(playerId, data);
            await gameService.processPlayerMove();
            const gameBoard = gameService.getUpdatedGameBoard();

            if (gameService.gameIsOver) {
                const totalPoints = await geUserTotalPoints(playerId);
                client.emit('gameIsOver', {
                    gameBoard: {
                        ...gameBoard,
                        youWon: true,
                        points: gameService.points
                    },
                    totalPoints
                });
                client.broadcast.to(room.name).emit('gameIsOver', { gameBoard });
            } else {
                this.io.sockets.to(room.name).emit('togglePlayerTurn', gameBoard);
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