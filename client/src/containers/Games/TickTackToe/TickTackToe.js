import React, { Component } from 'react';
import { connect } from 'react-redux';

class TickTackToe extends Component {

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <div className='container'>
                Tick tack toe
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

export default connect(mapStateToProps)(TickTackToe);