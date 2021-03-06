import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import history from './history';
import createSagaMiddleware from 'redux-saga'
import createRootReducer from './reducers';
import socketMiddleware from 'containers/app/middleware/socketMiddleware'
import asyncDispatchMiddleware from 'containers/app/middleware/asyncDispatchMiddleware'
import rootSagas from './sagas';
import logger from 'redux-logger';

const sagaMiddleware = createSagaMiddleware();


const store = createStore(
  createRootReducer(history),
  compose(
    applyMiddleware(
      routerMiddleware(history),
      asyncDispatchMiddleware,
      socketMiddleware(),
      sagaMiddleware,
      logger,
    )
  )
)
sagaMiddleware.run(rootSagas);

export default store;