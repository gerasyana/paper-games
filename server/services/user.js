
const mongoose = require('mongoose');
const jwtService = require('./jwt');
const { USER_MODEL } = require('../constants/modelNames');
const { USERS_CACHE_OPTIONS } = require('../constants/cacheOptions');
const { geUserTotalPoints } = require('./game');
const { logError } = require('./logger');

const User = mongoose.model(USER_MODEL);

class UserService {

    async getUserById(id) {
        try {
            const user = await User.findById(id).cache(USERS_CACHE_OPTIONS);

            if (!user) {
                return { error: 'User not found' };
            }
            return await getUserWrapper(user);
        } catch (err) {
            logError(err);
            return { error: 'User not found' };
        }
    }

    async getPlayerDetailsById(id) {
        try {
            const user = await User.findById(id).cache(USERS_CACHE_OPTIONS);

            if (!user) {
                return;
            }
            return {
                id,
                username: user.username
            };
        } catch (err) {
            logError(err);
            return { error: 'User not found' };
        }
    }

    async signUp(data) {
        const { email, password, username } = data;
        let user = await User.findOne({ username });

        if (user) {
            return { error: 'Account with the username already exists' };
        }

        try {
            user = await User.create({
                email,
                username,
                password
            });

            if (!user) {
                return { error: 'Error while signing up . Please try again' };
            }
            return await getUserDetails(user);
        } catch (err) {
            logError(err);
            return { error: err.message };
        }
    }

    async login(data) {
        const { username, password } = data;

        try {
            const user = await User.findOne({ username });

            if (!user) {
                return { error: 'User not found' };
            } else if (!user.validPassword(password)) {
                return { error: 'Invalid password' };
            }

            user.cache();
            return await getUserDetails(user);
        } catch (err) {
            logError(err);
            return { error: err.message };
        }
    }

    async resetPassword(data) {
        const { username, password } = data;

        try {
            const user = await User.findOneAndUpdate({ username }, { password: User.hashPassword(password) });

            if (!user) {
                return { error: 'User not found' };
            }

            user.cache(user);
            return await getUserDetails(user);
        } catch (err) {
            logError(err);
            return { error: err.message };
        }
    }
}

const getUserDetails = async user => {
    const tokenDetails = jwtService.generateAndSaveJWT(user);
    const userWrapper = await getUserWrapper(user);
    return {
        tokenDetails,
        user: userWrapper
    };
};

const getUserWrapper = async user => {
    const totalPoints = await geUserTotalPoints(user._id);
    return {
        email: user.email,
        username: user.username,
        id: user._id,
        totalPoints
    };
};

module.exports = new UserService();