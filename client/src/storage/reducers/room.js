import * as actionTypes from '../actions/actionTypes';

const initialState = {
    socket: null,
    userId: null
}

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.USER_CONNECTED: {
            return {
                ...state,
                socket: action.socket,
                userId: action.userId
            };
        }
        default:
            return state;
    }
}

export default reducers;