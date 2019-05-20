const pino = require('pino');

const logger = pino({
  prettyPrint: { colorize: true }
});

module.exports.logError = (error) => {
    logger.error(error);
}