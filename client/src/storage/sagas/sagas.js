import { all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import * as authSagas from './auth';
import * as gameSagas from './game';

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.CHECK_AUTHENTICATION, authSagas.checkAuthenticationSaga),
        takeEvery(actionTypes.AUTH_SET_TIMEOUT, authSagas.setAuthTimeoutSaga),
        takeEvery(actionTypes.INIT_LOGIN, authSagas.loginSaga),
        takeEvery(actionTypes.INIT_SIGNUP, authSagas.signUpSaga),
        takeEvery(actionTypes.INIT_LOGOUT, authSagas.logoutSaga)
    ])
}

export function* watchGame() {
    yield all([
        takeEvery(actionTypes.JOIN_ROOM, gameSagas.joinRoomSaga),
        takeEvery(actionTypes.CREATE_ROOM, gameSagas.createRoomSaga)
    ])
}