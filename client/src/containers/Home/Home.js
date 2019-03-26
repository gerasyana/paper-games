import React, { Component } from 'react';

import Game from '../../components/Game/Game';
import battleshipImg from '../../assets/battleship.png';
import tickTackToeImg from '../../assets/tick-tack-toe.jpg';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: {
                'tickTackToe': {
                    name: 'Tic-Tac-Toe',
                    src: tickTackToeImg,
                    link: '/games/tick-tack-toe'
                },
                'battleship': {
                    name: 'Battleship',
                    src: battleshipImg,
                    link: '/games/battleship'
                }
            }
        }
    }

    openGame = (event, url) => {
        this.props.history.push(url);
    }

    render() {
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

        return (
            <div className='container mt-5'>
                <div className='row justify-content-around'>
                    {games}
                </div>
            </div>
        )
    }
}

export default Home;