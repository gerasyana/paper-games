import React, { memo } from 'react';

import Button from '../../../UI/Button/Button';
import Modal from '../../../UI/Modal/Modal';
import { gameIsOverModalId } from '../../../constants/modalsIds';

const gameIsOverModal = (props) => (
    <Modal id={gameIsOverModalId}>
        <div id='body'>
            <h5 className='text-center'> {props.message}</h5>
        </div>
        <div id='footer'>
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

export default memo(gameIsOverModal);