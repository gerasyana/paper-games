import * as actionTypes from '../actions/actionTypes';

const initialState = {
    gameStart: false,
    waitForPlayer: false,
    gameFinished: false,
    playerLeftGame: false,
    room: {
        player1: null,
        player2: null,
        gameId: null,
        name: null,
    },
    gameBoard: {
        playerStep: '0',
        yourTurn: false,
        moves: Array(9)
    }
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PLAYER1_JOINED: {
            const room = {
                ...action.room
            }
            const waitForPlayer = !(room.player1 && room.player2)
            return {
                ...state,
                waitForPlayer,
                room
            }
        }
        case actionTypes.PLAYER2_JOINED: {
            return {
                ...state,
                waitForPlayer: false,
                room: {
                    ...state.room,
                    player2: action.player2
                },
                gameBoard: {
                    ...state.gameBoard,
                    yourTurn: true,
                    playerStep: 'X'
                }
            }
        }
        case actionTypes.CLOSE_GAME: {
            return {
                ...initialState,
                gameFinished: true
            }
        }
        case actionTypes.PLAYER_LEFT_GAME: {
            return {
                ...initialState,
                playerLeftGame: true
            }
        }
        case actionTypes.UPDATE_GAME_BOARD: {
            return {
                ...state,
                gameBoard: {
                    ...state.gameBoard,
                    yourTurn: !state.gameBoard.yourTurn,
                    ...action.data
                }
            }
        }
        default:
            return state;
    }
}

export default reducer;