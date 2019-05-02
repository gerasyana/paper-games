const { saveGame } = require('../game');
const games = require('../../constants/games');

const initialGameBoard = {
    gameIsOver: false,
    youWon: false,
    yourTurn: false,
    player1Fleet: {
        shipsAreSet: false,
        gridColumns: new Array(100).fill(false).map((value, index) => ({
            id: `gridColumn-${index}`,
            selected: false,
            hovered: false
        }))
    },
    player2Fleet: {
        shipsAreSet: false,
        gridColumns: new Array(100).fill(false).map((value, index) => ({
            id: `gridColumn-${index}`,
            selected: false,
            hovered: false
        }))
    }
}

class Battleship {

    constructor(gameId, params) {
        /* this.playerId = params.playerId;
         this.gameBoard = params.gameBoard;
         this.room = params.room;
         this.playerWon = false;
         this.gameIsOver = false;
         this.points = games[gameId].points;*/
    }

    async processPlayerMove() {

    }

    getUpdatedGameBoard() {
        return {
            moves: this.gameBoard.moves
        }
    }

    getPlayer1InitialGameBoard() {
        return initialGameBoard;
    }

    getPlayer2InitialGameBoard() {
        return initialGameBoard;
    }
}

module.exports = Battleship;