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
    describe('Socket rooms', () => {
        let ioClient1, ioClient2, user1Id, user2Id;
        const testRoom = {
            name: 'test room',
            gameId: 'tick-tack-toe'
        };

        before(async () => {
            const user1 = await mongoose.model(USER_MODEL).create(TEST_USER_1);
            const user2 = await mongoose.model(USER_MODEL).create(TEST_USER_2);
            user1Id = user1._id.toString();
            user2Id = user2._id.toString();

            ioClient1 = io.connect(socketURL, options);
            ioClient2 = io.connect(socketURL, options);
            ioClient1.emit('setUserId', { userId: user1Id });
            ioClient2.emit('setUserId', { userId: user2Id });
        });

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
            await mongoose.model(GAME_HISTORY_MODEL).remove();
            ioClient1.disconnect();
            ioClient2.disconnect();
        });

        it('User 1 should create a new test room ', done => {
            ioClient1.on('player1Joined', data => {
                const { name, players } = data.room;
                expect(name).to.equal(testRoom.name);
                expect(players).have.lengthOf(1);
                done();
            });

            ioClient1.emit('createRoom', {
                ...testRoom,
                playerId: user1Id
            });
        });

        it('User 2 should join existing test room', done => {
            ioClient2.on('player1Joined', data => {
                const { name, players } = data.room;
                expect(name).to.equal(testRoom.name);
                expect(players).have.lengthOf(2);
                done();
            });

            ioClient2.emit('joinRoom', {
                ...testRoom,
                playerId: user2Id
            });
        });

        it('Users should leave test room', done => {
            ioClient1.on('playerLeftRoom', data => {
                const { name, players } = data;
                expect(name).to.equal(testRoom.name);
                expect(players).have.lengthOf(1);
                done();
            });

            ioClient2.emit('leaveRoom', testRoom);
        });
    });
};
