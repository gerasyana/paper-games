import React from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux'

import * as actions from '../../../storage/actions/actions'

class Login extends React.Component {

    componentWillMount() {
        this.props.logout();
    }

    render() {
        return <Redirect to="/" />;
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(null, mapDispatchToState)(Login);