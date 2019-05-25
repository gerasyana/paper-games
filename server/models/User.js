const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { documents } = require('../services/redis');
const { USER_MODEL } = require('../constants/modelNames');
const { USERS_CACHE_OPTIONS } = require('../constants/cacheOptions');

// eslint-disable-next-line no-useless-escape
const EMAIL_PATTERN = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/i;

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        minlength: 5,
        maxlength: 15
    },
    email: {
        type: String,
        validate: {
            validator: (value) => EMAIL_PATTERN.test(value),
            message: () => 'Email is invalid'
        },
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    }
});

UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
};

UserSchema.methods.cache = async function () {
    await cache(this);
};

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(10));
    next();
});

UserSchema.pre('update',  function (next) {
    next();
});

UserSchema.post('save', async (user) => {
    await cache(user);
});

const cache = async (user) => {
    await documents.save(USERS_CACHE_OPTIONS.hashKey, user[USERS_CACHE_OPTIONS.hashSubKey], user);
    await documents.setExpire(USERS_CACHE_OPTIONS.hashKey, USERS_CACHE_OPTIONS.expiresIn);
};

mongoose.model(USER_MODEL, UserSchema);

