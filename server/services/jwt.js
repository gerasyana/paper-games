const jwt = require('jsonwebtoken');
const { addTokenToWhitelist, isTokenValid } = require('./redis');
const keys = require('../configs/keys');

const EXPIRES_IN_SECONDS = 2 * 60 * 60;
const EXPIRES_IN = '2h';

const generateJWT = (user) => {
    const today = new Date();
    const expirationDate = new Date();
    expirationDate.setHours(today.getHours() + 2);

    const options = {
        email: user.email,
        id: user._id,
        expirationDate: expirationDate
    };
    const token = jwt.sign(options, keys.JWT_SECRET, { expiresIn: EXPIRES_IN });
    addTokenToWhitelist(token, EXPIRES_IN_SECONDS);

    return { token, expirationDate }
}

const validJWT = (token, callback) => {
    const decoded = jwt.verify(token, keys.JWT_SECRET);
    return isTokenValid(token, (error, valid) => {
        return callback(decoded && !!valid)
    });
}

const getDecodedJWT = (token) => {
    return jwt.decode(token, keys.JWT_SECRET);
}

module.exports = {
    generateJWT,
    validJWT,
    getDecodedJWT
}