import client from '../../socket.io/client';

export function* joinRoom(action) {
    yield client.joinRoom(action.data);
}

export function* createRoom(action) {
    yield client.createRoom(action.data);
}

export function* leaveRoom(action) {
    yield client.leaveRoom(action.room);
}

export function* playerMadeMove(action) {
    yield client.playerMadeMove(action.data);
}