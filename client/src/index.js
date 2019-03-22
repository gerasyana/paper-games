import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga'

import App from './App';
import authReducer from './storage/reducers/auth';
import { watchAuth } from './storage/sagas/sagas';

const composeEnhancers = process.env.NODE_ENV === 'development' ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : null || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
    combineReducers({
        auth: authReducer
    }),
    composeEnhancers(
        applyMiddleware(sagaMiddleware)
    )
);

sagaMiddleware.run(watchAuth);

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

