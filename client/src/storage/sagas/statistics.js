import { put } from 'redux-saga/effects'

import * as gameRouters from '../../axios/routes/game';
import * as actions from '../actions/actions';

export function* getGameRating(action) {
    const { gameId } = action;
    const response = yield gameRouters.getGameRating({ gameId });

    if (response.data) {
        yield put(actions.setGameRating(gameId, response.data));
    }
}