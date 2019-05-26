const express = require('express');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    const fileNames = fs.readdirSync(path.resolve(__dirname, '../routes'));
    fileNames.forEach((fileName) => require(`../routes/${fileName}`)(app));

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../../client/build')));
        app.get('/*', (req, res) => {
            res.sendFile(path.join(__dirname, '../../client/build/index.html'));
        });
    } else {
        app.get('/', (req, res) => {
            res.send({ status: 200 });
        });
    }
}; 