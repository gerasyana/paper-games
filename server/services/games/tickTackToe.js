const { saveGame } = require('../game');
const games = require('../../constants/games');

const winningMoves = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const initialGameBoard = {
    gameIsOver: false,
    youWon: false,
    yourTurn: false,
    playerStep: '0',
    moves: new Array(9).fill(null)
};

class TickTackToe {

    constructor(gameId, params) {
        this.playerWon = false;
        this.gameIsOver = false;
        this.points = games[gameId].points;

        if (params) {
            this.playerId = params.playerId;
            this.gameBoard = params.gameBoard;
            this.room = params.room;
        }
    }

    async processPlayerMove() {
        const { moves, playerStep } = this.gameBoard;
        this.playerWon = winningMoves.some(winningMove => winningMove.every(moveIndex => moves[moveIndex] === playerStep));

        if (this.playerWon) {
            await saveGame({
                room: this.room,
                winnerId: this.playerId,
                points: this.points
            });
        } else {
            this.gameIsOver = moves.filter(move => move).length === moves.length;
        }
    }

    getUpdatedGameBoard() {
        return {
            moves: this.gameBoard.moves
        };
    }

    getPlayer1InitialGameBoard() {
        return initialGameBoard;
    }

    getPlayer2InitialGameBoard() {
        return {
            ...initialGameBoard,
            yourTurn: true,
            playerStep: 'X',
        };
    }
}

module.exports = TickTackToe;