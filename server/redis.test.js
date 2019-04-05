const asyncRedis = require("async-redis");
const client = asyncRedis.createClient();

const USERS_ONLINE_KEY = 'usersOnline';

client.expire(USERS_ONLINE_KEY, 0);


