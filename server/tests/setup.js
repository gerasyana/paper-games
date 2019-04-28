const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('../init-scripts/mongoose');
require('../init-scripts/routes')(app);

const getTestFilesFromDirectory = (file) => {
    const testFileNames = [];
    let directoryPath = file ? path.join(__dirname, file) : __dirname;

    fs.readdirSync(directoryPath).forEach(subfile => {
        const subfilePath = file ? `${file}/${subfile}` : `${subfile}`;
        const fileStat = fs.statSync(path.join(__dirname, subfilePath));

        if (fileStat.isDirectory()) {
            testFileNames.push(...getTestFilesFromDirectory(subfilePath));
        } else if (fileStat.isFile() && subfile.match(/.test.js/)) {
            testFileNames.push(path.resolve(__dirname, subfilePath));
        }
    });
    return testFileNames;
}

const unitTests = getTestFilesFromDirectory();
unitTests.forEach(unitTest => require(unitTest)(app));
