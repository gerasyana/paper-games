
const mongoose = require('mongoose');
const jwt = require('../helpers/jwt');
const { USER_MODEL } = require('../constants/modelNames');

const User = mongoose.model(USER_MODEL);

getUserById = (userId) => {
    return User.findById(userId).then(user => {
        const { email, username } = user;
        return { email, username }
    }).catch(err => {
        console.log(err);
        //TODO log error
        return { error: 'User not found' }
    })
}

signUp = (data) => {
    const { email, password, username } = data;

    return User.findOne({ username })
        .then(user => {
            if (user) {
                return { error: 'Account with the username already exists' };
            }

            const newUser = {
                email,
                username,
                password: User.hashPassword(password)
            };
            return User.create(newUser).then(user => {
                const tokenDetails = jwt.generateJWT(user);
                return {
                    tokenDetails,
                    user: { email, username }
                }
            }).catch(err => {
                console.log(error);
                //TODO : log error
                return { error: 'Error while creating new account. Please try again' }
            });
        })
        .catch(err => {
            console.log(error);
            //TODO : log error
            return { error: 'Error while creating new account. Please try again' }
        });
}

login = (data) => {
    const { username, password } = data;

    return User.findOne({ username })
        .then(user => {
            if (!user) {
                return { error: `User not found` };
            } else if (!user.validPassword(password)) {
                return { error: "Invalid password" };
            }

            const tokenDetails = jwt.generateJWT(user);
            return {
                tokenDetails,
                user: { password, username }
            }
        }).catch(err => {
            console.log(err);
            //TODO : log error
            return { error: 'Error while creating new account. Please try again' }
        });
}

module.exports = {
    getUserById,
    login,
    signUp
};