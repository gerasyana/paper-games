/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import classes from './TickTackToe.css';
import Modal from '../../../UI/Modal/Modal';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import BoardMove from '../../../components/TickTackToe/BoardMove/BoardMove';
import * as actions from '../../../storage/actions/actions';
import { tickTackToeKey } from '../../../constants/games';

const waitForPlayerModalId = 'waitForPlayerModal';
const playerLeftRoomModalId = 'playerLeftModal';
const gameIsOverModalId = 'gameIsOverModalId';
const gameDetailsUrl = `/game/${tickTackToeKey}`;

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
            this.props.setLoginRedirectUrl(this.props.location.pathname);
        } else {
            if (!this.props.gameStarted) {
                $(`#${waitForPlayerModalId}`).modal('show');
            }
            /*  window.addEventListener("beforeunload", e => {
                  e = e || window.e;
                  e.cancelBubble = true;
                  e.returnValue = '<h1>You sure you want to leave?</h1>'; //This is displayed on the dialog
  
                  //e.stopPropagation works in Firefox.
                  if (e.stopPropagation) {
                      e.stopPropagation();
                      e.preventDefault();
                  }
              });
  */
        }
    }

    componentDidUpdate() {
        if (!this.props.gameStarted) {
            $(`#${waitForPlayerModalId}`).modal('show');
        }

        if (this.props.playerLeftRoom) {
            $(`#${playerLeftRoomModalId}`).modal('show');
        }

        if (this.props.gameBoard.gameIsOver) {
            $(`#${playerLeftRoomModalId}`).modal('hide');
            $(`#${gameIsOverModalId}`).modal('show');
        }
    }

    leaveRoom = () => {
        $(`#${waitForPlayerModalId}`).modal('hide');
        $(`#${gameIsOverModalId}`).modal('hide');
        $(`#${playerLeftRoomModalId}`).modal('hide');
        this.props.leaveRoom(this.props.room.name);
    }

    closeRoom = () => {
        $(`#${playerLeftRoomModalId}`).modal('hide');
        this.props.history.push(gameDetailsUrl);
    }

    startWaitingForPlayer = () => {
        setTimeout(() => {
            this.props.waitForPlayer();
        }, 500);
        $(`#${playerLeftRoomModalId}`).modal('hide');
    }

    restartGame = () => {
        $(`#${gameIsOverModalId}`).modal('show');
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

    getPlayerLeftRoomModal = () => (
        <Modal id={playerLeftRoomModalId}>
            <div id='body'>
                <h5 className='text-center'>Player has left the room. Game is over</h5>
            </div>
            <div id='footer'>
                <Button
                    id="closeBtn"
                    type="button"
                    className="btn btn-primary mr-4"
                    onClick={this.startWaitingForPlayer}>
                    Wait for player
                </Button>
                <Button
                    id="closeBtn"
                    type="button"
                    className="btn btn-secondary"
                    onClick={this.leaveRoom}>
                    Leave room
                </Button>
            </div>
        </Modal>
    )

    getWaitForPlayerModal = () => (
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
                    onClick={this.leaveRoom}>
                    Leave room
                </Button>
            </div>
        </Modal>
    )

    getGameIsOverModal = () => {
        let message = 'You lose. Game is over';

        if (this.props.gameBoard.youWon) {
            message = `You win! You got an extra ${this.props.gameBoard.points} points`;
        }

        return (
            <Modal id={gameIsOverModalId}>
                <div id='body'>
                    <h5 className='text-center'> {message}</h5>
                </div>
                <div id='footer'>
                    <Button
                        id="closeBtn"
                        type="button"
                        className="btn btn-primary mr-4 "
                        onClick={this.restartGame}>
                        Try again
                    </Button>
                    <Button
                        id="closeBtn"
                        type="button"
                        className="btn btn-secondary"
                        onClick={this.leaveRoom}>
                        Leave room
                    </Button>
                </div>
            </Modal>
        )
    };

    getGameBoard = () => {
        let boardRows = [];
        let modal = null;

        if (this.props.gameBoard.gameIsOver) {
            modal = this.getGameIsOverModal();
        }

        for (let i = 0; i < 3; i++) {
            // eslint-disable-next-line no-loop-func
            const boardMoves = this.props.gameBoard.moves
                .slice(i * 3, (i + 1) * 3)
                .map((boardMove, index) => {
                    const id = i * 3 + index;
                    return <BoardMove id={id} key={`col-${id}`} value={boardMove} onClick={this.playerMadeMove} />
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
                <div className="row">
                    <div className={'col-2 ' + classes.border}></div>
                    <div className='col-8'>
                        <div className='row align-items-center justify-content-center' style={{ height: "75%" }}>
                            <div className={this.props.gameBoard.yourTurn ? 'col-10' : classes.noUserTurn + ' col-10'}>
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
                        <div className={'row text-center align-items-center ' + classes.playersPnl}>
                            <div className='col-4'>
                                <h5>
                                    {this.props.room.players[0].username}
                                </h5>
                            </div>
                            <div className='col-4'>
                                <Button
                                    id="closeBtn"
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={this.leaveRoom}>
                                    Leave Game
                                </Button>
                            </div>
                            <div className='col-4'>
                                <h5>
                                    {this.props.room.players[1].username}
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className={'col-2 ' + classes.border}></div>
                </div>
            </div>
        );
    }

    render() {
        let game = null;
        debugger;
        if (!this.props.isAuthenticated) {
            game = <Redirect to='/login' />;
        } else if (this.props.playerLeftRoom) {
            game = this.getPlayerLeftRoomModal();
        } else if (!this.props.room.name || this.props.roomClosed) {
            game = <Redirect to={gameDetailsUrl} />;
        } else {
            if (!this.props.gameStarted) {
                game = this.getWaitForPlayerModal();
            } else {
                $(`#${waitForPlayerModalId}`).modal('hide');
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
        waitForPlayer: () => dispatch(actions.waitForPlayer())
    }
}

export default connect(mapStateToProps, mapDispatchToState)(TickTackToe);