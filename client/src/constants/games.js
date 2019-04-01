import battleshipImgSrc from '../assets/battleship.png';
import tickTackToeImgSrc from '../assets/tick-tack-toe.jpg';

const games = {
    'tick-tack-toe': {
        name: 'Tic-Tac-Toe',
        src: tickTackToeImgSrc,
        gamePath: '/tick-tack-toe',
        rules: [
            'Player 1: Create a new game by entering the username',
            'Player 2: Enter another username and the room id that is displayed on first window',
            'Click on join game'
        ]
    },
    'battleship': {
        name: 'Battleship',
        src: battleshipImgSrc,
        gamePath: '/battleship',
        rules: [
            'Player 1: Create a new game by entering the username',
            'Player 2: Enter another username and the room id that is displayed on first window',
            'Click on join game'
        ]
    }
}

export default games;