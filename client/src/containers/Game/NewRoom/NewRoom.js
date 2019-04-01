import React, { Component } from 'react'
import { connect } from 'react-redux';

import Modal from '../../../UI/Modal/Modal';
import Input from '../../../UI/Input/Input';
import Button from '../../../UI/Button/Button';
import { validateInput } from '../../../helpers/validation';
import * as actions from '../../../storage/actions/actions';

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
        const room = this.state.roomControl.value;

        if (this.props.rooms.includes(`room-${room}`)) {
            this.setState({
                roomControl: {
                    ...this.state.roomControl,
                    errorMessage: 'Room already exist',
                    isValid: false
                }
            })
        } else {
            this.props.createRoom({
                room,
                userId : this.props.userId,
                gameId: this.props.gameId
            });
        }
    }

    render() {
        return (
            <Modal title="New Room" id={this.props.modalId}>
                <Input {...this.state.roomControl} onChange={this.setControlValue} />
                <Button
                    type="button"
                    className='btn btn-primary'
                    disabled={!this.state.roomControl.value}
                    onClick={this.createRoom}>
                    Create room
                </Button>
            </Modal>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.statistics.rooms,
        userId : state.auth.user.id
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        createRoom: (data) => dispatch(actions.createRoom(data))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(NewRoom);