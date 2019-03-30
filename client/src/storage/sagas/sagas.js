import { all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import * as authSagas from './auth';
import * as statisticsSagas from './statistics';

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.CHECK_AUTHENTICATION, authSagas.checkAuthenticationSaga),
        takeEvery(actionTypes.AUTH_SET_TIMEOUT, authSagas.setAuthTimeoutSaga),
        takeEvery(actionTypes.INIT_LOGIN, authSagas.loginSaga),
        takeEvery(actionTypes.INIT_SIGNUP, authSagas.signUpSaga),
        takeEvery(actionTypes.INIT_LOGOUT, authSagas.logoutSaga)
    ])
}

export function* watchStatistics() {
    yield all([
        takeEvery(actionTypes.JOIN_ROOM, statisticsSagas.joinRoomSaga),
        takeEvery(actionTypes.CREATE_ROOM, statisticsSagas.createRoomSaga)
    ])
}