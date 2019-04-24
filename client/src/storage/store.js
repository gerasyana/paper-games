

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'

import authReducer from './reducers/auth';
import statisticsReducer from './reducers/statistics';
import gameReducer from './reducers/game';

import { watchAuth, watchGame, watchStatistics } from './sagas/sagas';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers({
        auth: authReducer,
        statistics: statisticsReducer,
        game: gameReducer
    }),
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchGame);
sagaMiddleware.run(watchStatistics);

export default store;