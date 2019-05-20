const chai = require('chai');
const mongoose = require('mongoose');
const io = require('socket.io-client');
const { USER_MODEL, GAME_HISTORY_MODEL } = require('../../constants/modelNames');
const { TEST_USER_1 } = require('../constants');
const { sockets } = require('../../services/redis');
const { expect } = chai;

const PORT = process.env.PORT || 5000;
const socketURL = `http://localhost:${PORT}`;
const options = {
    transports: ['websocket'],
    'force new connection': true
}

module.exports = app => {
    describe('Socket connection', () => {
        let user1Id;

        before(async () => {
            const user1 = await mongoose.model(USER_MODEL).create(TEST_USER_1);
            user1Id = user1._id.toString();
        });

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
            await mongoose.model(GAME_HISTORY_MODEL).remove();
        })

        it('It should connect a user', (done) => {
            const ioClient = io.connect(socketURL, options);

            ioClient.on('userConnected', async (data) => {
                const result = await sockets.getUserId(ioClient.id);
                expect(result).to.not.null;
                expect(result).to.equal(user1Id);
                expect(data).to.have.property('rooms');
                expect(data).to.have.property('usersOnline');

                ioClient.disconnect();
                done();
            });

            ioClient.emit('setUserId', { userId: user1Id });
        });
    })
}
