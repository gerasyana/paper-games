import * as actionTypes from './actionTypes';

export const updateRooms = rooms => {
    return {
        type: actionTypes.UPDATE_ROOMS,
        rooms
    }
}

export const setSiteStatistics = data => {
    return {
        type: actionTypes.SET_SITE_STATISTICS,
        data
    }
}

export const getGameRating = gameId => {
    return {
        type: actionTypes.GET_GAME_RATING,
        gameId
    }
}

export const setGameRating = (gameId, rating) => {
    return {
        type: actionTypes.SET_GAME_RATING,
        gameId,
        rating
    }
}


