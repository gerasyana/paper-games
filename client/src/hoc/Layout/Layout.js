import React, { Component } from 'react';
import { connect } from 'react-redux';
import './Layout.css';

import NavigationBar from '../../components/NavigationBar/NavigationBar';

class Layout extends Component {
    render() {
        return (
        <div id='app-container'>
            <div id='header'>
                <NavigationBar {...this.props} />
            </div>
            <div id='body'>
                {this.props.children}
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps)(Layout);