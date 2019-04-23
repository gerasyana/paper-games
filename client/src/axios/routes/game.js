import axios from '../axios';

export const getGameRating = data => {
    return axios.get('/game/rating', {
        params: data
    });
}