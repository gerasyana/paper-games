
const mongoose = require('mongoose');
const jwtService = require('./jwt');
const { USER_MODEL } = require('../constants/modelNames');
const { USERS_CACHE_OPTIONS } = require('../constants/cacheOptions');
const { geUserTotalPoints } = require('./game')

const User = mongoose.model(USER_MODEL);

class UserService {

    async getUserById(id) {
        const user = await User.findById(id).cache(USERS_CACHE_OPTIONS);

        if (!user) {
            return { error: 'User not found' };
        }
        return await getUserWrapper(user);
    }

    async getPlayerDetailsById(id) {
        const user = await User.findById(id).cache(USERS_CACHE_OPTIONS);

        if (!user) {
            return;
        }
        return {
            id,
            username: user.username
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
                password: User.hashPassword(password)
            });

            if (!user) {
                return { error: 'Error while signing up . Please try again' }
            }
            return await getUserDetails(user);
        } catch (err) {
            return { error: err.message }
        }
    }

    async login(data) {
        const { username, password } = data;

        try {
            const user = await User.findOne({ username });

            if (!user) {
                return { error: `User not found` };
            } else if (!user.validPassword(password)) {
                return { error: "Invalid password" };
            }

            user.cache();
            return await getUserDetails(user);
        } catch (err) {
            return { error: err.message }
        }
    }
}

const getUserDetails = async (user) => {
    const tokenDetails = jwtService.generateAndSaveJWT(user);
    const userWrapper = await getUserWrapper(user);
    return {
        tokenDetails,
        user: userWrapper
    }
}

const getUserWrapper = async (user) => {
    const totalPoints = await geUserTotalPoints(user._id);
    return {
        email: user.email,
        username: user.username,
        id: user._id,
        totalPoints
    }
}

module.exports = new UserService();