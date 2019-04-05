const keys = require('../configs/keys');
const { removeTokenFromWhitelist } = require('../services/redis');
const { getDecodedJWT } = require('../services/jwt');

module.exports.logout = (req, res, next) => {
    const token = req.headers[keys.AUTH_HEADER];
    const tokenDecoded = getDecodedJWT(token);
    removeTokenFromWhitelist(token);
    next();
}
