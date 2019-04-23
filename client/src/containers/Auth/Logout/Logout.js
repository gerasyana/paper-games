import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux'

import * as actions from '../../../storage/actions/actions'

class Login extends PureComponent {

    componentDidMount() {
        this.props.logout();
    }

    render() {
        return <Redirect to="/" />;
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        logout: (userId) => dispatch(actions.logout(userId))
    }
}

export default connect(null, mapDispatchToState)(Login);