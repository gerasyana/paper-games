import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import Aux from '../../hoc/Aux/Aux';
import classes from './TickTackToe.css';
import * as actions from '../../storage/actions/actions';

class TickTackToe extends PureComponent {

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.setRedirectUrl(this.props.location.pathname);
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <Aux>
                <div className={classes.gameBoard}>
                    <div className="row">
                        <div className={'col-3 ' + classes.player}>
                            Player 1
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
                            Player 2
                        </div>
                    </div>
                </div>
                <div className={classes.players}>

                </div>
            </Aux>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToState = (dispatch) => {
    return {
      setRedirectUrl: (url) => dispatch(actions.setRedirectUrl(url))
    }
  }

  
export default connect(mapStateToProps, mapDispatchToState)(TickTackToe);