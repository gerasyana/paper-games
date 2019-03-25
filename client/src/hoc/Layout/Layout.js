import React, { Component } from 'react';
import { connect } from 'react-redux';

import classes from './Layout.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

class Layout extends Component {
    render() {
        return (
            <div className={classes.appContainer}>
                <div className={classes.header}>
                    <NavigationBar {...this.props} />
                </div>
                <div className={classes.body}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps)(Layout);