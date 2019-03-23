const jwt = require('../helpers/jwt');
const { authenticate } = require('../middlewares/authenticate');
const { signUp, login, getUserById } = require('../actions/user');

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
}
