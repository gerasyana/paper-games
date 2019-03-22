const redis = require('../helpers/redis');

module.exports = logout = (req, res, next) => {
   const token = req.headers[keys.AUTH_HEADER];
   //TODO : store in redis
   next();
}