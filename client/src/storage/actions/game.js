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

export const roomCreated = (room, player1) => {
    return {
        type: actionTypes.ROOM_CREATED,
        room,
        player1
    }
}

export const userJoined = (data) => {
    return {
        type: actionTypes.USER_JOINED,
        data
    }
}