const env = process.env.NODE_END;
let keys;

switch (env) {
    case 'production':
        keys = require('./production');
        break;
    case 'dev':
        keys = require('./dev');
        break;
    default:
        keys = require('./dev');
        break;
}

keys.AUTH_HEADER = 'x-auth'; 
module.exports = keys;

