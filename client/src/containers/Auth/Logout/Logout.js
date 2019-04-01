import React, { PureComponent } from 'react';
import { Redirect } from 'react-router';
import { connect } from 'react-redux'

import * as actions from '../../../storage/actions/actions'

class Login extends PureComponent {

    componentDidMount() {
        this.props.logout(this.props.userId);
    }

    render() {
        return <Redirect to="/" />;
    }
}

const mapStateToProps = (state) => {
    return {
        userId: state.auth.user.id
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        logout: (userId) => dispatch(actions.logout(userId))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Login);