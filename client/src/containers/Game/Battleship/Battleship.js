/* eslint-disable no-undef */

/*
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import classes from './Battleship.css';
import Button from '../../../UI/Button/Button';
import * as actions from '../../../storage/actions/actions';
import games, { tickTackToeKey } from '../../../constants/games';
import * as modals from '../../../constants/modalsIds';

import WaitForPlayerModal from '../../../components/Games/Notifications/WaitForPlayerModal';
import PlayerLeftRoomModal from '../../../components/Games/Notifications/PlayerLeftRoomModal';
import GameIsOverModal from '../../../components/Games/Notifications/GameIsOverModal';

const gameDetailsUrl = games[tickTackToeKey].url;

class Battleship extends Component {

    render() {
        return (
            <div className={classes.gameBoard}>
                <div className="row">
                    <div className={'col-sm-1 ' + classes.border}></div>
                    <div className='col-sm-10'>
                        <div className='row align-items-center justify-content-center' style={{ height: "90%" }}>
                            tetst 2
                         </div>
                        <div className={'row text-center align-items-center ' + classes.playersPnl} style={{ height: "10%" }}>
                            tetst 2
                         </div>
                    </div>
                    <div className={'col-sm-1 ' + classes.border}></div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        ...state.game
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        setLoginRedirectUrl: (url) => dispatch(actions.setLoginRedirectUrl(url)),
        leaveRoom: (room) => dispatch(actions.leaveRoom(room)),
        playerMadeMove: (data) => dispatch(actions.playerMadeMove(data)),
        waitForPlayer: () => dispatch(actions.waitForPlayer()),
        restartGame: () => dispatch(actions.restartGame())
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Battleship);*/

export default '';