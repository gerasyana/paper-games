const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const keys = require('../configs/keys');

mongoose.Promise = global.Promise;
mongoose.connect(keys.MONGO_URL, { useNewUrlParser: true });

const fileNames = fs.readdirSync(path.resolve(__dirname, '../models'));
fileNames.forEach(fileName => {
    require(`../models/${fileName}`);
});
