import { put } from 'redux-saga/effects'
import client from '../../socket.io/client';

import * as actions from '../../storage/actions/actions';

export function* joinRoomSaga(action) {
    yield client.joinRoom(action.data);
}

export function* createRoomSaga(action) {
    yield put(actions.initRoom(action.data.room));
    yield client.createRoom(action.data);
}

export function* leaveRoom(action) {
    yield client.leaveRoom(action.room);
}