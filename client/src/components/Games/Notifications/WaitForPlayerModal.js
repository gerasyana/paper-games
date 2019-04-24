import React, { memo } from 'react';

import Button from '../../../UI/Button/Button';
import Spinner from '../../../UI/Spinner/Spinner';
import Modal from '../../../UI/Modal/Modal';
import { waitForPlayerModalId } from '../../../constants/modalsIds';

const waitForPlayerModal = (props) => (
    <Modal id={waitForPlayerModalId}>
        <div id='body'>
            <Spinner />
            <h5 className='text-center'>Waiting for a player ....</h5>
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
)

export default memo(waitForPlayerModal);