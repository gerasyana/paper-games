const jwt = require('../helpers/jwt');
const keys = require('../configs/keys');

module.exports.authenticate = (req, res, next) => {
    const token = req.headers[keys.AUTH_HEADER];
    //TODO check token from backlist
    
    if (token) {
        jwt.verifyJWT(token).then(() => {
            req.token = token;
            next()
        }).catch(err => {
            return res.json({ error: 'Token is not valid' });
        });
    } else {
        return res.json({ error: 'Auth token is not supplied' });
    }
}