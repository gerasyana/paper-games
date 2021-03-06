import axios from 'axios';

import * as keys from '../constants/localStorageKeys';
import { SERVER_URL } from '../constants/configs';

const instance = axios.create({
    baseURL: `${SERVER_URL}/api`,
    headers: {
        common: {
            'Access-Control-Allow-Origin': SERVER_URL,
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        },
        post: {
            'Content-Type': 'application/json'
        }
    }
});

instance.interceptors.request.use((req) => {
    const token = localStorage.getItem(keys.TOKEN_KEY);
 
    if (token) {
        req.headers['x-auth'] = token;
    }
    return req;
});

export default instance;