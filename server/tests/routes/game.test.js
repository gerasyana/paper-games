const chai = require('chai');
const mongoose = require('mongoose');
const { USER_MODEL, GAME_HISTORY_MODEL } = require('../../constants/modelNames');
const { TEST_USER_1, TEST_USER_2 } = require('../constants');

const { expect } = chai;
chai.use(require('chai-http'));

module.exports = (app) => {
    describe('Game route', () => {
        before(async () => {
            const user1 = await mongoose.model(USER_MODEL).create(TEST_USER_1);
            const user2 = await mongoose.model(USER_MODEL).create(TEST_USER_2);
            await mongoose.model(GAME_HISTORY_MODEL).create({
                room: {
                    name: 'test',
                    gameId: 'tick-tack-toe',
                    players: [user1, user2],
                },
                winnerId: user1.id,
                points: 10
            });
        });

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
            await mongoose.model(GAME_HISTORY_MODEL).remove();
        });

        describe('GET /api/game/rating', () => {
            it('It should return game rating', async () => {
                const res = await chai.request(app)
                    .get('/api/game/rating')
                    .query({ gameId: 'tick-tack-toe' });
                expect(res.body).to.not.null;
            });
        });
    });
};