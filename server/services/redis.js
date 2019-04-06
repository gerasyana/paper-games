const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const USER_CONNECTIONS_KEY = 'userConnections';
const OPEN_ROOMS = 'openRooms';
const TOKENS_WHITELIST_KEY = 'validTokens';
const EXPIRES_IN = 2 * 60 * 60;

const tokens = {
    addToWhitelist: async (token) => {
        await client.sadd(TOKENS_WHITELIST_KEY, token);
        await client.expire(TOKENS_WHITELIST_KEY, EXPIRES_IN);
    },
    isValid: async (token) => {
        return await client.sismember(TOKENS_WHITELIST_KEY, token);
    },
    removeFromWhitelist: async (token) => {
        await client.srem(TOKENS_WHITELIST_KEY, token);
    }
}

const rooms = {
    save: async (room) => {
        const { gameId, name } = room;
        const rooms = await client.hgetall(OPEN_ROOMS);

        if (!rooms || !rooms[name]) {
            await client.hset(OPEN_ROOMS, name, gameId);
            await client.expire(OPEN_ROOMS, EXPIRES_IN);
        }
    },
    getAll: async () => {
        let rooms = await client.hgetall(OPEN_ROOMS);

        if (!rooms) {
            rooms = [];
        }
        return rooms;
    },
    refresh: async (availableRooms) => {
        const rooms = await client.hgetall(OPEN_ROOMS);
        const roomNames = rooms ? [...Object.keys(rooms)] : [];
        roomNames.forEach(async (roomName) => {
            if (!availableRooms[roomName]) {
                await client.hdel(OPEN_ROOMS, roomName);
            }
        })
    }
}

const sockets = {
    getAll: async () => {
        return await client.hgetall(USER_CONNECTIONS_KEY);
    },
    save: async (clientId, userId) => {
        await client.hset(USER_CONNECTIONS_KEY, clientId, userId);
        await client.expire(USER_CONNECTIONS_KEY, EXPIRES_IN);
    },
    remove: async (clientId) => {
        await client.hdel(USER_CONNECTIONS_KEY, clientId);
        await client.expire(USER_CONNECTIONS_KEY, EXPIRES_IN);
    },
    getUsersOnlineCount: async () => {
        const connections = await client.hgetall(USER_CONNECTIONS_KEY);
        const userIds = connections ? [...new Set(Object.entries(connections))] : []
        return userIds.length;
    }
}
module.exports = {
    tokens,
    rooms,
    sockets
}