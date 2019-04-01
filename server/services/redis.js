const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();


const USERS_ONLINE_KEY = 'usersOnline';
const USER_ROOMS_KEY = 'userRooms';
const TOKENS_WHITELIST_KEY = 'validTokens';
const EXPIRES_IN = 2 * 60 * 60;

class RedisService {

    async addTokenToWhitelist(token, userId) {
        await client.sadd(TOKENS_WHITELIST_KEY, token);
        await client.expire(TOKENS_WHITELIST_KEY, EXPIRES_IN);
        await client.sadd(USERS_ONLINE_KEY, userId);
        await client.expire(USERS_ONLINE_KEY, EXPIRES_IN);
    }

    async isTokenValid(token, callback) {
        return client.sismember(TOKENS_WHITELIST_KEY, token);
    }

    async removeTokenFromWhitelist(token, userId) {
        await client.srem(TOKENS_WHITELIST_KEY, token);
        await client.srem(USERS_ONLINE_KEY, userId);
    }

    async getOnlineUsersCount() {
        const userIds = await client.smembers(USERS_ONLINE_KEY);
        return userIds ? userIds.length : 0;
    }

    async saveUserRoom(data) {
        const { userId, gameId, room } = data;
        const rooms = await client.hgetall(USER_ROOMS_KEY);
        let userRooms;

        if (rooms) {
            const userRoomsParsed = rooms[userId] ? JSON.parse(rooms[userId]) : {};
            let gameRooms = userRoomsParsed ? userRoomsParsed[gameId] : [];
            gameRooms.push(room);

            userRooms = {
                ...userRoomsParsed,
                [gameId]: gameRooms
            };
        } else {
            userRooms = {
                [gameId]: [room]
            }
        }

        await client.hset(USER_ROOMS_KEY, userId, JSON.stringify(userRooms));
        await client.expire(USER_ROOMS_KEY, EXPIRES_IN);
    }

    async clearUserRooms(userId) {
        await client.hdel(USER_ROOMS_KEY, userId);
        await client.expire(USER_ROOMS_KEY, EXPIRES_IN);
    }
}

module.exports = new RedisService();