import React, { PureComponent } from 'react';
import { connect } from 'react-redux'
import { Route, Switch, Redirect } from 'react-router';

import GameLogo from '../../components/Games/GameLogo/GameLogo';
import Button from '../../UI/Button/Button';
import NewRoom from '../NewRoom/NewRoom';
import games from '../../constants/games';
import * as actions from '../../storage/actions/actions';

import TickTackToe from './TickTackToe/TickTackToe';

class Game extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            game: null,
            gameId: null,
            showNewRoomModal: false,
            startGame: false
        }
    }

    componentDidMount() {
        if (!this.state.game && this.props.match.params.id) {
            const gameId = this.props.match.params.id;
            const game = games[gameId];
            this.setState({
                game,
                gameId
            });
        }
    }

    createGame = () => {
        if (!this.props.isAuthenticated) {
            this.props.setLoginRedirectUrl(this.props.match.url);
            this.props.history.push('/login');
        } else {
            this.setState({
                showNewRoomModal: true
            });
        }
    }

    joinGame = () => {
        this.props.history.push('/rooms');
    }

    render() {
        let gameDetails = null;
        let modal = null;

        if (this.state.showNewRoomModal) {
            modal = <NewRoom gameId={this.state.gameId} />
        }
        
        if (this.props.room) {
            gameDetails = <Redirect to={`${this.props.match.url}/${this.props.room}`} />;
        } else if (this.state.game) {
            const rules = this.state.game.rules.map((rule, index) => <li key={index}>{rule}</li>);

            gameDetails = (
                <div className="container body-container">
                    {modal}
                    <div className='row justify-content-center'>
                        <div className='col-4'>
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
                                    data-toggle="modal"
                                    data-target="#newRoomModal"
                                    onClick={this.createGame} >
                                    Create a new game
                                </Button>
                                <Button
                                    type="button"
                                    className='btn btn-primary mb-4'
                                    onClick={this.joinGame}>
                                    Join an existing game
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
        room: state.game.room.name
    }
}

const mapDispatchToState = (dispatch) => {
    return {
        setLoginRedirectUrl: (url) => dispatch(actions.setLoginRedirectUrl(url))
    }
}

export default connect(mapStateToProps, mapDispatchToState)(Game);