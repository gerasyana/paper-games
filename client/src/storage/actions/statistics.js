import * as actionTypes from './actionTypes';

export const updateRooms = (rooms) => {
    return {
        type: actionTypes.UPDATE_ROOMS,
        rooms
    }
}

export const setSiteStatistics = (data) => {
    return {
        type : actionTypes.SET_SITE_STATISTICS,
        data
    }
}



