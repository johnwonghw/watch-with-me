import React, { Component } from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import history from './history';
import store from './store';
import AppContent from './app-content'

import './_app.scss';

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <AppContent />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default App;
