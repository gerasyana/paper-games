const mongoose = require('mongoose');
const { GAME_HISTORY_MODEL } = require('../constants/modelNames');

const GameHistory = mongoose.model(GAME_HISTORY_MODEL);

class GameHistoryService {

    async saveGame(game) {
        await GameHistory.create(game);
    }
}

module.exports = new GameHistoryService();