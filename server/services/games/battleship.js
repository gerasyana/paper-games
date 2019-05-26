const { saveGame } = require('../game');
const games = require('../../constants/games');

const initialGameBoard = {
    gameIsOver: false,
    youWon: false,
    yourTurn: false,
    fleets: []
};

class Battleship {

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
        this.gameBoard.fleets.forEach((fleet) => {
            if (fleet.playerId !== this.playerId) {
                fleet.ships.forEach((ship) => ship.destroyed = ship.columns.every((column) => fleet.moves.includes(column)));
            }
        });

        this.playerWon = this.gameBoard.fleets.some((fleet) => fleet.ships.every((ship) => ship.destroyed));

        if (this.playerWon) {
            await saveGame({
                room: this.room,
                winnerId: this.playerId,
                points: this.points
            });
        }
    }

    getUpdatedGameBoard() {
        return {
            fleets: this.gameBoard.fleets
        };
    }

    getPlayer1InitialGameBoard() {
        return initialGameBoard;
    }

    getPlayer2InitialGameBoard() {
        return {
            ...initialGameBoard,
            yourTurn: true
        };
    }
}

module.exports = Battleship;