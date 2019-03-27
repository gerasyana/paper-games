import io from 'socket.io-client';

import { SERVER_URL } from '../constants/configs';
const socket = io.connect(SERVER_URL);

export function createRoom(data) {
    socket.emit('createRoom', data);
}
