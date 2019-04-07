const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();
const keys = require('../constants/redisHashKeys');

const EXPIRES_IN = 2 * 60 * 60;

const tokens = {
    addToWhitelist: async (token) => {
        await client.sadd(keys.TOKENS_WHITELIST_KEY, token);
        await client.expire(keys.TOKENS_WHITELIST_KEY, EXPIRES_IN);
    },
    isValid: async (token) => {
        return await client.sismember(keys.TOKENS_WHITELIST_KEY, token);
    },
    removeFromWhitelist: async (token) => {
        await client.srem(keys.TOKENS_WHITELIST_KEY, token);
    }
}

const rooms = {
    save: async (room, data) => {
        await client.hset(keys.OPEN_ROOMS, room, JSON.stringify(data));
        await client.expire(keys.OPEN_ROOMS, EXPIRES_IN);
    },
    getAll: async () => {
        let rooms = await client.hgetall(keys.OPEN_ROOMS);

        if (!rooms) {
            rooms = [];
        }
        return rooms;
    },
    remove: async (room) => {
        await client.hdel(keys.OPEN_ROOMS, room);
    }
}

const sockets = {
    getAll: async () => {
        return await client.hgetall(keys.USER_CONNECTIONS_KEY);
    },
    save: async (clientId, userId) => {
        await client.hset(keys.USER_CONNECTIONS_KEY, clientId, userId);
        await client.expire(keys.USER_CONNECTIONS_KEY, EXPIRES_IN);
    },
    remove: async (clientId) => {
        await client.hdel(keys.USER_CONNECTIONS_KEY, clientId);
        await client.expire(keys.USER_CONNECTIONS_KEY, EXPIRES_IN);
    },
    getUsersOnlineCount: async () => {
        const connections = await client.hgetall(keys.USER_CONNECTIONS_KEY);
        const userIds = connections ? [...new Set(Object.values(connections))] : []
        return userIds.length;
    }
}

const db = {
    save: async (key, subkey, data) => {
        await client.hset(key, subkey.toString(), JSON.stringify(data));
        await client.expire(key, EXPIRES_IN);
    },
    get: async (key, subkey) => {
        const data = await client.hget(key, subkey.toString(), JSON.stringify(data));
        return data ? JSON.parse(data) : {}
    },
}

module.exports = {
    tokens,
    rooms,
    sockets,
    db
}