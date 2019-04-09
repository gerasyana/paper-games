import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import classes from './TickTackToe.css';
import Modal from '../../../UI/Modal/Modal';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import BoardMove from '../../../components/TickTackToe/BoardMove/BoardMove';
import * as actions from '../../../storage/actions/actions';
import { ticktackToeKey } from '../../../constants/games';

const waitingUserModalId = 'waitingUserModal';
const userLeftModalId = 'userLeftModal';
const gameDetailsUrl = `/game/${ticktackToeKey}`;

class TickTackToe extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.waitForPlayer !== nextProps.waitForPlayer ||
            this.props.gameFinished !== nextProps.gameFinished ||
            this.props.userLeftGame !== nextProps.userLeftGame ||
            this.props.gameBoard.moves !== nextProps.gameBoard.moves;
    }

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.location.pathname);
        } else {
            if (this.props.waitForPlayer) {
                // eslint-disable-next-line no-undef
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
        if (this.props.userLeftGame) {
            // eslint-disable-next-line no-undef
            $(`#${userLeftModalId}`).modal('show');
        }
    }

    leaveRoom = () => {
        this.props.leaveRoom(this.props.room.name);
    }

    closeRoom = () => {
        // eslint-disable-next-line no-undef
        $(`#${userLeftModalId}`).modal('hide');
        this.props.history.push(gameDetailsUrl);
    }

    playerMadeMove = (event) => {
        const key = event.target.id;
        let moves = [...this.props.gameBoard.moves];
        moves[key] = this.props.gameBoard.playerStep;
        this.props.playerMadeMove({ room: this.props.room.name, moves });
    }

    getUserLeftModal = () => (
        <Modal id={userLeftModalId}>
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
        let boardRows = []

        for (let i = 0; i < 3; i++) {
            let boardMoves = [];

            for (let index = i * 3; index < (i + 1) * 3; index++) {
                const boardMove = this.props.gameBoard.moves[index];
                boardMoves.push(<BoardMove key={index} id={index} value={boardMove} clicked={this.playerMadeMove} />)
            }
            boardRows.push((
                <tr key={i * 2}>
                    {boardMoves}
                </tr>
            ));
        }

        return (
            <div className={classes.gameBoard}>
                <div className="row">
                    <div className={'col-2 ' + classes.border}></div>
                    <div className='col-8'>
                        <div className='row align-items-center justify-content-center' style={{ height: "85%" }}>
                            <div className={this.props.gameBoard.yourTurn ? 'col-10' : classes.noUserTurn + ' col-10'}>
                                <table className={classes.game}>
                                    {boardRows}
                                </table>
                            </div>
                        </div>
                        <div className={'row text-center align-items-center ' + classes.playersPnl}>
                            <div className='col-4'>
                                <h5>
                                    {this.props.room.player1.username} X
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
                                    {this.props.room.player2.username} O
                                    </h5>
                            </div>
                        </div>
                    </div>
                    <div className={'col-2 ' + classes.border}></div>
                </div>
            </div>)
    }

    render() {
        let game = null;

        if (!this.props.isAuthenticated) {
            game = <Redirect to='/login' />;
        } else if (!this.props.room.name || this.props.gameFinished) {
            game = <Redirect to={gameDetailsUrl} />;
        } else {

            if (!this.props.waitForPlayer || this.props.gameFinished) {
                // eslint-disable-next-line no-undef
                $(`#${waitingUserModalId}`).modal('hide');
            }

            if (this.props.userLeftGame) {
                game = this.getUserLeftModal();
            } else if (this.props.waitForPlayer) {
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