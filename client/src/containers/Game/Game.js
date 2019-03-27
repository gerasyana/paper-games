import React, { Component } from 'react';
import { connect } from 'react-redux'

import GameLogo from '../../components/Games/GameLogo/GameLogo';
import Button from '../../UI/Button/Button';
import Modal from '../../UI/Modal/Modal';
import games from '../../constants/games';
import * as actions from '../../storage/actions/actions';
import * as sockets from '../../sockets/rooms';

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            game: null
        }
    }

    componentDidMount() {
        if (!this.state.game && this.props.match.params.id) {
            const game = games[this.props.match.params.id];
            this.setState({ game });
        }
    }

    createRoom = () => {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.location.pathname);
            this.props.history.push('/login');
        } else {
            sockets.createRoom({name : 'test'});
        }
    }

    joinRoom = () => {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.location.pathname);
            this.props.history.push('/login');
        }
    }

    render() {
        let gameDetails = null;

        if (this.state.game) {
            const rules = this.state.game.rules.map((rule, index) => <li key={index}>{rule}</li>);

            gameDetails = (
                <div className="container body-container">
                    <div className='row justify-content-center'>
                        <div className='col-3 offset-md-1'>
                            <GameLogo name={this.state.game.name} src={this.state.game.src} />
                        </div>
                        <div className='col-5 offset-md-1'>
                            <h1>{this.state.game.name}</h1>
                            <h3>How To Play</h3>
                            <ol>
                                {rules}
                            </ol>
                            <div>
                                <Button
                                    type="submit"
                                    className='btn btn-primary mr-4 mb-4'
                                    onClick={this.createRoom} >
                                    Create a new Game
                            </Button>
                                <Button
                                    type="button"
                                    className='btn btn-primary mb-4'
                                    onClick={this.joinRoom}>
                                    Join an existing game
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
        return gameDetails;
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        setLoginRedirectUrl: (url) => dispatch(actions.setLoginRedirectUrl(url))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Game);