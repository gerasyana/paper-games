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
};

module.exports = () => {
    describe('Test "Tick tack toe" game events', () => {
        let ioClient1, ioClient2, gameBoard1, gameBoard2;
        const testRoom = {
            name: 'test room',
            gameId: 'tick-tack-toe'
        };

        before(async () => {
            const user1 = await mongoose.model(USER_MODEL).create(TEST_USER_1);
            const user2 = await mongoose.model(USER_MODEL).create(TEST_USER_2);

            ioClient1 = io.connect(socketURL, options);
            ioClient2 = io.connect(socketURL, options);
            ioClient1.emit('setUserId', { userId: user1._id.toString()  });
            ioClient2.emit('setUserId', { userId: user2._id.toString()  });

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
                    { id:  user2._id.toString() }
                ]
            };

            const gameBoard = {
                gameIsOver: false,
                youWon: false,
                yourTurn: true,
                playerStep: 'O',
                moves: new Array(9).fill(null)
            };

            gameBoard1 = {
                room,
                gameBoard: {
                    ...gameBoard,
                    playerStep: 'X'
                }
            };

            gameBoard2 = {
                room,
                gameBoard: {
                    ...gameBoard,
                    playerStep: 'O'
                }
            };
        });

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
            await mongoose.model(GAME_HISTORY_MODEL).remove();
            ioClient1.disconnect();
            ioClient2.disconnect();
        });

        it('User 2 made move', () => {
            gameBoard2.gameBoard.moves[0] = 'X';
            ioClient2.emit('playerMadeMove', gameBoard2);
        });

        it('User 1 made move and won', done => {
            gameBoard1.gameBoard.moves[0] = 'X';
            gameBoard1.gameBoard.moves[1] = 'X';
            gameBoard1.gameBoard.moves[2] = 'X';

            ioClient1.on('gameIsOver', data => {
                const { gameBoard } = data;
                expect(gameBoard.youWon).to.true;
                done();
            });

            ioClient1.emit('playerMadeMove', gameBoard1);
        });
    });
};