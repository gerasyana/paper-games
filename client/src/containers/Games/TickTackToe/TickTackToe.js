import React, { Component } from 'react';
import { connect } from 'react-redux';
import './TickTackToe.css';

class TickTackToe extends Component {

    componentDidMount() {
        if (!this.props.isAuthenticated) {
            this.props.history.push('/login');
        }
    }

    render() {
        return (
            <div class='container'>
                <div className='row justify-content-center'>
                    <div id='gamePanel' className='col-10'>
                        <table id='game'>
                            <tbody>
                                <tr>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td ></td>
                                    <td ></td>
                                    <td ></td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td ></td>
                                    <td ></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='row justify-content-center'>
                    <div className='col playersPanel'>
                        panel for players
                    </div>
                </div>
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