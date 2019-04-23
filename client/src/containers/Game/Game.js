import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router';

import GameRating from '../../components/Games/GameRating/GameRating';
import Button from '../../UI/Button/Button';
import NewRoom from './NewRoom/NewRoom';
import games from '../../constants/games';
import * as actions from '../../storage/actions/actions';

import TickTackToe from './TickTackToe/TickTackToe';

class Game extends Component {

    constructor(props) {
        super(props);
        this.state = {
            game: null,
            gameId: null,
            startGame: false,
            gameRating: []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.isAuthenticated !== nextProps.isAuthenticated ||
            this.props.room !== nextProps.room ||
            this.state.gameRating !== nextState.gameRating;
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (Object.keys(nextProps.gamesRating).includes(prevState.gameId)) {
            return {
                ...prevState.state,
                gameRating: nextProps.gamesRating[prevState.gameId]
            }
        }
        return prevState;
    }

    componentDidMount() {
        if (!this.state.game && this.props.match.params.id) {
            const gameId = this.props.match.params.id;
            const game = games[gameId];
            this.setState({
                game,
                gameId
            });

            this.props.getGameRating(gameId);
        }
    }

    createRoom = () => {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.match.url);
            this.props.history.push('/login');
        }
    }

    joinRoom = () => {
        this.props.history.push('/rooms');
    }

    render() {
        let gameDetails = null;

        if (this.props.room) {
            gameDetails = <Redirect to={`${this.props.match.url}/${this.props.room}`} />;
        } else if (this.state.game) {
            const rules = this.state.game.rules.map((rule, index) => <li key={index}>{rule}</li>);

            gameDetails = (
                <div className="container body-container">
                    <NewRoom gameId={this.state.gameId} />
                    <div className='row justify-content-center'>
                        <div className='col-sm-4 col-margin-fixed'>
                            <GameRating rating={this.state.gameRating} />
                        </div>
                        <div className='col-sm-5 col-margin-fixed'>
                            <h1>{this.state.game.name}</h1>
                            <h3>How To Play</h3>
                            <ol>
                                {rules}
                            </ol>
                            <div>
                                <Button
                                    type="submit"
                                    className='btn btn-primary mr-4 mb-4'
                                    data-toggle="modal"
                                    data-target="#newRoomModal"
                                    onClick={this.createRoom} >
                                    Create a new room
                                </Button>
                                <Button
                                    type="button"
                                    className='btn btn-primary mb-4'
                                    onClick={this.joinRoom}>
                                    Join an existing room
                            </Button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <Switch>
                <Route path={`${this.props.match.path}:room`} exact component={TickTackToe} />;
                <Route path={`${this.props.match.path}`} exact >
                    {gameDetails}
                </Route>
            </Switch>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        room: state.game.room.name,
        gamesRating: state.statistics.gamesRating
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        setLoginRedirectUrl: (url) => dispatch(actions.setLoginRedirectUrl(url)),
        getGameRating: (gameId) => dispatch(actions.getGameRating(gameId))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Game);