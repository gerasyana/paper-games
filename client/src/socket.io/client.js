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

    connectUser(userId) {
        this.client = io.connect(SERVER_URL);

        this.client.emit('setUserId', { userId });

        this.client.on('userConnected', (data) => {
            store.dispatch(actions.setSiteStatistics(data));
        })

        this.client.on('userDisconnected', (data) => {
            store.dispatch(actions.setSiteStatistics(data));
        })

        this.client.on('roomsUpdated', (rooms) => {
            store.dispatch(actions.updateRooms(rooms));
        });

        this.client.on('closeRoom', () => {
            store.dispatch(actions.closeRoom());
        });

        this.client.on('playerLeftRoom', () => {
            store.dispatch(actions.playerLeftRoom());
        });

        this.client.on('player1Joined', (room) => {
            store.dispatch(actions.player1Joined(room));
        });

        this.client.on('player2Joined', (players) => {
            store.dispatch(actions.player2Joined(players));
        });

        this.client.on('updateGameBoard', (gameBoard) => {
            store.dispatch(actions.updateGameBoard(gameBoard));
        });
    }

    leaveRoom(name) {
        this.client.emit('leaveRoom', { name });
    }

    playerMadeMove(data) {
        this.client.emit('playerMadeMove', data);
    }

    disconnectUser() {
        if (this.client) {
            this.client.disconnect();
        }
    }
}

export default new SocketClient();