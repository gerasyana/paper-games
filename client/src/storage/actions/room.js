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

export const connectUser = (userId) => {
    return {
        type: actionTypes.CONNECT_USER,
        userId
    }
}
export const disconnectUser = () => {
    return {
        type: actionTypes.DISCONNECT_USER
    }
}

export const userConnected = (userId, socket) => {
    return {
        type: actionTypes.USER_CONNECTED,
        userId,
        socket
    }
}
