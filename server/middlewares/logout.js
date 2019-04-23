const keys = require('../configs/keys');
const { tokens } = require('../services/redis');

module.exports.logout = (req, res, next) => {
    const token = req.headers[keys.AUTH_HEADER];
    tokens.removeFromWhitelist(token);
    next();
}
