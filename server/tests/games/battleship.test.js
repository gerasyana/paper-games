const chai = require('chai');
const mongoose = require('mongoose');
const io = require('socket.io-client');
const { USER_MODEL, GAME_HISTORY_MODEL } = require('../../constants/modelNames');
const { TEST_USER_1, TEST_USER_2 } = require('../constants');
const { expect } = chai;

const PORT = process.env.PORT || 5000;
const socketURL = `http://localhost:${PORT}`;
const options = {
    transports: ['websocket'],
    'force new connection': true
}

module.exports = app => {
    describe('Test "Battleship" game events', () => {
        let game, ioClient1, ioClient2;
        const testRoom = {
            name: 'test room 2',
            gameId: 'battleship'
        };

        before(async () => {
            const user1 = await mongoose.model(USER_MODEL).create(TEST_USER_1);
            const user2 = await mongoose.model(USER_MODEL).create(TEST_USER_2);

            ioClient1 = io.connect(socketURL, options);
            ioClient2 = io.connect(socketURL, options);
            ioClient1.emit('setUserId', { userId: user1._id.toString() });
            ioClient2.emit('setUserId', { userId: user2._id.toString() });

            ioClient1.on('player1Joined', () => {
                ioClient2.emit('joinRoom', {
                    ...testRoom,
                    playerId: user2._id.toString()
                });
            });

            ioClient1.emit('createRoom', {
                ...testRoom,
                playerId: user1._id.toString()
            });

            const room = {
                ...testRoom,
                players: [
                    { id: user1._id.toString() },
                    { id: user2._id.toString() }
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
                            playerId: user1._id.toString(),
                            ships: [
                                {
                                    columns: [1, 2, 3],
                                    destroyed: false
                                }
                            ],
                            moves: []
                        },
                        {
                            playerId: user2._id.toString(),
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
        })

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
            await mongoose.model(GAME_HISTORY_MODEL).remove();
            ioClient1.disconnect();
            ioClient2.disconnect();
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
                done();
            });

            ioClient1.emit('playerMadeMove', game);
        });
    });
}
