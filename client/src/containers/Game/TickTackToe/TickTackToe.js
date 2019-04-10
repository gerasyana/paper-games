/* eslint-disable no-undef */
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import classes from './TickTackToe.css';
import Aux from '../../../hoc/Aux/Aux';
import Modal from '../../../UI/Modal/Modal';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import BoardMove from '../../../components/TickTackToe/BoardMove/BoardMove';
import * as actions from '../../../storage/actions/actions';
import { ticktackToeKey } from '../../../constants/games';

const waitingUserModalId = 'waitingUserModal';
const playerLeftModalId = 'userLeftModal';
const gameIsOverModalId = 'gameIsOverModalId';
const gameDetailsUrl = `/game/${ticktackToeKey}`;

class TickTackToe extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.gameStarted !== nextProps.gameStarted ||
            this.props.gameClosed !== nextProps.gameClosed ||
            this.props.playerLeftGame !== nextProps.playerLeftGame ||
            this.props.gameBoard.gameIsOver !== nextProps.gameBoard.gameIsOver ||
            this.props.gameBoard.moves !== nextProps.gameBoard.moves;
    }

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.location.pathname);
        } else {
            if (!this.props.gameStarted) {
                $(`#${waitingUserModalId}`).modal('show');
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
        if (this.props.playerLeftGame) {
            $(`#${playerLeftModalId}`).modal('show');
        }

        $(`#${gameIsOverModalId}`).modal(this.props.gameBoard.gameIsOver ? 'show' : 'hide');
    }

    leaveRoom = () => {
        this.props.leaveRoom(this.props.room.name);
    }

    closeRoom = () => {
        $(`#${playerLeftModalId}`).modal('hide');
        this.props.history.push(gameDetailsUrl);
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

    getPlayerLeftModal = () => (
        <Modal id={playerLeftModalId}>
            <div id='body'>
                <h5 className='text-center'>Player has left the game. Game is over</h5>
            </div>
            <div id='footer'>
                <Button
                    id="closeBtn"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.closeRoom}>
                    Close Game
                      </Button>
            </div>
        </Modal>
    )

    getWaitingUserModal = () => (
        <Modal id={waitingUserModalId}>
            <div id='body'>
                <Spinner />
                <h4 className='text-center'>Waiting for a player ....</h4>
            </div>
            <div id='footer'>
                <Button
                    id="closeBtn"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.leaveRoom}>
                    Leave Game
        </Button>
            </div>
        </Modal>
    )

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
                                    {this.props.room.players.player1.username}
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
                                    {this.props.room.players.player2.username}
                                </h5>
                            </div>
                        </div>
                    </div>
                    <div className={'col-2 ' + classes.border}></div>
                </div>
            </div>
        );
    }

    getGameIsOverModal = () => (
        <Modal id={gameIsOverModalId}>
            <div id='body'>
                <h4 className='text-center'>Game is over</h4>
            </div>
            <div id='footer'>
                button
            </div>
        </Modal>
    );

    render() {
        let game = null;

        if (this.props.gameStarted || this.props.gameClosed) {
            $(`#${waitingUserModalId}`).modal('hide');
        }

        if (!this.props.isAuthenticated) {
            game = <Redirect to='/login' />;
        } else if (this.props.playerLeftGame) {
            game = this.getPlayerLeftModal();
        } else if (!this.props.room.name || this.props.gameClosed) {
            game = <Redirect to={gameDetailsUrl} />;
        } else {
            if (!this.props.gameStarted) {
                game = this.getWaitingUserModal();
            } else {
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
        playerMadeMove: (data) => dispatch(actions.playerMadeMove(data))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(TickTackToe);