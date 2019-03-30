import axios from '../axios';

export const getUser = () => {
    return axios.get('/user');
}

export const login = (data) => {
    return axios.post('/user/login', data);
}

export const signUp = (data) => {
    return axios.post('/user/signup', data);
}

export const logout = () => {
    return axios.post('/user/logout');
}