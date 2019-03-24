import React, { Component } from 'react';

import Game from '../../components/Game/Game';
import battleshipImg from '../../assets/battleship.png';
import tickTackToeImg from '../../assets/tick-tack-toe.jpg';

class Games extends Component {

    constructor(props) {
        super(props);
        this.state = {
            games: {
                'tickTackToe': {
                    key: 'tickTackToe',
                    name: 'Tic-Tac-Toe',
                    src: tickTackToeImg,
                    link: '/gamees'
                },
                'battleship': {
                    name: 'Battleship',
                    src: battleshipImg,
                    link: '/games'
                }
            }
        }
    }

    render() {
        const games = [];
        Object.keys(this.state.games).forEach(key => {
            const game = this.state.games[key];
            games.push((
                <div key={key} className='col-4'>
                    <Game {...game}/>
                </div>
            ));
        });

        return (
            <div className='container'>
                <div className='row justify-content-around'>
                    {games}
                </div>
            </div>
        )
    }
}

export default Games;