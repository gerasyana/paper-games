const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const keys = require('../configs/keys');
const { documents } = require('../services/redis');

mongoose.Promise = global.Promise;
mongoose.connect(keys.MONGO_URL, { useNewUrlParser: true });
const exec = mongoose.Query.prototype.exec;

mongoose.Query.prototype.exec = async function () {
    if (!this.cacheData) {
        return await exec.apply(this, arguments);
    }

    const { hashKey, hashSubKey, expiresIn } = this.cacheOptions;
    const subKey = this.getQuery()[hashSubKey];
    let data = await documents.get(hashKey, subKey);

    if (!data) {
        data = await exec.apply(this, arguments);

        if (data) {
            await documents.save(hashKey, subKey, data);
            await documents.setExpire(hashKey, expiresIn);
        }
    }
    return data;
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
