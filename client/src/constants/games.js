import tickTackToeImgSrc from '../assets/tick-tack-toe.jpg';

export const tickTackToeKey = 'tick-tack-toe';

const games = {
    [tickTackToeKey]: {
        name: 'Tic-Tac-Toe',
        src: tickTackToeImgSrc,
        url: '/game/tick-tack-toe',
        rules: [
            'Player 1: Create a new game by entering room name',
            'Player 2: Enter another username and the room id that is displayed on first window',
            'Click on join game'
        ]
    }/*,
    'battleship': {
        name: 'Battleship',
        src: battleshipImgSrc,
        gamePath: '/battleship',
        rules: [
            'Player 1: Create a new game by entering the username',
            'Player 2: Enter another username and the room id that is displayed on first window',
            'Click on join game'
        ]
    }*/
}

export default games;
