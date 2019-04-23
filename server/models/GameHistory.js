const mongoose = require('mongoose');
const { GAME_HISTORY_MODEL } = require('../constants/modelNames');

const ObjectId = mongoose.Schema.Types.ObjectId;

const GameHistorySchema = new mongoose.Schema({
    room: {
        name: {
            type: String
        },
        gameId: {
            type: String
        },
        players: {
            type: Array
        }
    },
    winnerId: {
        type: ObjectId,
        required: [true, 'Id of winned user is mandatory'],
        index: true
    },
    points: {
        type: Number,
        default: 0
    }
});

GameHistorySchema.post('save', async function (gameHistory) {
    const { refreshGameRating } = require('../services/game');
    await refreshGameRating(gameHistory.room.gameId);
});

mongoose.model(GAME_HISTORY_MODEL, GameHistorySchema);

