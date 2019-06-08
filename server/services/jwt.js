const jwt = require('jsonwebtoken');
const { tokens } = require('./redis');
const keys = require('../configs/keys');
const { logError } = require('./logger');

const EXPIRES_IN = '2h';

class JWTService {

    generateAndSaveJWT(user) {
        try {
            const expirationDate = new Date();
            expirationDate.setHours(new Date().getHours() + 2);

            const token = jwt.sign({
                email: user.email,
                id: user._id,
                expirationDate: expirationDate
            }, keys.JWT_SECRET, { expiresIn: EXPIRES_IN });

            tokens.addToWhitelist(token);
            return { token, expirationDate };
        } catch (error) {
            logError(error);
            return false;
        }
    }

    async isValidJWT(token) {
        try {
            const isValid = await tokens.isValid(token);
            return jwt.verify(token, keys.JWT_SECRET) && !!isValid;
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