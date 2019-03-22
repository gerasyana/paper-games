import axios from 'axios';

import * as keys from '../constants/localStorageKeys';

const baseURL = process.env.SERVER_URL || 'http://localhost:5000';

const instance = axios.create({
    baseURL: `${baseURL}/api`,
    headers: {
        common: {
            'Access-Control-Allow-Origin': baseURL,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        },
        post: {
            'Content-Type': 'application/json'
        }
    }
});

instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem(keys.TOKEN_KEY);
    if (token) {
        config.headers['x-auth'] = token;     
    }
    return config;
});

export default instance;