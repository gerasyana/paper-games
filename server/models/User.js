const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { documents } = require('../services/redis');
const { USER_MODEL } = require('../constants/modelNames');
const { USERS_CACHE_OPTIONS } = require('../constants/cacheOptions');

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

UserSchema.methods.cache = async function () {
    await cache(this);
}

UserSchema.post('save', async (user) => {
    await cache(user);
});

cache = async (user) => {
    await documents.save(USERS_CACHE_OPTIONS.hashKey, user[USERS_CACHE_OPTIONS.hashSubKey], user);
    await documents.setExpire(USERS_CACHE_OPTIONS.hashKey, USERS_CACHE_OPTIONS.expiresIn);
}

mongoose.model(USER_MODEL, UserSchema);

