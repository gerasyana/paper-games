const TickTackToe = require('./tickTackToe');

class GameFactory {
    constructor(playerId, data) {
        const { gameId } = data.room;
        //TODO get proper instance by gameId  (when there will be more then one game)
        return new TickTackToe(playerId, data);
    }
}

module.exports = GameFactory;