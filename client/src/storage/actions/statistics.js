import * as actionTypes from './actionTypes';

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



