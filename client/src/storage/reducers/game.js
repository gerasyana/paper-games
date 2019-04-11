import * as actionTypes from '../actions/actionTypes';

const initialState = {
    gameStarted: false,
    roomClosed: false,
    playerLeftRoom: false,
    room: {
        gameId: null,
        name: null,
        players: []
    },
    gameBoard: {
        gameFinished: false,
        yourTurn: false,
        playerStep: 'O',
        moves: new Array(9).fill(null)
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PLAYER1_JOINED: {
            const room = {
                ...action.room
            }
            return {
                ...state,
                playerLeftRoom: false,
                roomClosed: false,
                gameStarted: Object.keys(action.room.players).length === 2,
                gameBoard: {
                    ...state.gameBoard,
                },
                room
            }
        }
        case actionTypes.PLAYER2_JOINED: {
            return {
                ...state,
                gameStarted: Object.keys(action.players).length === 2,
                room: {
                    ...state.room,
                    players: action.players
                },
                gameBoard: {
                    ...state.gameBoard,
                    yourTurn: true,
                    playerStep: 'X'
                }
            }
        }
        case actionTypes.CLOSE_ROOM: {
            return {
                ...initialState,
                roomClosed: true
            }
        }
        case actionTypes.PLAYER_LEFT_ROOM: {
            return {
                ...initialState,
                playerLeftRoom: true
            }
        }
        case actionTypes.UPDATE_GAME_BOARD: {
            return {
                ...state,
                gameBoard: {
                    ...state.gameBoard,
                    ...action.gameBoard,
                    yourTurn: !state.gameBoard.yourTurn
                }
            }
        }
        default:
            return state;
    }
}

export default reducer;