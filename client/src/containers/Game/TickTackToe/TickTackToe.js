import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import Aux from '../../../hoc/Aux/Aux';
import classes from './TickTackToe.css';
import Modal from '../../../UI/Modal/Modal';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import BoardSquare from '../../../components/TickTackToe/BoardSquare/BoardSquare';
import * as actions from '../../../storage/actions/actions';
import { ticktackToeKey } from '../../../constants/games';

const waitingUserModalId = 'waitingUserModal';
const userLeftModalId = 'userLeftModal';
const gameDetailsUrl = `/game/${ticktackToeKey}`;

class TickTackToe extends Component {

    constructor(props) {
        super(props);
        const squares = [];
        for (let i = 0; i < 9; i++) {
            squares.push({ id: `cell${i}`, value: null });
        }
        this.state = {
            player1Score: 0,
            player2Score: 0,
            squares
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.gameStart !== nextProps.gameStart ||
            this.props.gameFinished !== nextProps.gameFinished ||
            this.props.userLeftGame !== nextProps.userLeftGame ||
            this.state.squares !== nextState.squares;
    }

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.location.pathname);
        } else {
            if (!this.props.gameStart) {
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
        this.props.leaveRoom(this.props.name);
        this.props.history.push(gameDetailsUrl);
    }

    closeRoom = () => {
        // eslint-disable-next-line no-undef
        $(`#${userLeftModalId}`).modal('hide');
        this.props.history.push(gameDetailsUrl);
    }

    render() {
        if (this.props.gameStart || this.props.gameFinished) {
            // eslint-disable-next-line no-undef
            $(`#${waitingUserModalId}`).modal('hide');
        }

        let game = null;

        if (!this.props.isAuthenticated) {
            game = <Redirect to='/login' />;
        } else if (!this.props.gameId && !this.props.name) {
            game = <Redirect to={gameDetailsUrl} />;
        } else {
            if (!this.props.gameStart) {
                game = (
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
            } else if (this.props.userLeftGame) {
                game = (
                    <Modal id={userLeftModalId}>
                        <div id='body'>
                            <h5 className='text-center'>Player has left the game. Game is over</h5>
                        </div>
                        <div id='footer'>
                            <Button
                                id="closeBtn"
                                type="button"
                                className="btn btn-primary"
                                onClick={this.leaveRoom}>
                                Close Game
                              </Button>
                        </div>
                    </Modal>
                )
            } else {
                let boardRows = []

                for (let i = 0; i < 3; i++) {
                    const boardSquares = this.state.squares.slice(i * 3, (i + 1) * 3).map(square => (
                        <BoardSquare key={square.id} {...square} />
                    ));

                    boardRows.push((
                        <tr>
                            {boardSquares}
                        </tr>
                    ))
                }

                game = (
                    <Aux>
                        <div className={classes.gameBoard}>
                            <div className="row">
                                <div className={'col-2 ' + classes.border}>  </div>
                                <div className='col-8'>
                                    <div className='row align-items-center justify-content-center' style={{ height: "85%" }}>
                                        <div className='col-10'>
                                            <table className={classes.game}>
                                                {boardRows}
                                            </table>
                                        </div>
                                    </div>
                                    <div className={'row text-center align-items-center ' + classes.playersPnl}>
                                        <div className='col-4'>
                                            <h5>
                                                {/*this.props.player1.username*/} X
                                            </h5>
                                        </div>
                                        <div className='col-4'>
                                            <h3>
                                                {this.state.player1Score} : {this.state.player2Score}
                                            </h3>
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
                                                {/*this.props.player2.username*/} O
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                                <div className={'col-2 ' + classes.border}></div>
                            </div>
                        </div>
                    </Aux>)
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
        leaveRoom: (room) => dispatch(actions.leaveRoom(room))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(TickTackToe);