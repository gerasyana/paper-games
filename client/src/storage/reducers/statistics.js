import * as actionTypes from '../actions/actionTypes';

const initialState = {
    rooms: [],
    usersOnline: 0,
    gamesRating: {}
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
        case actionTypes.SET_GAME_RATING: {
            return {
                ...state,
                gamesRating: {
                    ...state.gamesRating,
                    [action.gameId]: action.rating
                }
            }
        }
        default:
            return state;
    }
}

export default reducers;