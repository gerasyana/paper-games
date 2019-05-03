/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import classes from './Battleship.css';
import * as actions from '../../../storage/actions/actions';
import games, { battleship } from '../../../constants/games';
import Fleet from './Fleet/Fleet';
import ShipsPlacement from './Fleet/ShipsPlacement/ShipsPlacement';
import Aux from '../../../hoc/Aux/Aux';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';

import * as modals from '../../../constants/modalsIds';
import WaitForPlayerModal from '../../../components/Games/Notifications/WaitForPlayerModal';
import PlayerLeftRoomModal from '../../../components/Games/Notifications/PlayerLeftRoomModal';
import GameIsOverModal from '../../../components/Games/Notifications/GameIsOverModal';

const gameDetailsUrl = games[battleship].url;

class Battleship extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.gameStarted !== nextProps.gameStarted ||
            this.props.roomClosed !== nextProps.roomClosed ||
            this.props.playerLeftRoom !== nextProps.playerLeftRoom ||
            this.props.gameBoard.gameIsOver !== nextProps.gameBoard.gameIsOver ||
            this.props.gameBoard.fleets !== nextProps.gameBoard.fleets;
    }

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(gameDetailsUrl);
            this.props.history.push('/login');
        } else {
            if (!this.props.gameStarted) {
                $(`#${modals.waitForPlayerModalId}`).modal('show');
            }

            window.addEventListener("beforeunload", e => {
                e = e || window.e;
                e.cancelBubble = true;
                e.returnValue = '<h1>You sure you want to leave the room?</h1>';

                if (e.stopPropagation) {
                    e.stopPropagation();
                    e.preventDefault();
                }
            });

            window.addEventListener("popstate", e => {
                this.leaveRoom();
            });
        }
    }

    componentDidUpdate() {
        if (!this.props.gameStarted) {
            $(`#${modals.waitForPlayerModalId}`).modal('show');
        }

        if (this.props.playerLeftRoom) {
            $(`#${modals.playerLeftRoomModalId}`).modal('show');
        }

        if (this.props.gameBoard.gameIsOver) {
            $(`#${modals.playerLeftRoomModalId}`).modal('hide');
            $(`#${modals.gameIsOverModalId}`).modal('show');
        }
    }

    leaveRoom = () => {
        $(`#${modals.waitForPlayerModalId}`).modal('hide');
        $(`#${modals.playerLeftRoomModalId}`).modal('hide');
        $(`#${modals.gameIsOverModalId}`).modal('hide');
        this.props.leaveRoom(this.props.room.name);
    }

    closeRoom = () => {
        $(`#${modals.playerLeftRoomModalId}`).modal('hide');
        this.props.history.push(gameDetailsUrl);
    }

    startWaitingForPlayer = () => {
        setTimeout(() => {
            this.props.waitForPlayer();
        }, 500);
        $(`#${modals.playerLeftRoomModalId}`).modal('hide');
    }

    getGameBoard = () => {
        const { fleets } = this.props.gameBoard;
        const userId = this.props.user.id;
        const modal = this.props.gameBoard.gameIsOver ? this.getGameIsOverModal() : null;
        const waitForPlayer = fleets.length === 1 && fleets[0].playerId === userId;
        let content = <ShipsPlacement />;
       
        if (waitForPlayer) {
            content = (
                <div className='col-md-8 m-3'>
                    <Spinner />
                    <h4 className='text-center'>Please wait while the enemy places ships</h4>
                </div>
            );
        } else if (fleets.length === 2 && fleets.every(fleet => fleet.shipsAreSet)) {
            content = (
                <Aux>
                    <div className='col-lg-5 mt-5'>
                        <Fleet
                            fleet={fleets.find(fleet => fleet.playerId === userId)}
                            player={this.props.room.players.find(player => player.id === userId)}
                            readOnlyMode
                        />
                    </div>
                    <div className='col-lg-5 mt-5'>
                        <Fleet
                            fleet={fleets.find(fleet => fleet.playerId !== userId)}
                            player={this.props.room.players.find(player => player.id !== userId)}
                        />
                    </div>
                    <div className='col-12 text-center' style={{ height: '30px' }}>
                        {this.props.gameBoard.yourTurn ? <h5>Your turn</h5> : null}
                    </div>
                    <div className='col-12 text-center' style={{ height: '40px' }}>
                        <Button
                            id="closeBtn"
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.leaveRoom}>
                            Leave Game
                       </Button>
                    </div>
                </Aux>
            );
        }

        return (
            <div className={classes.gameBoard}>
                {modal}
                <div className={'row justify-content-center align-items-center ' + classes.gamePnl}>
                    {content}
                </div>
                <div className={'row justify-content-center align-items-center ' + classes.playersPnl}></div>
            </div>
        )
    }

    getGameIsOverModal = () => {
        let message = 'Game is over. Try again.';

        if (this.props.gameBoard.youWon) {
            message = `You win! You got an extra ${this.props.gameBoard.points} points`;
        }

        setTimeout(() => {
            $(`#${modals.gameIsOverModalId}`).modal('hide');
            this.props.restartGame();
        }, 3000);

        return <GameIsOverModal message={message} leaveRoom={this.leaveRoom} />;
    };

    render() {
        let game = null;

        if (!this.props.isAuthenticated) {
            game = <Redirect to='/login' />;
        } else if (this.props.playerLeftRoom) {
            game = <PlayerLeftRoomModal startWaitingForPlayer={this.startWaitingForPlayer} leaveRoom={this.leaveRoom} />
            $(`#${modals.gameIsOverModalId}`).modal('hide');
        } else if (!this.props.room.name || this.props.roomClosed || this.props.gameBoard === undefined) {
            game = <Redirect to={gameDetailsUrl} />;
        } else {
            if (!this.props.gameStarted) {
                game = <WaitForPlayerModal leaveRoom={this.leaveRoom} />;
            } else {
                $(`#${modals.waitForPlayerModalId}`).modal('hide');
                game = this.getGameBoard();
            }
        }
        return game;
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user,
        ...state.game
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        setLoginRedirectUrl: (url) => dispatch(actions.setLoginRedirectUrl(url)),
        leaveRoom: (room) => dispatch(actions.leaveRoom(room)),
        playerMadeMove: (data) => dispatch(actions.playerMadeMove(data)),
        waitForPlayer: () => dispatch(actions.waitForPlayer()),
        restartGame: () => dispatch(actions.restartGame()),
        updateGameBoard: (data) => dispatch(actions.updateGameBoard(data))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Battleship);