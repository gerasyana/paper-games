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
        case actionTypes.SIGNUP_START:
        case actionTypes.RESET_PASSWORD_START: {
            return {
                ...state,
                loading: true,
                isAuthenticated: false,
                error: null
            };
        }
        case actionTypes.LOGIN_SUCCESS:
        case actionTypes.SIGNUP_SUCCESS:
        case actionTypes.RESET_PASSWORD_SUCCESS: {
            return {
                ...state,
                loading: false,
                isAuthenticated: true,
                user: action.user
            };
        }
        case actionTypes.LOGIN_FAILED:
        case actionTypes.SIGNUP_FAILED:
        case actionTypes.RESET_PASSWORD_FAILED: {
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
        case actionTypes.SET_AUTH_REDIRECT_URL: {
            return {
                ...state,
                redirectUrl: action.redirectUrl
            };
        }
        case actionTypes.SET_USER_TOTAL_POINTS: {
            return {
                ...state,
                user: {
                    ...state.user,
                    totalPoints: action.totalPoints
                }
            }
        }
        default:
            return state;
    }
}

export default reducer;
