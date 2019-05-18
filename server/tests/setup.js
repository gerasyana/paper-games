process.env.NOVE_ENV = 'test';

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('../init-scripts/mongoose');
require('../init-scripts/routes')(app);

//require('./services/socket.test')();

const getTestsToRun = (file) => {
    const testFileNames = [];
    let directoryPath = file ? path.join(__dirname, file) : __dirname;

    fs.readdirSync(directoryPath).forEach(subfile => {
        const subfilePath = file ? `${file}/${subfile}` : `${subfile}`;
        const fileStat = fs.statSync(path.join(__dirname, subfilePath));

        if (fileStat.isDirectory()) {
            testFileNames.push(...getTestsToRun(subfilePath));
        } else if (fileStat.isFile() && subfile.match(/.test.js/)) {
            testFileNames.push(path.resolve(__dirname, subfilePath));
        }
    });
    return testFileNames;
}

getTestsToRun().forEach(unitTest => require(unitTest)(app));

