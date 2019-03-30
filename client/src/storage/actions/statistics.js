import * as actionTypes from './actionTypes';

export const joinRoom = (room) => {
    return {
        type: actionTypes.JOIN_ROOM,
        room
    }
}

export const createRoom = (room) => {
    return {
        type: actionTypes.CREATE_ROOM,
        room
    }
}

export const updateRooms = (data) => {
    return {
        type: actionTypes.UPDATE_ROOMS,
        ...data
    }
}

export const setSiteStatistics = (data) => {
    return {
        type : actionTypes.SET_SITE_STATISTICS,
        data
    }
}



