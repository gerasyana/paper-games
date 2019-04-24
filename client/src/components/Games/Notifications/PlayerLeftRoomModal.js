import React, { memo } from 'react';

import Button from '../../../UI/Button/Button';
import Modal from '../../../UI/Modal/Modal';
import { playerLeftRoomModalId } from '../../../constants/modalsIds';

const playerLeftRoomModal = (props) => (
    <Modal id={playerLeftRoomModalId}>
        <div id='body'>
            <h5 className='text-center'>Player has left the room. Game is over</h5>
        </div>
        <div id='footer'>
            <Button
                id="closeBtn"
                type="button"
                className="btn btn-primary mr-4"
                onClick={() => props.startWaitingForPlayer()}>
                Wait for player
            </Button>
            <Button
                id="closeBtn"
                type="button"
                className="btn btn-secondary"
                onClick={() => props.leaveRoom()}>
                Leave room
            </Button>
        </div>
    </Modal>
);

export default memo(playerLeftRoomModal);