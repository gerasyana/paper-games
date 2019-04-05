import client from '../../socket.io/client';

export function* joinRoomSaga(action) {
    yield client.joinRoom(action.data);
}

export function* createRoomSaga(action) {
    yield client.createRoom(action.data);
}
