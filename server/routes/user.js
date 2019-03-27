const { authenticate } = require('../middlewares/authenticate');
const { logout } = require('../middlewares/logout');
const { signUp, login, getUserById } = require('../services/user');
const jwt = require('../services/jwt');

module.exports = app => {

    app.get('/api/user', authenticate, (req, res) => {
        const tokenParsed = jwt.getDecodedJWT(req.token);
        return getUserById(tokenParsed.id).then(data => res.json(data));
    });

    app.post('/api/user/signup', (req, res) => {
        return signUp(req.body).then(data => res.json(data));
    });

    app.post('/api/user/login', (req, res) => {
        return login(req.body).then(data => res.json(data));
    });

    app.post('/api/user/logout', logout, (req, res) => {
        return res.sendStatus(200);
    });
}
