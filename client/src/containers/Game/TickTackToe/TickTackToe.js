import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux';

import Aux from '../../../hoc/Aux/Aux';
import classes from './TickTackToe.css';
import Modal from '../../../UI/Modal/Modal';
import Spinner from '../../../UI/Spinner/Spinner';
import Button from '../../../UI/Button/Button';
import * as actions from '../../../storage/actions/actions';

const modalId = '#waitingUserModal';

class TickTackToe extends Component {

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.gameStart !== nextProps.gameStart;
    }

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.location.pathname);
        } else {
            /* window.addEventListener("beforeunload", e => {
                 e = e || window.e;
                 e.cancelBubble = true;
                 e.returnValue = 'You sure you want to leave?'; //This is displayed on the dialog
 
                 //e.stopPropagation works in Firefox.
                 if (e.stopPropagation) {
                     e.stopPropagation();
                     e.preventDefault();
                 }
             });*/

            if (!this.props.gameStart) {
                // eslint-disable-next-line no-undef
                $(modalId).modal('show');
            }
        }
    }

    render() {
        const redirect = !this.props.isAuthenticated ? <Redirect to='/login' /> : null;

        if (this.props.gameStart) {
            // eslint-disable-next-line no-undef
            $(modalId).modal('hide');
        }

        let game = (
            <Aux>
                {redirect}
                <div className={classes.gameBoard}>
                    <div className="row">
                        <div className={'col-3 ' + classes.player}>
                            {this.props.player1 ? this.props.player1.username : null}
                        </div>
                        <div className='col-6'>
                            <table className={classes.game}>
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
                        <div className={'col-3 ' + classes.player}>
                            {this.props.player2 ? this.props.player2.username : null}
                        </div>
                    </div>
                </div>
                <div className={classes.players}>

                </div>
            </Aux>
        )

        if (!this.props.gameStart) {
            game = (<Modal id='waitingUserModal' title='Waiting for user'>
                <Spinner />
                <div id='footer'>
                    <Button
                        id="closeBtn"
                        type="button"
                        className="btn btn-primary">
                        Leave Game
                </Button>
                </div>
            </Modal>)
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
        setLoginRedirectUrl: (url) => dispatch(actions.setLoginRedirectUrl(url))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(TickTackToe);