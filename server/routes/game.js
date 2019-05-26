const gameService = require('../services/game');

module.exports = app => {
    app.get('/api/game/rating', async (req, res) => {
        const { gameId } = req.query;
        const rating = await gameService.getGameRating(gameId);
        return res.json(rating);
    });
};