import { all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import * as authSagas from './auth';
import * as gameSagas from './game';
import * as statistics from './statistics';

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.CHECK_AUTHENTICATION, authSagas.checkAuthentication),
        takeEvery(actionTypes.AUTH_SET_TIMEOUT, authSagas.setAuthTimeout),
        takeEvery(actionTypes.INIT_LOGIN, authSagas.login),
        takeEvery(actionTypes.INIT_SIGNUP, authSagas.signUp),
        takeEvery(actionTypes.INIT_LOGOUT, authSagas.logout)
    ])
}

export function* watchGame() {
    yield all([
        takeEvery(actionTypes.JOIN_ROOM, gameSagas.joinRoom),
        takeEvery(actionTypes.CREATE_ROOM, gameSagas.createRoom),
        takeEvery(actionTypes.LEAVE_ROOM, gameSagas.leaveRoom),
        takeEvery(actionTypes.PLAYER_MADE_MOVE, gameSagas.playerMadeMove),
        takeEvery(actionTypes.UPDATE_GAME_BOARD, gameSagas.updateGameBoard),
    ])
}

export function* watchStatistics() {
    yield all([
        takeEvery(actionTypes.GET_GAME_RATING, statistics.getGameRating),
    ])
};