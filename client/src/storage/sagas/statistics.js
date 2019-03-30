import client from '../../socket.io/client';

export function* joinRoomSaga(action) {
    yield client.joinRoom({ room: action.room });;
}

export function* createRoomSaga(action) {
    yield client.createRoom({ room: action.room });
}
