const mongoose = require('mongoose');
const { GAME_HISTORY_MODEL } = require('../constants/modelNames');

const GameHistory = mongoose.model(GAME_HISTORY_MODEL);

class GameHistoryService {

    async saveGame(game) {
        await GameHistory.create(game);
    }

    async geUserTotalPoints(userId) {
        const result = await GameHistory.aggregate([
            {
                $match: { winnerId: mongoose.Types.ObjectId(userId) }
            },
            {
                $group: { _id: null, totalPoints: { $sum: '$points' } }
            }
        ]);
        return result ? result[0].totalPoints : 0;
    }
}

module.exports = new GameHistoryService();