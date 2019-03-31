

import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga'

import authReducer from './reducers/auth';
import statisticsReducer from './reducers/statistics';
import { watchAuth, watchStatistics } from './sagas/sagas';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers({
        auth: authReducer,
        statistics: statisticsReducer
    }),
    composeEnhancers(
        applyMiddleware(sagaMiddleware)
    )
);

sagaMiddleware.run(watchAuth);
sagaMiddleware.run(watchStatistics);

export default store;