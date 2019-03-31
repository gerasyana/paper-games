import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import classes from './Layout.css';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import axios from '../../axios/axios';
import * as actions from '../../storage/actions/actions';

class Layout extends Component {

    componentWillMount() {
        this.setInterceptor();
    }

    setInterceptor = () => {
        axios.interceptors.response.use(res => {
            if (res.status === 2000 && this.state.message) {
                this.setState({ message: null });
            }
            return res;
        }, error => {
            if (error.response.status === 401) {
               this.props.logout();
            }
            return Promise.resolve(error.response);
        });
    }

    componentWillUnmount() {
        axios.interceptors.response.eject(this.setInterceptor);
    }

    shouldComponentUpdate(nextProps, state) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.usersOnline !== nextProps.usersOnline ||
            this.props.rooms !== nextProps.rooms;
    }

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
        isAuthenticated: state.auth.isAuthenticated,
        usersOnline: state.statistics.usersOnline,
        rooms: state.statistics.rooms.length
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        logout: () => dispatch(actions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToState)(withRouter(Layout));