import io from 'socket.io-client';

import { SERVER_URL } from '../constants/configs';
import store from '../storage/store';
import * as actions from '../storage/actions/actions';

class SocketClient {

    createRoom(data) {
        this.client.emit('createRoom', data);
    }

    joinRoom(data) {
        this.client.emit('joinRoom', data);
    }

    connectUser() {
        this.client = io.connect(SERVER_URL);
        
        this.client.on('userConnected', (data) => {
            store.dispatch(actions.setSiteStatistics(data));
        })

        this.client.on('userDisconnected', (data) => {
            store.dispatch(actions.setSiteStatistics(data));
        })
        
        this.client.on('roomCreated', (data) => {
            store.dispatch(actions.updateRooms(data));
        });

        this.client.on('roomClosed', (data) => {
            store.dispatch(actions.updateRooms(data));
        });
    }

    disconnectUser() {
        this.client.disconnect();
    }
}

export default new SocketClient();