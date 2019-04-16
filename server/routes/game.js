const { getGameRating } = require('../services/game');

module.exports = (app) => {
    app.get('/api/game/rating', async (req, res) => {
        const { gameId } = req.body;
        return await getGameRating(gameId);
    });
}