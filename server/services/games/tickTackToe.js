const { saveGame } = require('../gameHistory');
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

class TickTackToe {

    constructor(playerId, data) {
        this.playerId = playerId;
        this.gameBoard = data.gameBoard;
        this.room = data.room;
        this.gameIsOver = false;
        this.points = games[data.room.gameId].points;
    }

    async processPlayerMove() {
        const { moves, playerStep } = this.gameBoard;
        this.gameIsOver = winningMoves.some((winningMove) =>
            winningMove.every(moveIndex => moves[moveIndex] === playerStep)
        );

        if (this.gameIsOver) {
            await saveGame({
                room: this.room,
                winnerId: this.playerId,
                points: this.points
            });
        }
    }

    getUpdatedGameBoard() {
        return {
            moves: this.gameBoard.moves
        }
    }
}

module.exports = TickTackToe;