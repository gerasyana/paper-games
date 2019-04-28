const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const http = require('http');
const socketIO = require('socket.io');
const socketIOClient = require('socket.io-client');
const { USER_MODEL, GAME_HISTORY_MODEL } = require('../../constants/modelNames');
const { TEST_USER_1, TEST_USER_2 } = require('../constants');
const { sockets } = require('../../services/redis');

const options = {
    transports: ['websocket'],
    'force new connection': true
}
const { expect } = chai;
chai.use(chaiHttp);

module.exports = app => {
    describe('Sockets', async () => {
        let ioServer, socketPort,
            ioClient1, ioClient2,
            user1, user2, user1Id, user2Id,
            testRoom = {
                name: 'test room',
                gameId: 'tick-tack-toe'
            }

        before(async () => {
            const httpServer = http.Server(app);
            const io = socketIO(httpServer);
            const httpServerAddr = httpServer.listen().address();
            socketPort = `http://[${httpServerAddr.address}]:${httpServerAddr.port}`;
            console.log('socketPort', socketPort);
            ioServer = require('../../services/socket')(io);
            ioServer.initConnection();

            user1 = await mongoose.model(USER_MODEL).create(TEST_USER_1);
            user2 = await mongoose.model(USER_MODEL).create(TEST_USER_2);
            user1Id = user1._id.toString();
            user2Id = user2._id.toString();
            console.log(user1);
            console.log(user2);
        });

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
            await mongoose.model(GAME_HISTORY_MODEL).remove();
            await ioClient1.disconnect();
            await ioClient2.disconnect();
        })

        it('It should connect user 1 ', async () => {
            ioClient1 = socketIOClient.connect(socketPort, options);

            ioClient1.on('userConnected', async (data) => {
                const result = await sockets.getUserId(ioClient1.id);
                expect(result).to.not.null;
                expect(result).to.equal(user1Id);
                expect(data).to.have.property('rooms');
                expect(data).to.have.property('usersOnline');
            });

            ioClient1.emit('setUserId', { userId: user1Id });
        });

        it('It should connect user 2 ', async () => {
            ioClient2 = socketIOClient.connect(socketPort, options);

            ioClient2.on('userConnected', async (data) => {
                const result = await sockets.getUserId(ioClient2.id);
                expect(result).to.not.null;
                expect(result).to.equal(user2Id);
                expect(data).to.have.property('rooms');
                expect(data).to.have.property('usersOnline');
            });

            ioClient2.emit('setUserId', { userId: user2Id });
        });

        describe('Test room events', () => {

            it('User 1 should create a new test room ', async () => {
                ioClient1.on('player1Joined', (data) => {
                    const { name, players } = data;
                    expect(name).to.equal(testRoom.name);
                    expect(players).have.lengthOf(1);
                });

                ioClient1.emit('createRoom', {
                    ...testRoom,
                    playerId: user1Id
                });
            });

            it('User 2 should join existing test room', async () => {
                ioClient2.on('player1Joined', (data) => {
                    const { name, players } = data;
                    expect(name).to.equal(testRoom.name);
                    expect(players).have.lengthOf(2);
                });

                ioClient2.emit('joinRoom', {
                    ...testRoom,
                    playerId: user2Id
                });
            });

            it('User 2 should leave test room', async () => {
                ioClient1.on('playerLeftRoom', (data) => {
                    const { name, players } = data;
                    expect(name).to.equal(testRoom.name);
                    expect(players).have.lengthOf(1);
                });

                ioClient2.emit('leaveRoom', testRoom);
            });

            it('User 1 should leave test room', () => {
                ioClient1.emit('leaveRoom', testRoom);
            });
        });

        describe('Test "Tick tack toe" game events', () => {
            let gameClient1, gameClient2;

            before(async () => {
                const room = {
                    ...testRoom,
                    players: [
                        { id: user1Id },
                        { id: user2Id }
                    ]
                }

                const gameBoard = {
                    gameIsOver: false,
                    youWon: false,
                    yourTurn: true,
                    playerStep: 'O',
                    moves: new Array(9).fill(null)
                }

                gameClient1 = {
                    room,
                    gameBoard: {
                        ...gameBoard,
                        playerStep: 'X'
                    }
                }

                gameClient2 = {
                    room,
                    gameBoard: {
                        ...gameBoard,
                        playerStep: 'O'
                    }
                }

                ioClient1.on('player1Joined', (data) => {
                    ioClient2.emit('joinRoom', {
                        ...testRoom,
                        playerId: user2Id
                    });
                });

                ioClient1.emit('createRoom', {
                    ...testRoom,
                    playerId: user1Id
                });
            })

            it('User 2 made move', async () => {
                gameClient2.gameBoard.moves[0] = 'X';
                ioClient2.emit('playerMadeMove', gameClient2);
            });

            it('User 1 made move and won', async () => {
                gameClient1.gameBoard.moves[0] = 'X';
                gameClient1.gameBoard.moves[1] = 'X';
                gameClient1.gameBoard.moves[2] = 'X';

                ioClient1.on('gameIsOver', (data) => {
                    const { gameBoard } = data;
                    expect(gameBoard.youWon).to.true;
                });

                ioClient1.emit('playerMadeMove', gameClient1);
            });
        });
    })
}
