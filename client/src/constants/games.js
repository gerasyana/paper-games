import tickTackToeImgSrc from '../assets/tick-tack-toe.jpg';
import battleshipImgSrc from '../assets/battleship.png';

export const tickTackToeKey = 'tick-tack-toe';
export const battleship = 'battleship';

const games = {
    [tickTackToeKey]: {
        name: 'Tic-Tac-Toe',
        label: 'Tick Tac Toe',
        componentName: 'TickTackToe',
        src: tickTackToeImgSrc,
        url: '/game/tick-tack-toe',
        rules: [
            'Player 1: Create a new room by entering room name',
            'Player 2: Join to existing room',
            'For each won game you got 10 points'
        ]
    },
    [battleship]: {
        name: 'Battleship',
        label: 'Battleship',
        componentName: 'Battleship',
        src: battleshipImgSrc,
        url: '/game/battleship',
        rules: [
            'Player 1: Create a new room by entering room name',
            'Player 2: Join to existing room'
        ]
    }
}

export const gameBoards = {
    [tickTackToeKey]: {
        gameIsOver: false,
        youWon: false,
        yourTurn: false,
        playerStep: '0',
        moves: new Array(9).fill(null)
    },
    [battleship]: {
        gameIsOver: false,
        youWon: false,
        yourTurn: false,
        fleets: []
    }
}

export default games;
