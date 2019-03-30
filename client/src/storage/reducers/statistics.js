import * as actionTypes from '../actions/actionTypes';

const initialState = {
    rooms: [],
    usersOnline: 0
}

const reducers = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.SET_SITE_STATISTICS: {
            return {
                ...state,
                ...action.data
            }
        }
        case actionTypes.UPDATE_ROOMS: {
            return {
                ...state,
                rooms: action.rooms
            }
        }
        default:
            return state;
    }
}

export default reducers;