const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const TOKENS_WHITELIST_KEY = 'validTokens';
const TOKENS_WHITELIST_EX = 2 * 60 * 60;
const USERS_ONLINE_KEY = 'usersOnline';
const USERS_ONLINE_EX = 2 * 60 * 60;

class RedisService {

    addTokenToWhitelist(token, userId) {
        client.sadd(TOKENS_WHITELIST_KEY, token);
        client.expire(TOKENS_WHITELIST_KEY, TOKENS_WHITELIST_EX);
        client.sadd(USERS_ONLINE_KEY, userId);
        client.expire(USERS_ONLINE_KEY, USERS_ONLINE_EX);
    }

    async isTokenValid(token, callback) {
        return client.sismember(TOKENS_WHITELIST_KEY, token);
    }

    removeTokenFromWhitelist(token, userId) {
        client.srem(TOKENS_WHITELIST_KEY, token);
        client.srem(USERS_ONLINE_KEY, userId);
    }

    async getOnlineUsersCount() {
        const userIds = await client.smembers(USERS_ONLINE_KEY);
        return userIds ? userIds.length : 0;
    }
}

module.exports = new RedisService();