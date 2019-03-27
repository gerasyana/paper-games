import io from 'socket.io-client';

import { SERVER_URL } from '../constants/configs';

class SocketClient {

    createRoom(data) {
        this.client.emit('createRoom', data);
    }

    joinRoom(data) {
        this.client.emit('joinRoom', data);
    }

    connectUser() {
        this.client = io.connect(SERVER_URL);

        this.client.on('roomCreated', (data) => {
            console.log('new room Created ', data);
        })

        this.client.on('roomClosed', (data) => {
            console.log('room Closed ', data);
        });

        this.client.on('join', (data) => {
            console.log('join to room', data);
        });
    }

    disconnectUser() {
        if (this.client) {
            this.client.disconnect();
        }
    }
}

export default new SocketClient();