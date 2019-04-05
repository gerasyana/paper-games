const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const USER_CONNECTIONS_KEY = 'userConnections';
const OPEN_ROOMS = 'openRooms';
const TOKENS_WHITELIST_KEY = 'validTokens';
const EXPIRES_IN = 2 * 60 * 60;

class RedisService {

    async addTokenToWhitelist(token) {
        await client.sadd(TOKENS_WHITELIST_KEY, token);
        await client.expire(TOKENS_WHITELIST_KEY, EXPIRES_IN);
    }

    async isTokenValid(token) {
        return client.sismember(TOKENS_WHITELIST_KEY, token);
    }

    async removeTokenFromWhitelist(token) {
        await client.srem(TOKENS_WHITELIST_KEY, token);
    }

    async getOnlineUsersCount() {
        const userIds = await this.getOnlineUsersIds();
        return userIds.length;
    }

    async getOnlineUsersIds() {
        const connections = await this.getOnlineUsers();
        return connections ? [...new Set(Object.values(connections))] : [];
    }

    async getOnlineUsers() {
        return await client.hgetall(USER_CONNECTIONS_KEY);
    }

    async getOnlineUserId(clientId) {
        return await client.hget(USER_CONNECTIONS_KEY, clientId);
    }

    async saveUserConnection(clientId, userId) {
        await client.hset(USER_CONNECTIONS_KEY, clientId, userId);
        await client.expire(USER_CONNECTIONS_KEY, EXPIRES_IN);
    }

    async removeUserConnection(clientId) {
        await client.hdel(USER_CONNECTIONS_KEY, clientId);
        await client.expire(USER_CONNECTIONS_KEY, EXPIRES_IN);
    }

    async saveRoom(room) {
        const { gameId, name } = room;
        const rooms = await client.hgetall(OPEN_ROOMS);

        if (!rooms || !rooms[name]) {
            await client.hset(OPEN_ROOMS, name, gameId);
            await client.expire(OPEN_ROOMS, EXPIRES_IN);
        }
    }

    async getRooms() {
        let rooms = await client.hgetall(OPEN_ROOMS);

        if (!rooms) {
            rooms = [];
        }
        return rooms;
    }
}

module.exports = new RedisService();