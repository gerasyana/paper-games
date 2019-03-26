import * as actionTypes from '../actions/actionTypes';

const initialState = {
    redirectUrl: '/',
    user: null,
    isAuthenticated: false,
    loading: false,
    token: null,
    error: null
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.LOGIN_START:
        case actionTypes.SIGNUP_START: {
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
                error: null
            };
        }
        case actionTypes.LOGIN_SUCCESS:
        case actionTypes.SIGNUP_SUCCESS: {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.user
            };
        }
        case actionTypes.LOGIN_FAILED:
        case actionTypes.SIGNUP_FAILED: {
            return {
                ...state,
                loading: false,
                isAuthenticated: false,
                error: action.error
            };
        }
        case actionTypes.LOGOUT_SUCCESS: {
            return {
                ...state,
                isAuthenticated: false,
                user: null
            };
        }
        case actionTypes.SET_REDIRECT_URL: {
            return {
                ...state,
                redirectUrl: action.redirectUrl
            };
        }
        default:
            return state;
    }
}

export default reducer;
