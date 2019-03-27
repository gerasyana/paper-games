import { put } from 'redux-saga/effects';

import client from '../../socket.io/client';
import * as actions from '../actions/actions';

export function* joinRoomSaga(action) {
    yield client.joinRoom(action.socket, action.data);
}

export function* createRoomSaga(action) {
    yield client.createRoom(action.socket, action.data);
}

export function* connectUser(action) {
    yield client.connectUser(action.userId);
    yield put(actions.userConnected(action.userId));
}

export function* disconnectUser() {
    yield client.disconnectUser();
}