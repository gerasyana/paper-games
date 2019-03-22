import axios from '../axios';

export function getUser() {
    return axios.get('/user');
}

export function login(data) {
    return axios.post('/user/login', data);
}

export function signUp(data) {
    return axios.post('/user/signup', data);
}

export function logout() {
    return axios.post('/user/logout');
}