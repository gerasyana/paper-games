import * as actionTypes from '../actions/actionTypes';

const initialState = {
    player1: null,
    player2: null,
    gameId: null,
    name: null,
    gameStart: false,
    gameFinished: false,
    userLeftGame: false
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
        case actionTypes.CLOSE_GAME: {
            return {
                ...state,
                gameFinished: true
            }
        }
        case actionTypes.USER_LEFT_GAME: {
            return {
                ...state,
                userLeftGame: true
            }
        }
        default:
            return state;
    }
}

export default reducer;