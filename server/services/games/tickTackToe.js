const { sockets } = require('../redis');
const { saveGame } = require('../gameHistory');

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

    constructor(clientId, room, gameBoard) {
        this.clientId = clientId;
        this.gameBoard = gameBoard;
        this.room = room;
        this.gameIsOver = false;
    }

    async processPlayerMove() {
        const { moves, playerStep } = this.gameBoard;
        this.gameIsOver = winningMoves.some((winningMove) =>
            winningMove.every(moveIndex => moves[moveIndex] === playerStep)
        );

        if (this.gameIsOver) {
            this.playerId = await sockets.getUserId(this.clientId);
            await saveGame(this.room, this.playerId);
        }
    }

    getUpdatedGameBoard() {
        return {
            moves: this.gameBoard.moves,
            gameIsOver: this.gameIsOver,
            winnerId: this.playerId
        }
    }
}

module.exports = TickTackToe;