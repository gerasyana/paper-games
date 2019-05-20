const chai = require('chai');
const mongoose = require('mongoose');
const { AUTH_HEADER } = require('../../configs/keys');
const { USER_MODEL } = require('../../constants/modelNames')
const { TEST_USER_1 } = require('../constants');

const { expect } = chai;
chai.use(require('chai-http'));

module.exports = app => {
    describe('User route', () => {
        let token;

        after(async () => {
            await mongoose.model(USER_MODEL).remove();
        });

        describe('POST /api/user/signup', () => {
            it('It should create new user account', async () => {
                const res = await chai.request(app)
                    .post('/api/user/signup')
                    .set('Content-type', 'application/json')
                    .send(TEST_USER_1);

                const { tokenDetails } = res.body;
                token = tokenDetails.token;
                expect(token).to.not.be.null;
            });

            it('It shouldn\'t create new user account (duplicate validation)', async () => {
                const res = await chai.request(app)
                    .post('/api/user/signup')
                    .set('Content-type', 'application/json')
                    .send(TEST_USER_1)

                const { error } = res.body;
                expect(error).to.equal("Account with the username already exists");
            });
        });

        describe('GET /api/user', () => {
            it('User unauthorized', async () => {
                const res = await chai.request(app)
                    .get('/api/user');

                expect(res.status).to.equal(401);
            });

            it('It should return user info', async () => {
                const res = await chai.request(app)
                    .get('/api/user')
                    .set(AUTH_HEADER, token);

                const data = res.body;
                expect(data.id).to.not.null;
            });
        });

        describe('POST /api/user/logout', () => {
            it('It should logout user', async () => {
                const res = await chai.request(app)
                    .post('/api/user/logout')
                    .set(AUTH_HEADER, token);

                expect(res.status).to.equal(200);
                token = null;
            })
        });

        describe('POST /api/user/login', () => {
            it('It shouldn\'t login user (User not found)', async () => {
                const res = await chai.request(app)
                    .post('/api/user/login')
                    .set('Content-type', 'application/json')
                    .send({
                        ...TEST_USER_1,
                        username: 'testfake'
                    });

                const { error } = res.body;
                expect(error).to.equal("User not found");
            });

            it('It shouldn\'t login user (Invalid password)', async () => {
                const res = await chai.request(app)
                    .post('/api/user/login')
                    .set('Content-type', 'application/json')
                    .send({
                        ...TEST_USER_1,
                        password: 'testfake'
                    });

                const { error } = res.body;
                expect(error).to.equal("Invalid password");
            });

            it('It should login user and return token and user details', async () => {
                const res = await chai.request(app)
                    .post('/api/user/login')
                    .set('Content-type', 'application/json')
                    .send(TEST_USER_1);

                const { tokenDetails } = res.body;
                token = tokenDetails.token;
                expect(token).to.not.be.null;
            });
        });

        describe('POST /api/user/resetpassword', () => {
            it('It should reset password for a user', async () => {
                const res = await chai.request(app)
                    .post('/api/user/resetpassword')
                    .set('Content-type', 'application/json')
                    .send({
                        username: TEST_USER_1.username, password: 'newpassword'
                    });

                const { error } = res.body;
                expect(error).to.be.undefined;
            });
        });
    })
}