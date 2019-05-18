var colors = require('colors');

module.exports.logError = (error) => {
    global.console.log(colors.red(`----->>> ${new Date()} : ${error}`));
}