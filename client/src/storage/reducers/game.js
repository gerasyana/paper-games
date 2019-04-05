import * as actionTypes from '../actions/actionTypes';

const initialState = {
    player1: null,
    player2: null,
    gameId: null,
    name: null,
    gameStart: false
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.ROOM_CREATED: {
            return {
                ...action.room,
                player1: action.player1,
                player2: null,
                gameStart: false
            }
        }
        case actionTypes.USER_JOINED: {
            return {
                ...state,
                ...action.data,
                gameStart: true
            }
        }
        default:
            return state;
    }
}

export default reducer;