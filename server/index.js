const redis = require('redis');
const client = redis.createClient();

const TOKENS_WHITELIST_KEY = 'validTokens';
const TOKENS_WHITELIST_EX = 2 * 60 * 60;
const USERS_ONLINE_KEY = 'usersOnline';
const USERS_ONLINE_EX = 2 * 60 * 60;
const userId = '5c94da0338d4157514817c25';

client.sadd(USERS_ONLINE_KEY, userId);
//client.expire(TOKENS_WHITELIST_KEY, USERS_ONLINE_EX);

