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
        gameIsOver: false,
        youWon: false,
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
                gameStarted: Object.keys(room.players).length === 2,
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
                ...state,
                playerLeftRoom: true,
                room: {
                    ...action.room
                },
                gameBoard: {
                    ...initialState.gameBoard
                }
            }
        }
        case actionTypes.TOGGLE_PLAYER_TURN: {
            return {
                ...state,
                gameBoard: {
                    ...state.gameBoard,
                    ...action.gameBoard,
                    yourTurn: !state.gameBoard.yourTurn
                }
            }
        }
        case actionTypes.GAME_IS_OVER: {
            return {
                ...state,
                gameBoard: {
                    ...state.gameBoard,
                    gameIsOver: true,
                    ...action.gameBoard
                }
            }
        }
        case actionTypes.WAIT_FOR_PLAYER: {
            return {
                ...state,
                playerLeftRoom: false,
                gameStarted: false
            }
        }
        default:
            return state;
    }
}

export default reducer;