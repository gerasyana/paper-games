import { put, delay } from 'redux-saga/effects'

import client from '../../socket.io/client';
import * as actions from '../actions/actions';
import * as userRouters from '../../axios/routes/user';
import * as keys from '../../constants/localStorageKeys';

export function* logout(action) {
  yield userRouters.logout();
  yield removeLocalStorage();
  yield put(actions.logoutSuccess());
  yield client.disconnectUser();
}

export function* checkAuthentication(action) {
  const token = yield localStorage.getItem(keys.TOKEN_KEY);

  if (token) {
    const expirationDate = yield new Date(localStorage.getItem(keys.EXPIRATION_DATE_KEY));

    if (expirationDate <= new Date()) {
      yield put(actions.logout());
    } else {
      const response = yield userRouters.getUser();

      if (response.status === 200 && response.data) {
        yield put(actions.loginSuccess(response.data));

        const expiresIn = yield (expirationDate.getTime() - new Date().getTime());
        yield put(actions.setAuthTimeout(expiresIn));

        yield client.connectUser(response.data.id);
      }
    }
  }
}

export function* login(action) {
  yield put(actions.loginStart());
  const response = yield userRouters.login(action.credentials);

  if (response.data.error || response.status !== 200) {
    yield put(actions.loginFailed(response.data.error));
  } else {
    yield put(actions.loginSuccess(response.data.user));
    yield setLocalStorage(response.data.tokenDetails);
    yield client.connectUser(response.data.user.id);
  }
}

export function* signUp(action) {
  yield put(actions.signUpStart());
  const response = yield userRouters.signUp(action.user);

  if (response.data.error || response.status !== 200) {
    yield put(actions.signUpFailed(response.data.error));
  } else {
    yield put(actions.signUpSuccess(response.data.user));
    yield setLocalStorage(response.data.tokenDetails);
    yield client.connectUser(response.data.user.id);
  }
}

export function* setAuthTimeout(action) {
  yield delay(action.expirationTime);
  yield put(actions.logout());
}

function setLocalStorage(tokenDetails) {
  const { expirationDate } = tokenDetails;
  const expiresIn = getExpirationTime(expirationDate);
  localStorage.setItem(keys.TOKEN_KEY, tokenDetails.token);
  localStorage.setItem(keys.EXPIRATION_DATE_KEY, tokenDetails.expirationDate);
  put(actions.setAuthTimeout(expiresIn));
}

function removeLocalStorage() {
  localStorage.removeItem(keys.TOKEN_KEY);
  localStorage.removeItem(keys.EXPIRATION_DATE_KEY);
}

function getExpirationTime(date) {
  const expirationDate = new Date(date);
  return expirationDate.getTime() - new Date().getTime();
}