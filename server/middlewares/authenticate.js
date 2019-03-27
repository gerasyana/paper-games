const jwt = require('../services/jwt');
const keys = require('../configs/keys');

module.exports.authenticate = (req, res, next) => {
    const token = req.headers[keys.AUTH_HEADER];

    if (!token) {
        return res.json({ error: 'Auth token is not supplied' });
    }

    jwt.validJWT(token, (isValid) => {
        if (isValid) {
            req.token = token;
            next();
        } else {
            return res.json({ error: 'Token is not valid' });
        }
    });
}