import React, { Component } from 'react';
import { Route, Switch } from 'react-router';

import Game from '../../components/Game/Game';
import TickTackToe from './TickTackToe/TickTackToe';
import battleshipImg from '../../assets/battleship.png';
import tickTackToeImg from '../../assets/tick-tack-toe.jpg';

class Games extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: {
                'tickTackToe': {
                    name: 'Tic-Tac-Toe',
                    src: tickTackToeImg,
                    link: `${this.props.match.url}/tick-tack-toe`
                },
                'battleship': {
                    name: 'Battleship',
                    src: battleshipImg,
                    link: `${this.props.match.url}/battleship`
                }
            },
            selectedGameUrl: ''
        }
    }

    openGame = (event, url) => {
        this.props.history.push(url);
    }

    render() {
        const params = this.props.location.pathname.split('/');
        const games = [];

        Object.keys(this.state.games).forEach(key => {
            const game = this.state.games[key];
            games.push((
                <div key={key} className='col-4'>
                    <Game
                        name={game.name}
                        src={game.src}
                        gameSelected={(event) => this.openGame(event, game.link)} />
                </div>
            ));
        });

        let gamesList = (
            <div className='row justify-content-around'>
                {games}
            </div>
        );
        
        if (params.length > 2) {
            gamesList = (
                <Switch>
                    <Route path={`${this.props.match.url}/tick-tack-toe`} component={TickTackToe} />
                </Switch>);
        }

        return (
            <div className='container'>
                {gamesList}
            </div>
        )
    }
}

export default Games;