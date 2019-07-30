const gameIds = require('../../constants/gameIds');

const gameInstances = {
    [gameIds.TICK_TACK_TOE_ID]: require('./tickTackToe'),
    [gameIds.BATTLESHIP_ID]: require('./battleship')
};

class GameFactory {
    constructor(gameId, params) {
        const game = gameInstances[gameId];
        return new game(gameId, params);
    }
}

module.exports = GameFactory;