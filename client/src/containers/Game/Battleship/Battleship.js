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
            this.props.gameBoard.player1Fleet !== nextProps.gameBoard.player1Fleet ||
            this.props.gameBoard.player2Fleet !== nextProps.gameBoard.player2Fleet;
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
        const { gameBoard, room } = this.props;
        const userId = this.props.user.id;
        let content = <ShipsPlacement gameBoardFleetId={room.players[0].id === userId ? 'player1Fleet' : 'player2Fleet'} />;
        let modal = this.props.gameBoard.gameIsOver ? this.getGameIsOverModal() : null;
        let waitForPlayer = false;

        if ((room.players[0].id === userId && gameBoard.player1Fleet.shipsAreSet && !gameBoard.player2Fleet.shipsAreSet) ||
            (room.players[1].id === userId && gameBoard.player2Fleet.shipsAreSet && !gameBoard.player1Fleet.shipsAreSet)) {
            waitForPlayer = true;
        }
        
        if (waitForPlayer) {
            content = (
                <div className='col-md-8 m-3'>
                    <Spinner />
                    <h4 className='text-center'>Please wait while the enemy places ships</h4>
                </div>
            );
        } else if (gameBoard.player1Fleet.shipsAreSet && gameBoard.player2Fleet.shipsAreSet) {
            content = (
                <Aux>
                    <div className='col-md-5 m-3'>
                        <Fleet
                            fleet={gameBoard.player1Fleet}
                            playerCurrentUser={room.players[0].id === userId}
                            gameBoardFleetId='player1Fleet'
                        />
                    </div>
                    <div className='col-md-5 m-3'>
                        <Fleet
                            fleet={gameBoard.player2Fleet}
                            playerCurrentUser={room.players[1].id === userId}
                            gameBoardFleetId='player2Fleet'
                        />
                    </div>
                    <div className='col-md-8 text-center'>
                        <h4>Your turn</h4>
                    </div>
                </Aux>
            );
        }

        return (
            <div className={classes.gameBoard}>
                {modal}
                <div className={'row justify-content-center  align-items-center ' + classes.gamePnl}>
                    {content}
                </div>
                <div className={'row text-center align-items-center ' + classes.playersPnl}>

                </div>
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