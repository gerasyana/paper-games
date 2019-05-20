const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const io = require('socket.io-client');
const { USER_MODEL, GAME_HISTORY_MODEL } = require('../../constants/modelNames');
const { TEST_USER_1, TEST_USER_2 } = require('../constants');
const { sockets } = require('../../services/redis');
const { expect } = chai;

const PORT = process.env.PORT || 5000;
const socketURL = `http://localhost:${PORT}`;
const options = {
    transports: ['websocket'],
    'force new connection': true
}

chai.use(chaiHttp);

module.exports = app => {
    describe('Sockets', () => {
        let ioClient1, ioClient2,
            user1, user2, user1Id, user2Id;

        before(async () => {
            const socketIO = require('socket.io').listen(PORT);
            const ioServer = require('../../services/socket')(socketIO);
            ioServer.initConnection();
            user1 = await mongoose.model(USER_MODEL).create(TEST_USER_1);
            user2 = await mongoose.model(USER_MODEL).create(TEST_USER_2);
            user1Id = user1._id.toString();
            user2Id = user2._id.toString();
        });

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
            await mongoose.model(GAME_HISTORY_MODEL).remove();
            await ioClient1.disconnect();
            await ioClient2.disconnect();
        })

        it('It should connect user 1 ', (done) => {
            ioClient1 = io.connect(socketURL, options);

            ioClient1.on('connect', data => {
                ioClient1.on('userConnected', async (data) => {
                    const result = await sockets.getUserId(ioClient1.id);
                    expect(result).to.not.null;
                    expect(result).to.equal(user1Id);
                    expect(data).to.have.property('rooms');
                    expect(data).to.have.property('usersOnline');
                });

                ioClient1.emit('setUserId', { userId: user1Id });
                done();
            });
        });

        it('It should connect user 2 ', (done) => {
            ioClient2 = io.connect(socketURL, options);

            ioClient2.on('connect', data => {
                ioClient2.on('userConnected', async (data) => {
                    const result = await sockets.getUserId(ioClient2.id);
                    expect(result).to.not.null;
                    expect(result).to.equal(user2Id);
                    expect(data).to.have.property('rooms');
                    expect(data).to.have.property('usersOnline');
                });

                ioClient2.emit('setUserId', { userId: user2Id });
                done();
            });
        });

        describe('Test room events', () => {
            const testRoom = {
                name: 'test room',
                gameId: 'tick-tack-toe'
            };

            it('User 1 should create a new test room ', (done) => {
                ioClient1.on('player1Joined', (data) => {
                    const { players } = data.room;
                    expect(players).have.lengthOf(1);
                });

                ioClient1.emit('createRoom', {
                    ...testRoom,
                    playerId: user1Id
                });
                done();
            });

            it('User 2 should join existing test room', (done) => {
                ioClient2.on('player1Joined', (data) => {
                    const { players } = data.room;
                    expect(players).have.lengthOf(2);
                });

                ioClient2.emit('joinRoom', {
                    ...testRoom,
                    playerId: user2Id
                });
                done();
            });

            it('User 2 should leave test room', (done) => {
                ioClient1.on('playerLeftRoom', (data) => {
                    const { name, players } = data;
                    expect(name).to.equal(testRoom.name);
                    expect(players).have.lengthOf(1);
                });

                ioClient2.emit('leaveRoom', testRoom);
                done();
            });

            it('User 1 should leave test room', (done) => {
                ioClient1.emit('leaveRoom', testRoom);
                done();
            });
        });

        describe('Test "Tick tack toe" game events', () => {
            const testRoom = {
                name: 'test room',
                gameId: 'tick-tack-toe'
            };
            let gameClient1, gameClient2;

            before((done) => {
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
                done();
            })

            it('User 2 made move', async () => {
                gameClient2.gameBoard.moves[0] = 'X';
                ioClient2.emit('playerMadeMove', gameClient2);
            });

            it('User 1 made move and won', (done) => {
                gameClient1.gameBoard.moves[0] = 'X';
                gameClient1.gameBoard.moves[1] = 'X';
                gameClient1.gameBoard.moves[2] = 'X';

                ioClient1.on('gameIsOver', (data) => {
                    const { gameBoard } = data;
                    expect(gameBoard.youWon).to.true;
                });

                ioClient1.emit('playerMadeMove', gameClient1);
                done();
            });
        });

        describe('Test "Battleship" game events', () => {
            const testRoom = {
                name: 'test room 2',
                gameId: 'battleship'
            };
            let game;

            before((done) => {
                const room = {
                    ...testRoom,
                    players: [
                        { id: user1Id },
                        { id: user2Id }
                    ]
                }

                game = {
                    room,
                    gameBoard: {
                        gameIsOver: false,
                        youWon: false,
                        yourTurn: false,
                        fleets: [
                            {
                                playerId: user1Id,
                                ships: [
                                    {
                                        columns: [1, 2, 3],
                                        destroyed: false
                                    }
                                ],
                                moves: []
                            },
                            {
                                playerId: user2,
                                ships: [
                                    {
                                        columns: [4, 5, 6],
                                        destroyed: false
                                    }
                                ],
                                moves: []
                            },
                        ]
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
                done();
            })

            it('User 2 made move', async () => {
                game.gameBoard.fleets[0].moves.push();
                ioClient2.emit('playerMadeMove', game);
            });

            it('User 1 made move and won', (done) => {
                game.gameBoard.fleets[1].moves.push(4);
                game.gameBoard.fleets[1].moves.push(5);
                game.gameBoard.fleets[1].moves.push(6);

                ioClient1.on('gameIsOver', (data) => {
                    const { gameBoard } = data;
                    expect(gameBoard.youWon).to.true;
                });

                ioClient1.emit('playerMadeMove', game);
                done();
            });
        });
    })
}
