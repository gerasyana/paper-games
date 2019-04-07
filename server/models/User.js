const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { db } = require('../services/redis');
const { USER_MODEL } = require('../constants/modelNames');
const { USERS } = require('../constants/redisHashKeys');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 5,
        maxlength: 15
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    }
});

UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

mongoose.model(USER_MODEL, UserSchema);

