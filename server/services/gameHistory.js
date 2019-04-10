const mongoose = require('mongoose');
const { GAME_HISTORY_MODEL } = require('../constants/modelNames');

const GameHistory = mongoose.model(GAME_HISTORY_MODEL);

class GameHistoryService {

    async saveGame(room, playerId) {
        const points = 10; //TODO : get game details from DB
        await GameHistory.create({
            playerId,
            room,
            points
        });
    }
}

module.exports = new GameHistoryService();