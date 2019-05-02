/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import classes from './TickTackToe.css';
import Button from '../../../UI/Button/Button';
import BoardMove from '../../../components/TickTackToe/BoardMove/BoardMove';
import * as actions from '../../../storage/actions/actions';
import games, { tickTackToeKey } from '../../../constants/games';

import * as modals from '../../../constants/modalsIds';
import WaitForPlayerModal from '../../../components/Games/Notifications/WaitForPlayerModal';
import PlayerLeftRoomModal from '../../../components/Games/Notifications/PlayerLeftRoomModal';
import GameIsOverModal from '../../../components/Games/Notifications/GameIsOverModal';

const gameDetailsUrl = games[tickTackToeKey].url;

class TickTackToe extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.gameStarted !== nextProps.gameStarted ||
            this.props.roomClosed !== nextProps.roomClosed ||
            this.props.playerLeftRoom !== nextProps.playerLeftRoom ||
            this.props.gameBoard.gameIsOver !== nextProps.gameBoard.gameIsOver ||
            this.props.gameBoard.moves !== nextProps.gameBoard.moves;
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

    playerMadeMove = (event) => {
        const key = event.target.id;
        let moves = [...this.props.gameBoard.moves];
        moves[key] = this.props.gameBoard.playerStep;
        const data = {
            room: this.props.room,
            gameBoard: {
                ...this.props.gameBoard,
                moves
            }
        }
        this.props.playerMadeMove(data);
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

    getGameBoard = () => {
        let boardRows = [];
        let modal = this.props.gameBoard.gameIsOver ? this.getGameIsOverModal() : null;

        for (let i = 0; i < 3; i++) {
            // eslint-disable-next-line no-loop-func
            const boardMoves = this.props.gameBoard.moves
                .slice(i * 3, (i + 1) * 3)
                .map((boardMove, index) => {
                    const id = i * 3 + index;
                    return <BoardMove id={id} key={`col-sm-${id}`} value={boardMove} onClick={this.playerMadeMove} />
                });
            boardRows.push((
                <tr key={`row${i}`} >
                    {boardMoves}
                </tr>
            ));
        }

        return (
            <div className={classes.gameBoard}>
                {modal}
                <div className={'row ' + classes.gamePnl}>
                    <div className={'col-2 ' + classes.border}></div>
                    <div className='col-8'>
                        <div className='row align-items-center justify-content-center' style={{ height: "90%" }}>
                            <div className={this.props.gameBoard.yourTurn ? 'col-sm-10' : classes.noUserTurn + ' col-sm-10'}>
                                <table className={classes.game}>
                                    <tbody>
                                        {boardRows}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className='row align-items-center justify-content-center' style={{ height: "10%" }}>
                            {
                                this.props.gameBoard.yourTurn ?
                                    <h5>Your turn</h5> :
                                    null
                            }
                        </div>

                    </div>
                    <div className={'col-2 ' + classes.border}></div>
                </div>
                <div className={'row text-center align-items-center justify-content-center ' + classes.playersPnl}>
                    <div className='col-md-3'>
                        <h5>
                            {this.props.room.players[0].username}
                        </h5>
                    </div>
                    <div className='col-md-2 text-break'>
                        <Button
                            id="closeBtn"
                            type="button"
                            className="btn btn-secondary"
                            onClick={this.leaveRoom}>
                            Leave Game
                                </Button>
                    </div>
                    <div className='col-md-3'>
                        <h5>
                            {this.props.room.players[1].username}
                        </h5>
                    </div>
                </div>
            </div>
        );
    }

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

export default connect(mapStateToProps, mapDispatchToState)(TickTackToe);