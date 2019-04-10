const TickTackToe = require('./tickTackToe');

class GameFactory {
    constructor(clientId, room, gameBoard) {
        const { gameId } = room;
        //TODO : get room inf ofrom redis
        //get proper instance by gameId 
        return new TickTackToe(clientId, room, gameBoard);
    }
}

module.exports = GameFactory;