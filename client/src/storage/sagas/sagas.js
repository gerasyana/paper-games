import { all, takeEvery } from 'redux-saga/effects';

import * as actionTypes from '../actions/actionTypes';
import { loginSaga, logoutSaga, signUpSaga, checkAuthenticationSaga, setAuthTimeoutSaga} from './auth';

export function* watchAuth() {
    yield all([
        takeEvery(actionTypes.CHECK_AUTHENTICATION, checkAuthenticationSaga),
        takeEvery(actionTypes.AUTH_SET_TIMEOUT, setAuthTimeoutSaga),
        takeEvery(actionTypes.INIT_LOGIN, loginSaga),
        takeEvery(actionTypes.INIT_SIGNUP, signUpSaga),
        takeEvery(actionTypes.INIT_LOGOUT, logoutSaga)
    ])
}