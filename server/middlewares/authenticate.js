const keys = require('../configs/keys');
const { isValidJWT } = require('../services/jwt');

module.exports.authenticate = async (req, res, next) => {
    const token = req.headers[keys.AUTH_HEADER];

    if (!token) {
        return res.json({ error: 'Auth token is not supplied' });
    }

    const isValid = await isValidJWT(token);
    
    if (isValid) {
        req.token = token;
        next();
    } else {
        return res.json({ error: 'Token is not valid' });
    }
}