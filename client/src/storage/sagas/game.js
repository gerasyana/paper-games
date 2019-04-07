import client from '../../socket.io/client';

export function* joinRoomSaga(action) {
    yield client.joinRoom(action.data);
}

export function* createRoomSaga(action) {
    yield client.createRoom(action.data);
}

export function* leaveRoom(action) {
    yield client.leaveRoom(action.room);
}