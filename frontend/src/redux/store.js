import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import reducers from './reducers';

const logger = createLogger();

export function configureStore(initialState) {

    const middlewares = [thunk,logger];

    const store = createStore(
        reducers,
        initialState,
        applyMiddleware(...middlewares)
    );

    return store;
}
