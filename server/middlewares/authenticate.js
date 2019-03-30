const keys = require('../configs/keys');
const { isValidJWT } = require('../services/jwt');

module.exports.authenticate = async (req, res, next) => {
    const token = req.headers[keys.AUTH_HEADER];

    if (!token) {
        return res.status(401);
    }

    const isValid = await isValidJWT(token);

    if (isValid) {
        req.token = token;
        next();
    } else {
        return res.status(401);
    }
}