const mongoose = require('mongoose');
const { GAME_HISTORY_MODEL } = require('../constants/modelNames');

const ObjectId = mongoose.Schema.Types.ObjectId;

const GameHistorySchema = new mongoose.Schema({
    room: {
        type: [mongoose.Schema.Types.Mixed],
    },
    playerId: {
        type: ObjectId,
        required: true,
        index: true
    },
    points: {
        type: Number,
        default: 0
    }
});

mongoose.model(GAME_HISTORY_MODEL, GameHistorySchema);

