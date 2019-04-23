const jwt = require('jsonwebtoken');
const { tokens } = require('./redis');
const keys = require('../configs/keys');
const { logError } = require('./logger');

const EXPIRES_IN = '2h';

class JWTService {

    generateAndSaveJWT(user) {
        try {
            const today = new Date();
            const expirationDate = new Date();
            expirationDate.setHours(today.getHours() + 2);
            const options = {
                email: user.email,
                id: user._id,
                expirationDate: expirationDate
            };

            const token = jwt.sign(options, keys.JWT_SECRET, { expiresIn: EXPIRES_IN });
            tokens.addToWhitelist(token);
            return { token, expirationDate }
        } catch (error) {
            logError(error);
            return false;
        }
    }

    async isValidJWT(token) {
        try {
            const decoded = jwt.verify(token, keys.JWT_SECRET);
            const isValid = await tokens.isValid(token);
            return decoded && !!isValid;
        } catch (error) {
            logError(error);
            return false;
        }
    }

    getDecodedJWT(token) {
        return token ? jwt.decode(token, keys.JWT_SECRET) : {};
    }
}

module.exports = new JWTService();