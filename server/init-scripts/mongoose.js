const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const keys = require('../configs/keys');
const { documents } = require('../services/redis');

mongoose.Promise = global.Promise;
mongoose.connect(keys.MONGO_URL, { useNewUrlParser: true });
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
    let data;

    if (this.cacheData === undefined || !this.cacheData) {
        data = await exec.apply(this, arguments);
    }

    if (this.cacheOptions !== undefined) {
        const { hashKey, hashSubKey, expiresIn } = this.cacheOptions;
        const subKey = this.getQuery()[hashSubKey];
        data = await documents.get(hashKey, subKey);

        if (!data) {
            data = await exec.apply(this, arguments);

            if (data) {
                await documents.save(hashKey, subKey, data);
                await documents.setExpire(hashKey, expiresIn);
            }
        }
    }

    if (this.mapFieldKey !== undefined) {
        return data.reduce((obj, item) => {
            const fieldValue = item[this.mapFieldKey];
            if (fieldValue) {
                obj[fieldValue] = item;
            }
            return obj;
        }, {});
    }
    return data;
}

mongoose.Query.prototype.toMap = function (fieldKey) {
    this.mapFieldKey = fieldKey;
    return this;
}

mongoose.Query.prototype.cache = function (options) {
    this.cacheData = true;
    this.cacheOptions = options;
    return this;
}

const fileNames = fs.readdirSync(path.resolve(__dirname, '../models'));
fileNames.forEach(fileName => {
    require(`../models/${fileName}`);
});

module.exports = mongoose;