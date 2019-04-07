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

export const initRoom = (room) => {
    return {
        type : actionTypes.INIT_ROOM,
        room
    }
}

export const roomCreated = (room, player1) => {
    return {
        type: actionTypes.ROOM_CREATED,
        room,
        player1
    }
}

export const leaveRoom = (room) => {
    return {
        type : actionTypes.LEAVE_ROOM,
        room
    }
}

export const userJoined = (data) => {
    return {
        type: actionTypes.USER_JOINED,
        data
    }
}

export const closeGame = () => {
    return {
        type: actionTypes.CLOSE_GAME
    }
}

export const userLeftGame = () => {
    return {
        type :  actionTypes.USER_LEFT_GAME
    }
}