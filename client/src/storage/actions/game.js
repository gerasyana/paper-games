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
        type: actionTypes.LEAVE_ROOM,
        room
    }
}

export const player2Joined = (players) => {
    return {
        type: actionTypes.PLAYER2_JOINED,
        players
    }
}

export const player1Joined = (room) => {
    return {
        type: actionTypes.PLAYER1_JOINED,
        room
    }
}

export const closeRoom = () => {
    return {
        type: actionTypes.CLOSE_ROOM
    }
}

export const playerLeftRoom = () => {
    return {
        type: actionTypes.PLAYER_LEFT_ROOM
    }
}

export const playerMadeMove = (data) => {
    return {
        type: actionTypes.PLAYER_MADE_MOVE,
        data
    }
}

export const updateGameBoard = (gameBoard) => {
    return {
        type: actionTypes.UPDATE_GAME_BOARD,
        gameBoard
    }
}
