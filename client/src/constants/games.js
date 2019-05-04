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
            'Player 1 creates a new room by entering room name',
            'Player 2 joins an existing room',
            'The game is played on a grid that\'s 3 squares by 3 squares',
            'Player 1 is X, player 2 is Y. Player 1 goes first',
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
            'Player 1 creates a new room by entering room name',
            'Player 2 joins an existing room',
            'Player 1 goes first',
            'Select ships from the left-hand side and place on your board',
            'Wait while your enemy places his ships and start the game',
            'Click on the cells of the enemy\'s board to find and destroy all enemy ships',
            'For each won game you got 50 points'
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
