import * as actionTypes from '../actions/actionTypes';

export const checkAuthentication = () => {
    return {
        type: actionTypes.CHECK_AUTHENTICATION
    }
}

export const login = (credentials) => {
    return {
        type: actionTypes.INIT_LOGIN,
        credentials
    }
}

export const loginStart = () => {
    return {
        type: actionTypes.LOGIN_START
    }
}

export const loginSuccess = (user) => {
    return {
        type: actionTypes.LOGIN_SUCCESS,
        user
    }
}

export const loginFailed = (error) => {
    return {
        type: actionTypes.LOGIN_FAILED,
        error
    }
}

export const logout = () => {
    return {
        type: actionTypes.INIT_LOGOUT
    }
}

export const logoutSuccess = () => {
    return {
        type: actionTypes.LOGOUT_SUCCESS
    }
}

export const signUp = (user) => {
    return {
        type: actionTypes.INIT_SIGNUP,
        user
    }
}

export const signUpStart = () => {
    return {
        type: actionTypes.SIGNUP_START
    }
}

export const signUpSuccess = (user) => {
    return {
        type: actionTypes.SIGNUP_SUCCESS,
        user
    }
}

export const signUpFailed = (error) => {
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
