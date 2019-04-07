

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'

import authReducer from './reducers/auth';
import statisticsReducer from './reducers/statistics';
import gameReducer from './reducers/game';
import { watchAuth, watchGame } from './sagas/sagas';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
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

export default store;