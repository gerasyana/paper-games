import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import Aux from '../../../hoc/Aux/Aux';
import classes from './TickTackToe.css';
import Modal from '../../../UI/Modal/Modal';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import * as actions from '../../../storage/actions/actions';
import { ticktackToeKey } from '../../../constants/games';

const waitingUserModalId = 'waitingUserModal';
const userLeftModalId = 'userLeftModal';
const gameDetailsUrl = `/game/${ticktackToeKey}`;

class TickTackToe extends Component {

    constructor(props) {
        super(props);
        this.state = {
            player1Score: 0,
            player2Score: 0,
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.gameStart !== nextProps.gameStart ||
            this.props.gameFinished !== nextProps.gameFinished ||
            this.props.userLeftGame !== nextProps.userLeftGame;
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
        if (this.props.userLeftGame) {
            // eslint-disable-next-line no-undef
            $(`#${userLeftModalId}`).modal('hide');
            this.props.history.push(gameDetailsUrl);
        } else {
            this.props.leaveRoom(this.props.name);
            this.props.history.push(gameDetailsUrl);
        }
    }

    render() {
        if (this.props.gameStart || this.props.gameFinished) {
            // eslint-disable-next-line no-undef
            $(`#${waitingUserModalId}`).modal('hide');
        }

        let game = (
            <Aux>
                <div className={classes.gameBoard}>
                    <div className="row">
                        <div className={'col-2 ' + classes.border}>  </div>
                        <div className='col-8'>
                            <div className='row justify-content-center' style={{ height: "85%" }}>
                                <div className='col-6'>
                                    <table className={'table ' + classes.game}>
                                        <tbody>
                                            <tr>
                                                <td><button className="tile" id="button_00"></button></td>
                                                <td><button className="tile" id="button_01"></button></td>
                                                <td><button className="tile" id="button_02"></button></td>
                                            </tr>
                                            <tr>
                                                <td><button className="tile" id="button_10"></button></td>
                                                <td><button className="tile" id="button_11"></button></td>
                                                <td><button className="tile" id="button_12"></button></td>
                                            </tr>
                                            <tr>
                                                <td><button className="tile" id="button_20"></button></td>
                                                <td><button className="tile" id="button_21"></button></td>
                                                <td><button className="tile" id="button_22"></button></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={'row text-center align-items-center ' + classes.playersPnl}>
                                <div className='col-4'>
                                    <h5>
                                        {this.props.player1.username} X
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
                                        {this.props.player2.username} O
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className={'col-2 ' + classes.border}></div>
                    </div>
                </div>
            </Aux>
        )

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
            }

            if (this.props.userLeftGame) {
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
                                Leave Game
                              </Button>
                        </div>
                    </Modal>
                )
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