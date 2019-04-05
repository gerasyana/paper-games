
const mongoose = require('mongoose');
const jwtService = require('./jwt');
const { USER_MODEL } = require('../constants/modelNames');

const User = mongoose.model(USER_MODEL);

class UserService {

    async getUserById(id) { //TODO : CACHE
        const user = await User.findById(id);

        if (!user) {
            return { error: 'User not found' };
        }

        const { email, username } = user;
        return { email, username, id }
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
        return getUserDetails(user);
    }

    async getUsersByIdsMap(ids) {
        return await User.findByIdMap(ids);
    }
}

const getUserDetails = (user) => {
    const tokenDetails = jwtService.generateAndSaveJWT(user);
    return {
        tokenDetails,
        user: {
            email: user.email,
            username: user.username,
            id: user._id
        }
    }
}

module.exports = new UserService();