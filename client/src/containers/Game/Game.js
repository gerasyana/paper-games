import React, { Component } from 'react';

import GameLogo from '../../components/Games/GameLogo/GameLogo';
import games from '../../constants/games';
import Button from '../../UI/Button/Button';

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
                                    className='btn btn-primary mr-4'
                                    onClick={this.login} >
                                    Create a new Game
                            </Button>
                                <Button
                                    type="button"
                                    className='btn btn-primary'
                                    onClick={this.goToSignUp}>
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

export default Game;