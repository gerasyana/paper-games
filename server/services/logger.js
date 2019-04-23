var colors = require('colors');

module.exports.logError = (error) => {
    const message = JSON.stringify(error);
    global.console.log(colors.red(`----->>> ${new Date()} : ${message}`));
}