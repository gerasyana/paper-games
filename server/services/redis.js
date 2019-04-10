const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const USER_CONNECTIONS_KEY = 'userConnections';
const USER_CONNECTIONS_EXPIRES_IN = 2 * 60 * 60;

const OPEN_ROOMS_KEY = 'openRooms';
const OPEN_ROOMS_EXPIRES_IN = 30 * 60;

const TOKENS_WHITELIST_KEY = 'validTokens';
const TOKENS_WHITELISt_EXPIRES_IN = 2 * 60 * 60;

const tokens = {
    addToWhitelist: async (token) => {
        await client.sadd(TOKENS_WHITELIST_KEY, token);
        await client.expire(TOKENS_WHITELIST_KEY, TOKENS_WHITELISt_EXPIRES_IN);
    },
    isValid: async (token) => {
        return await client.sismember(TOKENS_WHITELIST_KEY, token);
    },
    removeFromWhitelist: async (token) => {
        await client.srem(TOKENS_WHITELIST_KEY, token);
    }
}

const rooms = {
    save: async (room, data) => {
        await client.hset(OPEN_ROOMS_KEY, room, JSON.stringify(data));
        await client.expire(OPEN_ROOMS_KEY, OPEN_ROOMS_EXPIRES_IN);
    },
    get: async (name) => {
        const room = await client.hget(OPEN_ROOMS_KEY, name);
        return room ? JSON.parse(room) : {}
    },
    getAll: async () => {
        let rooms = await client.hgetall(OPEN_ROOMS_KEY);

        if (!rooms) {
            rooms = [];
        }
        return rooms;
    },
    remove: async (room) => {
        await client.hdel(OPEN_ROOMS_KEY, room);
    }
}

const sockets = {
    getAll: async () => {
        return await client.hgetall(USER_CONNECTIONS_KEY);
    },
    getUserId : async (clientId) => {
        return await client.hget(USER_CONNECTIONS_KEY, clientId);
    },
    save: async (clientId, userId) => {
        await client.hset(USER_CONNECTIONS_KEY, clientId, userId);
        await client.expire(USER_CONNECTIONS_KEY, USER_CONNECTIONS_EXPIRES_IN);
    },
    remove: async (clientId) => {
        await client.hdel(USER_CONNECTIONS_KEY, clientId);
        await client.expire(USER_CONNECTIONS_KEY, USER_CONNECTIONS_EXPIRES_IN);
    },
    getUsersOnlineCount: async () => {
        const connections = await client.hgetall(USER_CONNECTIONS_KEY);
        const userIds = connections ? [...new Set(Object.values(connections))] : []
        return userIds.length;
    }
}

const documents = {
    save: async (key, subkey, data) => {
        await client.hset(key, subkey.toString(), JSON.stringify(data));

    },
    get: async (key, subkey) => {
        const data = await client.hget(key, subkey.toString());
        return data ? JSON.parse(data) : null;
    },
    setExpire: async (key, expireIn) => {
        await client.expire(key, expireIn);
    }
}

module.exports = {
    tokens,
    rooms,
    sockets,
    documents
}