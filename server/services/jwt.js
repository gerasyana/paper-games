const jwt = require('jsonwebtoken');
const { addTokenToWhitelist, isTokenValid } = require('./redis');
const keys = require('../configs/keys');

const EXPIRES_IN = '2h';

class JWTService {

    generateAndSaveJWT(user) {
        const today = new Date();
        const expirationDate = new Date();
        expirationDate.setHours(today.getHours() + 2);
        const options = {
            email: user.email,
            id: user._id,
            expirationDate: expirationDate
        };

        const token = jwt.sign(options, keys.JWT_SECRET, { expiresIn: EXPIRES_IN });
        addTokenToWhitelist(token, user._id.toString());
        return { token, expirationDate }
    }

    async isValidJWT(token) {
        const decoded = jwt.verify(token, keys.JWT_SECRET);
        const isValid = await isTokenValid(token);
        return decoded && !!isValid;
    }

    getDecodedJWT(token) {
        return jwt.decode(token, keys.JWT_SECRET);
    }
}

module.exports = new JWTService();