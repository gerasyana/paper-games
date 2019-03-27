const redis = require('redis');
const client = redis.createClient();

const TOKENS_WHITELIST_KEY = 'validTokens';

const addTokenToWhitelist = (token, expiresIn) => {
    client.sadd(TOKENS_WHITELIST_KEY, token);
    client.expire(TOKENS_WHITELIST_KEY, expiresIn);
}

const isTokenValid = (token, callback) => {
    return client.sismember(TOKENS_WHITELIST_KEY, token, callback);
}

const removeTokenFromWhitelist = (token) => {
    client.srem(TOKENS_WHITELIST_KEY, token);
}

module.exports = {
    addTokenToWhitelist,
    isTokenValid,
    removeTokenFromWhitelist
};