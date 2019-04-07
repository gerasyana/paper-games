import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';

import * as actions from '../../storage/actions/actions';
import Room from '../../components/Room/Room';

class Rooms extends Component {

    constructor(props) {
        super(props);
        this.state = {
            roomSelected: null
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.rooms !== nextProps.rooms ||
            nextProps.rooms.length !== this.props.rooms.length ||
            nextProps.gameStart !== this.props.gameStart
    }

    joinRoom = (name) => {
        const room = this.props.rooms.find(room => room.name === name);
        this.setState({ roomSelected: room });
        this.props.joinRoom({
            room,
            player2: this.props.player2
        });
    }

    render() {
        let rooms = this.props.rooms.map(room => (
            <Room key={room.name} {...room} join={this.joinRoom} />
        ))

        if (this.state.roomSelected) {
            rooms = <Redirect to={`game/${this.state.roomSelected.gameId}/${this.state.roomSelected.name}`} />
        }

        return (
            <div className='container body-container'>
                <div className='row justify-content-around'>
                    <div className='col-10'>
                        <div className='row'>
                            {rooms}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        rooms: state.statistics.rooms,
        player2: state.auth.user,
        gameStart: state.game.gameStart
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        joinRoom: (data) => dispatch(actions.joinRoom(data))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Rooms);