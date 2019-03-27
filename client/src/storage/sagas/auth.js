import { put, delay } from 'redux-saga/effects'

import * as actions from '../actions/actions';
import * as userRouters from '../../axios/routes/user';
import * as keys from '../../constants/localStorageKeys';

export function* logoutSaga(action) {
  yield localStorage.removeItem(keys.TOKEN_KEY);
  yield localStorage.removeItem(keys.EXPIRATION_DATE_KEY);
  yield put(actions.logoutSuccess());
  yield put(actions.disconnectUser());
}

export function* checkAuthenticationSaga(action) {
  const token = yield localStorage.getItem(keys.TOKEN_KEY);

  if (token) {
    const expirationDate = yield new Date(localStorage.getItem(keys.EXPIRATION_DATE_KEY));

    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const response = yield userRouters.getUser();

      if (response.data) {
        yield put(actions.loginSuccess(response.data));

        const expiresIn = yield (expirationDate.getTime() - new Date().getTime());
        yield put(actions.setAuthTimeout(expiresIn));

        yield put(actions.connectUser());
      }
    }
  }
}

export function* loginSaga(action) {
  yield put(actions.loginStart());
  const response = yield userRouters.login(action.credentials);

  if (response.data.error) {
    yield put(actions.loginFailed(response.data.error));
  } else {
    yield put(actions.loginSuccess(response.data.user));

    const { expirationDate } = response.data.tokenDetails;
    const expiresIn = yield getExpirationTime(expirationDate);
    yield setLocalStorage(response.data.tokenDetails);
    yield put(actions.setAuthTimeout(expiresIn));

    yield put(actions.connectUser());
  }
}

export function* signUpSaga(action) {
  yield put(actions.signUpStart());
  const response = yield userRouters.signUp(action.user);

  if (response.data.error) {
    yield put(actions.signUpFailed(response.data.error));
  } else {
    yield put(actions.signUpSuccess(response.data.user));

    const { expirationDate } = response.data.tokenDetails;
    const expiresIn = yield getExpirationTime(expirationDate);
    yield setLocalStorage(response.data.tokenDetails);
    yield put(actions.setAuthTimeout(expiresIn));

    yield put(actions.connectUser());
  }
}

export function* setAuthTimeoutSaga(action) {
  yield delay(action.expirationTime);
  yield put(actions.logout());
}

function setLocalStorage(tokenDetails) {
  localStorage.setItem(keys.TOKEN_KEY, tokenDetails.token);
  localStorage.setItem(keys.EXPIRATION_DATE_KEY, tokenDetails.expirationDate);
}

function getExpirationTime(date) {
  const expirationDate = new Date(date);
  return expirationDate.getTime() - new Date().getTime();
}