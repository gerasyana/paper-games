const mongoose = require('mongoose');
const redis = require('redis');
const fs = require('fs');
const path = require('path');
const keys = require('./configs/keys');

const PORT = process.env.PORT || 5000;

initMongoose = () => {
    mongoose.Promise = global.Promise;
    mongoose.connect(keys.MONGO_URL, { useNewUrlParser: true });
    
    const fileNames = fs.readdirSync(path.resolve(__dirname, './models'));
    fileNames.forEach(fileName => {
        require(`./models/${fileName}`);
    });
}

initRoutes = app => {
    if (['production', 'ci'].includes(PORT)) {
        app.use(express.static(path.join(__dirname, 'client/build')));
        app.get('/', function (req, res) {
            res.sendFile(path.join(__dirname, 'client/build/index.html'));
        });
    } else {
        app.get('/', (req, res) => {
            res.send({ status: 200 });
        })
    }

    const fileNames = fs.readdirSync(path.resolve(__dirname, './routes'));
    fileNames.forEach(fileName => require(`./routes/${fileName}`)(app));
}

module.exports = app => {
    initMongoose();
    initRoutes(app);
} 