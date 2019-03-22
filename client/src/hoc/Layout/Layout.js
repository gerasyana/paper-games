import React, { Component } from 'react';
import { connect } from 'react-redux';

import Aux from '../Aux/Aux';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

class Layout extends Component {
    render() {
        return (<Aux>
            <NavigationBar {...this.props} />
            {this.props.children}
        </Aux>)
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps)(Layout);