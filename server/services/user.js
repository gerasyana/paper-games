
const mongoose = require('mongoose');
const jwtService = require('./jwt');
const { USER_MODEL } = require('../constants/modelNames');
const { USERS_CACHE_OPTIONS } = require('../constants/cacheOptions');

const User = mongoose.model(USER_MODEL);

class UserService {

    async getUserById(id) {
        const user = await User.findById(id).cache(USERS_CACHE_OPTIONS);

        if (!user) {
            return { error: 'User not found' };
        }
        return getUserWrapper(user);
    }

    async getUsernameById(id) {
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

        user = await User.create({
            email,
            username,
            password: User.hashPassword(password)
        });

        if (!user) {
            return { error: 'Error while signing up . Please try again' }
        }
        return getUserDetails(user);
    }

    async login(data) {
        const { username, password } = data;
        const user = await User.findOne({ username });

        if (!user) {
            return { error: `User not found` };
        } else if (!user.validPassword(password)) {
            return { error: "Invalid password" };
        }

        user.cache();
        return getUserDetails(user);
    }
}

const getUserDetails = (user) => {
    const tokenDetails = jwtService.generateAndSaveJWT(user);
    return {
        tokenDetails,
        user: getUserWrapper(user)
    }
}

const getUserWrapper = (user) => (
    {
        email: user.email,
        username: user.username,
        id: user._id
    }
)

module.exports = new UserService();