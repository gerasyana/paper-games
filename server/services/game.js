const mongoose = require('mongoose');
const { GAME_HISTORY_MODEL, USER_MODEL } = require('../constants/modelNames');

const GameHistory = mongoose.model(GAME_HISTORY_MODEL);
const User = mongoose.model(USER_MODEL);

class GameHistoryService {

    async saveGame(game) {
        await GameHistory.create(game);
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

    async getUserGameHistory(userId) {
        const userGames = await GameHistory.find({
            "room.players": {
                $elemMatch: { id: userId }
            }
        });
        return userGames.map(userGame => {
            const { room, points } = userGame;

            return {
                room: room.name,
                players: room.players.map(player => player.username),
                youWin: userGame.winnerId === userId,
                points
            }
        });
    }

    async getGameRating(gameId) {
        const results = await GameHistory.aggregate([{
            $match: {
                "room.gameId": gameId
            }
        }]).group({
            _id: "$winnerId",
            totalPoints: { $sum: '$points' }
        }).sort({ totalPoints: "desc" });

        const userIds = results.map(result => result._id);
        const users = await User.
            find({
                _id: {
                    $in: userIds
                }
            }, "_id username").
            toMap('_id');

        return results.map(result => ({
            username: users[result._id].username,
            points: result.totalPoints
        }));
    }
}

module.exports = new GameHistoryService();