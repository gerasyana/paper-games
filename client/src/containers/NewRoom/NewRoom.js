/* eslint-disable no-undef */
import React, { Component } from 'react'
import { connect } from 'react-redux';

import Modal from '../../UI/Modal/Modal';
import Input from '../../UI/Input/Input';
import Button from '../../UI/Button/Button';
import { validateInput } from '../../helpers/validation';
import * as actions from '../../storage/actions/actions';

const modalId = 'newRoomModal';

class NewRoom extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roomControl: {
                type: 'text',
                label: 'Room Name',
                value: '',
                placeholder: 'Enter room name'
            },
            validation: {
                required: true
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.roomControl.value !== this.state.roomControl.value ||
            nextState.roomControl.isValid !== this.state.roomControl.isValid;
    }

    setControlValue = (event) => {
        const value = event.target.value;
        const validationResults = validateInput(value, this.state.validation);
        const controlUpdated = {
            ...this.state.roomControl,
            ...validationResults,
            value
        }
        this.setState({
            roomControl: controlUpdated
        });
    }

    createRoom = () => {
        let room = this.state.roomControl.value;

        if (this.isRoomExists(room)) {
            this.setState({
                roomControl: {
                    ...this.state.roomControl,
                    errorMessage: 'Room already exist',
                    isValid: false
                }
            })
        } else {
            this.props.createRoom({
                room: {
                    gameId: this.props.gameId,
                    name: room
                },
                player1: this.props.player1
            });
            $(`#${modalId}`).modal('hide');
            this.props.roomCreated(room);
        }
    }

    isRoomExists = (roomName) => {
        const rooms = this.props.rooms.map(room => room.name);
        return rooms.includes(roomName);
    }

    render() {
        return (
            <Modal title="New Room" id={modalId} showCloseIcon>
                <Input {...this.state.roomControl} onChange={this.setControlValue} />
                <div id="footer">
                    <Button
                        type="button"
                        className='btn btn-primary mr-4'
                        disabled={!this.state.roomControl.value}
                        onClick={this.createRoom}>
                        Create room
                    </Button>
                    <Button
                        id="closeBtn"
                        type="button"
                        className="btn btn-secondary"
                        data-dismiss="modal">
                        Close
                    </Button>
                </div>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.statistics.rooms,
        player1: state.auth.user
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        createRoom: (data) => dispatch(actions.createRoom(data))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(NewRoom);