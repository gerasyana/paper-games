const TickTackToe = require('./tickTackToe');

class GameFactory {
    constructor(playerId, data) {
        const { gameId } = data.room;
        //TODO get proper instance by gameId 
        return new TickTackToe(playerId, data);
    }
}

module.exports = GameFactory;