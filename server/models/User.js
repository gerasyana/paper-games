const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { users } = require('../services/redis');
const { USER_MODEL } = require('../constants/modelNames');

const exec = mongoose.Query.prototype.exec;

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

UserSchema.statics.findByIdMap = async function (ids) {
    const items = await this.find({
        _id: {
            $in: ids
        }
    });
    return items.reduce((obj, item) => {
        obj[item._id] = {
            id: item._id,
            username: item.username,
            email: item.email
        };
        return obj;
    }, {});
}

UserSchema.statics.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

mongoose.model(USER_MODEL, UserSchema);

