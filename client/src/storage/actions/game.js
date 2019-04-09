import * as actionTypes from '../actions/actionTypes';

export const joinRoom = (data) => {
    return {
        type: actionTypes.JOIN_ROOM,
        data
    }
}

export const createRoom = (data) => {
    return {
        type: actionTypes.CREATE_ROOM,
        data
    }
}

export const leaveRoom = (room) => {
    return {
        type : actionTypes.LEAVE_ROOM,
        room
    }
}

export const player2Joined = (player2) => {
    return {
        type: actionTypes.PLAYER2_JOINED,
        player2
    }
}

export const player1Joined = (room) => {
    return {
        type: actionTypes.PLAYER1_JOINED,
        room
    }
}

export const closeGame = () => {
    return {
        type: actionTypes.CLOSE_GAME
    }
}

export const playerLeftGame = () => {
    return {
        type :  actionTypes.PLAYER_LEFT_GAME
    }
}

export const playerMadeMove = (data) => {
    return {
        type :  actionTypes.PLAYER_MADE_MOVE,
        data
    }
}

export const updateGameBoard = (data) => {
    return {
        type :  actionTypes.UPDATE_GAME_BOARD,
        data
    }
}
