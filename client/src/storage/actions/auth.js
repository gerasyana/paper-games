import * as actionTypes from '../actions/actionTypes';

export function checkAuthentication() {
    return {
        type: actionTypes.CHECK_AUTHENTICATION
    }
}

export function login(credentials) {
    return {
        type: actionTypes.INIT_LOGIN,
        credentials
    }
}

export function loginStart() {
    return {
        type: actionTypes.LOGIN_START
    }
}

export function loginSuccess(user) {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        user
    }
}

export function loginFailed(error) {
    return {
        type: actionTypes.LOGIN_FAILED,
        error
    }
}

export function logout() {
    return {
        type: actionTypes.INIT_LOGOUT
    }
}

export function logoutSuccess() {
    return {
        type: actionTypes.LOGOUT_SUCCESS
    }
}

export function signUp(user) {
    return {
        type: actionTypes.INIT_SIGNUP,
        user
    }
}

export function signUpStart() {
    return {
        type: actionTypes.SIGNUP_START
    }
}

export function signUpSuccess(user) {
    return {
        type: actionTypes.SIGNUP_SUCCESS,
        user
    }
}

export function signUpFailed(error) {
    return {
        type: actionTypes.SIGNUP_FAILED,
        error
    }
}

export const setAuthTimeout = (expirationTime) => {
    return {
        type: actionTypes.AUTH_SET_TIMEOUT,
        expirationTime
    }
}

export const setLoginRedirectUrl = (redirectUrl) => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_URL,
        redirectUrl
    }
}