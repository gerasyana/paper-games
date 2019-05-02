import * as actionTypes from '../actions/actionTypes';
import { gameBoards } from '../../constants/games';

const initialState = {
    gameStarted: false,
    roomClosed: false,
    playerLeftRoom: false,
    room: {
        gameId: null,
        name: null,
        players: []
    },
    gameBoard: {}
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.PLAYER1_JOINED: {
            const { room, gameBoard } = action.data;
            return {
                ...state,
                playerLeftRoom: false,
                roomClosed: false,
                gameStarted: Object.keys(room.players).length === 2,
                gameBoard,
                room
            }
        }
        case actionTypes.PLAYER2_JOINED: {
            const { players, gameBoard } = action.data;
            return {
                ...state,
                gameStarted: Object.keys(players).length === 2,
                room: {
                    ...state.room,
                    players
                },
                gameBoard
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
        case actionTypes.RESTART_GAME: {
            return {
                ...state,
                gameBoard: {
                    ...gameBoards[state.room.gameId],
                    yourTurn: state.gameBoard.yourTurn,
                    playerStep: state.gameBoard.playerStep
                }
            }
        }
        case actionTypes.GAME_BOARD_UPDATED: {
            return {
                ...state,
                gameBoard: {
                    ...state.gameBoard,
                    ...action.gameBoard
                }
            }
        }
        case actionTypes.CLEAN_GAME_BOARD: {
            return initialState;
        }
        default:
            return state;
    }
}

export default reducer;