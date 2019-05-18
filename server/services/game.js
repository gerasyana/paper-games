const mongoose = require('mongoose');
const { gameRating } = require('../services/redis');
const { GAME_HISTORY_MODEL, USER_MODEL } = require('../constants/modelNames');
const { logError } = require('./logger');

const GameHistory = mongoose.model(GAME_HISTORY_MODEL);
const User = mongoose.model(USER_MODEL);

class GameHistoryService {

    async saveGame(game) {
        try {
            await GameHistory.create(game);
        } catch (error) {
            logError(error);
        }
    }

    async geUserTotalPoints(userId) {
        const result = await GameHistory.
            aggregate([{
                $match: {
                    winnerId: mongoose.Types.ObjectId(userId)
                }
            }]).
            group({
                _id: null,
                totalPoints: { $sum: '$points' }
            });

        return result.length > 0 ? result[0].totalPoints : 0;
    }

    async getGameRating(gameId) {
        let data = await gameRating.get(gameId);

        if (!data || data.length === 0) {
            data = await this.refreshGameRating(gameId);
        }
        return data;
    }

    async refreshGameRating(gameId) {
        let results = [];

        try {
            results = await GameHistory.aggregate([{
                $match: {
                    "room.gameId": gameId
                }
            }]).group({
                _id: "$winnerId",
                points: { $sum: '$points' }
            }).sort({ points: "desc" });

            const userIds = results.map(result => result._id);
            const users = await User.
                find({
                    _id: {
                        $in: userIds
                    }
                }, "_id username").
                toMap('_id');
                
            results = results.map(result => ({
                username: users[result._id].username,
                points: result.points
            }));
            await gameRating.save(gameId, results);
        } catch (error) {
            logError(error);
        } finally {
            return results;
        }
    }
}

module.exports = new GameHistoryService();