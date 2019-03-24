const { removeTokenFromWhitelist } = require('../helpers/redis');
const keys = require('../configs/keys');

module.exports.logout = (req, res, next) => {
    const token = req.headers[keys.AUTH_HEADER];
    removeTokenFromWhitelist(token);
    next();
}