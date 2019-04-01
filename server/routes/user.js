const { authenticate } = require('../middlewares/authenticate');
const { logout } = require('../middlewares/logout');
const { getDecodedJWT } = require('../services/jwt');
const userService = require('../services/user');

module.exports = app => {

    app.get('/api/user', authenticate, async (req, res) => {
        const tokenParsed = getDecodedJWT(req.token);
        const data = await userService.getUserById(tokenParsed.id);
        return res.json(data);
    });

    app.post('/api/user/signup', async (req, res) => {
        const data = await userService.signUp(req.body);
        return res.json(data);
    });

    app.post('/api/user/login', async (req, res) => {
        const data = await userService.login(req.body);
        return res.json(data);
    });

    app.post('/api/user/logout', logout, (req, res) => {
        return res.sendStatus(200);
    });
}
